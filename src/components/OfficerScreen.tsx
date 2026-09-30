/**
 * Screen 6: MINICOM Officer View
 * Government officer administrative and policy oversight view:
 * - Queue of introduction requests (Approve to facilitate, Ask for more information).
 * - Products with SME supply but few partners (Market Gap Analysis).
 * - Requests per product breakdown.
 * - Editable scoring weights configuration.
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Sliders,
  TrendingDown,
  FileCheck,
  Send,
  Building,
  RotateCcw,
  BarChart2
} from 'lucide-react';
import {
  IntroductionRequest,
  ScoringWeights,
  RwandanSME,
  KenyanPartner
} from '../types';
import { HS_PRODUCTS, INITIAL_WEIGHTS } from '../data/seedData';

interface OfficerScreenProps {
  requests: IntroductionRequest[];
  allSmes: RwandanSME[];
  allPartners: KenyanPartner[];
  weights: ScoringWeights;
  onUpdateWeights: (newWeights: ScoringWeights) => void;
  onApproveRequest: (requestId: string, notes: string) => void;
  onRequestMoreInfo: (requestId: string, notes: string) => void;
}

export const OfficerScreen: React.FC<OfficerScreenProps> = ({
  requests,
  allSmes,
  allPartners,
  weights,
  onUpdateWeights,
  onApproveRequest,
  onRequestMoreInfo
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'gaps' | 'weights'>('queue');
  const [selectedReqForAction, setSelectedReqForAction] = useState<IntroductionRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'more-info' | null>(null);
  const [officerNote, setOfficerNote] = useState<string>('');

  // Editable weights local state
  const [tempWeights, setTempWeights] = useState<ScoringWeights>(weights);
  const [weightsSaved, setWeightsSaved] = useState<boolean>(false);

  // Calculate Market Gaps: SME Supply vs Available Verified Kenyan Partners
  const productMarketGaps = HS_PRODUCTS.map((prod) => {
    // Total SME supply in kg for this product
    const smesSupplying = allSmes.filter((s) => s.products.includes(prod.hsCode));
    const totalMonthlyCapacityKg = smesSupplying.reduce(
      (sum, s) => sum + s.monthlyCapacityKg,
      0
    );

    // Number of Kenyan partners handling this product
    const partnersHandling = allPartners.filter((p) =>
      p.handledProducts.some((hp) => hp.hsCode === prod.hsCode)
    );

    // Requests count
    const requestCount = requests.filter((r) => r.productHs === prod.hsCode).length;

    const partnerCount = partnersHandling.length;
    const isUnderserved = partnerCount <= 2 && totalMonthlyCapacityKg > 15000;

    return {
      product: prod,
      smeCount: smesSupplying.length,
      totalSupplyTonnes: totalMonthlyCapacityKg / 1000,
      partnerCount,
      requestCount,
      isUnderserved,
      ratio: partnerCount > 0 ? (totalMonthlyCapacityKg / 1000 / partnerCount).toFixed(1) : 'Deficit'
    };
  });

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForAction || !actionType) return;

    if (actionType === 'approve') {
      onApproveRequest(selectedReqForAction.id, officerNote || 'Facilitation approved by MINICOM Bilateral Trade Desk.');
    } else {
      onRequestMoreInfo(selectedReqForAction.id, officerNote || 'Please provide updated phytosanitary inspection or batch test certificate.');
    }

    setSelectedReqForAction(null);
    setActionType(null);
    setOfficerNote('');
  };

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWeights(tempWeights);
    setWeightsSaved(true);
    setTimeout(() => setWeightsSaved(false), 2500);
  };

  const handleResetWeights = () => {
    setTempWeights(INITIAL_WEIGHTS);
    onUpdateWeights(INITIAL_WEIGHTS);
  };

  const pendingRequests = requests.filter((r) => r.status === 'Pending review');

  return (
    <div className="space-y-6">
      {/* Officer Header */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-sub)] mb-1">
              <span>MINICOM Internal Directorate</span>
              <span>/</span>
              <span>Regional Trade Facilitation</span>
              <span>/</span>
              <span className="text-[var(--text-display)] font-semibold">Officer Control Desk</span>
            </div>
            <h1 className="text-xl font-bold text-[var(--text-display)] tracking-tight">
              MINICOM Bilateral Trade Officer Dashboard
            </h1>
            <p className="text-xs text-[var(--text-body)] mt-1">
              Supervise SME introduction queues, resolve corridor supply bottlenecks, and configure algorithmic matching weights.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[var(--gray-100)] p-1 rounded-[4px] border border-[var(--gray-300)] text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors cursor-pointer ${
                activeTab === 'queue'
                  ? 'bg-white text-[var(--brand)] shadow-xs'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-display)]'
              }`}
            >
              Introduction Queue ({requests.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gaps')}
              className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors cursor-pointer ${
                activeTab === 'gaps'
                  ? 'bg-white text-[var(--brand)] shadow-xs'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-display)]'
              }`}
            >
              Market Supply & Gaps
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('weights')}
              className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors cursor-pointer ${
                activeTab === 'weights'
                  ? 'bg-white text-[var(--brand)] shadow-xs'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-display)]'
              }`}
            >
              Algorithm Scoring Weights
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Introduction Requests Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--gray-300)] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[var(--text-display)]">
                  Facilitated Introduction Queue ({pendingRequests.length} Pending Actions)
                </h2>
                <p className="text-xs text-[var(--text-sub)]">
                  Review Rwandan SME requests for formal MINICOM institutional introductions to vetted Kenyan entities.
                </p>
              </div>

              <div className="text-xs font-semibold text-[var(--brand)] bg-[var(--brand-light)] px-2.5 py-1 border border-[var(--brand)] rounded-[4px]">
                Northern Corridor Protocol
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[var(--gray-300)]">
                <thead className="bg-[var(--gray-100)] border-b border-[var(--gray-300)] font-semibold text-[var(--text-display)]">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Request Ref & Date</th>
                    <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Rwandan SME</th>
                    <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Target Kenyan Partner</th>
                    <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Commodity (HS)</th>
                    <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Current Status</th>
                    <th className="py-2.5 px-3">Officer Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--gray-300)] text-[var(--text-body)]">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-[var(--gray-100)]/50">
                      <td className="py-3 px-3 font-mono border-r border-[var(--gray-300)] whitespace-nowrap">
                        <div className="font-bold text-[var(--text-display)]">{req.id}</div>
                        <div className="text-[11px] text-[var(--text-sub)]">{req.requestedDate}</div>
                      </td>

                      <td className="py-3 px-3 border-r border-[var(--gray-300)]">
                        <div className="font-bold text-[var(--text-display)]">{req.smeName}</div>
                      </td>

                      <td className="py-3 px-3 border-r border-[var(--gray-300)]">
                        <div className="font-semibold text-[var(--text-display)]">{req.partnerName}</div>
                      </td>

                      <td className="py-3 px-3 border-r border-[var(--gray-300)] whitespace-nowrap">
                        <span className="font-semibold text-[var(--brand-dark)]">
                          {req.productName}
                        </span>
                      </td>

                      <td className="py-3 px-3 border-r border-[var(--gray-300)] whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-[4px] border ${
                            req.status === 'Facilitation approved'
                              ? 'bg-[var(--brand-light)] text-[var(--success)] border-[var(--success)]'
                              : req.status === 'More information requested'
                              ? 'bg-white text-[var(--warning)] border-[var(--warning)]'
                              : req.status === 'Pending review'
                              ? 'bg-[var(--gray-100)] text-[var(--brand)] border-[var(--brand)]'
                              : 'bg-white text-[var(--error)] border-[var(--error)]'
                          }`}
                        >
                          {req.status === 'Facilitation approved' && <CheckCircle2 className="w-3 h-3" />}
                          {req.status === 'More information requested' && <HelpCircle className="w-3 h-3" />}
                          {req.status}
                        </span>

                        {req.facilitationLetterRef && (
                          <div className="text-[10px] font-mono text-[var(--text-sub)] mt-1">
                            Ref: {req.facilitationLetterRef}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {req.status === 'Pending review' ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedReqForAction(req);
                                setActionType('approve');
                              }}
                              className="px-2.5 py-1 bg-[var(--brand)] text-white font-semibold rounded-[4px] hover:bg-[var(--brand-dark)] cursor-pointer text-[11px]"
                            >
                              Approve to facilitate
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedReqForAction(req);
                                setActionType('more-info');
                              }}
                              className="px-2.5 py-1 bg-white border border-[var(--gray-300)] text-[var(--text-body)] hover:bg-[var(--gray-100)] font-semibold rounded-[4px] cursor-pointer text-[11px]"
                            >
                              Ask for more info
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11px] text-[var(--text-sub)] italic max-w-xs">
                            {req.officerNotes || 'Processed by trade officer.'}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Market Supply & Gap Analysis */}
      {activeTab === 'gaps' && (
        <div className="space-y-6">
          {/* Market Gaps Table */}
          <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5 space-y-4">
            <div className="border-b border-[var(--gray-300)] pb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[var(--warning)]" />
                <h2 className="text-sm font-bold text-[var(--text-display)]">
                  Products with High SME Supply but Constrained Regional Buyer Base
                </h2>
              </div>
              <p className="text-xs text-[var(--text-sub)] mt-0.5">
                Identifies product categories with significant Rwandan SME export capacity requiring targeted commercial attaché intervention in Nairobi, Mombasa, and Kisumu.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[var(--gray-300)]">
                <thead className="bg-[var(--gray-100)] border-b border-[var(--gray-300)] font-semibold text-[var(--text-display)]">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Product & HS Code</th>
                    <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Rwandan SME Supply (MT/Mo)</th>
                    <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Verified Kenyan Partners</th>
                    <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Active Introductions</th>
                    <th className="py-2.5 px-3 border-r border-[var(--gray-300)]">Corridor Balance Ratio</th>
                    <th className="py-2.5 px-3">Policy Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--gray-300)] text-[var(--text-body)]">
                  {productMarketGaps.map((item) => (
                    <tr key={item.product.hsCode} className={item.isUnderserved ? 'bg-[var(--brand-light)]/30' : ''}>
                      <td className="py-3 px-3 font-semibold text-[var(--text-display)] border-r border-[var(--gray-300)]">
                        {item.product.name} (HS {item.product.hsCode})
                      </td>

                      <td className="py-3 px-3 font-bold text-[var(--brand)] border-r border-[var(--gray-300)]">
                        {item.totalSupplyTonnes.toFixed(1)} MT / month
                        <span className="text-[10px] text-[var(--text-sub)] block font-normal">
                          across {item.smeCount} SMEs
                        </span>
                      </td>

                      <td className="py-3 px-3 border-r border-[var(--gray-300)]">
                        <span className="font-bold text-[var(--text-display)]">
                          {item.partnerCount} verified buyers
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono border-r border-[var(--gray-300)]">
                        {item.requestCount} requests
                      </td>

                      <td className="py-3 px-3 border-r border-[var(--gray-300)]">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold border ${
                            item.isUnderserved
                              ? 'bg-[var(--brand-light)] text-[var(--warning)] border-[var(--warning)]'
                              : 'bg-[var(--gray-100)] text-[var(--success)] border-[var(--gray-300)]'
                          }`}
                        >
                          {item.isUnderserved ? 'Buyer Shortage' : 'Adequate Coverage'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-[11px] leading-relaxed">
                        {item.isUnderserved ? (
                          <strong className="text-[var(--warning)]">
                            Priority: Onboard additional cold-chain distributors in Nairobi & Mombasa.
                          </strong>
                        ) : (
                          <span className="text-[var(--text-sub)]">
                            Sufficient pipeline liquidity along Northern Corridor.
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Requests Per Product Chart */}
          <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--gray-300)] pb-2">
              <BarChart2 className="w-4 h-4 text-[var(--brand)]" />
              <h2 className="text-sm font-bold text-[var(--text-display)]">
                Bilateral Introduction Requests per Commodity Line
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              {productMarketGaps.map((item) => (
                <div key={item.product.hsCode} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--text-display)]">
                      {item.product.name} (HS {item.product.hsCode})
                    </span>
                    <span className="font-bold text-[var(--brand)]">
                      {item.requestCount} request{item.requestCount !== 1 ? 's' : ''} ({item.totalSupplyTonnes.toFixed(1)} MT supply)
                    </span>
                  </div>

                  <div className="w-full bg-[var(--gray-100)] border border-[var(--gray-300)] h-3 rounded-[4px] overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand)] transition-all"
                      style={{
                        width: `${Math.max(10, (item.requestCount / Math.max(1, requests.length)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Editable Scoring Weights Config */}
      {activeTab === 'weights' && (
        <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--gray-300)] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[var(--brand)]" />
                <h2 className="text-sm font-bold text-[var(--text-display)]">
                  Algorithmic Scoring Signal Weights
                </h2>
              </div>
              <p className="text-xs text-[var(--text-sub)] mt-0.5">
                Adjust decision weights for the matching engine. Scores across all 12 Kenyan partners will recalculate deterministically based on these weights.
              </p>
            </div>

            {weightsSaved && (
              <div className="px-3 py-1 bg-[var(--brand-light)] border border-[var(--brand)] text-[var(--brand)] font-bold text-xs rounded-[4px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Scoring weights updated and applied across platform!</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveWeights} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Product Fit */}
              <div className="p-3.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--text-display)]">Product Fit Weight</label>
                  <span className="font-mono font-bold text-[var(--brand)] text-sm">
                    {(tempWeights.productFit * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={tempWeights.productFit}
                  onChange={(e) => setTempWeights({ ...tempWeights, productFit: parseFloat(e.target.value) })}
                  className="w-full accent-[var(--brand)] cursor-pointer"
                />
                <p className="text-[11px] text-[var(--text-sub)]">
                  Evaluates exact match against 4-digit HS headings and partner role preference.
                </p>
              </div>

              {/* Trade Evidence */}
              <div className="p-3.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--text-display)]">Trade Evidence Weight</label>
                  <span className="font-mono font-bold text-[var(--brand)] text-sm">
                    {(tempWeights.tradeEvidence * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={tempWeights.tradeEvidence}
                  onChange={(e) => setTempWeights({ ...tempWeights, tradeEvidence: parseFloat(e.target.value) })}
                  className="w-full accent-[var(--brand)] cursor-pointer"
                />
                <p className="text-[11px] text-[var(--text-sub)]">
                  Values empirical customs manifest filings and Gatuna/Malaba OSBP cargo transits.
                </p>
              </div>

              {/* Certification Fit */}
              <div className="p-3.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--text-display)]">Certification Fit Weight</label>
                  <span className="font-mono font-bold text-[var(--brand)] text-sm">
                    {(tempWeights.certificationFit * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={tempWeights.certificationFit}
                  onChange={(e) => setTempWeights({ ...tempWeights, certificationFit: parseFloat(e.target.value) })}
                  className="w-full accent-[var(--brand)] cursor-pointer"
                />
                <p className="text-[11px] text-[var(--text-sub)]">
                  RSB S-Mark, HACCP, GlobalG.A.P., and Organic mutual recognition acceptance.
                </p>
              </div>

              {/* Capacity Compatibility */}
              <div className="p-3.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--text-display)]">Capacity Compatibility Weight</label>
                  <span className="font-mono font-bold text-[var(--brand)] text-sm">
                    {(tempWeights.capacityFit * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={tempWeights.capacityFit}
                  onChange={(e) => setTempWeights({ ...tempWeights, capacityFit: parseFloat(e.target.value) })}
                  className="w-full accent-[var(--brand)] cursor-pointer"
                />
                <p className="text-[11px] text-[var(--text-sub)]">
                  Ensures SME monthly supply matches partner minimum procurement volume threshold.
                </p>
              </div>

              {/* Landed Price Fit */}
              <div className="p-3.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--text-display)]">Landed Price Fit Weight</label>
                  <span className="font-mono font-bold text-[var(--brand)] text-sm">
                    {(tempWeights.landedPriceFit * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={tempWeights.landedPriceFit}
                  onChange={(e) => setTempWeights({ ...tempWeights, landedPriceFit: parseFloat(e.target.value) })}
                  className="w-full accent-[var(--brand)] cursor-pointer"
                />
                <p className="text-[11px] text-[var(--text-sub)]">
                  Competitiveness of ex-works price plus corridor road transport converted to KES.
                </p>
              </div>

              {/* Data Freshness */}
              <div className="p-3.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--text-display)]">Data Freshness Weight</label>
                  <span className="font-mono font-bold text-[var(--brand)] text-sm">
                    {(tempWeights.dataFreshness * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.30"
                  step="0.01"
                  value={tempWeights.dataFreshness}
                  onChange={(e) => setTempWeights({ ...tempWeights, dataFreshness: parseFloat(e.target.value) })}
                  className="w-full accent-[var(--brand)] cursor-pointer"
                />
                <p className="text-[11px] text-[var(--text-sub)]">
                  Recency of partner verification or recorded border crossing activity in 2026.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--gray-300)] flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetWeights}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--text-sub)] hover:text-[var(--text-display)] border border-[var(--gray-300)] rounded-[4px] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Standard Weights
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-[4px] hover:bg-[var(--brand-dark)] cursor-pointer"
              >
                Save & Recalculate Corridor Shortlists
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Action Modal for Introduction Processing */}
      {selectedReqForAction && actionType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white rounded-[4px] border border-[var(--gray-300)] shadow-lg overflow-hidden text-xs">
            <div className="px-5 py-3.5 bg-[var(--gray-100)] border-b border-[var(--gray-300)] flex items-center justify-between">
              <h3 className="font-bold text-[var(--text-display)] text-sm">
                {actionType === 'approve'
                  ? 'Approve Facilitated Introduction'
                  : 'Request Additional Information from SME'}
              </h3>
              <button
                onClick={() => {
                  setSelectedReqForAction(null);
                  setActionType(null);
                }}
                className="text-[var(--text-sub)] hover:text-[var(--text-display)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="p-5 space-y-4">
              <div className="p-3 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] space-y-1">
                <div className="font-bold text-[var(--brand)]">
                  Request Ref: {selectedReqForAction.id}
                </div>
                <div className="text-[11px] text-[var(--text-body)]">
                  Rwandan SME: <strong>{selectedReqForAction.smeName}</strong>
                </div>
                <div className="text-[11px] text-[var(--text-body)]">
                  Target Partner: <strong>{selectedReqForAction.partnerName}</strong>
                </div>
                <div className="text-[11px] text-[var(--text-body)]">
                  Commodity: <strong>{selectedReqForAction.productName}</strong>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  {actionType === 'approve'
                    ? 'Facilitation Letter Directives & Officer Endorsement'
                    : 'Information Required from SME (e.g. RSB batch analysis, phyto permit)'}
                </label>
                <textarea
                  rows={3}
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  placeholder={
                    actionType === 'approve'
                      ? 'Confirm verified RSB S-Mark, TIN clearance, and corridor customs assistance protocol...'
                      : 'Specify the missing compliance document or capacity verification required...'
                  }
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] focus:border-[var(--brand)] text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReqForAction(null);
                    setActionType(null);
                  }}
                  className="px-3 py-1.5 border border-[var(--gray-300)] rounded-[4px] hover:bg-[var(--gray-100)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 text-white font-bold rounded-[4px] cursor-pointer ${
                    actionType === 'approve'
                      ? 'bg-[var(--brand)] hover:bg-[var(--brand-dark)]'
                      : 'bg-[var(--warning)] hover:opacity-90'
                  }`}
                >
                  {actionType === 'approve' ? 'Issue Facilitation Approval' : 'Send Information Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
