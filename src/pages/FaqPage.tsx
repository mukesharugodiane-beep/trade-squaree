/**
 * Page 7: FAQ (Frequently Asked Questions)
 * 8 questions in an accessible accordion with plain, definitive answers:
 * 1. Cost during pilot ("to be confirmed")
 * 2. Who sees my data
 * 3. Is a partner guaranteed
 * 4. What happens after I request an introduction
 * 5. Languages
 * 6. Offline options
 * 7. AI usage & integrity (never invents companies)
 * 8. How to report a problem
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';
import { FAQ_ITEMS } from '../data/publicSiteData';
import { PageId } from '../types/publicSite';

interface FaqPageProps {
  onNavigate: (page: PageId) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  // By default, open first question
  const [openIndices, setOpenIndices] = useState<number[]>([0, 2]);

  const toggleAccordion = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const allOpen = openIndices.length === FAQ_ITEMS.length;

  const toggleAll = () => {
    if (allOpen) {
      setOpenIndices([]);
    } else {
      setOpenIndices(FAQ_ITEMS.map((_, idx) => idx));
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-[var(--gray-300)] pb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-sub)]">
          Questions &amp; Official Answers
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-display)] tracking-tight">
            Frequently Asked Questions
          </h1>
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs font-semibold text-[var(--brand)] hover:underline cursor-pointer self-start sm:self-auto"
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed">
          Clear, plain explanations regarding pilot access, verification criteria, data privacy, and government facilitation.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3" role="region" aria-label="Frequently Asked Questions Accordion">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndices.includes(idx);
          const controlId = `faq-content-${idx}`;
          const buttonId = `faq-btn-${idx}`;

          return (
            <div
              key={idx}
              className="bg-white border border-[var(--gray-300)] rounded-[4px] overflow-hidden transition-colors"
            >
              <button
                id={buttonId}
                type="button"
                onClick={() => toggleAccordion(idx)}
                aria-expanded={isOpen}
                aria-controls={controlId}
                className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-[var(--gray-100)] transition-colors cursor-pointer"
              >
                <span className="font-bold text-sm text-[var(--text-display)] flex items-start gap-2">
                  <span className="text-[var(--brand)] min-w-[20px]">{idx + 1}.</span>
                  <span>{item.question}</span>
                </span>
                <span className="text-[var(--text-sub)] flex-shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[var(--brand)]" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div
                  id={controlId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="px-4 pb-4 pt-1 border-t border-[var(--gray-100)] text-xs text-[var(--text-body)] leading-relaxed space-y-2 bg-[var(--gray-100)]/40"
                >
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Prompt */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <div className="font-bold text-sm text-[var(--text-display)]">
            Have a question not addressed here?
          </div>
          <div className="text-[var(--text-sub)] mt-0.5">
            Submit your specific question directly to the MINICOM Trade Desk.
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className="px-4 py-2 bg-[var(--brand)] text-white font-semibold rounded-[4px] hover:bg-[var(--brand-dark)] transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <span>Contact MINICOM Desk</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
