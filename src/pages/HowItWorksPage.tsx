/**
 * Page 2: How It Works
 * Explains the six signals used to rank partners in plain words:
 * 1. Product fit
 * 2. Trade evidence
 * 3. Certification fit
 * 4. Capacity
 * 5. Landed price
 * 6. Data freshness
 * Includes an example "Why this match?" panel.
 * Explains that AI helps read messy product descriptions and write explanations, and never invents companies.
 */

import React from 'react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  Clock,
  Scale,
  ShieldCheck,
  Building,
  AlertTriangle
} from 'lucide-react';
import { PageId } from '../types/publicSite';

interface HowItWorksPageProps {
  onNavigate: (page: PageId) => void;
  onOpenSignIn: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate, onOpenSignIn }) => {
  const signals = [
    {
      title: '1. Product Fit',
      weight: '30%',
      icon: Layers,
      summary: 'Matches exact Harmonized System (HS) headings and buyer role.',
      detail:
        'We compare the Rwandan SME’s commodity HS heading (for example, Beans HS 0713 or Avocado HS 0804) directly against what the regional partner buys or distributes. A buyer looking specifically for wholesale dried beans receives a higher match than a general trader.'
    },
    {
      title: '2. Trade Evidence',
      weight: '25%',
      icon: FileCheck,
      summary: 'Empirical cross-border shipment and customs filings.',
      detail:
        'Partners with documented import declarations or transit logs clearing through the Gatuna and Malaba One-Stop Border Posts (OSBPs) receive priority. We verify real commercial activity instead of unverified self-reported claims.'
    },
    {
      title: '3. Certification Fit',
      weight: '15%',
      icon: ShieldCheck,
      summary: 'Mutual recognition of national quality marks under EAC protocols.',
      detail:
        'Under East African Community (EAC) standardization frameworks, quality marks issued by the Rwanda Standards Board (RSB S-Mark) are recognized by the Kenya Bureau of Standards (KEBS). We verify whether the buyer accepts these certifications without demanding secondary destination testing.'
    },
    {
      title: '4. Capacity Compatibility',
      weight: '10%',
      icon: Scale,
      summary: 'Aligning harvest volume with buyer batch requirements.',
      detail:
        'A small cooperative producing 12 metric tonnes per month requires a buyer whose minimum procurement envelope matches that volume. We prevent situations where SMEs are matched with industrial buyers requiring 100 tonnes per week.'
    },
    {
      title: '5. Landed Price Competitiveness',
      weight: '15%',
      icon: TrendingUp,
      summary: 'Farmgate price plus corridor road freight compared to Nairobi market prices.',
      detail:
        'We calculate the estimated landed price in Kenyan Shillings (KES/kg) by combining the Rwandan farmgate ex-works price with road transit freight costs across the Gatuna-Malaba corridor under duty-free EAC rules of origin, ensuring the offer is competitive against Kenyan wholesale thresholds.'
    },
    {
      title: '6. Data Freshness',
      weight: '5%',
      icon: Clock,
      summary: 'Recency of verified transactions and regulatory checks.',
      detail:
        'Partner profiles confirmed through customs manifests or regulatory audits within the current calendar quarter receive higher freshness weighting than records that have not been re-verified in over six months.'
    }
  ];

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-[var(--gray-300)] pb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-sub)]">
          Methodology &amp; Decision Support
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-display)] tracking-tight">
          How Trade Square Evaluates and Ranks Regional Partners
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed">
          Trade Square does not provide an endless directory of unranked names. It computes a transparent relevance score from six verifiable signals to generate a short, actionable shortlist.
        </p>
      </div>

      {/* The Role of AI Panel (Mandatory explanation per rules) */}
      <section className="bg-white border-2 border-[var(--brand)] rounded-[4px] p-6 space-y-3" aria-labelledby="ai-role-title">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
          <h2 id="ai-role-title" className="text-sm sm:text-base font-bold text-[var(--text-display)]">
            How Artificial Intelligence Is Used on Trade Square
          </h2>
        </div>

        <p className="text-xs text-[var(--text-body)] leading-relaxed">
          Rwandan SMEs often describe their goods in varied ways (for example: &ldquo;haricot rouge calibre moyen&rdquo;, &ldquo;mixed dry grain&rdquo;, or &ldquo;pure raw forest honey&rdquo;). Artificial intelligence assists trade officers by <strong>reading unstructured, messy product descriptions</strong>, mapping them to standard Harmonized System (HS) headings, and <strong>writing clear, plain-language match explanations</strong> for busy business owners.
        </p>

        <div className="p-3 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] text-xs text-[var(--brand-dark)]">
          <strong>Core Integrity Rule:</strong> The AI operates strictly over authenticated regulatory databases. It <strong>never invents companies, never hallucinates contact details, and never manufactures trade history</strong>. Every partner on Trade Square corresponds to a real, verified legal entity in regional commercial registries.
        </div>
      </section>

      {/* Six Signals Grid */}
      <section className="space-y-4" aria-labelledby="six-signals-title">
        <div className="border-b border-[var(--gray-300)] pb-2 flex items-center justify-between">
          <h2 id="six-signals-title" className="text-base font-bold text-[var(--text-display)]">
            The Six Weighted Decision Signals
          </h2>
          <span className="text-xs text-[var(--text-sub)]">
            Weights sum to 100%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {signals.map((sig, idx) => {
            const Icon = sig.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5 space-y-2 hover:border-[var(--brand)] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-display)]">
                    <Icon className="w-4 h-4 text-[var(--brand)]" aria-hidden="true" />
                    <span>{sig.title}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--brand)] bg-[var(--gray-100)] px-2 py-0.5 border border-[var(--gray-300)] rounded-[4px]">
                    Weight {sig.weight}
                  </span>
                </div>

                <div className="font-semibold text-[var(--text-display)] text-[11px]">
                  {sig.summary}
                </div>

                <p className="text-[var(--text-body)] leading-relaxed text-[11px]">
                  {sig.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Example "Why this match?" Panel */}
      <section className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4" aria-labelledby="why-match-title">
        <div className="border-b border-[var(--gray-300)] pb-2 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 id="why-match-title" className="text-base font-bold text-[var(--text-display)] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" aria-hidden="true" />
              <span>Example &ldquo;Why this match?&rdquo; Audit Panel</span>
            </h2>
            <p className="text-xs text-[var(--text-sub)]">
              Inside Trade Square, every partner card includes a transparent breakdown of how the score was calculated.
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase text-[var(--text-sub)] bg-[var(--gray-100)] border border-[var(--gray-300)] px-2 py-0.5 rounded-[4px]">
            Sample data
          </span>
        </div>

        {/* Company Header inside audit panel */}
        <div className="p-4 bg-[var(--gray-100)] rounded-[4px] border border-[var(--gray-300)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-sm text-[var(--text-display)]">
              Ushirika Grain Millers Cooperative Union (sample)
            </div>
            <div className="text-[var(--text-sub)] mt-0.5">
              Nairobi, Kenya · Large Agro-Processor · KRA PIN: P051029482Z
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-xl font-extrabold text-[var(--brand)]">
              92<span className="text-xs font-normal text-[var(--text-sub)]">/100</span>
            </div>
            <div className="text-[10px] font-bold uppercase text-[var(--success)]">
              Strong match
            </div>
          </div>
        </div>

        {/* Natural Language Explanation */}
        <div className="p-3 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] text-xs text-[var(--text-display)] leading-relaxed">
          <strong className="text-[var(--brand-dark)]">Generated Match Summary:</strong> Direct commercial alignment on HS 1102 (Maize flour) as an active regional buyer; verified cross-border cargo manifests via Gatuna and Malaba border posts (55 logged transits); certified compliance with Rwandan quality marks recognized under EAC standardization protocols; estimated landed price of KES 76.5/kg is competitive against their buying threshold of KES 79/kg.
        </div>

        {/* Signal Bars */}
        <div className="space-y-3 pt-2 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-[var(--text-display)]">Product Fit (HS 1102 Milled Grain)</span>
              <span className="font-mono text-[var(--brand)]">100 / 100</span>
            </div>
            <div className="w-full bg-[var(--gray-100)] border border-[var(--gray-300)] h-2 rounded-[4px] overflow-hidden">
              <div className="bg-[var(--brand)] h-full w-[100%]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-[var(--text-display)]">Trade Evidence (55 logged corridor crossings)</span>
              <span className="font-mono text-[var(--brand)]">98 / 100</span>
            </div>
            <div className="w-full bg-[var(--gray-100)] border border-[var(--gray-300)] h-2 rounded-[4px] overflow-hidden">
              <div className="bg-[var(--brand)] h-full w-[98%]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-[var(--text-display)]">Certification Fit (RSB S-Mark recognized by KEBS)</span>
              <span className="font-mono text-[var(--brand)]">92 / 100</span>
            </div>
            <div className="w-full bg-[var(--gray-100)] border border-[var(--gray-300)] h-2 rounded-[4px] overflow-hidden">
              <div className="bg-[var(--brand)] h-full w-[92%]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-[var(--text-display)]">Capacity Compatibility (25 MT/month vs 20–70 MT demand)</span>
              <span className="font-mono text-[var(--brand)]">90 / 100</span>
            </div>
            <div className="w-full bg-[var(--gray-100)] border border-[var(--gray-300)] h-2 rounded-[4px] overflow-hidden">
              <div className="bg-[var(--brand)] h-full w-[90%]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-[var(--text-display)]">Landed Price Fit (KES 76.5/kg vs KES 79 target)</span>
              <span className="font-mono text-[var(--brand)]">94 / 100</span>
            </div>
            <div className="w-full bg-[var(--gray-100)] border border-[var(--gray-300)] h-2 rounded-[4px] overflow-hidden">
              <div className="bg-[var(--brand)] h-full w-[94%]" />
            </div>
          </div>
        </div>

        <div className="p-3 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] flex items-start gap-2 text-xs text-[var(--text-sub)]">
          <AlertTriangle className="w-4 h-4 text-[var(--warning)] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong>Reminder:</strong> The match score highlights commercial alignment; it does not constitute a guarantee of payment or contract fulfillment. SMEs must verify terms independently.
          </span>
        </div>
      </section>

      {/* Call to Action */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 text-center space-y-3">
        <h3 className="text-base font-bold text-[var(--text-display)]">
          Ready to discover explainable regional trading matches?
        </h3>
        <p className="text-xs text-[var(--text-body)] max-w-lg mx-auto">
          Rwandan SMEs with valid RDB and TIN credentials can apply for active participation in the Northern Corridor pilot.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={onOpenSignIn}
            className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-[4px] hover:bg-[var(--brand-dark)] cursor-pointer"
          >
            Sign in to Pilot
          </button>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-4 py-2 bg-white text-[var(--text-body)] border border-[var(--gray-300)] text-xs font-semibold rounded-[4px] hover:bg-[var(--gray-100)] cursor-pointer"
          >
            Request Pilot Access
          </button>
        </div>
      </div>
    </div>
  );
};
