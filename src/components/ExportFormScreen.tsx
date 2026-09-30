/**
 * Screen 2: Export Opportunity Form
 * Enables SME to specify product (with HS heading), monthly capacity (kg), ex-works price (RWF/kg),
 * target country (Kenya active, others disabled 'later phases'), partner role preference, and certifications.
 */

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle,
  Clock,
  Layers
} from 'lucide-react';
import {
  ExportOpportunity,
  RwandanSME,
  PartnerRole,
  Certification,
  CorridorAssumptions
} from '../types';
import { HS_PRODUCTS } from '../data/seedData';

interface ExportFormScreenProps {
  currentOpportunity: ExportOpportunity;
  sme: RwandanSME;
  assumptions: CorridorAssumptions;
  onSaveOpportunity: (opp: ExportOpportunity) => void;
  onViewShortlist: () => void;
  onOpenAssumptions: () => void;
}

export const ExportFormScreen: React.FC<ExportFormScreenProps> = ({
  currentOpportunity,
  sme,
  assumptions,
  onSaveOpportunity,
  onViewShortlist,
  onOpenAssumptions
}) => {
  const [formData, setFormData] = useState<ExportOpportunity>(currentOpportunity);

  const selectedProduct =
    HS_PRODUCTS.find((p) => p.hsCode === formData.productHs) || HS_PRODUCTS[0];

  const partnerRoles: (PartnerRole | 'All')[] = [
    'All',
    'Buyer',
    'Distributor',
    'Wholesaler',
    'Retailer'
  ];

  const certificationsList: Certification[] = [
    'RSB S-Mark',
    'HACCP',
    'GlobalG.A.P.',
    'Organic'
  ];

  // Dynamic calculations based on corridor assumptions
  const transitCostRwf = assumptions.corridorTransitCostRwfPerKg;
  const landedRwfPerKg = formData.exWorksPriceRwf + transitCostRwf;
  const landedKesPerKg = (landedRwfPerKg / assumptions.exchangeRateKesToRwf).toFixed(1);

  const handleToggleCert = (cert: Certification) => {
    const exists = formData.requiredCertifications.includes(cert);
    const updated = exists
      ? formData.requiredCertifications.filter((c) => c !== cert)
      : [...formData.requiredCertifications, cert];
    setFormData({ ...formData, requiredCertifications: updated });
  };

  const handleProductChange = (hsCode: string) => {
    const prod = HS_PRODUCTS.find((p) => p.hsCode === hsCode);
    setFormData({
      ...formData,
      productHs: hsCode,
      exWorksPriceRwf: prod ? prod.defaultPriceRwfPerKg : formData.exWorksPriceRwf,
      capacityKgMonth: prod ? prod.typicalMonthlyKg : formData.capacityKgMonth
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveOpportunity(formData);
    onViewShortlist();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5">
        <div className="flex items-center gap-2 text-xs text-[var(--text-sub)] mb-1">
          <span>MINICOM Trade Square</span>
          <span>/</span>
          <span>Corridor Matching Engine</span>
          <span>/</span>
          <span className="text-[var(--text-display)] font-semibold">Export Opportunity Form</span>
        </div>
        <h1 className="text-xl font-bold text-[var(--text-display)] tracking-tight">
          Define Export Consignment Parameters
        </h1>
        <p className="text-xs text-[var(--text-body)] mt-1">
          Configure product parameters for Kigali–Nairobi Northern Corridor matching. Scores are computed deterministically against verified Kenyan enterprise demands.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container */}
        <div className="lg:col-span-2 bg-white border border-[var(--gray-300)] rounded-[4px] p-5">
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Target Destination & Corridor Scope */}
            <div>
              <label className="block font-semibold text-[var(--text-display)] mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--brand)]" />
                <span>Target Country & Regional Trade Corridor</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Kenya: Active */}
                <div className="p-3 border-2 border-[var(--brand)] bg-[var(--brand-light)] rounded-[4px] relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--brand)]">Kenya</span>
                    <span className="text-[10px] font-bold uppercase text-white bg-[var(--brand)] px-1.5 py-0.5 rounded-[4px]">
                      Active Pilot
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--text-sub)] mt-1.5 leading-tight">
                    Northern Corridor via Gatuna & Malaba OSBPs
                  </div>
                </div>

                {/* Uganda: Disabled */}
                <div className="p-3 border border-[var(--gray-300)] bg-[var(--gray-100)] rounded-[4px] opacity-60">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--text-sub)]">Uganda</span>
                    <span className="text-[9px] uppercase font-bold text-[var(--text-sub)] bg-white px-1 py-0.5 border border-[var(--gray-300)] rounded-[4px]">
                      Later phases
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--text-sub)] mt-1.5">
                    Kampala corridor (planned Phase 2)
                  </div>
                </div>

                {/* Tanzania: Disabled */}
                <div className="p-3 border border-[var(--gray-300)] bg-[var(--gray-100)] rounded-[4px] opacity-60">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--text-sub)]">Tanzania</span>
                    <span className="text-[9px] uppercase font-bold text-[var(--text-sub)] bg-white px-1 py-0.5 border border-[var(--gray-300)] rounded-[4px]">
                      Later phases
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--text-sub)] mt-1.5">
                    Central Corridor via Rusumo (Phase 3)
                  </div>
                </div>

                {/* DRC: Disabled */}
                <div className="p-3 border border-[var(--gray-300)] bg-[var(--gray-100)] rounded-[4px] opacity-60">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--text-sub)]">DR Congo</span>
                    <span className="text-[9px] uppercase font-bold text-[var(--text-sub)] bg-white px-1 py-0.5 border border-[var(--gray-300)] rounded-[4px]">
                      Later phases
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--text-sub)] mt-1.5">
                    Goma / Bukavu borders (Phase 2)
                  </div>
                </div>
              </div>
            </div>

            {/* Product with HS Heading */}
            <div>
              <label htmlFor="select-product-hs" className="block font-semibold text-[var(--text-display)] mb-1">
                Commodity to Export (with Harmonized System HS Heading)
              </label>
              <select
                id="select-product-hs"
                value={formData.productHs}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-semibold text-[var(--text-display)] bg-white focus:border-[var(--brand)]"
              >
                {HS_PRODUCTS.map((prod) => (
                  <option key={prod.hsCode} value={prod.hsCode}>
                    HS {prod.hsCode} — {prod.name} ({prod.category})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[var(--text-sub)] mt-1">
                Harmonized System 4-digit heading governs tariff lines, phytosanitary rules, and EAC Simplified Trade Regime applicability.
              </p>
            </div>

            {/* Monthly Capacity & Ex-Works Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Available Monthly Export Capacity
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="500"
                    min="100"
                    value={formData.capacityKgMonth}
                    onChange={(e) => setFormData({ ...formData, capacityKgMonth: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-semibold focus:border-[var(--brand)]"
                    required
                  />
                  <span className="font-bold text-[var(--text-body)]">kg / month</span>
                </div>
                <div className="text-[11px] text-[var(--text-sub)] mt-1">
                  Equivalent to {(formData.capacityKgMonth / 1000).toFixed(1)} MT (Metric Tonnes) per month.
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Ex-Works Farmgate/Factory Price (Rwanda)
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text-body)]">RWF</span>
                  <input
                    type="number"
                    step="10"
                    min="10"
                    value={formData.exWorksPriceRwf}
                    onChange={(e) => setFormData({ ...formData, exWorksPriceRwf: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-semibold focus:border-[var(--brand)]"
                    required
                  />
                  <span className="font-bold text-[var(--text-body)]">/ kg</span>
                </div>
                <div className="text-[11px] text-[var(--text-sub)] mt-1">
                  Price before freight and border fees.
                </div>
              </div>
            </div>

            {/* Preferred Partner Role */}
            <div>
              <label className="block font-semibold text-[var(--text-display)] mb-2">
                Preferred Partner Operational Role in Kenya
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {partnerRoles.map((role) => {
                  const isSelected = formData.partnerType === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, partnerType: role })}
                      className={`py-2 px-3 border rounded-[4px] text-center font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)] font-bold'
                          : 'border-[var(--gray-300)] bg-white text-[var(--text-body)] hover:bg-[var(--gray-100)]'
                      }`}
                    >
                      {role === 'All' ? 'All Roles' : role}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Required Certifications */}
            <div>
              <label className="block font-semibold text-[var(--text-display)] mb-2">
                Required Quality & Process Certifications for this Consignment
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {certificationsList.map((cert) => {
                  const isSelected = formData.requiredCertifications.includes(cert);
                  const smeHasCert = sme.certifications.includes(cert);
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => handleToggleCert(cert)}
                      className={`p-2.5 border rounded-[4px] text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[var(--brand)] bg-[var(--brand-light)]'
                          : 'border-[var(--gray-300)] bg-white hover:bg-[var(--gray-100)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[var(--text-display)]">{cert}</span>
                        {smeHasCert && (
                          <span className="text-[9px] uppercase font-bold text-[var(--success)] bg-white px-1 py-0.5 border border-[var(--gray-300)] rounded-[4px]">
                            SME Verified
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[var(--text-sub)]">
                        {cert === 'RSB S-Mark'
                          ? 'Standardization mark'
                          : cert === 'HACCP'
                          ? 'Hazard Analysis'
                          : cert === 'GlobalG.A.P.'
                          ? 'Agricultural practice'
                          : 'Certified Organic'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit & Calculate */}
            <div className="pt-4 border-t border-[var(--gray-300)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--text-sub)]">
                Scoring algorithm will evaluate 12 Kenyan partners using live corridor formulas.
              </span>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--brand)] text-white font-bold rounded-[4px] hover:bg-[var(--brand-dark)] cursor-pointer text-xs"
              >
                <span>Calculate Match Shortlist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Corridor Economics & Landed Cost Simulation */}
        <div className="space-y-4 text-xs">
          <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--gray-300)] pb-2">
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-display)]">
                <TrendingUp className="w-4 h-4 text-[var(--brand)]" />
                <span>Corridor Landed Price Preview</span>
              </div>
              <button
                type="button"
                onClick={onOpenAssumptions}
                className="text-[11px] text-[var(--brand)] hover:underline font-semibold cursor-pointer"
              >
                Edit Assumptions
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between py-1 border-b border-[var(--gray-100)]">
                <span className="text-[var(--text-sub)]">Ex-Works (Rwanda Farmgate):</span>
                <span className="font-semibold text-[var(--text-display)]">
                  RWF {formData.exWorksPriceRwf} / kg
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[var(--gray-100)]">
                <span className="text-[var(--text-sub)]">Gatuna–Malaba Transit Freight:</span>
                <span className="font-semibold text-[var(--text-display)]">
                  + RWF {transitCostRwf} / kg
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[var(--gray-100)]">
                <span className="text-[var(--text-sub)]">EAC Common Tariff (CET):</span>
                <span className="font-bold text-[var(--success)]">
                  0.0% (Duty Free)
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[var(--gray-300)]">
                <span className="text-[var(--text-sub)]">Total Landed Cost (RWF):</span>
                <span className="font-bold text-[var(--text-display)]">
                  RWF {landedRwfPerKg} / kg
                </span>
              </div>

              <div className="p-3 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] mt-2">
                <div className="text-[11px] text-[var(--text-sub)]">
                  Estimated Nairobi Landed Price (KES)
                </div>
                <div className="text-xl font-extrabold text-[var(--brand)] mt-0.5">
                  KES {landedKesPerKg} / kg
                </div>
                <div className="text-[10px] text-[var(--text-sub)] mt-1">
                  At assumption rate: 1 KES = {assumptions.exchangeRateKesToRwf} RWF.
                </div>
              </div>
            </div>
          </div>

          {/* Procedure Notes */}
          <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-4 text-xs space-y-2.5">
            <h3 className="font-bold text-[var(--text-display)] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[var(--text-sub)]" />
              <span>Corridor Export Readiness Standards</span>
            </h3>

            <ul className="space-y-2 text-[11px] text-[var(--text-body)]">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>HS {selectedProduct.hsCode} ({selectedProduct.name}):</strong> Qualifies under AfCFTA / EAC Rules of Origin for preferential zero duty entry into Kenya.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>RSB S-Mark Mutual Recognition:</strong> Accepted by Kenya Bureau of Standards (KEBS) under the East African Standards Committee framework.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--text-sub)] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Customs Clearances:</strong> Processed through Rwanda Electronic Single Window (ReSW) with automated Gatuna and Malaba OSBP data exchange.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
