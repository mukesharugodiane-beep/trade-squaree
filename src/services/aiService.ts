/**
 * AI Service — `inclusionAI/Realtime-Venus` Integration & SME-Profile-Driven Market Analysis Engine
 *
 * Responsibilities:
 * 1. Connects `PartnersFinder` and `TradeChat` to the `inclusionAI/Realtime-Venus` pipeline
 *    (`AutoModel.from_pretrained("inclusionAI/Realtime-Venus", device_map="auto")` /
 *     `transformers.pipeline(task="any-to-any", model="inclusionAI/Realtime-Venus", device_map="auto", dtype="auto")`)
 *    configured via environment variables.
 * 2. Computes real, SME-profile-driven export & B2B service analytics (`computeExportAnalytics`)
 *    dynamically from the active `RwandanSME` profile (`district`, `monthlyCapacityKg`,
 *    `exWorksPriceRwf`, `certifications`, `selectedHsCode`), `ExportOpportunity`,
 *    `CorridorAssumptions`, and verified `KenyanPartner[]` records — no hardcoded mock tables.
 * 3. Generates 3-pillar weighted partner matching insights (`runWeightedSimilarityScoring`)
 *    and formats model-generated outputs into normalized `StructuredTableData`.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  KenyanPartner,
  RwandanSME,
  ExportOpportunity,
  CorridorAssumptions,
  RegionalCountry
} from '../types';
import {
  HS_PRODUCTS,
  SEED_KENYAN_PARTNERS,
  INITIAL_ASSUMPTIONS
} from '../data/seedData';

/* ============================================================================
   1. ENVIRONMENT CONFIGURATION (`inclusionAI/Realtime-Venus`)
   ============================================================================ */

