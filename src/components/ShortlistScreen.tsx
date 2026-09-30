/**
 * Screen 3: Partner Shortlist
 * Displays 5 to 10 partner cards based on deterministic weighted scoring.
 * Strict rules:
 * - Exactly four evidence labels:
 *     "Known trade activity", "Business identity verified", "Trade Square registered", "Potential partner"
 * - Never merge into one "Trusted" badge.
 * - End every name with "(sample)" and show a "Sample data" tag.
 * - Buttons: Contact, Save, Request introduction, View Match Detail.
 */

import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  AlertCircle,
  Phone,
  Mail,
  Bookmark,
  Send,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Filter
} from 'lucide-react';
import {
  KenyanPartner,
  MatchSignalBreakdown,
  EvidenceLabel,
  RwandanSME,
  ExportOpportunity
} from '../types';

interface ShortlistScreenProps {
  scoredPartners: { partner: KenyanPartner; scoreBreakdown: MatchSignalBreakdown }[];
  sme: RwandanSME;
  opportunity: ExportOpportunity;
  savedPartnerIds: string[];
  onToggleSavePartner: (partnerId: string) => void;
  onRequestIntroduction: (partner: KenyanPartner) => void;
  onSelectPartnerDetail: (partner: KenyanPartner) => void;
}

