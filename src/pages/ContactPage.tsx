/**
 * Page 8: Contact & Request Access
 * Strict compliance with MINICOM pilot specifications:
 * - Form with:
 *     Business name, RDB registration number, TIN, district, product, phone (+250), email, consent checkbox.
 * - Show a success message only upon submission.
 * - Contact email shown as "to be confirmed".
 * - Do not use any real email or phone number.
 * - No lorem ipsum; realistic Rwandan context.
 */

import React, { useState } from 'react';
import {
  Send,
  Building,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { RWANDAN_DISTRICTS, PILOT_PRODUCTS } from '../data/publicSiteData';
import { AccessRequestForm } from '../types/publicSite';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<AccessRequestForm>({
    businessName: '',
    rdbNumber: '',
    tin: '',
    district: RWANDAN_DISTRICTS[0],
    productHs: PILOT_PRODUCTS[0].hsCode,
    phone: '',
    email: '',
    consent: false
  });

  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-[var(--gray-300)] pb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-sub)]">
          MINICOM Bilateral Trade Desk
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-display)] tracking-tight">
          Contact &amp; Request Pilot Access
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed">
          Rwandan SMEs operating in priority agricultural commodities may request onboarding credentials for the Kigali to Nairobi Northern Corridor pilot.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form (2 columns) */}
        <div className="lg:col-span-2 bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4">
          <div className="border-b border-[var(--gray-300)] pb-2 flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--text-display)] flex items-center gap-2">
              <Building className="w-4 h-4 text-[var(--brand)]" aria-hidden="true" />
              <span>SME Pilot Onboarding Application</span>
            </h2>
            <span className="text-[10px] font-bold uppercase text-[var(--text-sub)] bg-[var(--gray-100)] border border-[var(--gray-300)] px-2 py-0.5 rounded-[4px]">
              Rwanda–Kenya Pilot
            </span>
          </div>

          {submitted ? (
            /* Show a success message only per the prompt rule */
            <div className="p-8 text-center space-y-3 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px]">
              <CheckCircle2 className="w-10 h-10 text-[var(--success)] mx-auto" aria-hidden="true" />
              <h3 className="text-base font-bold text-[var(--text-display)]">
                Application Received Successfully
              </h3>
              <p className="text-xs text-[var(--text-body)] max-w-md mx-auto leading-relaxed">
                Your request for pilot access has been submitted to the MINICOM Trade Desk. An authorized officer will verify your RDB registration ({formData.rdbNumber}) and TIN ({formData.tin}) with the Rwanda Revenue Authority within two business days.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      businessName: '',
                      rdbNumber: '',
                      tin: '',
                      district: RWANDAN_DISTRICTS[0],
                      productHs: PILOT_PRODUCTS[0].hsCode,
                      phone: '',
                      email: '',
                      consent: false
                    });
                  }}
                  className="text-xs text-[var(--brand)] font-semibold hover:underline cursor-pointer"
                >
                  Submit another enterprise application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Business Name */}
              <div>
                <label htmlFor="input-business-name" className="block font-semibold text-[var(--text-display)] mb-1">
                  Enterprise Legal Name (as registered with RDB)
                </label>
                <input
                  id="input-business-name"
                  type="text"
                  placeholder="e.g. Virunga Valley Agro-Processors Ltd (sample)"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] focus:border-[var(--brand)]"
                  required
                />
                <p className="text-[11px] text-[var(--text-sub)] mt-1">
                  Sample enterprise submissions should conclude with &ldquo;(sample)&rdquo; per simulation guidelines.
                </p>
              </div>

              {/* RDB Number & TIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="input-rdb-number" className="block font-semibold text-[var(--text-display)] mb-1">
                    RDB Registration Number
                  </label>
                  <input
                    id="input-rdb-number"
                    type="text"
                    placeholder="e.g. 109238472"
                    value={formData.rdbNumber}
                    onChange={(e) => setFormData({ ...formData, rdbNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-mono focus:border-[var(--brand)]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="input-tin" className="block font-semibold text-[var(--text-display)] mb-1">
                    Tax Identification Number (TIN - RRA)
                  </label>
                  <input
                    id="input-tin"
                    type="text"
                    placeholder="e.g. 102938475"
                    value={formData.tin}
                    onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-mono focus:border-[var(--brand)]"
                    required
                  />
                </div>
              </div>

              {/* District & Commodity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="select-district" className="block font-semibold text-[var(--text-display)] mb-1">
                    Operating District (Rwanda)
                  </label>
                  <select
                    id="select-district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] bg-white focus:border-[var(--brand)]"
                    required
                  >
                    {RWANDAN_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d} District
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="select-product" className="block font-semibold text-[var(--text-display)] mb-1">
                    Primary Export Product
                  </label>
                  <select
                    id="select-product"
                    value={formData.productHs}
                    onChange={(e) => setFormData({ ...formData, productHs: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] bg-white focus:border-[var(--brand)]"
                    required
                  >
                    {PILOT_PRODUCTS.map((p) => (
                      <option key={p.hsCode} value={p.hsCode}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="input-phone" className="block font-semibold text-[var(--text-display)] mb-1">
                    Authorized Phone (+250)
                  </label>
                  <input
                    id="input-phone"
                    type="text"
                    placeholder="+250 788 000 000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-mono focus:border-[var(--brand)]"
                    required
                  />
                  <p className="text-[11px] text-[var(--text-sub)] mt-1">
                    Official Rwandan commercial phone number.
                  </p>
                </div>

                <div>
                  <label htmlFor="input-email" className="block font-semibold text-[var(--text-display)] mb-1">
                    Official Business Email
                  </label>
                  <input
                    id="input-email"
                    type="email"
                    placeholder="trade@enterprise.rw (sample)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] focus:border-[var(--brand)]"
                    required
                  />
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="p-3 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 accent-[var(--brand)]"
                    required
                  />
                  <span className="text-[11px] text-[var(--text-body)] leading-relaxed">
                    I consent to MINICOM verifying these statutory enterprise details with the Rwanda Development Board (RDB) and the Rwanda Revenue Authority (RRA) for Trade Square pilot access, in accordance with Law No. 058/2021.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!formData.consent}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[var(--brand)] text-white text-xs font-bold rounded-[4px] hover:bg-[var(--brand-dark)] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Submit Pilot Access Request</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Institutional Desk Info */}
        <div className="space-y-4 text-xs">
          <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5 space-y-3">
            <h3 className="font-bold text-sm text-[var(--text-display)] border-b border-[var(--gray-300)] pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[var(--brand)]" aria-hidden="true" />
              <span>MINICOM Pilot Desk</span>
            </h3>

            <div className="space-y-2 text-[var(--text-body)]">
              <div>
                <strong>Ministry of Trade and Industry</strong>
                <div className="text-[11px] text-[var(--text-sub)]">
                  Directorate General of Trade and Investment
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--gray-100)] space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--brand)]" aria-hidden="true" />
                  <span>KN 3 Ave, Kigali, Rwanda</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[var(--brand)]" aria-hidden="true" />
                  <span>Contact email: <strong>to be confirmed</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[var(--brand)]" aria-hidden="true" />
                  <span>Inquiries hotline: <strong>to be confirmed</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] p-4 text-[11px] text-[var(--text-sub)] space-y-2">
            <div className="font-bold text-[var(--text-display)]">
              Statutory Verification Notice
            </div>
            <p className="leading-relaxed">
              Applications are cross-checked with official databases before credentials are issued. Unregistered informal traders will be referred to RDB registration facilitation desks prior to regional matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
