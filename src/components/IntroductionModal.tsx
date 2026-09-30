/**
 * Introduction Request Confirmation Modal
 * Allows SME to formally submit a request for a facilitated introduction by MINICOM officers.
 */

import React, { useState } from 'react';
import { Send, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import {
  KenyanPartner,
  RwandanSME,
  ExportOpportunity,
  CorridorAssumptions
} from '../types';
import { HS_PRODUCTS } from '../data/seedData';

interface IntroductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: KenyanPartner | null;
  sme: RwandanSME;
  opportunity: ExportOpportunity;
  assumptions: CorridorAssumptions;
  onConfirm: (partner: KenyanPartner, customMessage: string) => void;
}

export const IntroductionModal: React.FC<IntroductionModalProps> = ({
  isOpen,
  onClose,
  partner,
  sme,
  opportunity,
  assumptions,
  onConfirm
}) => {
  const [customMessage, setCustomMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen || !partner) return null;

  const product =
    HS_PRODUCTS.find((p) => p.hsCode === opportunity.productHs) || HS_PRODUCTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(partner, customMessage);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-white rounded-[4px] border border-[var(--gray-300)] shadow-lg overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[var(--gray-100)] border-b border-[var(--gray-300)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--brand)]" />
            <h2 className="font-bold text-[var(--text-display)] text-sm">
              Request MINICOM Facilitated Introduction
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[var(--text-sub)] hover:text-[var(--text-display)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[var(--success)] mx-auto" />
            <h3 className="text-sm font-bold text-[var(--text-display)]">
              Introduction Request Dispatched
            </h3>
            <p className="text-xs text-[var(--text-body)] max-w-sm mx-auto">
              Your request has been logged in the MINICOM Trade Desk Officer Queue. A trade officer will review your RSB quality marks and issue a bilateral facilitation notice.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="p-3 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] space-y-2">
              <div className="text-[11px] font-bold text-[var(--brand)]">
                Bilateral Trade Facilitation Protocol
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[var(--text-sub)] block">Originating Rwandan SME:</span>
                  <span className="font-bold text-[var(--text-display)]">{sme.businessName}</span>
                  <span className="text-[10px] text-[var(--text-sub)] block">TIN: {sme.tin}</span>
                </div>
                <div>
                  <span className="text-[var(--text-sub)] block">Target Kenyan Entity:</span>
                  <span className="font-bold text-[var(--text-display)]">{partner.name}</span>
                  <span className="text-[10px] text-[var(--text-sub)] block">{partner.city}, Kenya</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] text-[11px]">
              <div>
                <span className="text-[var(--text-sub)] block">Commodity:</span>
                <span className="font-bold text-[var(--text-display)]">
                  {product.name} (HS {product.hsCode})
                </span>
              </div>
              <div>
                <span className="text-[var(--text-sub)] block">Monthly Supply:</span>
                <span className="font-bold text-[var(--text-display)]">
                  {(opportunity.capacityKgMonth / 1000).toFixed(1)} MT / month
                </span>
              </div>
              <div>
                <span className="text-[var(--text-sub)] block">Ex-Works Farmgate:</span>
                <span className="font-bold text-[var(--text-display)]">
                  RWF {opportunity.exWorksPriceRwf}/kg
                </span>
              </div>
              <div>
                <span className="text-[var(--text-sub)] block">Transit Route:</span>
                <span className="font-bold text-[var(--brand-dark)]">
                  Gatuna & Malaba OSBPs
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-display)] mb-1">
                Consignment Specification or Officer Briefing Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Include details about packaged batch readiness, sample availability, or specific contractual payment terms..."
                className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] focus:border-[var(--brand)] text-xs"
              />
            </div>

            <p className="text-[11px] text-[var(--text-sub)] leading-relaxed">
              <strong>Notice:</strong> Facilitation letters are issued directly to Kenya commercial attachés and registered enterprise representatives. The service does not guarantee private credit or transactional outcomes.
            </p>

            <div className="pt-2 border-t border-[var(--gray-300)] flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 border border-[var(--gray-300)] rounded-[4px] text-[var(--text-body)] hover:bg-[var(--gray-100)] cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[var(--brand)] text-white font-bold rounded-[4px] hover:bg-[var(--brand-dark)] cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Facilitation Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
