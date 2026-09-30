/**
 * Page 4: For Regional Partners (Kenyan Buyers and Distributors)
 * Explains:
 * - Partners do not need to register to appear (initially indexed via public trade manifests and registries).
 * - They can claim a profile.
 * - Add what they want to buy.
 * - Receive verified export opportunities from Rwandan SMEs.
 * - Interactive claim/registration form.
 */

import React, { useState } from 'react';
import {
  Building,
  CheckCircle2,
  FileCheck,
  Send,
  MapPin,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { PageId } from '../types/publicSite';

interface ForRegionalPartnersPageProps {
  onNavigate: (page: PageId) => void;
}

export const ForRegionalPartnersPage: React.FC<ForRegionalPartnersPageProps> = () => {
  const [companyName, setCompanyName] = useState('');
  const [kraPin, setKraPin] = useState('');
  const [city, setCity] = useState('Nairobi');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [buyingNeeds, setBuyingNeeds] = useState<string[]>(['Beans (HS 0713)']);
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const availableProducts = [
    'Beans (HS 0713)',
    'Maize flour (HS 1102)',
    'Avocado (HS 0804)',
    'Honey (HS 0409)'
  ];

  const handleToggleProduct = (product: string) => {
    setBuyingNeeds((prev) =>
      prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-[var(--gray-300)] pb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-sub)]">
          Regional Buyer &amp; Distributor Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-display)] tracking-tight">
          For Regional Trading Partners in Kenya
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed">
          Information for commercial buyers, millers, food processors, supermarkets, and distributors operating in Nairobi, Mombasa, Nakuru, and Kisumu.
        </p>
      </div>

      {/* Core Principle Banner: Partners Do Not Need to Register to Appear */}
      <section className="bg-white border-2 border-[var(--brand)] rounded-[4px] p-6 space-y-3" aria-labelledby="no-registration-title">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
          <h2 id="no-registration-title" className="text-base font-bold text-[var(--text-display)]">
            Regional Partners Do Not Need to Register to Appear
          </h2>
        </div>

        <p className="text-xs text-[var(--text-body)] leading-relaxed">
          To ensure Rwandan SMEs have immediate access to realistic market counterparties, Trade Square identifies reputable Kenyan commercial entities using public trade manifests, customs cargo tracking logs from the Gatuna and Malaba One-Stop Border Posts, and official business directories.
        </p>

        <p className="text-xs text-[var(--text-body)] leading-relaxed">
          If your company already imports or distributes dry grains, horticulture, apiculture, or flours, your commercial identity may already appear under our <strong>&ldquo;Known trade activity&rdquo;</strong> or <strong>&ldquo;Business identity verified&rdquo;</strong> evidence labels.
        </p>
      </section>

      {/* Benefits for Regional Partners */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs" aria-labelledby="partner-benefits-title">
        <h2 id="partner-benefits-title" className="sr-only">Benefits for Regional Partners</h2>

        <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-display)]">
            <CheckCircle2 className="w-4 h-4 text-[var(--brand)]" aria-hidden="true" />
            <span>1. Claim Your Profile</span>
          </div>
          <p className="text-[var(--text-body)] leading-relaxed">
            Verify authorized executive contact coordinates so that trade inquiries reach your procurement desk directly rather than public general switchboards.
          </p>
        </div>

        <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-display)]">
            <FileCheck className="w-4 h-4 text-[var(--brand)]" aria-hidden="true" />
            <span>2. Add What You Want to Buy</span>
          </div>
          <p className="text-[var(--text-body)] leading-relaxed">
            Publish exact technical commodity requirements, acceptable moisture levels, preferred batch sizes, and target delivered pricing in Kenyan Shillings (KES).
          </p>
        </div>

        <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-display)]">
            <Send className="w-4 h-4 text-[var(--brand)]" aria-hidden="true" />
            <span>3. Receive Pre-Qualified Offers</span>
          </div>
          <p className="text-[var(--text-body)] leading-relaxed">
            Receive vetted export proposals from Rwandan enterprises possessing verified RSB S-Mark quality marks and authorized RDB incorporation.
          </p>
        </div>
      </section>

      {/* Claim or Register Profile Form */}
      <section className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4" aria-labelledby="claim-form-title">
        <div className="border-b border-[var(--gray-300)] pb-2 flex items-center justify-between">
          <div>
            <h2 id="claim-form-title" className="text-base font-bold text-[var(--text-display)]">
              Claim an Existing Profile or Register Your Sourcing Needs
            </h2>
            <p className="text-xs text-[var(--text-sub)]">
              Complete this form to connect your commercial procurement desk with the MINICOM Trade Square registry.
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase text-[var(--text-sub)] bg-[var(--gray-100)] border border-[var(--gray-300)] px-2 py-0.5 rounded-[4px]">
            Kenyan Commercial Entities
          </span>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px]">
            <CheckCircle2 className="w-10 h-10 text-[var(--success)] mx-auto" aria-hidden="true" />
            <h3 className="text-base font-bold text-[var(--text-display)]">
              Profile Claim Submission Received
            </h3>
            <p className="text-xs text-[var(--text-body)] max-w-md mx-auto leading-relaxed">
              Thank you. The MINICOM Trade Desk will verify your KRA PIN ({kraPin}) against statutory registry data. An officer will confirm your official procurement point of contact within 2 business days.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-2 text-xs text-[var(--brand)] font-semibold hover:underline cursor-pointer"
            >
              Submit another inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Enterprise Name in Kenya
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Supermarkets Kenya Ltd (sample)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] focus:border-[var(--brand)]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Kenya Revenue Authority PIN (KRA PIN)
                </label>
                <input
                  type="text"
                  placeholder="e.g. P051009481X"
                  value={kraPin}
                  onChange={(e) => setKraPin(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-mono focus:border-[var(--brand)]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Primary Operating Hub (Kenya)
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] bg-white focus:border-[var(--brand)]"
                >
                  <option value="Nairobi">Nairobi</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Nakuru">Nakuru</option>
                  <option value="Kisumu">Kisumu</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Authorized Procurement Officer
                </label>
                <input
                  type="text"
                  placeholder="Full name of trade contact"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] focus:border-[var(--brand)]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  placeholder="procurement@company.co.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] focus:border-[var(--brand)]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Official Phone (+254)
                </label>
                <input
                  type="text"
                  placeholder="+254 722 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-mono focus:border-[var(--brand)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-display)] mb-2">
                Commodities of Sourcing Interest (Northern Corridor Pilot)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableProducts.map((prod) => {
                  const isChecked = buyingNeeds.includes(prod);
                  return (
                    <button
                      key={prod}
                      type="button"
                      onClick={() => handleToggleProduct(prod)}
                      className={`p-2.5 text-left border rounded-[4px] transition-colors cursor-pointer ${
                        isChecked
                          ? 'border-[var(--brand)] bg-[var(--brand-light)] font-bold text-[var(--brand)]'
                          : 'border-[var(--gray-300)] bg-white text-[var(--text-body)] hover:bg-[var(--gray-100)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mr-1.5 accent-[var(--brand)] pointer-events-none"
                      />
                      <span>{prod}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-display)] mb-1">
                Procurement Specifications or Minimum Batch Envelope (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="State monthly volume demands (e.g. 20 tonnes/month), required certifications (e.g. RSB S-Mark, GlobalG.A.P.), or warehouse delivery points..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] focus:border-[var(--brand)] text-xs"
              />
            </div>

            <div className="p-3 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-[var(--brand)]"
                  required
                />
                <span className="text-[11px] text-[var(--text-body)] leading-relaxed">
                  I confirm that I am an authorized representative of this enterprise and consent to MINICOM verifying these commercial details to facilitate bilateral trade with registered Rwandan exporters.
                </span>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!consent}
                className="px-5 py-2.5 bg-[var(--brand)] text-white text-xs font-bold rounded-[4px] hover:bg-[var(--brand-dark)] transition-colors cursor-pointer disabled:opacity-50"
              >
                Submit Profile Claim / Sourcing Intent
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Due Diligence Notice */}
      <div className="p-4 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] text-xs text-[var(--text-sub)] space-y-1">
        <div className="font-bold text-[var(--text-display)]">
          Northern Corridor Regulatory Scope
        </div>
        <p className="leading-relaxed">
          Rwanda and Kenya operate under the East African Community (EAC) Customs Union and Northern Corridor Transit Agreement. Preferential 0% duty applies to originating commodities covered by valid EAC / AfCFTA Certificates of Origin.
        </p>
      </div>
    </div>
  );
};
