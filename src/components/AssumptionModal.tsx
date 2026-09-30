/**
 * Modal to view and adjust corridor exchange rate and freight assumptions
 */

import React, { useState } from 'react';
import { X, Sliders, Check, RotateCcw } from 'lucide-react';
import { CorridorAssumptions } from '../types';
import { INITIAL_ASSUMPTIONS } from '../data/seedData';

interface AssumptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assumptions: CorridorAssumptions;
  onSaveAssumptions: (newAssumptions: CorridorAssumptions) => void;
}

export const AssumptionModal: React.FC<AssumptionModalProps> = ({
  isOpen,
  onClose,
  assumptions,
  onSaveAssumptions
}) => {
  const [exchangeRate, setExchangeRate] = useState<number>(assumptions.exchangeRateKesToRwf);
  const [transitCost, setTransitCost] = useState<number>(assumptions.corridorTransitCostRwfPerKg);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAssumptions({
      ...assumptions,
      exchangeRateKesToRwf: Number(exchangeRate),
      corridorTransitCostRwfPerKg: Number(transitCost)
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setExchangeRate(INITIAL_ASSUMPTIONS.exchangeRateKesToRwf);
    setTransitCost(INITIAL_ASSUMPTIONS.corridorTransitCostRwfPerKg);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-assumptions-title"
    >
      <div className="w-full max-w-lg bg-white rounded-[4px] border border-[var(--gray-300)] shadow-lg overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[var(--gray-100)] border-b border-[var(--gray-300)]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--brand)]" />
            <h2 id="modal-assumptions-title" className="text-sm font-bold text-[var(--text-display)]">
              Corridor Economic Assumptions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[var(--text-sub)] hover:text-[var(--text-display)] rounded-[4px] cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] text-[var(--text-body)] leading-relaxed">
            <p className="font-semibold text-[var(--brand)] mb-1">
              Corridor: Kigali to Nairobi via Gatuna and Malaba Border Posts
            </p>
            <p>
              These assumptions directly compute landed prices and match competitiveness scores for all prospective Kenyan buyers and distributors.
            </p>
          </div>

          {/* Field 1: Exchange Rate */}
          <div className="space-y-1.5">
            <label htmlFor="input-exchange-rate" className="block font-semibold text-[var(--text-display)]">
              Exchange Rate (KES to RWF)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-sub)] font-medium">1 KES =</span>
              <input
                id="input-exchange-rate"
                type="number"
                step="0.05"
                min="5"
                max="20"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                className="w-32 px-3 py-1.5 border border-[var(--gray-300)] rounded-[4px] text-xs font-semibold focus:border-[var(--brand)]"
                required
              />
              <span className="text-[var(--text-display)] font-semibold">RWF</span>
              <span className="text-[var(--text-sub)] text-[11px] ml-auto">
                (1 RWF ≈ {(1 / (exchangeRate || 1)).toFixed(4)} KES)
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-sub)]">
              Central Bank of Rwanda (BNR) & Central Bank of Kenya reference corridor baseline.
            </p>
          </div>

          {/* Field 2: Corridor Transit Freight Cost */}
          <div className="space-y-1.5">
            <label htmlFor="input-transit-cost" className="block font-semibold text-[var(--text-display)]">
              Corridor Transit Freight Cost (Kigali to Nairobi)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="input-transit-cost"
                type="number"
                step="1"
                min="10"
                max="300"
                value={transitCost}
                onChange={(e) => setTransitCost(parseFloat(e.target.value) || 0)}
                className="w-32 px-3 py-1.5 border border-[var(--gray-300)] rounded-[4px] text-xs font-semibold focus:border-[var(--brand)]"
                required
              />
              <span className="text-[var(--text-display)] font-semibold">RWF per kg</span>
              <span className="text-[var(--text-sub)] text-[11px] ml-auto">
                (≈ {(transitCost / (exchangeRate || 1)).toFixed(2)} KES/kg)
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-sub)]">
              Standard road transport rate via Gatuna OSBP and Malaba OSBP including border handling.
            </p>
          </div>

          {/* Field 3: EAC Customs Duty Regime (Fixed per treaty) */}
          <div className="p-2.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] flex items-center justify-between">
            <div>
              <div className="font-semibold text-[var(--text-display)]">EAC Common External Tariff (CET)</div>
              <div className="text-[11px] text-[var(--text-sub)]">Originating goods under AfCFTA / EAC Certificate of Origin</div>
            </div>
            <div className="font-bold text-[var(--success)] bg-white px-2 py-1 border border-[var(--gray-300)] rounded-[4px]">
              0.0% Duty Free
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[var(--gray-300)] flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[var(--text-sub)] hover:text-[var(--text-display)] border border-[var(--gray-300)] rounded-[4px] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-[var(--text-body)] hover:bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[var(--brand)] text-white text-xs font-semibold rounded-[4px] hover:bg-[var(--brand-dark)] cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Saved!
                  </>
                ) : (
                  'Apply Assumptions'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