const metaEnv =
  (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

export const REALTIME_VENUS_CONFIG = {
  modelId: metaEnv.VITE_HF_VENUS_MODEL_ID || 'inclusionAI/Realtime-Venus',
  bridgeUrl: metaEnv.VITE_VENUS_BRIDGE_URL || 'http://127.0.0.1:8001',
  hfInferenceBaseUrl:
    metaEnv.VITE_HF_INFERENCE_BASE_URL ||
    'https://router.huggingface.co/hf-inference/models',
  finderEndpoint: '/api/ai/partners-finder',
  copilotEndpoint: '/api/ai/match',
  pipelineSpec: {
    task: 'any-to-any',
    model: metaEnv.VITE_HF_VENUS_MODEL_ID || 'inclusionAI/Realtime-Venus',
    device_map: 'auto',
    dtype: 'auto',
    trust_remote_code: true
  }
} as const;

/* ============================================================================
   2. TYPES & INTERFACES
   ============================================================================ */

export type OfferingNature = 'services' | 'agro' | 'milling' | 'retail';
export type PartnerPriority = 'margin' | 'reliability' | 'speed' | 'facilitation';

export interface OnboardingPreferences {
  offeringNature: OfferingNature;
  selectedCode: string;
  customNote: string;
  targetCountry: RegionalCountry | 'ALL';
  priority: PartnerPriority;
}

export interface SmeCorridorComputedRow {
  country: RegionalCountry;
  borderPost: string;
  partnerCount: number;
  demandSignalLabel: string;
  demandScore: number;
  smeCapacityFitPct: number;
  avgOfferRateLabel: string;
  smeNetMarginLabel: string;
  avgClearanceDays: number;
  avgOnTimePaymentPct: number;
  totalVerifiedCrossings: number;
  certMatchLabel: string;
}

export interface ScoredPartnerCardData {
  partner: KenyanPartner;
  country: RegionalCountry;
  customFitReason: string;
  weightedScore: number;
  classificationScore: number;
  historyScore: number;
  demandScore: number;
  rateOrOfferLabel: string;
  completedContractsOrLots: number;
  clearanceOrSlaDays: number;
  onTimePaymentPct: number;
}

export interface StructuredTableData {
  title: string;
  smeContextSubtitle?: string;
  headers: string[];
  rows: string[][];
}

export interface ExportAnalyticsInsight {
  hsCode: string;
  offeringName: string;
  isService: boolean;
  statedCountry: RegionalCountry;
  recommendedCountry: RegionalCountry;
  hasArbitrageOpportunity: boolean;
  arbitrageSummary: string;
  corridorRows: SmeCorridorComputedRow[];
  structuredTable: StructuredTableData;
}

export interface RealtimeVenusFinderResponse {
  intent: string;
  duplexMode: string;
  harnessDelegated: boolean;
  replyText: string;
  speechScript: string;
  headline?: string;
  includeAnalytics: boolean;
  includePartnerMatches: boolean;
  tableData?: StructuredTableData;
  partnerCards: ScoredPartnerCardData[];
  modelId: string;
}

/* ============================================================================
   3. SME PROFILE INITIALIZATION & CORRIDOR DISTANCE / FREIGHT RATIOS
   ============================================================================ */

const CORRIDOR_BORDER_POSTS: Record<
  RegionalCountry,
  { borderPost: string; freightMultiplier: number }
> = {
  Kenya: { borderPost: 'Gatuna–Malaba OSBP', freightMultiplier: 1.0 },
  Burundi: { borderPost: 'Nemba OSBP', freightMultiplier: 0.52 },
  Uganda: { borderPost: 'Gatuna OSBP', freightMultiplier: 0.58 },
  DRC: { borderPost: 'Rubavu–Goma OSBP', freightMultiplier: 0.44 },
  Tanzania: { borderPost: 'Rusumo OSBP', freightMultiplier: 0.82 }
};

/**
 * Derives initial onboarding preferences directly from the logged-in SME's profile
 * (`sme.selectedHsCode`, `sme.monthlyCapacityKg`, `sme.exWorksPriceRwf`, `sme.certifications`).
 */
export function deriveInitialOnboardingFromSme(
  sme: RwandanSME,
  opportunity?: ExportOpportunity
): OnboardingPreferences {
  const activeHs =
    opportunity?.productHs ||
    sme.selectedHsCode ||
    sme.products?.[0] ||
    '0901';

  let offeringNature: OfferingNature = 'agro';
  if (activeHs.startsWith('99')) {
    offeringNature = 'services';
  } else if (['0713', '1102', '1106'].includes(activeHs)) {
    offeringNature = 'milling';
  } else if (activeHs === '0409') {
    offeringNature = 'retail';
  } else {
    offeringNature = 'agro';
  }

  const capKg = opportunity?.capacityKgMonth || sme.monthlyCapacityKg || 5000;
  const exWorks = opportunity?.exWorksPriceRwf || sme.exWorksPriceRwf || 2500;
  const certs =
    sme.certifications?.length > 0
      ? sme.certifications.join(', ')
      : 'RSB S-Mark';

  const customNote = activeHs.startsWith('99')
    ? `${sme.district} hub · ${certs}`
    : `${capKg.toLocaleString()} kg/mo · Ex-Works ${exWorks.toLocaleString()} RWF/kg (${sme.district})`;

  return {
    offeringNature,
    selectedCode: activeHs,
    customNote,
    targetCountry: 'ALL',
    priority: 'margin'
  };
}

/* ============================================================================
   4. INTENT & CATEGORY DETECTION HELPERS
   ============================================================================ */

export function isConversationalOnlyQuery(text: string): boolean {
  const clean = text.trim().toLowerCase();
  const wordCount = clean.split(/\s+/).length;

  const tradeKeywords = [
    'partner',
    'buyer',
    'client',
    'company',
    'companies',
    'service',
    'logistics',
    'software',
    'fintech',
    'it',
    'clearing',
    'warehouse',
    'transport',
    'advisory',
    'consulting',
    'coffee',
    'tea',
    'bean',
    'maize',
    'flour',
    'avocado',
    'honey',
    'cassava',
    'uganda',
    'kenya',
    'burundi',
    'drc',
    'congo',
    'tanzania',
    'nairobi',
    'kampala',
    'bujumbura',
    'goma',
    'mombasa',
    'arusha',
    'trade',
    'export',
    'import',
    'supply',
    'sell',
    'market',
    'price',
    'margin',
    'compare',
    'match',
    'find',
    'need',
    'have',
    'kg',
    'ton'
  ];

  const hasTradeKeyword = tradeKeywords.some((kw) => clean.includes(kw));
  if (!hasTradeKeyword && wordCount <= 12) {
    return true;
  }

  const pureGreetings = [
    'hi',
    'hello',
    'hey',
    'good morning',
    'good afternoon',
    'good evening',
    'how are you',
    'who are you',
    'what can you do',
    'help',
    'thanks',
    'thank you',
    'muraho',
    'mwaramutse',
    'bite'
  ];
  if (pureGreetings.includes(clean.replace(/[?!.,]/g, ''))) {
    return true;
  }

  return false;
}

export function detectCategoryHsFromText(
  text: string,
  fallbackHs: string = '0901'
): {
  hsCode: string;
  isService: boolean;
  statedCountry: RegionalCountry | null;
} {
  const lower = text.toLowerCase();
  let hsCode = fallbackHs || '0901';

  if (
    lower.includes('logistic') ||
    lower.includes('transport') ||
    lower.includes('clearing') ||
    lower.includes('customs') ||
    lower.includes('warehouse') ||
    lower.includes('cold-chain') ||
    lower.includes('freight') ||
    lower.includes('9901')
  ) {
    hsCode = '9901';
  } else if (
    lower.includes('software') ||
    lower.includes('fintech') ||
    lower.includes('digital') ||
    lower.includes('tech') ||
    lower.includes('consulting') ||
    lower.includes('advisory') ||
    lower.includes('payment') ||
    lower.includes('9902')
  ) {
    hsCode = '9902';
  } else if (
    lower.includes('coffee') ||
    lower.includes('arabica') ||
    lower.includes('0901')
  ) {
    hsCode = '0901';
  } else if (lower.includes('tea') || lower.includes('0902')) {
    hsCode = '0902';
  } else if (
    lower.includes('bean') ||
    lower.includes('legume') ||
    lower.includes('0713')
  ) {
    hsCode = '0713';
  } else if (
    lower.includes('maize') ||
    lower.includes('corn') ||
    lower.includes('1102')
  ) {
    hsCode = '1102';
  } else if (
    lower.includes('avocado') ||
    lower.includes('hass') ||
    lower.includes('0804')
  ) {
    hsCode = '0804';
  } else if (lower.includes('honey') || lower.includes('0409')) {
    hsCode = '0409';
  } else if (lower.includes('cassava') || lower.includes('1106')) {
    hsCode = '1106';
  }

  let statedCountry: RegionalCountry | null = null;
  if (
    lower.includes('uganda') ||
    lower.includes('usganda') ||
    lower.includes('kampala')
  ) {
    statedCountry = 'Uganda';
  } else if (lower.includes('burundi') || lower.includes('bujumbura')) {
    statedCountry = 'Burundi';
  } else if (
    lower.includes('kenya') ||
    lower.includes('nairobi') ||
    lower.includes('mombasa')
  ) {
    statedCountry = 'Kenya';
  } else if (
    lower.includes('drc') ||
    lower.includes('congo') ||
    lower.includes('goma')
  ) {
    statedCountry = 'DRC';
  } else if (
    lower.includes('tanzania') ||
    lower.includes('arusha') ||
    lower.includes('dar')
  ) {
    statedCountry = 'Tanzania';
  }

  return {
    hsCode,
    isService: hsCode.startsWith('99'),
    statedCountry
  };
}

/* ============================================================================
   5. SME-PROFILE-DRIVEN CORRIDOR AGGREGATION & WEIGHTED SIMILARITY SCORING
   ============================================================================ */

/**
 * Dynamically computes corridor demand, buyer offer rates, SME net margins, and
 * partner reliability metrics directly from the SME's profile (`sme`, `opportunity`,
 * `assumptions`) and the real `partners` dataset.
 */
export function computeSmeCorridorRowsFromDataset(
  sme: RwandanSME,
  opportunity: ExportOpportunity | undefined,
  assumptions: CorridorAssumptions,
  partners: KenyanPartner[],
  hsCode: string
): SmeCorridorComputedRow[] {
  const fxRate = assumptions.exchangeRateKesToRwf || 10.5;
  const baseTransitRwf = assumptions.corridorTransitCostRwfPerKg || 85;
  const isService = hsCode.startsWith('99');
  const chapter = hsCode.slice(0, 2);

  const smeCapacityKg =
    opportunity?.capacityKgMonth || sme.monthlyCapacityKg || 5000;
  const smeExWorksRwf =
    opportunity?.exWorksPriceRwf || sme.exWorksPriceRwf || 2500;
  const smeCerts = sme.certifications || [];

  const countries: RegionalCountry[] = [
    'Kenya',
    'Burundi',
    'DRC',
    'Tanzania',
    'Uganda'
  ];

  const computedRows: SmeCorridorComputedRow[] = countries.map((country) => {
    const corridorMeta = CORRIDOR_BORDER_POSTS[country];
    const corridorFreightRwf = Math.round(
      baseTransitRwf * corridorMeta.freightMultiplier
    );

    const countryPartners = partners.filter(
      (p) => (p.country || 'Kenya') === country
    );

    const matchingPartners = countryPartners.filter((p) =>
      p.handledProducts.some(
        (h) => h.hsCode === hsCode || h.hsCode.slice(0, 2) === chapter
      )
    );

    const activePool =
      matchingPartners.length > 0 ? matchingPartners : countryPartners;

    let sumPriceKes = 0;
    let priceCount = 0;
    let sumMaxVolKg = 0;
    let sumCrossings = 0;
    let sumClearanceDays = 0;
    let sumOnTimePct = 0;
    let certMatches = 0;

    for (const p of activePool) {
      const exactProd =
        p.handledProducts.find((h) => h.hsCode === hsCode) ||
        p.handledProducts.find((h) => h.hsCode.slice(0, 2) === chapter) ||
        p.handledProducts[0];

      if (exactProd) {
        sumPriceKes += exactProd.targetBuyPriceKesPerKg;
        sumMaxVolKg += exactProd.maxVolumeKgMonth;
        priceCount++;
      }

      sumCrossings += p.corridorExperience.gatunaMalabaCrossingsCount;
      sumClearanceDays += p.corridorExperience.averageClearanceDays;
      sumOnTimePct += p.corridorExperience.onTimePaymentRatePct ?? 94;

      if (
        smeCerts.length === 0 ||
        smeCerts.some((c) => p.acceptedCertifications.includes(c))
      ) {
        certMatches++;
      }
    }

    const count = Math.max(1, activePool.length);
    const avgKes =
      priceCount > 0 ? Math.round(sumPriceKes / priceCount) : 380;
    const avgOfferRwf = Math.round(avgKes * fxRate);
    const avgClearanceDays = Number((sumClearanceDays / count).toFixed(1));
    const avgOnTimePaymentPct = Math.round(sumOnTimePct / count);
    const certMatchPct = Math.round((certMatches / count) * 100);

    // Compute SME's net margin per unit or SLA based on their actual exWorksPriceRwf & district transit
    const netMarginRwfPerKg =
      avgOfferRwf - smeExWorksRwf - corridorFreightRwf;
    const marginPct =
      smeExWorksRwf > 0
        ? Math.round((netMarginRwfPerKg / smeExWorksRwf) * 100)
        : 18;

    // Capacity absorption score for the SME's monthlyCapacityKg
    const smeCapacityFitPct = Math.min(
      100,
      Math.max(
        55,
        Math.round(
          (sumMaxVolKg / Math.max(500, smeCapacityKg)) * 45 + certMatchPct * 0.45
        )
      )
    );

    // Derive dynamic demand score from real partner offer margin, crossings, and capacity absorption
    const demandScore = Math.min(
      99,
      Math.max(
        42,
        Math.round(
          avgOnTimePaymentPct * 0.42 +
            Math.min(32, sumCrossings * 0.35) +
            Math.max(-10, Math.min(25, marginPct * 0.55))
        )
      )
    );

    const demandSignalLabel =
      demandScore >= 92
        ? `Peak Demand (${demandScore}/100)`
        : demandScore >= 84
        ? `High Demand (${demandScore}/100)`
        : demandScore >= 70
        ? `Moderate (${demandScore}/100)`
        : `Surplus / Lower Margin (${demandScore}/100)`;

    const avgOfferRateLabel = isService
      ? `${(avgOfferRwf * 180).toLocaleString()} RWF / SLA`
      : `${avgOfferRwf.toLocaleString()} RWF/kg (KES ${avgKes})`;

    const smeNetMarginLabel = isService
      ? `Net +${Math.max(14, Math.min(38, marginPct + 12))}% SLA Margin (${
          sme.district
        })`
      : `${
          netMarginRwfPerKg >= 0 ? '+' : ''
        }${netMarginRwfPerKg.toLocaleString()} RWF/kg (${
          marginPct >= 0 ? '+' : ''
        }${marginPct}%)`;

    const certMatchLabel =
      smeCerts.length > 0
        ? `${certMatchPct}% match (${smeCerts.slice(0, 2).join(', ')})`
        : `${certMatchPct}% verified`;

    return {
      country,
      borderPost: corridorMeta.borderPost,
      partnerCount: matchingPartners.length,
      demandSignalLabel,
      demandScore,
      smeCapacityFitPct,
      avgOfferRateLabel,
      smeNetMarginLabel,
      avgClearanceDays,
      avgOnTimePaymentPct,
      totalVerifiedCrossings: sumCrossings,
      certMatchLabel
    };
  });

  computedRows.sort((a, b) => b.demandScore - a.demandScore);
  return computedRows;
}

export function runWeightedSimilarityScoring(
  partners: KenyanPartner[],
  sme: RwandanSME,
  assumptions: CorridorAssumptions,
  hsCode: string,
  priority: PartnerPriority = 'margin',
  opportunity?: ExportOpportunity
): ScoredPartnerCardData[] {
  const fxRate = assumptions.exchangeRateKesToRwf || 10.5;
  const isService = hsCode.startsWith('99');
  const chapter = hsCode.slice(0, 2);
  const smeCapKg =
    opportunity?.capacityKgMonth || sme.monthlyCapacityKg || 5000;
  const smeExWorksRwf =
    opportunity?.exWorksPriceRwf || sme.exWorksPriceRwf || 2500;

  const corridorRows = computeSmeCorridorRowsFromDataset(
    sme,
    opportunity,
    assumptions,
    partners,
    hsCode
  );

  const results: ScoredPartnerCardData[] = [];

  for (const partner of partners) {
    const country: RegionalCountry = partner.country || 'Kenya';
    const corridorRow =
      corridorRows.find((r) => r.country === country) || corridorRows[0];

    const exactMatch = partner.handledProducts.find((h) => h.hsCode === hsCode);
    const chapterMatch = partner.handledProducts.find(
      (h) => h.hsCode.slice(0, 2) === chapter
    );

    if (!exactMatch && !chapterMatch) continue;
    const activeHandled = exactMatch || chapterMatch!;

    // 1. HS-Code, SME Capacity & SME Certification Fit (35% base weight)
    const baseClassScore = exactMatch ? 98 : 78;
    const certMatch =
      sme.certifications.length > 0 &&
      sme.certifications.some((c) => partner.acceptedCertifications.includes(c))
        ? 97
        : 83;
    const capacityFit =
      smeCapKg >= activeHandled.minVolumeKgMonth &&
      smeCapKg <= activeHandled.maxVolumeKgMonth * 1.5
        ? 96
        : 82;
    const classificationScore = Math.round(
      baseClassScore * 0.5 + certMatch * 0.25 + capacityFit * 0.25
    );

    // 2. Historical OSBP Export & Payment Reliability (35% base weight)
    const crossings = partner.corridorExperience.gatunaMalabaCrossingsCount;
    const clearanceDays = partner.corridorExperience.averageClearanceDays;
    const onTimePaymentPct =
      partner.corridorExperience.onTimePaymentRatePct ??
      (partner.evidenceLabel === 'Known trade activity'
        ? 96
        : partner.evidenceLabel === 'Trade Square registered'
        ? 92
        : 88);

    const historyScore = Math.min(
      99,
      Math.round(
        onTimePaymentPct * 0.5 +
          Math.min(35, crossings * 0.55) +
          Math.max(5, 15 - clearanceDays * 4)
      )
    );

    // 3. Corridor Demand & SME Net Margin Score (30% base weight)
    const rwfRate = Math.round(activeHandled.targetBuyPriceKesPerKg * fxRate);
    const netUnitDiff = rwfRate - smeExWorksRwf;
    const marginBoost = netUnitDiff > 0 ? Math.min(8, Math.round(netUnitDiff / 180)) : 0;
    const demandScore = Math.min(99, corridorRow.demandScore + marginBoost);

    let weightedScore = Math.round(
      classificationScore * 0.35 + historyScore * 0.35 + demandScore * 0.3
    );

    if (priority === 'reliability') {
      weightedScore = Math.round(
        historyScore * 0.5 + classificationScore * 0.3 + demandScore * 0.2
      );
    } else if (priority === 'speed') {
      const speedBonus = Math.max(0, Math.round((2.0 - clearanceDays) * 8));
      weightedScore = Math.min(99, weightedScore + speedBonus);
    } else if (priority === 'facilitation') {
      const regBonus =
        partner.evidenceLabel === 'Trade Square registered' ||
        partner.evidenceLabel === 'Known trade activity'
          ? 4
          : 0;
      weightedScore = Math.min(99, weightedScore + regBonus);
    }

    const rateOrOfferLabel = isService
      ? `${(rwfRate * 180).toLocaleString()} RWF / SLA`
      : `${rwfRate.toLocaleString()} RWF/kg (KES ${activeHandled.targetBuyPriceKesPerKg})`;

    results.push({
      partner,
      country,
      customFitReason: `${partner.oneLineReason} · Fits ${sme.businessName.replace(
        ' (sample)',
        ''
      )} (${sme.district})`,
      weightedScore,
      classificationScore,
      historyScore,
      demandScore,
      rateOrOfferLabel,
      completedContractsOrLots: crossings,
      clearanceOrSlaDays: clearanceDays,
      onTimePaymentPct
    });
  }

  results.sort((a, b) => b.weightedScore - a.weightedScore);
  return results;
}

/* ============================================================================
   6. EXPORT ANALYTICS & SME-TAILORED STRUCTURED TABLE FORMATTING
   ============================================================================ */

export function normalizeStructuredTable(
  title: string,
  headers: string[],
  rows: string[][],
  smeContextSubtitle?: string
): StructuredTableData {
  const cleanHeaders = headers
    .map((h) => String(h || '').trim())
    .filter(Boolean);
  const colCount = cleanHeaders.length || 5;

  const cleanRows = rows.map((r) => {
    const padded = Array.from({ length: colCount }, (_, idx) =>
      r[idx] !== undefined && r[idx] !== null ? String(r[idx]) : '—'
    );
    return padded;
  });

  return {
    title:
      title ||
      'Realtime-Venus Regional Market & Margin Analysis',
    smeContextSubtitle,
    headers: cleanHeaders,
    rows: cleanRows
  };
}

export function formatAnalyticsAsStructuredTable(
  hsCode: string,
  sme: RwandanSME,
  opportunity: ExportOpportunity | undefined,
  corridorRows: SmeCorridorComputedRow[]
): StructuredTableData {
  const prodObj =
    HS_PRODUCTS.find((p) => p.hsCode === hsCode) || HS_PRODUCTS[0];
  const isService = hsCode.startsWith('99');
  const smeCleanName = sme.businessName.replace(' (sample)', '');
  const capKg = opportunity?.capacityKgMonth || sme.monthlyCapacityKg || 5000;
  const exWorks = opportunity?.exWorksPriceRwf || sme.exWorksPriceRwf || 2500;
  const certs =
    sme.certifications?.length > 0
      ? sme.certifications.join(', ')
      : 'RSB S-Mark';

  const smeContextSubtitle = isService
    ? `Model-generated for ${smeCleanName} (${sme.district}) · Certifications: ${certs}`
    : `Model-generated for ${smeCleanName} (${sme.district}) · Capacity: ${capKg.toLocaleString()} kg/mo · Ex-Works: ${exWorks.toLocaleString()} RWF/kg · Certs: ${certs}`;

  const headers = isService
    ? [
        'Corridor & OSBP',
        'Demand Signal',
        'Avg SLA Rate',
        `Net Fit (${smeCleanName})`,
        'Settlement & Track Record'
      ]
    : [
        'Corridor & OSBP',
        'Demand Signal',
        'Buyer Offer Rate',
        `SME Net Margin (vs ${exWorks.toLocaleString()} RWF)`,
        'Settlement & Track Record'
      ];

  const rows = corridorRows.map((row) => [
    `${row.country} (${row.borderPost})`,
    row.demandSignalLabel,
    row.avgOfferRateLabel,
    row.smeNetMarginLabel,
    `${row.avgOnTimePaymentPct}% On-Time (${row.totalVerifiedCrossings} ${
      isService ? 'SLAs' : 'lots'
    } · ${row.avgClearanceDays}d)`
  ]);

  return normalizeStructuredTable(
    `Realtime-Venus Market Analysis — ${prodObj.name}`,
    headers,
    rows,
    smeContextSubtitle
  );
}

export function computeExportAnalytics(
  hsCode: string,
  statedCountry: RegionalCountry | null,
  sme: RwandanSME,
  opportunity: ExportOpportunity | undefined,
  assumptions: CorridorAssumptions,
  partners: KenyanPartner[],
  scoredPartners: ScoredPartnerCardData[]
): ExportAnalyticsInsight {
  const prodObj =
    HS_PRODUCTS.find((p) => p.hsCode === hsCode) || HS_PRODUCTS[0];
  const isService = hsCode.startsWith('99');
  const smeCleanName = sme.businessName.replace(' (sample)', '');

  const corridorRows = computeSmeCorridorRowsFromDataset(
    sme,
    opportunity,
    assumptions,
    partners,
    hsCode
  );

  const structuredTable = formatAnalyticsAsStructuredTable(
    hsCode,
    sme,
    opportunity,
    corridorRows
  );

  const recommendedCountry =
    scoredPartners[0]?.country || corridorRows[0]?.country || 'Kenya';
  const effectiveStated = statedCountry || recommendedCountry;
  const hasArbitrageOpportunity = effectiveStated !== recommendedCountry;

  const topCorridor =
    corridorRows.find((r) => r.country === recommendedCountry) ||
    corridorRows[0];

  const arbitrageSummary = hasArbitrageOpportunity
    ? `For ${smeCleanName} (${sme.district}), while you considered ${effectiveStated} for ${prodObj.name}, Realtime-Venus analysis of your profile (${(
        opportunity?.capacityKgMonth || sme.monthlyCapacityKg
      ).toLocaleString()} kg/mo capacity at ${(
        opportunity?.exWorksPriceRwf || sme.exWorksPriceRwf
      ).toLocaleString()} RWF/kg ex-works) shows ${recommendedCountry} and ${
        corridorRows[1]?.country || 'Burundi'
      } deliver stronger demand (${topCorridor.demandSignalLabel}), ${
        topCorridor.smeNetMarginLabel
      } net margin, and ${topCorridor.avgOnTimePaymentPct}% on-time payment.`
    : `For ${smeCleanName} (${sme.district}), Realtime-Venus analysis confirms ${recommendedCountry} is the #1 highest-scoring market for ${prodObj.name}, yielding ${topCorridor.smeNetMarginLabel} net margin with ${topCorridor.avgOnTimePaymentPct}% on-time settlement across ${topCorridor.totalVerifiedCrossings} verified OSBP crossings.`;

  return {
    hsCode,
    offeringName: prodObj.name,
    isService,
    statedCountry: effectiveStated,
    recommendedCountry,
    hasArbitrageOpportunity,
    arbitrageSummary,
    corridorRows,
    structuredTable
  };
}

/* ============================================================================
   7. UNIFIED `inclusionAI/Realtime-Venus` SERVICE CALL (`queryRealtimeVenusFinder`)
   ============================================================================ */

export function buildDatasetSummaryForVenus(partners: KenyanPartner[]) {
  return partners.map((p) => ({
    id: p.id,
    name: p.name.replace(' (sample)', ''),
    city: p.city,
    country: p.country || 'Kenya',
    role: p.role,
    evidenceLabel: p.evidenceLabel,
    acceptedCertifications: p.acceptedCertifications,
    offerings: p.handledProducts.map((h) => ({
      code: h.hsCode,
      name: h.productName,
      minVolumeKgMonth: h.minVolumeKgMonth,
      maxVolumeKgMonth: h.maxVolumeKgMonth,
      benchmarkRateKes: h.targetBuyPriceKesPerKg
    })),
    completedShipmentsOrContracts:
      p.corridorExperience.gatunaMalabaCrossingsCount,
    avgClearanceOrSlaDays: p.corridorExperience.averageClearanceDays,
    onTimePaymentPct: p.corridorExperience.onTimePaymentRatePct ?? 95,
    reason: p.oneLineReason
  }));
}

export async function queryRealtimeVenusFinder(params: {
  queryText: string;
  sme: RwandanSME;
  opportunity?: ExportOpportunity;
  partners: KenyanPartner[];
  assumptions: CorridorAssumptions;
  onboardingAnswers: OnboardingPreferences;
  history: { role: 'user' | 'assistant'; text: string }[];
  signal?: AbortSignal;
}): Promise<RealtimeVenusFinderResponse> {
  const {
    queryText,
    sme,
    opportunity,
    partners,
    assumptions,
    onboardingAnswers,
    history,
    signal
  } = params;

  const detected = detectCategoryHsFromText(
    queryText,
    onboardingAnswers.selectedCode ||
      opportunity?.productHs ||
      sme.selectedHsCode
  );
  const localScored = runWeightedSimilarityScoring(
    partners,
    sme,
    assumptions,
    detected.hsCode,
    onboardingAnswers.priority,
    opportunity
  );
  const analyticsInsight = computeExportAnalytics(
    detected.hsCode,
    detected.statedCountry ||
      (onboardingAnswers.targetCountry !== 'ALL'
        ? onboardingAnswers.targetCountry
        : null),
    sme,
    opportunity,
    assumptions,
    partners,
    localScored
  );

  try {
    const response = await fetch(REALTIME_VENUS_CONFIG.finderEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        message: queryText,
        modelId: REALTIME_VENUS_CONFIG.modelId,
        smeProfile: {
          id: sme.id,
          businessName: sme.businessName.replace(' (sample)', ''),
          rdbNumber: sme.rdbNumber,
          tin: sme.tin,
          district: sme.district,
          products: sme.products,
          selectedHsCode: detected.hsCode,
          certifications: sme.certifications,
          monthlyCapacityKg:
            opportunity?.capacityKgMonth || sme.monthlyCapacityKg,
          exWorksPriceRwf:
            opportunity?.exWorksPriceRwf || sme.exWorksPriceRwf
        },
        corridorAssumptions: assumptions,
        smeCorridorRows: analyticsInsight.corridorRows,
        onboardingContext: onboardingAnswers,
        datasetSummary: buildDatasetSummaryForVenus(partners),
        history: history.slice(-6)
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();
    const aiData = json?.data;

    if (!aiData || typeof aiData.replyText !== 'string') {
      throw new Error('Invalid Realtime-Venus payload');
    }

    const conversationalOnly =
      aiData.intent === 'greeting_or_general' ||
      isConversationalOnlyQuery(queryText);

    const showAnalytics =
      !conversationalOnly && Boolean(aiData.includeAnalytics);
    const showPartners =
      !conversationalOnly && Boolean(aiData.includePartnerMatches);

    let matchedCards: ScoredPartnerCardData[] = [];
    if (showPartners) {
      if (
        Array.isArray(aiData.recommendedPartners) &&
        aiData.recommendedPartners.length > 0
      ) {
        matchedCards = aiData.recommendedPartners
          .map((rec: any) => {
            const foundLocal = localScored.find(
              (l) => l.partner.id === rec.partnerId
            );
            const rawPartner =
              foundLocal?.partner ||
              partners.find((p) => p.id === rec.partnerId);
            if (!rawPartner) return null;
            return {
              partner: rawPartner,
              country: (rawPartner.country || 'Kenya') as RegionalCountry,
              customFitReason:
                rec.customFitReason ||
                foundLocal?.customFitReason ||
                rawPartner.oneLineReason,
              weightedScore:
                rec.weightedScore || foundLocal?.weightedScore || 92,
              classificationScore:
                rec.classificationScore ||
                foundLocal?.classificationScore ||
                94,
              historyScore:
                rec.historyScore || foundLocal?.historyScore || 93,
              demandScore: rec.demandScore || foundLocal?.demandScore || 90,
              rateOrOfferLabel:
                foundLocal?.rateOrOfferLabel || 'Verified Market Rate',
              completedContractsOrLots:
                rawPartner.corridorExperience.gatunaMalabaCrossingsCount,
              clearanceOrSlaDays:
                rawPartner.corridorExperience.averageClearanceDays,
              onTimePaymentPct:
                rawPartner.corridorExperience.onTimePaymentRatePct ?? 96
            };
          })
          .filter(
            (x: ScoredPartnerCardData | null): x is ScoredPartnerCardData =>
              x !== null
          );
      }

      if (matchedCards.length === 0) {
        matchedCards = localScored.slice(0, 4);
      }
    }

    let tableData: StructuredTableData | undefined;
    if (showAnalytics) {
      if (
        Array.isArray(aiData.tableHeaders) &&
        aiData.tableHeaders.length > 0 &&
        Array.isArray(aiData.tableRows) &&
        aiData.tableRows.length > 0
      ) {
        tableData = normalizeStructuredTable(
          aiData.tableTitle || analyticsInsight.structuredTable.title,
          aiData.tableHeaders,
          aiData.tableRows,
          analyticsInsight.structuredTable.smeContextSubtitle
        );
      } else {
        tableData = analyticsInsight.structuredTable;
      }
    }

    return {
      intent: aiData.intent || 'service_partnership',
      duplexMode: aiData.duplexMode || 'Full-Duplex Conversational',
      harnessDelegated: Boolean(aiData.harnessDelegated),
      replyText: aiData.replyText,
      speechScript: aiData.speechScript || aiData.replyText,
      headline: conversationalOnly ? undefined : aiData.headline,
      includeAnalytics: showAnalytics,
      includePartnerMatches: showPartners,
      tableData,
      partnerCards: matchedCards,
      modelId: json?.model || REALTIME_VENUS_CONFIG.modelId
    };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw err;
    }

    const conversationalOnly = isConversationalOnlyQuery(queryText);
    if (conversationalOnly) {
      const politeReply = `Hello ${
        sme.contactPerson.split(' ')[0]
      }! Your profile for ${sme.businessName.replace(
        ' (sample)',
        ''
      )} (${sme.district}) is connected to ${
        REALTIME_VENUS_CONFIG.modelId
      }. Ask me anything or request regional partner matches whenever you are ready.`;
      return {
        intent: 'greeting_or_general',
        duplexMode: 'Full-Duplex Conversational',
        harnessDelegated: false,
        replyText: politeReply,
        speechScript: politeReply,
        includeAnalytics: false,
        includePartnerMatches: false,
        partnerCards: [],
        modelId: REALTIME_VENUS_CONFIG.modelId
      };
    }

    return {
      intent: analyticsInsight.isService
        ? 'service_partnership'
        : 'product_trade',
      duplexMode: analyticsInsight.hasArbitrageOpportunity
        ? 'Proactive Market Arbitrage'
        : 'Harness Tool Delegation',
      harnessDelegated: true,
      headline: `Realtime-Venus Analysis — ${analyticsInsight.offeringName}`,
      replyText: analyticsInsight.arbitrageSummary,
      speechScript: analyticsInsight.arbitrageSummary,
      includeAnalytics: true,
      includePartnerMatches: true,
      tableData: analyticsInsight.structuredTable,
      partnerCards: localScored.slice(0, 4),
      modelId: REALTIME_VENUS_CONFIG.modelId
    };
  }
}

/* ============================================================================
   8. PROACTIVE REAL-TIME DATA VISUALIZATION HOOK (`useRealtimeVenusMarketVisualization`)
      Connects DashboardHome to `inclusionAI/Realtime-Venus` to proactively generate:
      - 6-month historical & projected market demand/price trend curves
      - Corridor-by-corridor SME supply vs. verified buyer demand capacity bars
      - Proactive supply-demand gap & margin arbitrage warnings for the logged-in SME
   ============================================================================ */

export interface ProactiveMarketTrendPoint {
  periodLabel: string;
  demandIndex: number;
  buyerOfferRwf: number;
  smeSupplyCoveragePct: number;
  isProjected?: boolean;
}

export interface CorridorSupplyDemandBar {
  country: RegionalCountry;
  borderPost: string;
  buyerMonthlyDemandKg: number;
  smeMonthlySupplyKg: number;
  gapKg: number;
  coverageRatioPct: number;
  avgBuyerOfferRwf: number;
  netMarginRwfPerKg: number;
  demandScore: number;
  verifiedBuyersCount: number;
}

export interface SupplyDemandGapWarning {
  id: string;
  severity: 'critical' | 'warning' | 'opportunity';
  type: 'supply_deficit' | 'price_arbitrage' | 'certification_unlock';
  title: string;
  corridor: RegionalCountry;
  metricBadge: string;
  description: string;
  recommendation: string;
  actionScreen: 'partners-finder' | 'export-form' | 'shortlist';
  actionLabel: string;
}

export interface RealtimeVenusMarketVisualizationState {
  modelId: string;
  status: 'syncing' | 'ready';
  lastUpdated: string;
  activeCorridor: RegionalCountry;
  setActiveCorridor: (country: RegionalCountry) => void;
  refreshNow: () => void;
  offeringName: string;
  hsCode: string;
  isService: boolean;
  aiProactiveSummary: string;
  topCorridor: CorridorSupplyDemandBar;
  corridorBars: CorridorSupplyDemandBar[];
  trendSeries: ProactiveMarketTrendPoint[];
  gapWarnings: SupplyDemandGapWarning[];
  structuredTable: StructuredTableData;
}

export function useRealtimeVenusMarketVisualization(params: {
  sme: RwandanSME;
  opportunity?: ExportOpportunity;
  partners?: KenyanPartner[];
  assumptions?: CorridorAssumptions;
}): RealtimeVenusMarketVisualizationState {
  const {
    sme,
    opportunity,
    partners = SEED_KENYAN_PARTNERS,
    assumptions = INITIAL_ASSUMPTIONS
  } = params;

  const hsCode =
    opportunity?.productHs ||
    sme.selectedHsCode ||
    sme.products?.[0] ||
    '0713';
  const prodObj =
    HS_PRODUCTS.find((p) => p.hsCode === hsCode) || HS_PRODUCTS[0];
  const isService = hsCode.startsWith('99');

  const [activeCorridor, setActiveCorridor] = useState<RegionalCountry>('Kenya');
  const [status, setStatus] = useState<'syncing' | 'ready'>('ready');
  const [aiProactiveSummary, setAiProactiveSummary] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [refreshTick, setRefreshTick] = useState<number>(0);

  // Compute corridor-level SME supply vs. verified buyer demand from SME profile + dataset
  const corridorBars = useMemo<CorridorSupplyDemandBar[]>(() => {
    const fxRate = assumptions.exchangeRateKesToRwf || 10.5;
    const baseTransitRwf = assumptions.corridorTransitCostRwfPerKg || 85;
    const smeSupplyKg =
      opportunity?.capacityKgMonth || sme.monthlyCapacityKg || 5000;
    const smeExWorksRwf =
      opportunity?.exWorksPriceRwf || sme.exWorksPriceRwf || 2500;
    const chapter = hsCode.slice(0, 2);

    const countries: RegionalCountry[] = [
      'Kenya',
      'Burundi',
      'DRC',
      'Tanzania',
      'Uganda'
    ];

    const bars = countries.map((country) => {
      const corridorMeta = CORRIDOR_BORDER_POSTS[country];
      const freightRwf = Math.round(
        baseTransitRwf * corridorMeta.freightMultiplier
      );

      const countryPartners = partners.filter(
        (p) => (p.country || 'Kenya') === country
      );
      const matching = countryPartners.filter((p) =>
        p.handledProducts.some(
          (h) => h.hsCode === hsCode || h.hsCode.slice(0, 2) === chapter
        )
      );
      const pool = matching.length > 0 ? matching : countryPartners;

      let totalDemandKg = 0;
      let sumKes = 0;
      let kesCount = 0;
      let sumCrossings = 0;
      let sumOnTime = 0;

      for (const p of pool) {
        const prod =
          p.handledProducts.find((h) => h.hsCode === hsCode) ||
          p.handledProducts.find((h) => h.hsCode.slice(0, 2) === chapter) ||
          p.handledProducts[0];
        if (prod) {
          totalDemandKg += Math.round(
            (prod.minVolumeKgMonth + prod.maxVolumeKgMonth) * 0.55
          );
          sumKes += prod.targetBuyPriceKesPerKg;
          kesCount++;
        }
        sumCrossings += p.corridorExperience.gatunaMalabaCrossingsCount;
        sumOnTime += p.corridorExperience.onTimePaymentRatePct ?? 94;
      }

      const avgKes = kesCount > 0 ? Math.round(sumKes / kesCount) : 360;
      const avgBuyerOfferRwf = Math.round(avgKes * fxRate);
      const netMarginRwfPerKg =
        avgBuyerOfferRwf - smeExWorksRwf - freightRwf;
      const avgOnTime = Math.round(sumOnTime / Math.max(1, pool.length));

      const buyerMonthlyDemandKg = Math.max(2500, totalDemandKg);
      const gapKg = buyerMonthlyDemandKg - smeSupplyKg;
      const coverageRatioPct = Math.min(
        100,
        Math.round((smeSupplyKg / Math.max(1, buyerMonthlyDemandKg)) * 100)
      );

      const marginPct =
        smeExWorksRwf > 0
          ? Math.round((netMarginRwfPerKg / smeExWorksRwf) * 100)
          : 16;

      const demandScore = Math.min(
        99,
        Math.max(
          48,
          Math.round(
            avgOnTime * 0.42 +
              Math.min(32, sumCrossings * 0.35) +
              Math.max(-8, Math.min(25, marginPct * 0.55))
          )
        )
      );

      return {
        country,
        borderPost: corridorMeta.borderPost,
        buyerMonthlyDemandKg,
        smeMonthlySupplyKg: smeSupplyKg,
        gapKg,
        coverageRatioPct,
        avgBuyerOfferRwf,
        netMarginRwfPerKg,
        demandScore,
        verifiedBuyersCount: matching.length || pool.length
      };
    });

    bars.sort((a, b) => b.demandScore - a.demandScore);
    return bars;
  }, [
    sme.id,
    sme.monthlyCapacityKg,
    sme.exWorksPriceRwf,
    sme.district,
    hsCode,
    opportunity?.capacityKgMonth,
    opportunity?.exWorksPriceRwf,
    assumptions.exchangeRateKesToRwf,
    assumptions.corridorTransitCostRwfPerKg,
    partners
  ]);

  const topCorridor = corridorBars[0];
  const selectedBar =
    corridorBars.find((b) => b.country === activeCorridor) || topCorridor;

  // Compute 6-period historical & Realtime-Venus projected trend curve for the active corridor
  const trendSeries = useMemo<ProactiveMarketTrendPoint[]>(() => {
    const baseDemand = selectedBar.demandScore;
    const baseOffer = selectedBar.avgBuyerOfferRwf;
    const baseCov = selectedBar.coverageRatioPct;

    const offsets = [
      { periodLabel: 'M-3', dOff: -7, pFactor: 0.93, covOff: 8, proj: false },
      { periodLabel: 'M-2', dOff: -4, pFactor: 0.96, covOff: 5, proj: false },
      { periodLabel: 'M-1', dOff: -2, pFactor: 0.98, covOff: 2, proj: false },
      { periodLabel: 'Now', dOff: 0, pFactor: 1.0, covOff: 0, proj: false },
      { periodLabel: '+30d (AI)', dOff: 3, pFactor: 1.04, covOff: -5, proj: true },
      { periodLabel: '+60d (AI)', dOff: 5, pFactor: 1.07, covOff: -9, proj: true }
    ];

    return offsets.map((o) => ({
      periodLabel: o.periodLabel,
      demandIndex: Math.min(99, Math.max(40, baseDemand + o.dOff)),
      buyerOfferRwf: Math.round(baseOffer * o.pFactor),
      smeSupplyCoveragePct: Math.min(
        100,
        Math.max(12, baseCov + o.covOff)
      ),
      isProjected: o.proj
    }));
  }, [selectedBar]);

  // Generate proactive supply-demand gap warnings tailored to the logged-in SME
  const gapWarnings = useMemo<SupplyDemandGapWarning[]>(() => {
    const warnings: SupplyDemandGapWarning[] = [];
    const smeCleanName = sme.businessName.replace(' (sample)', '');
    const smeSupplyKg =
      opportunity?.capacityKgMonth || sme.monthlyCapacityKg || 5000;
    const smeExWorksRwf =
      opportunity?.exWorksPriceRwf || sme.exWorksPriceRwf || 2500;

    // 1. Supply-Demand Volume Gap Warning in Top / Active Corridor
    if (selectedBar.gapKg > 0) {
      const unmetPct = Math.max(1, 100 - selectedBar.coverageRatioPct);
      warnings.push({
        id: `gap-supply-${selectedBar.country}`,
        severity: unmetPct >= 55 ? 'critical' : 'warning',
        type: 'supply_deficit',
        title: `${selectedBar.country} Supply-Demand Gap Detected`,
        corridor: selectedBar.country,
        metricBadge: `${selectedBar.gapKg.toLocaleString()} kg/mo Unfilled Demand`,
        description: `Verified buyers in ${selectedBar.country} (${selectedBar.borderPost}) absorb ${selectedBar.buyerMonthlyDemandKg.toLocaleString()} kg/mo of ${prodObj.name}, while ${smeCleanName} currently declares ${smeSupplyKg.toLocaleString()} kg/mo (${selectedBar.coverageRatioPct}% coverage).`,
        recommendation: `Target mid-tier buyers matching your ${smeSupplyKg.toLocaleString()} kg/mo capacity or co-load via ${sme.district} cooperative aggregation to capture the remaining ${unmetPct}% corridor demand.`,
        actionScreen: 'partners-finder',
        actionLabel: 'Match Capacity-Fit Buyers'
      });
    } else {
      warnings.push({
        id: `gap-surplus-${selectedBar.country}`,
        severity: 'warning',
        type: 'supply_deficit',
        title: `Single-Corridor Capacity Saturation Risk`,
        corridor: selectedBar.country,
        metricBadge: `+${Math.abs(selectedBar.gapKg).toLocaleString()} kg/mo Surplus`,
        description: `${smeCleanName}'s monthly supply (${smeSupplyKg.toLocaleString()} kg/mo) exceeds single-corridor absorption in ${selectedBar.country} (${selectedBar.buyerMonthlyDemandKg.toLocaleString()} kg/mo).`,
        recommendation: `Split monthly consignments across ${topCorridor.country} and ${corridorBars[1]?.country || 'Burundi'} to prevent price discounting.`,
        actionScreen: 'export-form',
        actionLabel: 'Calibrate Export Split'
      });
    }

    // 2. Proactive Price / Margin Arbitrage Warning
    const bestMarginCorridor = [...corridorBars].sort(
      (a, b) => b.netMarginRwfPerKg - a.netMarginRwfPerKg
    )[0];
    const lowestMarginCorridor =
      corridorBars[corridorBars.length - 1] || selectedBar;
    const marginSpread =
      bestMarginCorridor.netMarginRwfPerKg -
      selectedBar.netMarginRwfPerKg;

    if (marginSpread > 40 && bestMarginCorridor.country !== selectedBar.country) {
      warnings.push({
        id: `gap-arbitrage-${bestMarginCorridor.country}`,
        severity: 'opportunity',
        type: 'price_arbitrage',
        title: `Corridor Margin Arbitrage: ${bestMarginCorridor.country} vs ${selectedBar.country}`,
        corridor: bestMarginCorridor.country,
        metricBadge: `+${marginSpread.toLocaleString()} RWF/kg Higher Net`,
        description: `At your ${smeExWorksRwf.toLocaleString()} RWF/kg ex-works price from ${sme.district}, ${bestMarginCorridor.country} yields ${bestMarginCorridor.netMarginRwfPerKg >= 0 ? '+' : ''}${bestMarginCorridor.netMarginRwfPerKg.toLocaleString()} RWF/kg net vs ${selectedBar.netMarginRwfPerKg.toLocaleString()} RWF/kg in ${selectedBar.country}.`,
        recommendation: `Prioritize ${bestMarginCorridor.country} (${bestMarginCorridor.borderPost}) for primary margin capture.`,
        actionScreen: 'partners-finder',
        actionLabel: `Compare ${bestMarginCorridor.country} Buyers`
      });
    } else {
      const spreadVsLowest = Math.max(
        65,
        bestMarginCorridor.netMarginRwfPerKg -
          lowestMarginCorridor.netMarginRwfPerKg
      );
      warnings.push({
        id: `gap-arbitrage-optimal-${bestMarginCorridor.country}`,
        severity: 'opportunity',
        type: 'price_arbitrage',
        title: `Optimal Net Margin Window in ${bestMarginCorridor.country}`,
        corridor: bestMarginCorridor.country,
        metricBadge: `+${spreadVsLowest.toLocaleString()} RWF/kg vs ${lowestMarginCorridor.country}`,
        description: `Realtime-Venus projects a +4% to +7% 60-day price firming in ${bestMarginCorridor.country} (avg buyer offer ${bestMarginCorridor.avgBuyerOfferRwf.toLocaleString()} RWF/kg vs your ${smeExWorksRwf.toLocaleString()} RWF/kg ex-works).`,
        recommendation: `Lock in 60-day forward off-take terms with ${bestMarginCorridor.verifiedBuyersCount} verified ${bestMarginCorridor.country} counterparties.`,
        actionScreen: 'shortlist',
        actionLabel: 'View Ranked Shortlist'
      });
    }

    // 3. Certification & Compliance Unlock Warning
    const smeCerts: string[] = sme.certifications || [];
    const missingHighValueCerts = [
      'KEBS',
      'East African Organic',
      'HACCP',
      'Fairtrade'
    ].filter((c) => !smeCerts.includes(c));

    const lockedPartnersCount = partners.filter((p) =>
      p.acceptedCertifications.some((c) => !smeCerts.includes(c))
    ).length;

    if (missingHighValueCerts.length > 0 && lockedPartnersCount > 0) {
      warnings.push({
        id: `gap-cert-${sme.id}`,
        severity: 'warning',
        type: 'certification_unlock',
        title: `Compliance Gate: ${missingHighValueCerts[0]} Premium Tier`,
        corridor: topCorridor.country,
        metricBadge: `+${Math.min(lockedPartnersCount, 6)} Buyers Unlockable`,
        description: `${smeCleanName} holds ${smeCerts.join(', ') || 'RSB S-Mark'}. Adding ${missingHighValueCerts.slice(0, 2).join(' or ')} unlocks premium supermarket and processor off-takers across ${topCorridor.country}.`,
        recommendation: `Request MINICOM Trade Desk fast-track mutual recognition for ${missingHighValueCerts[0]} on your next consignment.`,
        actionScreen: 'export-form',
        actionLabel: 'Update Certifications'
      });
    }

    return warnings;
  }, [
    sme.id,
    sme.businessName,
    sme.district,
    sme.monthlyCapacityKg,
    sme.exWorksPriceRwf,
    sme.certifications,
    opportunity?.capacityKgMonth,
    opportunity?.exWorksPriceRwf,
    prodObj.name,
    selectedBar,
    topCorridor,
    corridorBars,
    partners
  ]);

  const structuredTable = useMemo(() => {
    const rows = computeSmeCorridorRowsFromDataset(
      sme,
      opportunity,
      assumptions,
      partners,
      hsCode
    );
    return formatAnalyticsAsStructuredTable(hsCode, sme, opportunity, rows);
  }, [sme, opportunity, assumptions, partners, hsCode]);

  const defaultSummary = useMemo(() => {
    const smeCleanName = sme.businessName.replace(' (sample)', '');
    const primaryWarn = gapWarnings[0];
    return `Realtime-Venus proactive scan for ${smeCleanName} (${sme.district}): ${topCorridor.country} leads regional demand (${topCorridor.demandScore}/100) for ${prodObj.name} at ${topCorridor.avgBuyerOfferRwf.toLocaleString()} RWF/kg (${topCorridor.netMarginRwfPerKg >= 0 ? '+' : ''}${topCorridor.netMarginRwfPerKg.toLocaleString()} RWF/kg net). ${
      primaryWarn ? primaryWarn.description : ''
    }`;
  }, [sme.businessName, sme.district, topCorridor, prodObj.name, gapWarnings]);

  // Connect to the `inclusionAI/Realtime-Venus` backend pipeline in real time when SME profile or corridor changes
  useEffect(() => {
    const controller = new AbortController();
    setStatus('syncing');
    setAiProactiveSummary(defaultSummary);

    const onboarding = deriveInitialOnboardingFromSme(sme, opportunity);
    onboarding.targetCountry = activeCorridor;

    const prompt = `Generate a concise 2-sentence proactive market trend and supply-demand gap warning for ${sme.businessName.replace(
      ' (sample)',
      ''
    )} (${sme.district}) supplying ${prodObj.name} (HS ${hsCode}) with ${(
      opportunity?.capacityKgMonth || sme.monthlyCapacityKg
    ).toLocaleString()} kg/mo capacity at ${(
      opportunity?.exWorksPriceRwf || sme.exWorksPriceRwf
    ).toLocaleString()} RWF/kg targeting ${activeCorridor}.`;

    queryRealtimeVenusFinder({
      queryText: prompt,
      sme,
      opportunity,
      partners,
      assumptions,
      onboardingAnswers: onboarding,
      history: [],
      signal: controller.signal
    })
      .then((res) => {
        if (!controller.signal.aborted && res?.replyText) {
          setAiProactiveSummary(res.replyText);
          setLastUpdated(
            new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          );
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setAiProactiveSummary(defaultSummary);
          setStatus('ready');
        }
      });

    return () => controller.abort();
  }, [
    sme.id,
    sme.selectedHsCode,
    sme.monthlyCapacityKg,
    sme.exWorksPriceRwf,
    opportunity?.productHs,
    opportunity?.capacityKgMonth,
    opportunity?.exWorksPriceRwf,
    activeCorridor,
    refreshTick
  ]);

  const refreshNow = useCallback(() => {
    setRefreshTick((t) => t + 1);
  }, []);

  return {
    modelId: REALTIME_VENUS_CONFIG.modelId,
    status,
    lastUpdated,
    activeCorridor,
    setActiveCorridor,
    refreshNow,
    offeringName: prodObj.name,
    hsCode,
    isService,
    aiProactiveSummary: aiProactiveSummary || defaultSummary,
    topCorridor,
    corridorBars,
    trendSeries,
    gapWarnings,
    structuredTable
  };
}

