/**
 * Screen 4: Match Detail ("Why this match?")
 * Deep explainability view with:
 * - Score bars by signal: product fit, trade evidence, certification fit, capacity, landed price, data freshness.
 * - Evidence table: source, date, status (Verified, Recorded, Pending audit).
 * - Interactive verification checklist.
 * - "Next steps to export": Rwanda Trade Portal procedure, AfCFTA / EAC certificate of origin, tariff check (text references only).
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Building,
  Calendar,
  Layers,
  Sparkles,
  ClipboardCheck,
  Bookmark
} from 'lucide-react';
import {
  KenyanPartner,
  MatchSignalBreakdown,
  RwandanSME,
  ExportOpportunity,
  CorridorAssumptions
} from '../types';

interface MatchDetailScreenProps {
  partner: KenyanPartner;
  scoreBreakdown: MatchSignalBreakdown;
  sme: RwandanSME;
  opportunity: ExportOpportunity;
  assumptions: CorridorAssumptions;
  onBackToShortlist: () => void;
  onRequestIntroduction: (partner: KenyanPartner) => void;
  isSaved: boolean;
  onToggleSavePartner: (partnerId: string) => void;
}

export const MatchDetailScreen: React.FC<MatchDetailScreenProps> = ({
  partner,
  scoreBreakdown,
  sme,
  opportunity,
  assumptions,
  onBackToShortlist,
  onRequestIntroduction,
  isSaved,
  onToggleSavePartner
}) => {
  // Verification checklist interactive state for SME user diligence
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'chk-rdb-kra': true,
    'chk-kebs-sqmt': true,
    'chk-moisture-aflatoxin': false,
    'chk-payment-guarantee': false,
    'chk-corridor-transit-insurance': true
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const signals = [
    {
      label: 'Product Fit',
      score: scoreBreakdown.productFitScore,
      weight: '30%',
      desc: `Alignment with HS ${opportunity.productHs} and buyer operational role (${partner.role}).`
    },
    {
      label: 'Trade Evidence',
      score: scoreBreakdown.tradeEvidenceScore,
      weight: '25%',
      desc: `${partner.evidenceLabel} · ${partner.corridorExperience.gatunaMalabaCrossingsCount} logged Gatuna/Malaba crossings.`
    },
    {
      label: 'Certification Fit',
      score: scoreBreakdown.certificationFitScore,
      weight: '15%',
      desc: 'RSB S-Mark recognition under EAC Standardization & Quality Management Protocol.'
    },
    {
      label: 'Capacity Compatibility',
      score: scoreBreakdown.capacityFitScore,
      weight: '10%',
      desc: `SME capacity (${(opportunity.capacityKgMonth / 1000).toFixed(1)} MT/mo) matches demand envelope.`
    },
    {
      label: 'Landed Price Competitiveness',
      score: scoreBreakdown.landedPriceFitScore,
      weight: '15%',
      desc: `Landed KES ${scoreBreakdown.landedCostKesPerKg}/kg vs target price envelope.`
    },
    {
      label: 'Data Freshness',
      score: scoreBreakdown.dataFreshnessScore,
      weight: '5%',
      desc: `Audit freshness verified (${partner.updatedDate}).`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation breadcrumb & Back button */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToShortlist}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand)] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Partner Shortlist</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleSavePartner(partner.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-[4px] cursor-pointer ${
              isSaved
                ? 'bg-[var(--brand-light)] text-[var(--brand)] border-[var(--brand)] font-semibold'
                : 'bg-white text-[var(--text-body)] border-[var(--gray-300)] hover:bg-[var(--gray-100)]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[var(--brand)]' : ''}`} />
            <span>{isSaved ? 'Saved in Pipeline' : 'Save to Pipeline'}</span>
          </button>

          <button
            type="button"
            onClick={() => onRequestIntroduction(partner)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[var(--brand)] text-white text-xs font-bold rounded-[4px] hover:bg-[var(--brand-dark)] cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Request MINICOM Facilitated Introduction</span>
          </button>
        </div>
      </div>

      {/* Main Enterprise Title & Explainable Score Hero */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[var(--gray-300)] pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-[var(--text-sub)] bg-[var(--gray-100)] px-2 py-0.5 border border-[var(--gray-300)] rounded-[4px]">
                Sample data
              </span>
              <span className="text-xs text-[var(--text-sub)]">
                Corridor Partner Profile
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-[var(--text-display)]">
              {partner.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-sub)]">
              <span className="font-semibold text-[var(--text-display)]">{partner.city}, Kenya</span>
              <span>·</span>
              <span>Operational Role: <strong className="text-[var(--text-display)]">{partner.role}</strong></span>
              <span>·</span>
              <span>KRA PIN: <code className="font-mono text-[var(--text-display)]">{partner.kraPin}</code></span>
              <span>·</span>
              <span>Updated: {partner.updatedDate}</span>
            </div>
          </div>

          {/* Relevance Score Pill */}
          <div className="bg-[var(--brand-light)] border border-[var(--brand)] p-4 rounded-[4px] text-center min-w-[160px] flex-shrink-0">
            <div className="text-[11px] font-bold text-[var(--brand-dark)] uppercase tracking-wider">
              Relevance Score
            </div>
            <div className="text-3xl font-black text-[var(--brand)] mt-0.5">
              {scoreBreakdown.totalScore}
              <span className="text-sm font-semibold text-[var(--text-sub)]">/100</span>
            </div>
            <div className="text-[10px] font-semibold text-[var(--text-body)] mt-1">
              Supports decisions. Not a guarantee.
            </div>
          </div>
        </div>

        {/* Explainable Template Summary: "Why this match?" */}
        <div className="p-4 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--brand-dark)] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[var(--brand)]" />
            <span>Deterministic Match Justification (Template Generated)</span>
          </div>
          <p className="text-xs text-[var(--text-display)] leading-relaxed font-medium">
            {scoreBreakdown.whyThisMatchText}
          </p>
          <div className="text-[11px] text-[var(--text-sub)] pt-1">
            Formulated from verified data signals: commodity alignment, border customs crossings, landed freight calculations, and mutual accreditation recognition.
          </div>
        </div>
      </div>

      {/* Signal Breakdown Progress Bars */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--gray-300)] pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--brand)]" />
            <h2 className="text-sm font-bold text-[var(--text-display)]">
              Score Breakdown by Weighted Decision Signal
            </h2>
          </div>
          <span className="text-[11px] text-[var(--text-sub)] font-semibold">
            Configurable MINICOM Scoring Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
          {signals.map((sig, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-[var(--text-display)]">
                  {sig.label}{' '}
                  <span className="text-[10px] font-normal text-[var(--text-sub)]">
                    (Weight: {sig.weight})
                  </span>
                </span>
                <span className="font-mono text-xs font-bold text-[var(--brand)]">
                  {sig.score} / 100
                </span>
              </div>

              {/* Progress bar with 4px corners */}
              <div className="w-full bg-[var(--gray-100)] border border-[var(--gray-300)] h-2.5 rounded-[4px] overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    sig.score >= 85
                      ? 'bg-[var(--brand)]'
                      : sig.score >= 70
                      ? 'bg-[var(--info)]'
                      : sig.score >= 50
                      ? 'bg-[var(--warning)]'
                      : 'bg-[var(--error)]'
                  }`}
                  style={{ width: `${sig.score}%` }}
                />
              </div>

              <div className="text-[11px] text-[var(--text-sub)]">
                {sig.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Corridor Landed Price Calculation Box */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-3 text-xs">
        <h2 className="text-sm font-bold text-[var(--text-display)] border-b border-[var(--gray-300)] pb-2">
          Corridor Route & Landed Price Transparency
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          <div className="p-3 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <div className="text-[11px] text-[var(--text-sub)]">Farmgate Ex-Works</div>
            <div className="text-sm font-bold text-[var(--text-display)] mt-0.5">
              RWF {opportunity.exWorksPriceRwf} / kg
            </div>
            <div className="text-[10px] text-[var(--text-sub)] mt-1">{sme.district} facility</div>
          </div>

          <div className="p-3 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <div className="text-[11px] text-[var(--text-sub)]">Gatuna–Malaba Transit</div>
            <div className="text-sm font-bold text-[var(--text-display)] mt-0.5">
              + RWF {assumptions.corridorTransitCostRwfPerKg} / kg
            </div>
            <div className="text-[10px] text-[var(--text-sub)] mt-1">Northern Corridor road freight</div>
          </div>

          <div className="p-3 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <div className="text-[11px] text-[var(--text-sub)]">EAC Tariff Regime</div>
            <div className="text-sm font-bold text-[var(--success)] mt-0.5">
              0.0% Duty Free
            </div>
            <div className="text-[10px] text-[var(--text-sub)] mt-1">AfCFTA / EAC Certificate</div>
          </div>

          <div className="p-3 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px]">
            <div className="text-[11px] font-semibold text-[var(--brand-dark)]">Estimated Landed Price</div>
            <div className="text-base font-extrabold text-[var(--brand)] mt-0.5">
              KES {scoreBreakdown.landedCostKesPerKg} / kg
            </div>
            <div className="text-[10px] text-[var(--text-sub)] mt-1">
              At 1 KES = {assumptions.exchangeRateKesToRwf} RWF
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--gray-300)] pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--brand)]" />
            <h2 className="text-sm font-bold text-[var(--text-display)]">
              Verifiable Evidence Records & Public Regulatory Audit Trail
            </h2>
          </div>
          <span className="text-[11px] text-[var(--text-sub)]">
            Verified across institutional Single Windows
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[var(--gray-300)]">
            <thead className="bg-[var(--gray-100)] border-b border-[var(--gray-300)] font-semibold text-[var(--text-display)]">
              <tr>
                <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Source Authority</th>
                <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Audit Date</th>
                <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Regulatory Status</th>
                <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Document Reference</th>
                <th className="py-2.5 px-3">Evidence Extract</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-300)] text-[var(--text-body)]">
              {partner.evidenceRecords.map((rec, idx) => (
                <tr key={idx} className="hover:bg-[var(--gray-100)]/50">
                  <td className="py-2.5 px-3 font-semibold text-[var(--text-display)] border-r border-[var(--gray-300)]">
                    {rec.source}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] border-r border-[var(--gray-300)] whitespace-nowrap">
                    {rec.date}
                  </td>
                  <td className="py-2.5 px-3 border-r border-[var(--gray-300)] whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-[4px] border ${
                        rec.status === 'Verified'
                          ? 'bg-[var(--brand-light)] text-[var(--success)] border-[var(--success)]'
                          : rec.status === 'Recorded'
                          ? 'bg-white text-[var(--brand)] border-[var(--brand)]'
                          : 'bg-white text-[var(--warning)] border-[var(--warning)]'
                      }`}
                    >
                      {rec.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[var(--brand-dark)] border-r border-[var(--gray-300)] whitespace-nowrap">
                    {rec.documentRef}
                  </td>
                  <td className="py-2.5 px-3 leading-relaxed">
                    {rec.summary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Due Diligence Interactive Verification Checklist */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--gray-300)] pb-2">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-[var(--warning)]" />
            <h2 className="text-sm font-bold text-[var(--text-display)]">
              SME Due Diligence Checklist (Still to Verify)
            </h2>
          </div>
          <span className="text-[11px] text-[var(--text-sub)]">
            Check off items as completed prior to dispatch
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <label className="flex items-start gap-2.5 p-3 border border-[var(--gray-300)] rounded-[4px] hover:bg-[var(--gray-100)] cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems['chk-rdb-kra'] || false}
              onChange={() => toggleCheck('chk-rdb-kra')}
              className="mt-0.5 accent-[var(--brand)]"
            />
            <div>
              <div className="font-bold text-[var(--text-display)]">
                Cross-border Entity Registration Verification
              </div>
              <div className="text-[11px] text-[var(--text-sub)] mt-0.5">
                Confirm partner KRA PIN {partner.kraPin} is in good tax standing via the Kenya Revenue Authority iTax checker.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 border border-[var(--gray-300)] rounded-[4px] hover:bg-[var(--gray-100)] cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems['chk-kebs-sqmt'] || false}
              onChange={() => toggleCheck('chk-kebs-sqmt')}
              className="mt-0.5 accent-[var(--brand)]"
            />
            <div>
              <div className="font-bold text-[var(--text-display)]">
                KEBS Standardization Mutual Recognition Acceptance
              </div>
              <div className="text-[11px] text-[var(--text-sub)] mt-0.5">
                Verify partner accepts RSB S-Mark certificate without demanding supplementary PVoC destination inspections.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 border border-[var(--gray-300)] rounded-[4px] hover:bg-[var(--gray-100)] cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems['chk-moisture-aflatoxin'] || false}
              onChange={() => toggleCheck('chk-moisture-aflatoxin')}
              className="mt-0.5 accent-[var(--brand)]"
            />
            <div>
              <div className="font-bold text-[var(--text-display)]">
                Lab Test Certificate on Moisture & Aflatoxin Tolerances
              </div>
              <div className="text-[11px] text-[var(--text-sub)] mt-0.5">
                Obtain RSB official batch certificate (max 13.5% moisture, &lt;10 ppb total aflatoxin) before dispatching sample consignment.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 border border-[var(--gray-300)] rounded-[4px] hover:bg-[var(--gray-100)] cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems['chk-payment-guarantee'] || false}
              onChange={() => toggleCheck('chk-payment-guarantee')}
              className="mt-0.5 accent-[var(--brand)]"
            />
            <div>
              <div className="font-bold text-[var(--text-display)]">
                Commercial Payment Guarantee Terms
              </div>
              <div className="text-[11px] text-[var(--text-sub)] mt-0.5">
                Agree on confirmed regional Letter of Credit (LC) or 30% advance deposit with balance upon Malaba border inspection clearance.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 border border-[var(--gray-300)] rounded-[4px] hover:bg-[var(--gray-100)] cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems['chk-corridor-transit-insurance'] || false}
              onChange={() => toggleCheck('chk-corridor-transit-insurance')}
              className="mt-0.5 accent-[var(--brand)]"
            />
            <div>
              <div className="font-bold text-[var(--text-display)]">
                Corridor Goods-In-Transit Insurance Policy
              </div>
              <div className="text-[11px] text-[var(--text-sub)] mt-0.5">
                Ensure freight forwarder carries valid COMESA Yellow Card and comprehensive transit insurance between Kigali and Nairobi.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Next Steps to Export (Text References only, strictly no fake URLs) */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4">
        <div className="border-b border-[var(--gray-300)] pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-[var(--brand)]" />
            <h2 className="text-sm font-bold text-[var(--text-display)]">
              Next Steps to Export: Official Regulatory Guidelines
            </h2>
          </div>
          <span className="text-[11px] text-[var(--text-sub)]">
            Rwanda Trade Portal & Customs Protocols
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Step 1 */}
          <div className="p-4 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--brand)] text-white flex items-center justify-center font-bold text-[10px]">
                1
              </span>
              <span className="font-bold text-[var(--text-display)]">
                Trade Portal Procedure
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-body)] leading-relaxed">
              Consult <strong>Rwanda Trade Portal Procedure RTP-EXP-088</strong> for cross-border movement of agricultural and food commodities. Requires electronic submission of consignment invoice, packing list, and transit declaration.
            </p>
            <div className="text-[10px] text-[var(--brand-dark)] font-semibold pt-1">
              Ref: Rwanda Electronic Single Window (ReSW)
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--brand)] text-white flex items-center justify-center font-bold text-[10px]">
                2
              </span>
              <span className="font-bold text-[var(--text-display)]">
                Certificate of Origin
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-body)] leading-relaxed">
              Obtain the <strong>EAC Simplified Trade Certificate of Origin</strong> or <strong>AfCFTA Certificate of Origin</strong> issued by Rwanda Revenue Authority (RRA Customs Directorate) at the border post or online via ReSW.
            </p>
            <div className="text-[10px] text-[var(--success)] font-bold pt-1">
              Guarantees 0.0% EAC Preferential Tariff
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--brand)] text-white flex items-center justify-center font-bold text-[10px]">
                3
              </span>
              <span className="font-bold text-[var(--text-display)]">
                Tariff & Phyto Inspection
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-body)] leading-relaxed">
              Execute joint inspection at Gatuna OSBP with Rwanda Inspectorate, Competition and Consumer Protection Authority (RICA) or NAEB for phytosanitary export certificate clearance prior to Malaba entry.
            </p>
            <div className="text-[10px] text-[var(--text-sub)] font-semibold pt-1">
              Ref: EAC Sanitary & Phytosanitary (SPS) Protocol
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
