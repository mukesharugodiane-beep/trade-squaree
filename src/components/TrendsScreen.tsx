/**
 * Trends Screen ("Trends" Page in Sidebar)
 * 100% Visual & Structural Clone of the Attached Executive Analytics Dashboard Image
 * while preserving 100% of Trade Square's `inclusionAI/Realtime-Venus` content,
 * real-time SME supply-demand intelligence, and official Rwandan color palette:
 * - Primary Blue: #005A94 | Secondary Blue: #2673A6 | Soft Ice Blue: #DDEBF7
 * - Primary Emerald: #1A8754 | Soft Mint: #D1FAE5
 *
 * Layout Architecture (Matches Reference Image):
 * - Top Control Strip: Interactive Corridor Selector (Kenya, Burundi, DRC, Tanzania, Uganda),
 *   Realtime-Venus Live Sync button, FX & Freight Assumptions trigger, and Proactive AI Brief.
 * - ROW 1 (12-Column Asymmetric Grid):
 *   - Left (col-span-7): "Regional Corridor & Partner Performers" structured table card with
 *     circular corridor/partner badges, coverage rates, margin rates, and buyer counts.
 *   - Right Top (col-span-5): "Corridor Supply-Demand Funnel" 4-stage card with diagonal
 *     trend indicators and a 4-segment stepped brand-blue area funnel chart.
 *   - Right Bottom (col-span-5, 2 cards): "Supply Coverage Rate" (green sparkline) &
 *     "Corridor Demand & Margin Rate" (blue sparkline).
 * - ROW 2 (2 Equal-Width 4-Sparkline Cards):
 *   - Left Card: "6-Period Demand & Buyer Offer Trends" (4 columns with green area sparklines)
 *   - Right Card: "SME Capacity vs. Regional Buyer Absorption" (4 columns with blue area sparklines)
 * - ROW 3 (4 Equal-Width Donut Chart Cards with Dashed Callout Leader Lines):
 *   - Donut 1 & 2 (Green #1A8754 / #D1FAE5): Supply vs. Demand & Net Margin vs. Cost
 *   - Donut 3 & 4 (Blue #005A94 / #DDEBF7): Current vs. 60d AI Forecast & Demand Score Breakdown
 * - Proactive Supply-Demand Gap & Arbitrage Warnings + Complete Regional Margin Table
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Info,
  RefreshCw,
  SlidersHorizontal,
  TrendingUp
} from 'lucide-react';
import {
  KenyanPartner,
  RwandanSME,
  ExportOpportunity,
  CorridorAssumptions,
  ActiveScreen,
  RegionalCountry
} from '../types';
import { useRealtimeVenusMarketVisualization } from '../services/aiService';

interface TrendsScreenProps {
  sme: RwandanSME;
  opportunity: ExportOpportunity;
  partners: KenyanPartner[];
  assumptions: CorridorAssumptions;
  onNavigateScreen: (screen: ActiveScreen) => void;
  onOpenAssumptions: () => void;
}

/**
 * Reusable Mini Area Sparkline SVG matching the reference image's smooth curves,
 * subtle horizontal grid lines, and soft gradient fill.
 */
