/**
 * Page 5: Trust and Data
 * Explains:
 * - Exactly four evidence labels:
 *     "Known trade activity", "Business identity verified", "Trade Square registered", "Potential partner"
 * - Strict rule: Never merge them into one "Trusted" badge.
 * - Data protection notice: business contact details only, consent for claimed profiles,
 *   personal data stored in Rwanda unless the regulator authorises otherwise.
 * - Sources and freshness are shown on every result.
 */

import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  Database,
  Lock,
  Layers,
  Clock,
  Building,
  FileCheck
} from 'lucide-react';
import { EVIDENCE_LABELS_DETAILS } from '../data/publicSiteData';
import { PageId } from '../types/publicSite';

interface TrustAndDataPageProps {
  onNavigate: (page: PageId) => void;
}

export const TrustAndDataPage: React.FC<TrustAndDataPageProps> = () => {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-[var(--gray-300)] pb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-sub)]">
          Governance &amp; Data Standards
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-display)] tracking-tight">
          Trust Architecture &amp; Data Protection Standards
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed">
          How Trade Square handles empirical evidence, prevents misleading credibility claims, and ensures strict compliance with Rwandan data privacy legislation.
        </p>
      </div>

      {/* The Four Evidence Labels (Strictly separated per rules) */}
      <section className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4" aria-labelledby="evidence-labels-title">
        <div className="border-b border-[var(--gray-300)] pb-2 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 id="evidence-labels-title" className="text-base font-bold text-[var(--text-display)] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--brand)]" aria-hidden="true" />
              <span>The Four Distinct Evidence Labels</span>
            </h2>
            <p className="text-xs text-[var(--text-sub)]">
              Trade Square assigns exactly one of four objective labels based on verifiable public records.
            </p>
          </div>
          <div className="text-[11px] font-bold text-[var(--error)] bg-red-50 border border-[var(--error)] px-2 py-0.5 rounded-[4px]">
            Strict Rule: Never Merged into One &ldquo;Trusted&rdquo; Badge
          </div>
        </div>

        <div className="p-3 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] text-xs text-[var(--brand-dark)] leading-relaxed">
          <strong>Why no generic &ldquo;Trusted&rdquo; badge exists:</strong> A single &ldquo;Trusted&rdquo; badge creates false security and implies government guarantee. In cross-border trade, an entity may be a legally verified company (statutory existence) without recent customs activity, or an active importer without a claim on Trade Square. We report the exact evidence type instead of guessing trustworthiness.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          {/* Label 1: Known trade activity */}
          <div className="p-4 border border-[var(--gray-300)] rounded-[4px] space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-[var(--success)] bg-[var(--brand-light)] border border-[var(--success)] rounded-[4px]">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                Known trade activity
              </span>
              <span className="text-[10px] text-[var(--text-sub)] font-semibold">Tier 1 Evidence</span>
            </div>
            <p className="text-[var(--text-body)] text-[11px] leading-relaxed">
              Assigned when documented cross-border shipping declarations, Single Administrative Documents (SAD), or border clearance manifests have been logged through the Gatuna or Malaba One-Stop Border Posts. Confirms that the entity is an active cross-border trader.
            </p>
          </div>

          {/* Label 2: Business identity verified */}
          <div className="p-4 border border-[var(--gray-300)] rounded-[4px] space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-[var(--brand)] bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px]">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                Business identity verified
              </span>
              <span className="text-[10px] text-[var(--text-sub)] font-semibold">Statutory Check</span>
            </div>
            <p className="text-[var(--text-body)] text-[11px] leading-relaxed">
              Assigned when the enterprise registration is confirmed through official government registrars (such as the Kenya Business Registration Service) and possesses an active tax PIN in good standing with the revenue authority.
            </p>
          </div>

          {/* Label 3: Trade Square registered */}
          <div className="p-4 border border-[var(--gray-300)] rounded-[4px] space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-[var(--brand-dark)] bg-[var(--gray-100)] border border-[var(--brand-dark)] rounded-[4px]">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                Trade Square registered
              </span>
              <span className="text-[10px] text-[var(--text-sub)] font-semibold">Authenticated</span>
            </div>
            <p className="text-[var(--text-body)] text-[11px] leading-relaxed">
              Assigned when an authorized enterprise executive has directly completed pilot onboarding on Trade Square, verified corporate banking credentials, and formally stated active procurement or supply envelopes.
            </p>
          </div>

          {/* Label 4: Potential partner */}
          <div className="p-4 border border-[var(--gray-300)] rounded-[4px] space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-[var(--warning)] bg-white border border-[var(--warning)] rounded-[4px]">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                Potential partner
              </span>
              <span className="text-[10px] text-[var(--text-sub)] font-semibold">Pending Audit</span>
            </div>
            <p className="text-[var(--text-body)] text-[11px] leading-relaxed">
              Assigned to enterprises sourced from established regional commercial directories or trade association memberships (such as the East African Grain Council) that have not yet had recent border shipments or formal registration logged under the pilot.
            </p>
          </div>
        </div>
      </section>

      {/* Transparent Source Attribution & Data Freshness */}
      <section className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4" aria-labelledby="sources-title">
        <div className="border-b border-[var(--gray-300)] pb-2 flex items-center gap-2">
          <Database className="w-5 h-5 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
          <h2 id="sources-title" className="text-base font-bold text-[var(--text-display)]">
            Every Result Displays Its Evidence Source &amp; Last Updated Date
          </h2>
        </div>

        <p className="text-xs text-[var(--text-body)] leading-relaxed">
          To eliminate hidden rankings, every prospective partner card in Trade Square explicitly identifies the authoritative primary source that informed the match and the date the evidence was audited.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <div className="font-bold text-[var(--text-display)] mb-1">Customs Single Windows</div>
            <div className="text-[11px] text-[var(--text-sub)]">
              Rwanda Electronic Single Window (ReSW) &amp; Kenya Revenue Authority ICMS/Simba systems.
            </div>
          </div>

          <div className="p-3 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <div className="font-bold text-[var(--text-display)] mb-1">Quality Registrars</div>
            <div className="text-[11px] text-[var(--text-sub)]">
              Rwanda Standards Board (RSB) &amp; Kenya Bureau of Standards (KEBS) standardization marks.
            </div>
          </div>

          <div className="p-3 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <div className="font-bold text-[var(--text-display)] mb-1">Corridor Cargo Trackers</div>
            <div className="text-[11px] text-[var(--text-sub)]">
              Northern Corridor Transit and Transport Coordination Authority (NCTTCA) logs.
            </div>
          </div>
        </div>
      </section>

      {/* Data Protection Notice */}
      <section className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4" aria-labelledby="privacy-notice-title">
        <div className="border-b border-[var(--gray-300)] pb-2 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
          <h2 id="privacy-notice-title" className="text-base font-bold text-[var(--text-display)]">
            Official Data Protection Notice
          </h2>
        </div>

        <p className="text-xs text-[var(--text-body)] leading-relaxed">
          Trade Square complies strictly with the laws of the Republic of Rwanda, in particular <strong>Law No. 058/2021 of 13/10/2021 relating to the protection of personal data and privacy</strong>.
        </p>

        <div className="space-y-3 text-xs text-[var(--text-body)]">
          <div className="flex items-start gap-2.5 p-3 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <CheckCircle2 className="w-4 h-4 text-[var(--brand)] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong>Business Contact Details Only:</strong> The platform processes and displays corporate contact coordinates (official legal business names, registered business addresses, corporate email addresses, and designated procurement phone numbers). Private personal numbers and residential information are strictly excluded.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <CheckCircle2 className="w-4 h-4 text-[var(--brand)] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong>Explicit Consent for Claimed Profiles:</strong> When an enterprise representative registers or claims a profile on Trade Square, explicit consent is obtained prior to listing commercial procurement envelopes or contact updates.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <CheckCircle2 className="w-4 h-4 text-[var(--brand)] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong>National Data Sovereignty:</strong> In accordance with statutory directives, all personal and commercial data collected for Trade Square is stored on secure government cloud infrastructure located within the territory of the Republic of Rwanda, unless specifically authorized otherwise by the competent regulatory authority.
            </div>
          </div>
        </div>
      </section>

      {/* Due Diligence Summary */}
      <div className="p-4 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] text-xs text-[var(--brand-dark)] leading-relaxed">
        <strong>Statutory Notice:</strong> Trade Square supports commercial decisions; it does not replace independent due diligence, contract negotiation, pre-shipment quality inspection, corridor transit insurance, or customs clearance.
      </div>
    </div>
  );
};