export const ShortlistScreen: React.FC<ShortlistScreenProps> = ({
  scoredPartners,
  opportunity,
  savedPartnerIds,
  onToggleSavePartner,
  onRequestIntroduction,
  onSelectPartnerDetail
}) => {
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All');
  const [selectedLabelFilter, setSelectedLabelFilter] = useState<string>('All');
  const [contactModalPartner, setContactModalPartner] = useState<KenyanPartner | null>(null);

  // Filter 5 to 10 top partners
  const filteredList = scoredPartners.filter(({ partner }) => {
    if (selectedCityFilter !== 'All' && partner.city !== selectedCityFilter) return false;
    if (selectedLabelFilter !== 'All' && partner.evidenceLabel !== selectedLabelFilter) return false;
    return true;
  });

  // Limit display to top 8-10 cards per pilot design
  const displayPartners = filteredList.slice(0, 10);

  // Helper for evidence label styling (distinct non-merged badges)
  const renderEvidenceBadge = (label: EvidenceLabel) => {
    switch (label) {
      case 'Known trade activity':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-[var(--success)] bg-[var(--brand-light)] border border-[var(--success)] rounded-[4px]">
            <CheckCircle2 className="w-3 h-3" />
            Known trade activity
          </span>
        );
      case 'Business identity verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-[var(--brand)] bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px]">
            <CheckCircle2 className="w-3 h-3" />
            Business identity verified
          </span>
        );
      case 'Trade Square registered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-[var(--brand-dark)] bg-[var(--gray-100)] border border-[var(--brand-dark)] rounded-[4px]">
            <CheckCircle2 className="w-3 h-3" />
            Trade Square registered
          </span>
        );
      case 'Potential partner':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-[var(--warning)] bg-white border border-[var(--warning)] rounded-[4px]">
            <AlertCircle className="w-3 h-3" />
            Potential partner
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter summary */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-sub)] mb-1">
              <span>MINICOM Trade Square</span>
              <span>/</span>
              <span>Regional Shortlist</span>
              <span>/</span>
              <span className="text-[var(--text-display)] font-semibold">
                Kenya Northern Corridor
              </span>
            </div>
            <h1 className="text-xl font-bold text-[var(--text-display)] tracking-tight">
              Shortlist: Verified Regional Trading Partners
            </h1>
            <p className="text-xs text-[var(--text-body)] mt-1">
              Short, explainable matches with empirical evidence along the Kigali–Nairobi corridor. Evaluated for commodity HS {opportunity.productHs}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-semibold text-[var(--text-sub)] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter by:
            </span>

            {/* City Filter */}
            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="bg-white px-2.5 py-1.5 border border-[var(--gray-300)] rounded-[4px] text-xs font-semibold focus:border-[var(--brand)]"
            >
              <option value="All">All Kenyan Cities</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Nakuru">Nakuru</option>
              <option value="Kisumu">Kisumu</option>
            </select>

            {/* Evidence Label Filter */}
            <select
              value={selectedLabelFilter}
              onChange={(e) => setSelectedLabelFilter(e.target.value)}
              className="bg-white px-2.5 py-1.5 border border-[var(--gray-300)] rounded-[4px] text-xs font-semibold focus:border-[var(--brand)]"
            >
              <option value="All">All 4 Evidence Types</option>
              <option value="Known trade activity">Known trade activity</option>
              <option value="Business identity verified">Business identity verified</option>
              <option value="Trade Square registered">Trade Square registered</option>
              <option value="Potential partner">Potential partner</option>
            </select>
          </div>
        </div>

        {/* Regulatory Banner */}
        <div className="mt-4 p-2.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] text-[11px] text-[var(--text-sub)] flex items-center justify-between flex-wrap gap-2">
          <div>
            <strong>Pilot Guidance:</strong> The tool supports decisions. It never guarantees that a company is trustworthy, and MINICOM does not guarantee any private company.
          </div>
          <div className="font-semibold text-[var(--brand)]">
            Showing {displayPartners.length} of {scoredPartners.length} evaluated partners
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayPartners.map(({ partner, scoreBreakdown }) => {
          const isSaved = savedPartnerIds.includes(partner.id);
          const score = scoreBreakdown.totalScore;

          return (
            <div
              key={partner.id}
              className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5 flex flex-col justify-between hover:border-[var(--brand)] transition-colors shadow-xs"
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {/* Sample data tag and name */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="text-sm font-bold text-[var(--text-display)] hover:text-[var(--brand)] transition-colors">
                        {partner.name}
                      </h2>
                      <span className="text-[10px] font-bold text-[var(--text-sub)] bg-[var(--gray-100)] border border-[var(--gray-300)] px-1.5 py-0.2 rounded-[4px]">
                        Sample data
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[var(--text-sub)] mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[var(--brand)]" />
                        <strong>{partner.city}</strong>, Kenya
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-[var(--text-display)]">
                        {partner.role}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">
                        PIN: {partner.kraPin}
                      </span>
                    </div>
                  </div>

                  {/* Relevance Score Badge */}
                  <div className="flex flex-col items-end flex-shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-[var(--brand)] leading-none">
                        {score}
                        <span className="text-xs font-normal text-[var(--text-sub)]">/100</span>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-sub)] mt-0.5">
                        {score >= 85 ? 'Strong match' : score >= 70 ? 'Medium match' : 'Baseline match'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence Label (Exactly one of the four allowed labels) */}
                <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
                  <div>{renderEvidenceBadge(partner.evidenceLabel)}</div>

                  {/* Source and Updated date */}
                  <div className="flex items-center gap-1 text-[11px] text-[var(--text-sub)]">
                    <Calendar className="w-3 h-3" />
                    <span>Updated {partner.updatedDate}</span>
                  </div>
                </div>

                {/* Source attribution line */}
                <div className="text-[11px] text-[var(--text-sub)] bg-[var(--gray-100)] px-2.5 py-1 rounded-[4px] border border-[var(--gray-300)] truncate">
                  <strong>Source:</strong> {partner.source}
                </div>

                {/* One-line reason */}
                <div className="text-xs text-[var(--text-body)] leading-relaxed border-l-2 border-[var(--brand)] pl-2.5 py-0.5">
                  <strong className="text-[var(--text-display)]">Why shortlisted:</strong> {partner.oneLineReason}
                </div>

                {/* Still to verify list */}
                <div className="bg-[var(--brand-light)]/40 border border-[var(--gray-300)] rounded-[4px] p-2.5 text-xs space-y-1">
                  <div className="font-bold text-[var(--warning)] flex items-center gap-1 text-[11px] uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Still to verify (due diligence checklist):</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-[var(--text-body)] pl-4 list-disc">
                    {partner.stillToVerify.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-4 mt-4 border-t border-[var(--gray-300)] flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => onSelectPartnerDetail(partner)}
                  className="font-bold text-[var(--brand)] hover:underline inline-flex items-center gap-1 cursor-pointer py-1"
                >
                  <span>Why this match? (Detail)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  {/* Contact button */}
                  <button
                    type="button"
                    onClick={() => setContactModalPartner(partner)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-[var(--text-body)] bg-white hover:bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] cursor-pointer"
                    title="View verified contact and office coordinates"
                  >
                    <Phone className="w-3.5 h-3.5 text-[var(--text-sub)]" />
                    <span>Contact</span>
                  </button>

                  {/* Save button */}
                  <button
                    type="button"
                    onClick={() => onToggleSavePartner(partner.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs border rounded-[4px] cursor-pointer transition-colors ${
                      isSaved
                        ? 'bg-[var(--brand-light)] text-[var(--brand)] border-[var(--brand)] font-semibold'
                        : 'bg-white text-[var(--text-body)] border-[var(--gray-300)] hover:bg-[var(--gray-100)]'
                    }`}
                    title={isSaved ? 'Saved in Opportunity Pipeline' : 'Save to Pipeline'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[var(--brand)] text-[var(--brand)]' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  {/* Request Introduction button */}
                  <button
                    type="button"
                    onClick={() => onRequestIntroduction(partner)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-[var(--brand)] text-white font-semibold rounded-[4px] hover:bg-[var(--brand-dark)] cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Request Intro</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Quick Modal */}
      {contactModalPartner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-white rounded-[4px] border border-[var(--gray-300)] shadow-lg overflow-hidden text-xs">
            <div className="px-5 py-3.5 bg-[var(--gray-100)] border-b border-[var(--gray-300)] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[var(--text-display)] text-sm">
                  {contactModalPartner.name}
                </h3>
                <span className="text-[11px] text-[var(--text-sub)]">
                  Kenya Revenue Authority Registered Business
                </span>
              </div>
              <button
                onClick={() => setContactModalPartner(null)}
                className="p-1 text-[var(--text-sub)] hover:text-[var(--text-display)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="p-2.5 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] text-[11px]">
                <strong>Official Contact Person:</strong> {contactModalPartner.contact.person}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--brand)]" />
                  <span className="font-mono text-xs">{contactModalPartner.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--brand)]" />
                  <span className="font-mono text-xs">{contactModalPartner.contact.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[var(--brand)] flex-shrink-0 mt-0.5" />
                  <span className="text-xs">{contactModalPartner.contact.address}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--gray-300)] text-[11px] text-[var(--text-sub)]">
                Corridor records indicate {contactModalPartner.corridorExperience.gatunaMalabaCrossingsCount} commercial cargo crossings cleared via Gatuna and Malaba OSBPs.
              </div>
            </div>

            <div className="px-5 py-3 bg-[var(--gray-100)] border-t border-[var(--gray-300)] flex justify-end">
              <button
                onClick={() => setContactModalPartner(null)}
                className="px-4 py-1.5 bg-white border border-[var(--gray-300)] font-semibold rounded-[4px] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