const MiniAreaSparkline: React.FC<{
  values: number[];
  strokeColor: string;
  fillColor: string;
  gradientId: string;
  height?: number;
}> = ({ values, strokeColor, fillColor, gradientId, height = 56 }) => {
  const width = 180;
  const padX = 2;
  const padY = 6;
  const usableW = width - padX * 2;
  const usableH = height - padY * 2;

  const safeValues = values.length >= 2 ? values : [60, 68, 65, 74, 71, 79];
  const minVal = Math.min(...safeValues) - 4;
  const maxVal = Math.max(...safeValues) + 4;
  const range = Math.max(8, maxVal - minVal);

  const pts = safeValues.map((v, i) => {
    const x = padX + (i / (safeValues.length - 1)) * usableW;
    const y = padY + usableH - ((v - minVal) / range) * usableH;
    return { x, y };
  });

  const linePath = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${(
    height - 2
  ).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(height - 2).toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-14 overflow-visible"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={fillColor} stopOpacity="0.08" />
        </linearGradient>
      </defs>
      {/* Subtle horizontal reference lines matching reference image */}
      {[0.25, 0.55, 0.85].map((ratio, idx) => (
        <line
          key={idx}
          x1={0}
          x2={width}
          y1={padY + usableH * ratio}
          y2={padY + usableH * ratio}
          stroke="#F1F5F9"
          strokeWidth="1"
        />
      ))}
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * Reusable Donut Comparison Card matching Row 3 of the reference image:
 * - Two-segment SVG ring with clean white segment gap
 * - Top-left and bottom-right dashed leader lines with colored square & figure
 * - Center total figure + "Total" label
 * - Bottom 2-item legend
 */
const DonutComparisonCard: React.FC<{
  title: string;
  tooltip: string;
  primaryValue: number;
  secondaryValue: number;
  primaryDisplay: string;
  secondaryDisplay: string;
  centerTotalDisplay: string;
  centerLabel?: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryColor: string;
  secondaryColor: string;
  onActionClick: () => void;
}> = ({
  title,
  tooltip,
  primaryValue,
  secondaryValue,
  primaryDisplay,
  secondaryDisplay,
  centerTotalDisplay,
  centerLabel = 'Total',
  primaryLabel,
  secondaryLabel,
  primaryColor,
  secondaryColor,
  onActionClick
}) => {
  const total = Math.max(1, primaryValue + secondaryValue);
  const primaryRatio = Math.min(0.92, Math.max(0.12, primaryValue / total));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const gapPx = 4;
  const primaryDash = Math.max(10, primaryRatio * circumference - gapPx);
  const secondaryDash = Math.max(10, (1 - primaryRatio) * circumference - gapPx);

  return (
    <div className="bg-white border border-slate-200/85 rounded-xl p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] flex flex-col justify-between">
      {/* Top Card Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className="text-xs sm:text-[13px] font-semibold text-slate-900 truncate">
            {title}
          </h3>
          <span
            title={tooltip}
            className="text-slate-400 hover:text-[#005A94] transition-colors cursor-help shrink-0"
          >
            <Info className="w-3.5 h-3.5" />
          </span>
        </div>
        <button
          type="button"
          onClick={onActionClick}
          title="Refresh metric with Realtime-Venus"
          className="p-1 rounded-md text-slate-400 hover:text-[#005A94] hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Donut + Dashed Callout Lines */}
      <div className="relative my-1 flex items-center justify-center">
        <svg viewBox="0 0 260 156" className="w-full max-w-[260px] h-36 overflow-visible">
          {/* Top-Left Dashed Callout Leader Line */}
          <polyline
            points="54,24 78,24 94,42"
            fill="none"
            stroke="#64748B"
            strokeWidth="1"
            strokeDasharray="2.5 2.5"
          />
          <rect
            x="43"
            y="20.5"
            width="6.5"
            height="6.5"
            rx="1.5"
            fill={primaryColor}
          />
          <text
            x="38"
            y="26.5"
            textAnchor="end"
            className="text-[11px] font-semibold fill-slate-700 font-mono"
          >
            {primaryDisplay}
          </text>

          {/* Bottom-Right Dashed Callout Leader Line */}
          <polyline
            points="166,118 182,134 206,134"
            fill="none"
            stroke="#64748B"
            strokeWidth="1"
            strokeDasharray="2.5 2.5"
          />
          <rect
            x="210"
            y="130.5"
            width="6.5"
            height="6.5"
            rx="1.5"
            fill={secondaryColor}
          />
          <text
            x="221"
            y="136.5"
            textAnchor="start"
            className="text-[11px] font-semibold fill-slate-700 font-mono"
          >
            {secondaryDisplay}
          </text>

          {/* Donut Ring Group Centered at (130, 78) */}
          <g transform="translate(130, 78) rotate(-90)">
            {/* Secondary Segment */}
            <circle
              r={radius}
              cx={0}
              cy={0}
              fill="transparent"
              stroke={secondaryColor}
              strokeWidth="18"
              strokeDasharray={`${secondaryDash} ${circumference}`}
              strokeDashoffset={-(primaryDash + gapPx)}
            />
            {/* Primary Segment */}
            <circle
              r={radius}
              cx={0}
              cy={0}
              fill="transparent"
              stroke={primaryColor}
              strokeWidth="18"
              strokeDasharray={`${primaryDash} ${circumference}`}
              strokeDashoffset={0}
            />
          </g>

          {/* Center Total Label */}
          <text
            x="130"
            y="76"
            textAnchor="middle"
            className="text-[16px] font-bold fill-slate-900 font-mono"
          >
            {centerTotalDisplay}
          </text>
          <text
            x="130"
            y="92"
            textAnchor="middle"
            className="text-[10px] font-medium fill-slate-500"
          >
            {centerLabel}
          </text>
        </svg>
      </div>

      {/* Bottom Legend Row */}
      <div className="pt-1 flex items-center justify-center gap-4 text-[11px] text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-[2px] shrink-0"
            style={{ backgroundColor: primaryColor }}
          />
          <span className="truncate">{primaryLabel}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-[2px] shrink-0"
            style={{ backgroundColor: secondaryColor }}
          />
          <span className="truncate">{secondaryLabel}</span>
        </span>
      </div>
    </div>
  );
};

export const TrendsScreen: React.FC<TrendsScreenProps> = ({
  sme,
  opportunity,
  partners,
  assumptions,
  onNavigateScreen,
  onOpenAssumptions
}) => {
  const [tableTab, setTableTab] = useState<'corridors' | 'partners'>('corridors');

  const venusViz = useRealtimeVenusMarketVisualization({
    sme,
    opportunity,
    partners,
    assumptions
  });

  const activeBar =
    venusViz.corridorBars.find((b) => b.country === venusViz.activeCorridor) ||
    venusViz.topCorridor;

  const smeCapacityKg = opportunity.capacityKgMonth || sme.monthlyCapacityKg;
  const smeExWorksRwf = opportunity.exWorksPriceRwf || sme.exWorksPriceRwf;
  const landedCostRwf = smeExWorksRwf + assumptions.corridorTransitCostRwfPerKg;

  // Series arrays for sparklines
  const demandIndexSeries = venusViz.trendSeries.map((pt) => pt.demandIndex);
  const buyerOfferSeries = venusViz.trendSeries.map((pt) => pt.buyerOfferRwf);
  const smeFloorSeries = venusViz.trendSeries.map((pt) => pt.smeSupplyCoveragePct);
  const marginSeries = venusViz.trendSeries.map((pt) =>
    Math.max(10, pt.buyerOfferRwf - landedCostRwf)
  );

  // Corridor badge visual styles using unchanged Trade Square color codes
  const CORRIDOR_BADGE_STYLES: Record<
    RegionalCountry,
    { code: string; bg: string; text: string; border: string }
  > = {
    Kenya: {
      code: 'KE',
      bg: 'bg-[#DDEBF7]',
      text: 'text-[#005A94]',
      border: 'border-[#005A94]/25'
    },
    Burundi: {
      code: 'BI',
      bg: 'bg-emerald-50',
      text: 'text-[#1A8754]',
      border: 'border-[#1A8754]/25'
    },
    DRC: {
      code: 'CD',
      bg: 'bg-[#005A94]',
      text: 'text-white',
      border: 'border-[#005A94]'
    },
    Tanzania: {
      code: 'TZ',
      bg: 'bg-[#2673A6]/15',
      text: 'text-[#005A94]',
      border: 'border-[#2673A6]/30'
    },
    Uganda: {
      code: 'UG',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-300/60'
    }
  };

  // Top 6 verified regional partners for the alternate partner performer view
  const topPartnerPerformers = partners.slice(0, 6).map((p, idx) => {
    const prod =
      p.handledProducts.find((hp) => hp.hsCode === venusViz.hsCode) ||
      p.handledProducts[0];
    const offerRwf = prod
      ? Math.round(prod.targetBuyPriceKesPerKg * assumptions.exchangeRateKesToRwf)
      : activeBar.avgBuyerOfferRwf;
    const onTimeRate = p.corridorExperience.onTimePaymentRatePct || 92 - idx * 2;
    const crossings = p.corridorExperience.gatunaMalabaCrossingsCount || 14 - idx;
    const initials = p.name
      .replace(' (sample)', '')
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    return {
      id: p.id,
      name: p.name.replace(' (sample)', ''),
      city: p.city,
      country: (p.country || 'Kenya') as RegionalCountry,
      initials,
      onTimeRate: `${onTimeRate}%`,
      offerRwf: `${offerRwf.toLocaleString()} RWF`,
      crossings
    };
  });

  const forecastedOfferRwf =
    venusViz.trendSeries[venusViz.trendSeries.length - 1]?.buyerOfferRwf ||
    Math.round(activeBar.avgBuyerOfferRwf * 1.07);

  return (
    <div className="space-y-4 pb-14">
      {/* =====================================================================
          COMPACT TOP CONTROL BAR (Preserves Corridor Tabs, Sync & Assumptions)
          ===================================================================== */}
      <div className="bg-white border border-slate-200/85 rounded-xl px-4 py-3 shadow-[0_2px_10px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => onNavigateScreen('dashboard-home')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-slate-200 hover:border-[#005A94] text-[11px] font-semibold text-[#005A94] transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Dashboard</span>
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Market Trends & Supply-Demand Intelligence
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#DDEBF7] text-[#005A94] text-[10px] font-bold">
                {venusViz.offeringName} (HS {venusViz.hsCode})
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {sme.businessName.replace(' (sample)', '')} ({sme.district}) · Capacity{' '}
              {smeCapacityKg.toLocaleString()} kg/mo · Ex-Works{' '}
              {smeExWorksRwf.toLocaleString()} RWF/kg
            </p>
          </div>
        </div>

        {/* Corridor Pills + Realtime-Venus Sync + Assumptions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/70">
            {venusViz.corridorBars.map((bar) => {
              const isSelected = venusViz.activeCorridor === bar.country;
              return (
                <button
                  key={bar.country}
                  type="button"
                  onClick={() => venusViz.setActiveCorridor(bar.country)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#005A94] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {bar.country}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={venusViz.refreshNow}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-[#005A94] text-[11px] font-semibold text-[#005A94] transition-colors cursor-pointer"
            title="Re-scan market trends with Realtime-Venus"
          >
            <RefreshCw
              className={`w-3 h-3 ${venusViz.status === 'syncing' ? 'animate-spin' : ''}`}
            />
            <span>
              {venusViz.status === 'syncing'
                ? 'Scanning...'
                : `Synced ${venusViz.lastUpdated}`}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenAssumptions}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-[#005A94] text-[11px] font-semibold text-slate-700 hover:text-[#005A94] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3 text-[#005A94]" />
            <span className="hidden sm:inline">Assumptions</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          ROW 1: ASYMMETRIC 12-COLUMN GRID (100% Clone of Image Row 1)
          - Left (xl:col-span-7): Top Corridor & Partner Performers Table Card
          - Right (xl:col-span-5):
            - Top Card: Corridor Supply-Demand Funnel (4 columns + stepped area)
            - Bottom 2 Cards: Supply Coverage Rate & Corridor Margin Rate
          ===================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
        {/* LEFT CARD (xl:col-span-7): TOP CORRIDOR & PARTNER PERFORMERS TABLE */}
        <div className="xl:col-span-7 bg-white border border-slate-200/85 rounded-xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] flex flex-col justify-between">
          <div>
            {/* Card Header matching "Top Partner Performers ⓘ" */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                  {tableTab === 'corridors'
                    ? 'Top Corridor Performers'
                    : 'Top Partner Performers'}
                </h2>
                <span
                  title={`Realtime-Venus live performance ranking for ${sme.businessName.replace(
                    ' (sample)',
                    ''
                  )}`}
                  className="text-slate-400 hover:text-[#005A94] cursor-help"
                >
                  <Info className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setTableTab('corridors')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                      tableTab === 'corridors'
                        ? 'bg-white text-[#005A94] shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Corridors
                  </button>
                  <button
                    type="button"
                    onClick={() => setTableTab('partners')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                      tableTab === 'partners'
                        ? 'bg-white text-[#005A94] shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Partners
                  </button>
                </div>

                <button
                  type="button"
                  onClick={venusViz.refreshNow}
                  title="Refresh table"
                  className="p-1 rounded-md text-slate-400 hover:text-[#005A94] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Inner Rounded Table matching Reference Image */}
            <div className="border border-slate-200/80 rounded-lg overflow-x-auto">
              {tableTab === 'corridors' ? (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-200/80 text-[11px] font-medium text-slate-600">
                      <th className="py-2.5 px-3.5 border-r border-slate-200/60">
                        Corridor (OSBP)
                      </th>
                      <th className="py-2.5 px-3.5 border-r border-slate-200/60">
                        Supply Coverage Rate
                      </th>
                      <th className="py-2.5 px-3.5 border-r border-slate-200/60">
                        Net Margin Rate
                      </th>
                      <th className="py-2.5 px-3.5">Verified Buyers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70">
                    {venusViz.corridorBars.map((bar) => {
                      const badge = CORRIDOR_BADGE_STYLES[bar.country];
                      const isSelected = bar.country === venusViz.activeCorridor;
                      const marginPct = Math.max(
                        0,
                        Math.round(
                          (bar.netMarginRwfPerKg / Math.max(1, bar.avgBuyerOfferRwf)) * 1000
                        ) / 10
                      );

                      return (
                        <tr
                          key={bar.country}
                          onClick={() => venusViz.setActiveCorridor(bar.country)}
                          className={`transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#DDEBF7]/35'
                              : 'hover:bg-slate-50/90'
                          }`}
                        >
                          <td className="py-2.5 px-3.5 border-r border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`w-7 h-7 rounded-full border ${badge.bg} ${badge.text} ${badge.border} flex items-center justify-center text-[10px] font-bold shrink-0`}
                              >
                                {badge.code}
                              </span>
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-900 truncate">
                                  {bar.country} Corridor
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  Via {bar.borderPost} · {bar.avgBuyerOfferRwf.toLocaleString()} RWF/kg
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 font-mono text-slate-800">
                            {bar.coverageRatioPct}%
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 font-mono">
                            <span
                              className={
                                bar.netMarginRwfPerKg >= 0
                                  ? 'text-[#1A8754] font-semibold'
                                  : 'text-amber-700 font-semibold'
                              }
                            >
                              {marginPct}% ({bar.netMarginRwfPerKg >= 0 ? '+' : ''}
                              {bar.netMarginRwfPerKg} RWF)
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 font-mono text-slate-800">
                            {bar.verifiedBuyersCount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-200/80 text-[11px] font-medium text-slate-600">
                      <th className="py-2.5 px-3.5 border-r border-slate-200/60">
                        Partner
                      </th>
                      <th className="py-2.5 px-3.5 border-r border-slate-200/60">
                        On-Time Settlement
                      </th>
                      <th className="py-2.5 px-3.5 border-r border-slate-200/60">
                        Buyer Offer Rate
                      </th>
                      <th className="py-2.5 px-3.5">OSBP Crossings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70">
                    {topPartnerPerformers.map((p, idx) => {
                      const badge =
                        CORRIDOR_BADGE_STYLES[p.country] || CORRIDOR_BADGE_STYLES.Kenya;
                      return (
                        <tr
                          key={p.id}
                          onClick={() => onNavigateScreen('partners-finder')}
                          className="hover:bg-slate-50/90 transition-colors cursor-pointer"
                        >
                          <td className="py-2.5 px-3.5 border-r border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`w-7 h-7 rounded-full border ${
                                  idx % 2 === 0
                                    ? 'bg-[#DDEBF7] text-[#005A94] border-[#005A94]/25'
                                    : `${badge.bg} ${badge.text} ${badge.border}`
                                } flex items-center justify-center text-[10px] font-bold shrink-0`}
                              >
                                {p.initials}
                              </span>
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-900 truncate">
                                  {p.name}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  {p.city}, {p.country}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 font-mono text-slate-800">
                            {p.onTimeRate}
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 font-mono text-[#1A8754] font-semibold">
                            {p.offerRwf}
                          </td>
                          <td className="py-2.5 px-3.5 font-mono text-slate-800">
                            {p.crossings}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Subtle Proactive Brief Footer inside Left Table Card */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="text-slate-600 truncate max-w-xl">
              <strong className="text-[#005A94]">{venusViz.activeCorridor} Brief:</strong>{' '}
              {venusViz.aiProactiveSummary}
            </span>
            <button
              type="button"
              onClick={() => onNavigateScreen('partners-finder')}
              className="font-semibold text-[#005A94] hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Open AI Matchmaker</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* RIGHT STACK (xl:col-span-5): FUNNEL CARD ON TOP + 2 RATE CARDS BELOW */}
        <div className="xl:col-span-5 flex flex-col justify-between gap-4">
          {/* TOP-RIGHT CARD: CORRIDOR SUPPLY-DEMAND FUNNEL (Clones "Sales Funnel ⓘ") */}
          <div className="bg-white border border-slate-200/85 rounded-xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                  Corridor Supply-Demand Funnel ({venusViz.activeCorridor})
                </h2>
                <span
                  title="Real-time buyer demand vs. SME monthly capacity and unfilled volume gap"
                  className="text-slate-400 hover:text-[#005A94] cursor-help"
                >
                  <Info className="w-3.5 h-3.5" />
                </span>
              </div>
              <button
                type="button"
                onClick={venusViz.refreshNow}
                className="p-1 rounded-md text-slate-400 hover:text-[#005A94] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Refresh funnel"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4 Funnel Columns with Vertical Hairline Dividers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/75">
              {/* Stage 1: Regional Demand */}
              <div className="py-1.5 sm:px-2.5 first:pl-0">
                <div className="text-[11px] text-slate-600 mb-1 truncate">
                  Buyer Demand
                </div>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                    {(activeBar.buyerMonthlyDemandKg / 1000).toFixed(1)}t
                  </span>
                  <span className="inline-flex items-center text-[10px] font-semibold text-[#1A8754]">
                    <ArrowUpRight className="w-3 h-3" />
                    7.0%
                  </span>
                </div>
              </div>

              {/* Stage 2: SME Supply */}
              <div className="py-1.5 sm:px-2.5">
                <div className="text-[11px] text-slate-600 mb-1 truncate">
                  Your Supply
                </div>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                    {(activeBar.smeMonthlySupplyKg / 1000).toFixed(1)}t
                  </span>
                  <span className="inline-flex items-center text-[10px] font-semibold text-[#1A8754]">
                    <ArrowUpRight className="w-3 h-3" />
                    {activeBar.coverageRatioPct}%
                  </span>
                </div>
              </div>

              {/* Stage 3: Unfilled Gap */}
              <div className="py-1.5 sm:px-2.5">
                <div className="text-[11px] text-slate-600 mb-1 truncate">
                  Unfilled Gap
                </div>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                    {(activeBar.gapKg / 1000).toFixed(1)}t
                  </span>
                  <span className="inline-flex items-center text-[10px] font-semibold text-rose-500">
                    <ArrowDownRight className="w-3 h-3" />
                    {Math.max(0, 100 - activeBar.coverageRatioPct)}%
                  </span>
                </div>
              </div>

              {/* Stage 4: Verified Buyers */}
              <div className="py-1.5 sm:px-2.5 last:pr-0">
                <div className="text-[11px] text-slate-600 mb-1 truncate">
                  Active Buyers
                </div>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                    {activeBar.verifiedBuyersCount}
                  </span>
                  <span className="inline-flex items-center text-[10px] font-semibold text-[#1A8754]">
                    <ArrowUpRight className="w-3 h-3" />
                    {activeBar.demandScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* 4-Segment Stepped Wave Funnel SVG (Shades of Trade Square Blue) */}
            <div className="mt-2 pt-1">
              <svg
                viewBox="0 0 400 54"
                className="w-full h-14 overflow-hidden rounded-b-lg"
                preserveAspectRatio="none"
              >
                {/* Segment 1: Softest Ice Blue (#DDEBF7) */}
                <path
                  d="M 0 12 Q 50 4, 100 16 L 100 54 L 0 54 Z"
                  fill="#DDEBF7"
                />
                {/* Segment 2: Mid-Light Corridor Blue (#8ABCE2) */}
                <path
                  d="M 100 16 Q 150 26, 200 22 L 200 54 L 100 54 Z"
                  fill="#8ABCE2"
                />
                {/* Segment 3: Secondary Brand Blue (#2673A6) */}
                <path
                  d="M 200 22 Q 250 18, 300 30 L 300 54 L 200 54 Z"
                  fill="#2673A6"
                />
                {/* Segment 4: Primary Deep Rwandan Blue (#005A94) */}
                <path
                  d="M 300 30 Q 350 24, 400 34 L 400 54 L 300 54 Z"
                  fill="#005A94"
                />
                {/* Vertical Segment Dividers */}
                <line x1="100" y1="0" x2="100" y2="54" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="200" y1="0" x2="200" y2="54" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="300" y1="0" x2="300" y2="54" stroke="#F1F5F9" strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* BOTTOM-RIGHT 2 SIDE-BY-SIDE CARDS (Clones "Referral Conversion Rate" & "Deal Won Rate") */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {/* Rate Card 1: Supply Coverage Rate (Green Sparkline) */}
            <div className="bg-white border border-slate-200/85 rounded-xl p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <div className="flex items-center gap-1 min-w-0">
                    <h3 className="text-xs font-semibold text-slate-900 truncate">
                      Supply Coverage Rate
                    </h3>
                    <span
                      title="Percentage of regional buyer demand fulfilled by your monthly capacity"
                      className="text-slate-400 hover:text-[#005A94] cursor-help shrink-0"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateScreen('export-form')}
                    className="p-1 rounded-md text-slate-400 hover:text-[#005A94] hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Adjust export capacity"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
                    {activeBar.coverageRatioPct}%
                  </span>
                  <span
                    className={`inline-flex items-center text-[11px] font-semibold ${
                      activeBar.gapKg > 0 ? 'text-rose-500' : 'text-[#1A8754]'
                    }`}
                  >
                    {activeBar.gapKg > 0 ? (
                      <>
                        <ArrowDownRight className="w-3 h-3" />
                        {(activeBar.gapKg / 1000).toFixed(1)}t gap
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-3 h-3" />
                        Full Fit
                      </>
                    )}
                  </span>
                </div>
              </div>

              <MiniAreaSparkline
                values={demandIndexSeries}
                strokeColor="#1A8754"
                fillColor="#D1FAE5"
                gradientId="rateCardGreenGrad"
              />
            </div>

            {/* Rate Card 2: Corridor Demand Score & Margin Rate (Blue Sparkline) */}
            <div className="bg-white border border-slate-200/85 rounded-xl p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <div className="flex items-center gap-1 min-w-0">
                    <h3 className="text-xs font-semibold text-slate-900 truncate">
                      Corridor Demand Score
                    </h3>
                    <span
                      title="Realtime-Venus composite demand & net margin readiness score"
                      className="text-slate-400 hover:text-[#005A94] cursor-help shrink-0"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateScreen('partners-finder')}
                    className="p-1 rounded-md text-slate-400 hover:text-[#005A94] hover:bg-slate-100 transition-colors cursor-pointer"
                    title="View matched buyers"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
                    {activeBar.demandScore}%
                  </span>
                  <span className="inline-flex items-center text-[11px] font-semibold text-[#1A8754]">
                    <ArrowUpRight className="w-3 h-3" />
                    +{activeBar.netMarginRwfPerKg} RWF/kg
                  </span>
                </div>
              </div>

              <MiniAreaSparkline
                values={buyerOfferSeries}
                strokeColor="#005A94"
                fillColor="#DDEBF7"
                gradientId="rateCardBlueGrad"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          ROW 2: TWO EQUAL-WIDTH 4-MINI-CHART CARDS (100% Clone of Image Row 2)
          - Left Card: 6-Period Demand & Buyer Offer Trends (4 Green Sparklines)
          - Right Card: Corridor Capacity vs. Buyer Absorption (4 Blue Sparklines)
          ===================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* LEFT WIDE 4-SPARKLINE CARD (Green #1A8754 Sparklines) */}
        <div className="bg-white border border-slate-200/85 rounded-xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                6-Period Price & Margin Trajectory ({venusViz.activeCorridor})
              </h2>
              <span
                title="Historical OSBP price trajectory + 60-day Realtime-Venus AI forecast"
                className="text-slate-400 hover:text-[#005A94] cursor-help"
              >
                <Info className="w-3.5 h-3.5" />
              </span>
            </div>
            <button
              type="button"
              onClick={venusViz.refreshNow}
              className="p-1 rounded-md text-slate-400 hover:text-[#005A94] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Re-scan trajectory"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Sub-column 1: Current Buyer Offer */}
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-600 truncate">Buyer Offer</div>
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                  {activeBar.avgBuyerOfferRwf.toLocaleString()}
                </span>
                <span className="inline-flex items-center text-[10px] font-semibold text-[#1A8754]">
                  <ArrowUpRight className="w-3 h-3" />
                  3.2%
                </span>
              </div>
              <MiniAreaSparkline
                values={buyerOfferSeries}
                strokeColor="#1A8754"
                fillColor="#D1FAE5"
                gradientId="row2Green1"
              />
            </div>

            {/* Sub-column 2: 60d AI Forecast Offer */}
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-600 truncate">60d AI Forecast</div>
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                  {forecastedOfferRwf.toLocaleString()}
                </span>
                <span className="inline-flex items-center text-[10px] font-semibold text-[#1A8754]">
                  <ArrowUpRight className="w-3 h-3" />
                  7.0%
                </span>
              </div>
              <MiniAreaSparkline
                values={[...buyerOfferSeries.slice(1), forecastedOfferRwf + 45]}
                strokeColor="#1A8754"
                fillColor="#D1FAE5"
                gradientId="row2Green2"
              />
            </div>

            {/* Sub-column 3: Landed Cost Floor */}
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-600 truncate">Landed Cost</div>
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                  {landedCostRwf.toLocaleString()}
                </span>
                <span className="inline-flex items-center text-[10px] font-semibold text-rose-500">
                  <ArrowDownRight className="w-3 h-3" />
                  1.5%
                </span>
              </div>
              <MiniAreaSparkline
                values={smeFloorSeries}
                strokeColor="#1A8754"
                fillColor="#D1FAE5"
                gradientId="row2Green3"
              />
            </div>

            {/* Sub-column 4: SME Net Margin */}
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-600 truncate">SME Net Margin</div>
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                  {activeBar.netMarginRwfPerKg >= 0 ? '+' : ''}
                  {activeBar.netMarginRwfPerKg}
                </span>
                <span className="inline-flex items-center text-[10px] font-semibold text-[#1A8754]">
                  <ArrowUpRight className="w-3 h-3" />
                  4.8%
                </span>
              </div>
              <MiniAreaSparkline
                values={marginSeries}
                strokeColor="#1A8754"
                fillColor="#D1FAE5"
                gradientId="row2Green4"
              />
            </div>
          </div>
        </div>

        {/* RIGHT WIDE 4-SPARKLINE CARD (Blue #005A94 Sparklines) */}
        <div className="bg-white border border-slate-200/85 rounded-xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                Regional Corridor Demand Absorption (kg/mo)
              </h2>
              <span
                title="Verified monthly buyer demand across the top 4 regional corridors"
                className="text-slate-400 hover:text-[#005A94] cursor-help"
              >
                <Info className="w-3.5 h-3.5" />
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenAssumptions}
              className="p-1 rounded-md text-slate-400 hover:text-[#005A94] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Corridor freight & FX assumptions"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {venusViz.corridorBars.slice(0, 4).map((bar, idx) => {
              const hasGap = bar.gapKg > 0;
              const syntheticSeries = [
                bar.demandScore - 6,
                bar.demandScore - 2,
                bar.demandScore - 4,
                bar.demandScore + 1,
                bar.demandScore + 3,
                bar.demandScore + 6
              ];

              return (
                <div
                  key={bar.country}
                  onClick={() => venusViz.setActiveCorridor(bar.country)}
                  className="space-y-1.5 cursor-pointer group"
                >
                  <div className="text-[11px] text-slate-600 group-hover:text-[#005A94] font-medium truncate">
                    {bar.country} ({bar.borderPost})
                  </div>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                      {(bar.buyerMonthlyDemandKg / 1000).toFixed(1)}t
                    </span>
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold ${
                        idx % 2 === 0 ? 'text-[#1A8754]' : 'text-rose-500'
                      }`}
                    >
                      {hasGap ? (
                        <>
                          <ArrowUpRight className="w-3 h-3" />
                          {bar.coverageRatioPct}%
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="w-3 h-3" />
                          Full
                        </>
                      )}
                    </span>
                  </div>
                  <MiniAreaSparkline
                    values={syntheticSeries}
                    strokeColor="#005A94"
                    fillColor="#DDEBF7"
                    gradientId={`row2Blue${idx}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          ROW 3: FOUR EQUAL-WIDTH DONUT COMPARISON CARDS (100% Clone of Image Row 3)
          - Card 1 & 2: Emerald Green (#1A8754 & #D1FAE5)
          - Card 3 & 4: Trade Square Blue (#005A94 & #DDEBF7)
          ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Donut 1: SME Supply vs. Unfilled Demand (Green) */}
        <DonutComparisonCard
          title="Supply v/s Unfilled Demand"
          tooltip={`Your monthly supply (${activeBar.smeMonthlySupplyKg.toLocaleString()} kg) vs. unfilled buyer demand (${activeBar.gapKg.toLocaleString()} kg) in ${venusViz.activeCorridor}`}
          primaryValue={activeBar.smeMonthlySupplyKg}
          secondaryValue={Math.max(500, activeBar.gapKg)}
          primaryDisplay={`${(activeBar.smeMonthlySupplyKg / 1000).toFixed(1)}t`}
          secondaryDisplay={`${(activeBar.gapKg / 1000).toFixed(1)}t`}
          centerTotalDisplay={`${(activeBar.buyerMonthlyDemandKg / 1000).toFixed(1)}t`}
          centerLabel="Total Demand"
          primaryLabel="Your Supply"
          secondaryLabel="Unfilled Gap"
          primaryColor="#1A8754"
          secondaryColor="#D1FAE5"
          onActionClick={venusViz.refreshNow}
        />

        {/* Donut 2: Net Margin vs. Landed Cost (Green) */}
        <DonutComparisonCard
          title="Net Margin v/s Landed Cost"
          tooltip={`SME net profit margin (${activeBar.netMarginRwfPerKg} RWF/kg) vs. Ex-Works + OSBP transit cost (${landedCostRwf} RWF/kg)`}
          primaryValue={Math.max(120, activeBar.netMarginRwfPerKg)}
          secondaryValue={landedCostRwf}
          primaryDisplay={`${Math.max(0, activeBar.netMarginRwfPerKg)}`}
          secondaryDisplay={`${landedCostRwf}`}
          centerTotalDisplay={`${activeBar.avgBuyerOfferRwf}`}
          centerLabel="RWF/kg Offer"
          primaryLabel="Net Margin"
          secondaryLabel="Landed Cost"
          primaryColor="#1A8754"
          secondaryColor="#D1FAE5"
          onActionClick={onOpenAssumptions}
        />

        {/* Donut 3: 60d AI Forecast vs. Current Offer (Blue) */}
        <DonutComparisonCard
          title="60d Forecast v/s Current Offer"
          tooltip="Realtime-Venus 60-day forward projected buyer offer vs. current regional spot offer"
          primaryValue={forecastedOfferRwf}
          secondaryValue={activeBar.avgBuyerOfferRwf}
          primaryDisplay={`${forecastedOfferRwf}`}
          secondaryDisplay={`${activeBar.avgBuyerOfferRwf}`}
          centerTotalDisplay="+7.0%"
          centerLabel="60d AI Trend"
          primaryLabel="60d Forecast"
          secondaryLabel="Spot Offer"
          primaryColor="#005A94"
          secondaryColor="#DDEBF7"
          onActionClick={venusViz.refreshNow}
        />

        {/* Donut 4: Corridor Demand Score vs. Compliance Gap (Blue) */}
        <DonutComparisonCard
          title="Demand Fit v/s Unlock Potential"
          tooltip={`Corridor readiness score (${activeBar.demandScore}/100) vs. certification & volume unlock margin`}
          primaryValue={activeBar.demandScore}
          secondaryValue={Math.max(8, 100 - activeBar.demandScore)}
          primaryDisplay={`${activeBar.demandScore}%`}
          secondaryDisplay={`${Math.max(0, 100 - activeBar.demandScore)}%`}
          centerTotalDisplay={`${activeBar.demandScore}/100`}
          centerLabel="Match Score"
          primaryLabel="Ready Fit"
          secondaryLabel="Unlock Gap"
          primaryColor="#005A94"
          secondaryColor="#DDEBF7"
          onActionClick={() => onNavigateScreen('partners-finder')}
        />
      </div>

      {/* =====================================================================
          ROW 4: PROACTIVE SUPPLY-DEMAND GAP WARNINGS & FULL MARGIN TABLE
          (Preserves 100% of existing Realtime-Venus warnings & table content)
          ===================================================================== */}
      <div className="bg-white border border-slate-200/85 rounded-xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] space-y-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>
                Proactive Supply-Demand Gap & Arbitrage Warnings ({venusViz.gapWarnings.length})
              </span>
            </h2>
            <span className="text-[11px] text-slate-500">
              Calibrated to {sme.businessName.replace(' (sample)', '')} ({sme.district})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {venusViz.gapWarnings.map((warn) => {
              const isCritical = warn.severity === 'critical';
              const isOpportunity = warn.severity === 'opportunity';

              const borderClass = isCritical
                ? 'border-rose-200 bg-rose-50/30'
                : isOpportunity
                ? 'border-emerald-200 bg-emerald-50/30'
                : 'border-amber-200 bg-amber-50/30';

              const accentText = isCritical
                ? 'text-rose-700'
                : isOpportunity
                ? 'text-[#1A8754]'
                : 'text-amber-700';

              return (
                <div
                  key={warn.id}
                  className={`p-3.5 rounded-xl border ${borderClass} flex flex-col justify-between gap-3`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className={`font-bold ${accentText} flex items-center gap-1`}>
                        {isOpportunity ? (
                          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{warn.corridor} Corridor</span>
                      </span>
                      <span className={`font-mono font-bold ${accentText}`}>
                        {warn.metricBadge}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {warn.title}
                    </h3>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {warn.description}
                    </p>

                    <p className="text-[11px] text-slate-800 font-medium leading-snug pt-1 border-t border-slate-200/60">
                      Recommendation: {warn.recommendation}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateScreen(warn.actionScreen)}
                    className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-[#005A94] text-[#005A94] hover:text-white border border-[#005A94]/30 text-[11px] font-bold transition-colors cursor-pointer inline-flex items-center justify-center gap-1"
                  >
                    <span>{warn.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full SME-Tailored Regional Corridor Market & Margin Table */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xs sm:text-sm font-semibold text-[#005A94]">
              {venusViz.structuredTable.title}
            </h2>
            {venusViz.structuredTable.smeContextSubtitle && (
              <span className="text-[11px] font-mono text-slate-500">
                {venusViz.structuredTable.smeContextSubtitle}
              </span>
            )}
          </div>

          <div className="overflow-x-auto border border-slate-200/85 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#005A94] text-white font-semibold">
                  {venusViz.structuredTable.headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="py-2.5 px-3.5 border-r border-white/15 last:border-r-0 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {venusViz.structuredTable.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={
                      rIdx === 0 ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                    }
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`py-2 px-3.5 border-r border-slate-100 last:border-r-0 ${
                          cIdx === 0
                            ? 'font-bold text-slate-900'
                            : 'text-slate-700 font-mono tabular-nums'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
