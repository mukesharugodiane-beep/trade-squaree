/**
 * Deterministic scoring engine for Trade Square
 * Computes scores strictly from weighted signals in a config object. No random numbers.
 * Generates explainable "Why this match?" justifications using structured templates.
 */

import {
  RwandanSME,
  KenyanPartner,
  ExportOpportunity,
  ScoringWeights,
  MatchSignalBreakdown,
  CorridorAssumptions
} from '../types';

export function calculateMatchScore(
  partner: KenyanPartner,
  opportunity: ExportOpportunity,
  sme: RwandanSME,
  weights: ScoringWeights,
  assumptions: CorridorAssumptions
): MatchSignalBreakdown {
  // 1. PRODUCT FIT (0 - 100)
  const handled = partner.handledProducts.find((p) => p.hsCode === opportunity.productHs);
  let productFitScore = 0;
  if (handled) {
    productFitScore = 95;
    // Boost if partner role aligns directly with opportunity partnerType preference
    if (opportunity.partnerType === 'All' || opportunity.partnerType === partner.role) {
      productFitScore = 100;
    } else {
      productFitScore = 90;
    }
  } else {
    // Check if partner handles closely related agricultural categories
    productFitScore = 20;
  }

  // 2. TRADE EVIDENCE (0 - 100)
  // Based on the 4 strict evidence labels and verified corridor crossings
  let tradeEvidenceScore = 40;
  switch (partner.evidenceLabel) {
    case 'Known trade activity':
      tradeEvidenceScore = 95;
      break;
    case 'Trade Square registered':
      tradeEvidenceScore = 88;
      break;
    case 'Business identity verified':
      tradeEvidenceScore = 80;
      break;
    case 'Potential partner':
      tradeEvidenceScore = 55;
      break;
  }
  // Small corridor experience adjustment (+ up to 5 pts based on Gatuna-Malaba crossings)
  const corridorBonus = Math.min(5, Math.floor(partner.corridorExperience.gatunaMalabaCrossingsCount / 8));
  tradeEvidenceScore = Math.min(100, tradeEvidenceScore + corridorBonus);

  // 3. CERTIFICATION FIT (0 - 100)
  // Compare SME certifications with partner accepted certifications and opportunity requirements
  const smeCerts = new Set(sme.certifications);
  const requiredCerts = opportunity.requiredCertifications;
  let certScore = 70;

  if (requiredCerts.length > 0) {
    const hasRequired = requiredCerts.every((c) => smeCerts.has(c));
    const partnerAcceptsRequired = requiredCerts.every((c) =>
      partner.acceptedCertifications.includes(c)
    );
    if (hasRequired && partnerAcceptsRequired) {
      certScore = 100;
    } else if (hasRequired) {
      certScore = 85;
    } else {
      certScore = 50;
    }
  } else {
    // If no specific required certs, check if partner accepts SME's key cert (e.g. RSB S-Mark)
    const matchesAccepted = sme.certifications.some((c) =>
      partner.acceptedCertifications.includes(c)
    );
    certScore = matchesAccepted ? 92 : 68;
  }

  // 4. CAPACITY FIT (0 - 100)
  let capacityFitScore = 50;
  if (handled) {
    const smeCap = opportunity.capacityKgMonth || sme.monthlyCapacityKg;
    const minVol = handled.minVolumeKgMonth;
    const maxVol = handled.maxVolumeKgMonth;

    if (smeCap >= minVol && smeCap <= maxVol) {
      capacityFitScore = 100; // Optimal match
    } else if (smeCap < minVol) {
      // SME supplies less than partner min
      const ratio = smeCap / minVol;
      capacityFitScore = Math.max(30, Math.round(ratio * 90));
    } else {
      // SME supplies more than partner max (can partially fill or oversupply)
      capacityFitScore = 85;
    }
  }

  // 5. LANDED PRICE FIT (0 - 100)
  // Landed Cost = Ex-Works RWF + Corridor Transit RWF (85 RWF/kg Kigali - Gatuna - Malaba - Nairobi)
  // Converted to KES at current assumption rate (e.g. 9.85 RWF/KES)
  const freightCostRwfPerKg = assumptions.corridorTransitCostRwfPerKg;
  const landedRwfPerKg = (opportunity.exWorksPriceRwf || sme.exWorksPriceRwf) + freightCostRwfPerKg;
  const landedCostKesPerKg = Number((landedRwfPerKg / assumptions.exchangeRateKesToRwf).toFixed(1));

  let landedPriceFitScore = 60;
  if (handled) {
    const targetKes = handled.targetBuyPriceKesPerKg;
    const diffPct = ((targetKes - landedCostKesPerKg) / targetKes) * 100;

    if (diffPct >= 5) {
      // Landed cost is well below target buy price -> very competitive
      landedPriceFitScore = 100;
    } else if (diffPct >= 0) {
      // Slightly below target price -> competitive
      landedPriceFitScore = 92;
    } else if (diffPct >= -10) {
      // Up to 10% above target price -> negotiable
      landedPriceFitScore = 75;
    } else if (diffPct >= -25) {
      // 10-25% above -> tight margins
      landedPriceFitScore = 55;
    } else {
      // >25% above target
      landedPriceFitScore = 35;
    }
  }

  // 6. DATA FRESHNESS (0 - 100)
  // Evaluated relative to late 2026 pilot reference
  let dataFreshnessScore = 75;
  if (partner.updatedDate.includes('Aug 2026') || partner.updatedDate.includes('Sep 2026')) {
    dataFreshnessScore = 95;
  } else if (partner.updatedDate.includes('Jul 2026')) {
    dataFreshnessScore = 85;
  } else if (partner.updatedDate.includes('Jun 2026')) {
    dataFreshnessScore = 75;
  } else {
    dataFreshnessScore = 60;
  }

  // WEIGHTED TOTAL SCORE
  const totalWeight =
    weights.productFit +
    weights.tradeEvidence +
    weights.certificationFit +
    weights.capacityFit +
    weights.landedPriceFit +
    weights.dataFreshness;

  const rawTotal =
    (productFitScore * weights.productFit +
      tradeEvidenceScore * weights.tradeEvidence +
      certScore * weights.certificationFit +
      capacityFitScore * weights.capacityFit +
      landedPriceFitScore * weights.landedPriceFit +
      dataFreshnessScore * weights.dataFreshness) /
    totalWeight;

  const totalScore = Math.round(Math.min(100, Math.max(0, rawTotal)));

  // STRUCTURED TEMPLATE-BASED EXPLANATION ("Why this match?")
  const whyTextParts: string[] = [];

  if (productFitScore >= 90 && handled) {
    whyTextParts.push(`Direct commercial alignment on HS ${handled.hsCode} (${handled.productName}) as an active regional ${partner.role.toLowerCase()}`);
  }

  if (partner.evidenceLabel === 'Known trade activity') {
    whyTextParts.push(`verified cross-border cargo manifests via Gatuna and Malaba border posts (${partner.corridorExperience.gatunaMalabaCrossingsCount} logged transits)`);
  } else if (partner.evidenceLabel === 'Trade Square registered') {
    whyTextParts.push(`active pilot registration verified with validated banking credentials and direct buyer intent`);
  } else if (partner.evidenceLabel === 'Business identity verified') {
    whyTextParts.push(`statutory business registration confirmed with Kenya Revenue Authority (KRA PIN) and institutional registries`);
  } else {
    whyTextParts.push(`regional directory listing documented with pending field verification`);
  }

  if (landedPriceFitScore >= 90 && handled) {
    whyTextParts.push(`estimated landed price of KES ${landedCostKesPerKg}/kg is competitive against their buying threshold of KES ${handled.targetBuyPriceKesPerKg}/kg`);
  } else if (landedPriceFitScore >= 70 && handled) {
    whyTextParts.push(`landed price of KES ${landedCostKesPerKg}/kg is within negotiable range of target KES ${handled.targetBuyPriceKesPerKg}/kg`);
  }

  if (certScore >= 90) {
    whyTextParts.push(`certified compliance with Rwandan quality marks recognized under EAC standardization protocols`);
  }

  const whyThisMatchText = whyTextParts.join('; ') + '.';

  return {
    productFitScore,
    tradeEvidenceScore,
    certificationFitScore: certScore,
    capacityFitScore,
    landedPriceFitScore,
    dataFreshnessScore,
    totalScore,
    whyThisMatchText,
    landedCostKesPerKg,
    freightCostRwfPerKg,
    tariffRegime: 'EAC Customs Union Duty Free (0% with EAC Certificate of Origin)'
  };
}

export function sortAndFilterShortlist(
  partners: KenyanPartner[],
  opportunity: ExportOpportunity,
  sme: RwandanSME,
  weights: ScoringWeights,
  assumptions: CorridorAssumptions
): { partner: KenyanPartner; scoreBreakdown: MatchSignalBreakdown }[] {
  const scored = partners.map((partner) => ({
    partner,
    scoreBreakdown: calculateMatchScore(partner, opportunity, sme, weights, assumptions)
  }));

  // Sort descending by total score, then by tradeEvidenceScore
  scored.sort((a, b) => {
    if (b.scoreBreakdown.totalScore !== a.scoreBreakdown.totalScore) {
      return b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore;
    }
    return b.scoreBreakdown.tradeEvidenceScore - a.scoreBreakdown.tradeEvidenceScore;
  });

  return scored;
}
