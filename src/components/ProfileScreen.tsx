/**
 * Screen 1: Sign in & SME Profile
 * Displays SME statutory credentials, district, contact, certifications, and product portfolio.
 * Allows quick switching between the 8 seeded pilot SMEs or updating details.
 */

import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Award,
  ArrowRight,
  Save,
  Users
} from 'lucide-react';
import { RwandanSME, Certification, District } from '../types';
import { HS_PRODUCTS } from '../data/seedData';

interface ProfileScreenProps {
  currentSme: RwandanSME;
  allSmes: RwandanSME[];
  onSelectSme: (sme: RwandanSME) => void;
  onUpdateSme: (updated: RwandanSME) => void;
  onProceedToExportForm: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentSme,
  allSmes,
  onSelectSme,
  onUpdateSme,
  onProceedToExportForm
}) => {
  const [formData, setFormData] = useState<RwandanSME>(currentSme);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  const districts: District[] = [
    'Musanze',
    'Rubavu',
    'Rwamagana',
    'Huye',
    'Nyagatare',
    'Kayonza',
    'Gicumbi',
    'Rusizi'
  ];

  const availableCertifications: Certification[] = [
    'RSB S-Mark',
    'HACCP',
    'GlobalG.A.P.',
    'Organic'
  ];

  const handleSmeSwitch = (smeId: string) => {
    const found = allSmes.find((s) => s.id === smeId);
    if (found) {
      setFormData(found);
      onSelectSme(found);
      setSaveAlert(`Switched active profile to ${found.businessName}`);
      setTimeout(() => setSaveAlert(null), 3000);
    }
  };

  const handleToggleCert = (cert: Certification) => {
    const exists = formData.certifications.includes(cert);
    const updated = exists
      ? formData.certifications.filter((c) => c !== cert)
      : [...formData.certifications, cert];
    setFormData({ ...formData, certifications: updated });
  };

  const handleToggleProduct = (hsCode: string) => {
    const exists = formData.products.includes(hsCode);
    const updated = exists
      ? formData.products.filter((p) => p !== hsCode)
      : [...formData.products, hsCode];
    setFormData({ ...formData, products: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSme(formData);
    setSaveAlert('SME profile details updated successfully.');
    setTimeout(() => setSaveAlert(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header breadcrumb & Pilot scope context */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-sub)] mb-1">
              <span>MINICOM Trade Square</span>
              <span>/</span>
              <span>SME Registry</span>
              <span>/</span>
              <span className="text-[var(--text-display)] font-semibold">Business Profile</span>
            </div>
            <h1 className="text-xl font-bold text-[var(--text-display)] tracking-tight">
              SME Profile & Northern Corridor Authorization
            </h1>
            <p className="text-xs text-[var(--text-body)] mt-1">
              Verify statutory registration with Rwanda Development Board (RDB), Rwanda Revenue Authority (TIN), and quality marks from Rwanda Standards Board (RSB).
            </p>
          </div>

          {/* Quick SME Profile Switcher */}
          <div className="bg-[var(--gray-100)] p-3 border border-[var(--gray-300)] rounded-[4px] min-w-[280px]">
            <label htmlFor="sme-switcher" className="block text-[11px] font-semibold text-[var(--text-sub)] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[var(--brand)]" />
              <span>Switch Pilot SME (8 Seeded)</span>
            </label>
            <select
              id="sme-switcher"
              value={formData.id}
              onChange={(e) => handleSmeSwitch(e.target.value)}
              className="w-full bg-white px-2.5 py-1.5 border border-[var(--gray-300)] rounded-[4px] text-xs font-semibold text-[var(--text-display)] focus:border-[var(--brand)]"
            >
              {allSmes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.businessName} ({s.district})
                </option>
              ))}
            </select>
          </div>
        </div>

        {saveAlert && (
          <div className="mt-4 p-3 bg-[var(--brand-light)] border border-[var(--brand)] text-[var(--brand)] text-xs rounded-[4px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">{saveAlert}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Edit */}
        <div className="lg:col-span-2 bg-white border border-[var(--gray-300)] rounded-[4px] p-5">
          <div className="border-b border-[var(--gray-300)] pb-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[var(--brand)]" />
              <h2 className="text-sm font-bold text-[var(--text-display)]">
                Enterprise Statutory Information
              </h2>
            </div>
            <span className="text-[11px] text-[var(--text-sub)] bg-[var(--gray-100)] px-2 py-0.5 rounded-[4px] border border-[var(--gray-300)]">
              Sample data tag: Verified for Pilot
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Business Name */}
            <div>
              <label className="block font-semibold text-[var(--text-display)] mb-1">
                Enterprise Legal Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-medium text-[var(--text-display)] focus:border-[var(--brand)]"
                required
              />
              <p className="text-[11px] text-[var(--text-sub)] mt-1">
                All pilot enterprise profiles must conclude with &quot;(sample)&quot; per pilot simulation rules.
              </p>
            </div>

            {/* RDB & TIN in two columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  RDB Registration Number (Rwanda Development Board)
                </label>
                <input
                  type="text"
                  value={formData.rdbNumber}
                  onChange={(e) => setFormData({ ...formData, rdbNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-mono font-medium focus:border-[var(--brand)]"
                  placeholder="e.g. 109238472"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Tax Identification Number - TIN (RRA)
                </label>
                <input
                  type="text"
                  value={formData.tin}
                  onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-mono font-medium focus:border-[var(--brand)]"
                  placeholder="e.g. 102938475"
                  required
                />
              </div>
            </div>

            {/* District & Contact Person */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Operating District (Rwanda)
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value as District })}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-medium focus:border-[var(--brand)] bg-white"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d} District
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Authorized Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-medium focus:border-[var(--brand)]"
                  required
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Official Phone (+250)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-mono focus:border-[var(--brand)]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Official Trade Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] focus:border-[var(--brand)]"
                  required
                />
              </div>
            </div>

            {/* Products handled with HS Code */}
            <div>
              <label className="block font-semibold text-[var(--text-display)] mb-2">
                Export Commodity Portfolio (with HS Headings)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HS_PRODUCTS.map((prod) => {
                  const isChecked = formData.products.includes(prod.hsCode);
                  return (
                    <button
                      key={prod.hsCode}
                      type="button"
                      onClick={() => handleToggleProduct(prod.hsCode)}
                      className={`flex items-start gap-2 p-2.5 text-left border rounded-[4px] transition-colors cursor-pointer ${
                        isChecked
                          ? 'border-[var(--brand)] bg-[var(--brand-light)]'
                          : 'border-[var(--gray-300)] bg-white hover:bg-[var(--gray-100)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 pointer-events-none accent-[var(--brand)]"
                      />
                      <div>
                        <div className="font-bold text-[var(--text-display)]">
                          {prod.name} (HS {prod.hsCode})
                        </div>
                        <div className="text-[11px] text-[var(--text-sub)]">
                          {prod.category}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <label className="block font-semibold text-[var(--text-display)] mb-2">
                Accreditations & Certifications
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableCertifications.map((cert) => {
                  const hasCert = formData.certifications.includes(cert);
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => handleToggleCert(cert)}
                      className={`p-2.5 text-left border rounded-[4px] transition-colors cursor-pointer ${
                        hasCert
                          ? 'border-[var(--success)] bg-[var(--brand-light)]'
                          : 'border-[var(--gray-300)] bg-white hover:bg-[var(--gray-100)]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Award className={`w-3.5 h-3.5 ${hasCert ? 'text-[var(--success)]' : 'text-[var(--text-sub)]'}`} />
                        <span className="font-bold text-[var(--text-display)]">{cert}</span>
                      </div>
                      <div className="text-[10px] text-[var(--text-sub)]">
                        {cert === 'RSB S-Mark'
                          ? 'Rwanda Standards Board'
                          : cert === 'HACCP'
                          ? 'Food Safety System'
                          : cert === 'GlobalG.A.P.'
                          ? 'Good Agricultural Practices'
                          : 'Certified Organic'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Capacity & Price Baseline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Default Monthly Supply Capacity (kg/month)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="500"
                    value={formData.monthlyCapacityKg}
                    onChange={(e) => setFormData({ ...formData, monthlyCapacityKg: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-semibold focus:border-[var(--brand)]"
                  />
                  <span className="font-medium text-[var(--text-sub)]">kg</span>
                </div>
                <p className="text-[11px] text-[var(--text-sub)] mt-1">
                  {(formData.monthlyCapacityKg / 1000).toFixed(1)} Metric Tonnes per month.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Default Ex-Works Price (RWF/kg at farmgate/factory)
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--text-sub)]">RWF</span>
                  <input
                    type="number"
                    step="10"
                    value={formData.exWorksPriceRwf}
                    onChange={(e) => setFormData({ ...formData, exWorksPriceRwf: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-semibold focus:border-[var(--brand)]"
                  />
                  <span className="font-medium text-[var(--text-sub)]">/kg</span>
                </div>
                <p className="text-[11px] text-[var(--text-sub)] mt-1">
                  Ex-works before corridor transport to Nairobi depot.
                </p>
              </div>
            </div>

            {/* Submit & Navigation */}
            <div className="pt-4 border-t border-[var(--gray-300)] flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[var(--brand)] border border-[var(--brand)] font-semibold rounded-[4px] hover:bg-[var(--brand-light)] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Profile Changes
              </button>

              <button
                type="button"
                onClick={onProceedToExportForm}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-[var(--brand)] text-white font-semibold rounded-[4px] hover:bg-[var(--brand-dark)] cursor-pointer"
              >
                <span>Proceed to Export Opportunity Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Institutional Verification Badges */}
        <div className="space-y-4">
          <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-4 text-xs space-y-3">
            <h3 className="font-bold text-[var(--text-display)] border-b border-[var(--gray-300)] pb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
              <span>Rwandan Institutional Verifications</span>
            </h3>

            <div className="space-y-2.5">
              <div className="p-2.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-display)]">RDB Company Registry</span>
                  <span className="text-[10px] font-bold uppercase text-[var(--success)] bg-white px-1.5 py-0.5 border border-[var(--gray-300)] rounded-[4px]">
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-sub)] mt-1 font-mono">
                  Reg No: {formData.rdbNumber}
                </div>
              </div>

              <div className="p-2.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-display)]">RRA Tax Compliance</span>
                  <span className="text-[10px] font-bold uppercase text-[var(--success)] bg-white px-1.5 py-0.5 border border-[var(--gray-300)] rounded-[4px]">
                    Compliant
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-sub)] mt-1 font-mono">
                  TIN: {formData.tin}
                </div>
              </div>

              <div className="p-2.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-display)]">RSB Quality Marks</span>
                  <span className="text-[10px] font-bold uppercase text-[var(--brand)] bg-white px-1.5 py-0.5 border border-[var(--gray-300)] rounded-[4px]">
                    {formData.certifications.includes('RSB S-Mark') ? 'S-Mark Verified' : 'Standard'}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-sub)] mt-1">
                  Mutual recognition under EAC SQMT Protocol with KEBS Kenya.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] p-4 text-xs space-y-2">
            <h4 className="font-bold text-[var(--brand)]">
              Northern Corridor Logistics Note
            </h4>
            <p className="text-[var(--text-body)] leading-relaxed">
              Consignments originating from {formData.district} District route via Kigali dry port through Gatuna One-Stop Border Post (OSBP) and enter Kenya at Malaba OSBP en route to Nairobi distribution depots.
            </p>
            <div className="text-[11px] text-[var(--brand-dark)] font-semibold pt-1">
              Estimated corridor dwell time: 36–48 hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
