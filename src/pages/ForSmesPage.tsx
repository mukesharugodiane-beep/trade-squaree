/**
 * Page 3: For SMEs
 * Explains:
 * - Who can join: Rwandan registered businesses with an RDB registration number and TIN.
 * - What to prepare: statutory certificates, commodity details, capacity, and pricing.
 * - What they get: explainable shortlist, verification trail, facilitation letters, deal tracking.
 * - Pipeline stages:
 *     New, Contacted, Interested, Requirements exchanged, Quotation or sample, Negotiation, Deal.
 */

import React from 'react';
import {
  Building2,
  CheckCircle2,
  FileText,
  Package,
  KanbanSquare,
  ArrowRight,
  ShieldCheck,
  Award,
  AlertCircle
} from 'lucide-react';
import { PageId } from '../types/publicSite';
import { CreateAccountDropdown, AccountCreationType } from '../components/CreateAccountDropdown';

interface ForSmesPageProps {
  onNavigate: (page: PageId, accountType?: AccountCreationType) => void;
  onOpenSignIn: () => void;
}

export const ForSmesPage: React.FC<ForSmesPageProps> = ({ onNavigate, onOpenSignIn }) => {
  const pipelineStages = [
    {
      stage: '1. New',
      summary: 'Partner shortlisted by matching algorithm.',
      description: 'The partner card appears in your shortlist with an empirical relevance score out of 100 based on your export consignment parameters.'
    },
    {
      stage: '2. Contacted',
      summary: 'Initial commercial outreach initiated.',
      description: 'You initiate direct contact via authenticated corporate phone/email or request an official MINICOM introduction letter.'
    },
    {
      stage: '3. Interested',
      summary: 'Partner acknowledges bilateral interest.',
      description: 'The regional buyer confirms procurement interest in your product category and requests technical commodity specifications.'
    },
    {
      stage: '4. Requirements exchanged',
      summary: 'Quality and compliance alignment.',
      description: 'Both parties exchange quality certificates (e.g. RSB S-Mark, KEBS standards), packaging preferences, and moisture or grading specifications.'
    },
    {
      stage: '5. Quotation or sample',
      summary: 'Formal pricing and sample consignment.',
      description: 'A formal pro-forma invoice or physical commercial sample (e.g. 5kg test batch) is dispatched across the border for laboratory assessment.'
    },
    {
      stage: '6. Negotiation',
      summary: 'Contractual terms and payment mechanisms.',
      description: 'Commercial terms are finalized, including delivery incoterms (FOB Kigali or DDP Nairobi), currency assumptions, and payment guarantees.'
    },
    {
      stage: '7. Deal',
      summary: 'Export contract signed.',
      description: 'A binding cross-border sales contract is executed, and corridor logistics dispatch via Gatuna and Malaba is scheduled.'
    }
  ];

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-[var(--gray-300)] pb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-sub)]">
          Rwandan Enterprise Participation Guide
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-display)] tracking-tight">
          Guidance for Rwandan Exporters (SMEs)
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed">
          Designed specifically for Rwandan small and medium-sized enterprises seeking verified, structured access to regional buyers in Kenya along the Northern Corridor.
        </p>
      </div>

      {/* Who Can Join */}
      <section className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4" aria-labelledby="who-can-join-title">
        <div className="flex items-center gap-2 border-b border-[var(--gray-300)] pb-2">
          <Building2 className="w-5 h-5 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
          <h2 id="who-can-join-title" className="text-base font-bold text-[var(--text-display)]">
            Who Can Join the Pilot
          </h2>
        </div>

        <p className="text-xs text-[var(--text-body)] leading-relaxed">
          Participation in the pilot phase is open to <strong>Rwandan registered commercial businesses</strong> that satisfy the following statutory requirements:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-1.5">
            <div className="font-bold text-[var(--text-display)] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" aria-hidden="true" />
              <span>RDB Registration Number</span>
            </div>
            <p className="text-[var(--text-body)] text-[11px] leading-relaxed">
              Valid enterprise registration or certificate of incorporation issued by the Rwanda Development Board (RDB).
            </p>
          </div>

          <div className="p-4 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-1.5">
            <div className="font-bold text-[var(--text-display)] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" aria-hidden="true" />
              <span>RRA Tax Identification Number (TIN)</span>
            </div>
            <p className="text-[var(--text-body)] text-[11px] leading-relaxed">
              Active TIN registered with the Rwanda Revenue Authority (RRA) in good standing for commercial operations.
            </p>
          </div>

          <div className="p-4 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-1.5">
            <div className="font-bold text-[var(--text-display)] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" aria-hidden="true" />
              <span>Pilot Commodity Portfolio</span>
            </div>
            <p className="text-[var(--text-body)] text-[11px] leading-relaxed">
              Produces or aggregates one or more priority pilot commodities: Beans (HS 0713), Maize flour (HS 1102), Avocado (HS 0804), or Honey (HS 0409).
            </p>
          </div>

          <div className="p-4 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-1.5">
            <div className="font-bold text-[var(--text-display)] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" aria-hidden="true" />
              <span>Export Readiness</span>
            </div>
            <p className="text-[var(--text-body)] text-[11px] leading-relaxed">
              Demonstrated monthly supply capacity and readiness to comply with East African Community cross-border standards.
            </p>
          </div>
        </div>
      </section>

      {/* What to Prepare */}
      <section className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4" aria-labelledby="what-prepare-title">
        <div className="flex items-center gap-2 border-b border-[var(--gray-300)] pb-2">
          <FileText className="w-5 h-5 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
          <h2 id="what-prepare-title" className="text-base font-bold text-[var(--text-display)]">
            What to Prepare Before Accessing the Platform
          </h2>
        </div>

        <p className="text-xs text-[var(--text-body)]">
          Having these data points ready ensures your SME profile and consignment match accurately against Kenyan buyer demands:
        </p>

        <ul className="space-y-2.5 text-xs text-[var(--text-body)]">
          <li className="flex items-start gap-2 p-2.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <span className="font-bold text-[var(--brand)] min-w-[20px]">1.</span>
            <div>
              <strong>Enterprise Credentials:</strong> Official legal name matching RDB incorporation certificate, RDB registration number, and RRA TIN.
            </div>
          </li>
          <li className="flex items-start gap-2 p-2.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <span className="font-bold text-[var(--brand)] min-w-[20px]">2.</span>
            <div>
              <strong>Operating District &amp; Facility:</strong> Location of processing plant, aggregation warehouse, or farming cooperative in Rwanda.
            </div>
          </li>
          <li className="flex items-start gap-2 p-2.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <span className="font-bold text-[var(--brand)] min-w-[20px]">3.</span>
            <div>
              <strong>Commodity Details &amp; HS Headings:</strong> Exact commodity with 4-digit HS heading, packaging type (e.g. 50kg bags or retail jars), and grade specifications.
            </div>
          </li>
          <li className="flex items-start gap-2 p-2.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <span className="font-bold text-[var(--brand)] min-w-[20px]">4.</span>
            <div>
              <strong>Accreditations:</strong> Quality mark reference from Rwanda Standards Board (RSB S-Mark), HACCP, GlobalG.A.P., or Organic certification.
            </div>
          </li>
          <li className="flex items-start gap-2 p-2.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px]">
            <span className="font-bold text-[var(--brand)] min-w-[20px]">5.</span>
            <div>
              <strong>Supply Capacity &amp; Ex-Works Price:</strong> Realistic monthly export capacity (kg or tonnes) and minimum farmgate ex-works price in RWF per kg.
            </div>
          </li>
        </ul>
      </section>

      {/* What You Get */}
      <section className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4" aria-labelledby="what-get-title">
        <div className="flex items-center gap-2 border-b border-[var(--gray-300)] pb-2">
          <Package className="w-5 h-5 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
          <h2 id="what-get-title" className="text-base font-bold text-[var(--text-display)]">
            What You Get as a Participating SME
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 border border-[var(--gray-300)] rounded-[4px] space-y-1">
            <h3 className="font-bold text-sm text-[var(--text-display)]">
              Uncluttered 5 to 10 Partner Shortlist
            </h3>
            <p className="text-[var(--text-body)] leading-relaxed">
              No endless scrolls of inactive companies. You receive a curated, explainable shortlist ranked by verifiable commercial compatibility.
            </p>
          </div>

          <div className="p-4 border border-[var(--gray-300)] rounded-[4px] space-y-1">
            <h3 className="font-bold text-sm text-[var(--text-display)]">
              Auditable Evidence &amp; Verification Dates
            </h3>
            <p className="text-[var(--text-body)] leading-relaxed">
              Review where each company’s trading evidence originated, their last recorded customs crossing, and statutory tax compliance status.
            </p>
          </div>

          <div className="p-4 border border-[var(--gray-300)] rounded-[4px] space-y-1">
            <h3 className="font-bold text-sm text-[var(--text-display)]">
              Official MINICOM Facilitation Letters
            </h3>
            <p className="text-[var(--text-body)] leading-relaxed">
              Request formal institutional introduction letters signed by the MINICOM Trade Desk to authenticate your business to Kenyan buyers.
            </p>
          </div>

          <div className="p-4 border border-[var(--gray-300)] rounded-[4px] space-y-1">
            <h3 className="font-bold text-sm text-[var(--text-display)]">
              Opportunity Pipeline Management
            </h3>
            <p className="text-[var(--text-body)] leading-relaxed">
              Track negotiation milestones, sample shipments, and contractual agreements in an organized dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Opportunity Pipeline Stages */}
      <section className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4" aria-labelledby="pipeline-stages-title">
        <div className="flex items-center gap-2 border-b border-[var(--gray-300)] pb-2">
          <KanbanSquare className="w-5 h-5 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
          <div>
            <h2 id="pipeline-stages-title" className="text-base font-bold text-[var(--text-display)]">
              Opportunity Pipeline Stages
            </h2>
            <p className="text-xs text-[var(--text-sub)]">
              Every prospective partner you pursue moves through structured stages to ensure disciplined cross-border deal execution.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {pipelineStages.map((stg, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-sm text-[var(--text-display)]">
                  {stg.stage}
                </div>
                <div className="font-semibold text-[var(--brand-dark)] text-[11px]">
                  {stg.summary}
                </div>
                <p className="text-[var(--text-body)] text-[11px] leading-relaxed">
                  {stg.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] text-xs text-[var(--brand-dark)]">
          <strong>Outcome Stages:</strong> If discussions do not proceed, opportunities are closed with terminal labels: <em>No response</em> or <em>Not interested</em>, providing analytical feedback to trade officers without cluttering your active pipeline.
        </div>
      </section>

      {/* Next Step / Action */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-[var(--text-display)]">
            Ready to participate in the pilot?
          </h3>
          <p className="text-xs text-[var(--text-sub)]">
            Create your Business or Partner account with your statutory credentials.
          </p>
        </div>

        <CreateAccountDropdown
          label="Create account"
          onSelectAccountType={(type) => onNavigate('contact', type)}
          variant="brand"
          align="right"
          dropUp
        />
      </div>
    </div>
  );
};
