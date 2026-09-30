/**
 * Screen 5: Opportunity Pipeline Board
 * Kanban / Stage board with the exact specified stages:
 * - New
 * - Contacted
 * - Interested
 * - Requirements exchanged
 * - Quotation or sample
 * - Negotiation
 * - Deal
 * Plus terminal stages:
 * - No response
 * - Not interested
 */

import React, { useState } from 'react';
import {
  KanbanSquare,
  Plus,
  ArrowRight,
  MoveRight,
  MapPin,
  Calendar,
  MessageSquare,
  CheckCircle2,
  XCircle,
  FileCheck
} from 'lucide-react';
import {
  PipelineItem,
  PipelineStage,
  KenyanPartner,
  RwandanSME
} from '../types';

interface PipelineScreenProps {
  pipelineItems: PipelineItem[];
  allPartners: KenyanPartner[];
  currentSme: RwandanSME;
  onUpdateStage: (itemId: string, newStage: PipelineStage) => void;
  onAddNote: (itemId: string, noteText: string) => void;
  onSelectPartnerDetail: (partner: KenyanPartner) => void;
}

export const PipelineScreen: React.FC<PipelineScreenProps> = ({
  pipelineItems,
  allPartners,
  currentSme,
  onUpdateStage,
  onAddNote,
  onSelectPartnerDetail
}) => {
  const [activeTabGroup, setActiveTabGroup] = useState<'active' | 'terminal'>('active');
  const [selectedItemForNote, setSelectedItemForNote] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');

  const activeStages: PipelineStage[] = [
    'New',
    'Contacted',
    'Interested',
    'Requirements exchanged',
    'Quotation or sample',
    'Negotiation',
    'Deal'
  ];

  const terminalStages: PipelineStage[] = [
    'No response',
    'Not interested'
  ];

  // Filter items for the current active SME
  const smeItems = pipelineItems.filter((item) => item.smeId === currentSme.id);

  const handleAddNoteSubmit = (e: React.FormEvent, itemId: string) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    onAddNote(itemId, `${dateStr}: ${noteInput.trim()}`);
    setNoteInput('');
    setSelectedItemForNote(null);
  };

  const getPartner = (partnerId: string) => {
    return allPartners.find((p) => p.id === partnerId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[var(--gray-300)] rounded-[4px] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-sub)] mb-1">
              <span>MINICOM Trade Square</span>
              <span>/</span>
              <span>Deal Flow</span>
              <span>/</span>
              <span className="text-[var(--text-display)] font-semibold">Opportunity Pipeline</span>
            </div>
            <h1 className="text-xl font-bold text-[var(--text-display)] tracking-tight">
              Export Opportunity Commercial Pipeline
            </h1>
            <p className="text-xs text-[var(--text-body)] mt-1">
              Track bilateral negotiations from initial contact to sample exchange and finalized trade contracts for {currentSme.businessName}.
            </p>
          </div>

          {/* Toggle between Active Pipeline and Outcome Stages */}
          <div className="flex items-center gap-1 bg-[var(--gray-100)] p-1 rounded-[4px] border border-[var(--gray-300)] text-xs">
            <button
              type="button"
              onClick={() => setActiveTabGroup('active')}
              className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors cursor-pointer ${
                activeTabGroup === 'active'
                  ? 'bg-white text-[var(--brand)] shadow-xs'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-display)]'
              }`}
            >
              Active Deal Stages (7)
            </button>
            <button
              type="button"
              onClick={() => setActiveTabGroup('terminal')}
              className={`px-3 py-1.5 rounded-[4px] font-semibold transition-colors cursor-pointer ${
                activeTabGroup === 'terminal'
                  ? 'bg-white text-[var(--brand)] shadow-xs'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-display)]'
              }`}
            >
              Closed / Outcome Stages (2)
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Column View */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1100px]">
          {(activeTabGroup === 'active' ? activeStages : terminalStages).map((stage) => {
            const itemsInStage = smeItems.filter((i) => i.stage === stage);

            return (
              <div
                key={stage}
                className="flex-1 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] flex flex-col max-w-[340px]"
              >
                {/* Column Header */}
                <div className="p-3 bg-white border-b border-[var(--gray-300)] rounded-t-[4px] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[var(--text-display)]">
                      {stage}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] bg-[var(--gray-100)] border border-[var(--gray-300)] text-[var(--text-sub)]">
                    {itemsInStage.length}
                  </span>
                </div>

                {/* Items in Column */}
                <div className="p-2 space-y-2.5 flex-1 min-h-[350px]">
                  {itemsInStage.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-6 text-center text-[11px] text-[var(--text-sub)] italic">
                      No partners currently in this stage.
                    </div>
                  ) : (
                    itemsInStage.map((item) => {
                      const partner = getPartner(item.partnerId);
                      if (!partner) return null;

                      return (
                        <div
                          key={item.id}
                          className="bg-white border border-[var(--gray-300)] rounded-[4px] p-3 shadow-xs space-y-2 text-xs hover:border-[var(--brand)] transition-colors"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <div className="font-bold text-[var(--text-display)] leading-snug">
                                {partner.name}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-[var(--text-sub)] mt-0.5">
                                <span className="flex items-center gap-0.5">
                                  <MapPin className="w-3 h-3 text-[var(--brand)]" />
                                  {partner.city}
                                </span>
                                <span>·</span>
                                <span className="font-medium text-[var(--text-body)]">
                                  {partner.role}
                                </span>
                              </div>
                            </div>

                            <span className="text-[9px] uppercase font-bold text-[var(--text-sub)] bg-[var(--gray-100)] px-1 py-0.5 border border-[var(--gray-300)] rounded-[4px]">
                              Sample
                            </span>
                          </div>

                          {/* Key deal metrics */}
                          <div className="pt-1 border-t border-[var(--gray-100)] grid grid-cols-2 gap-2 text-[11px]">
                            {item.estimatedVolumeKg && (
                              <div>
                                <span className="text-[var(--text-sub)] block text-[10px]">Target Volume:</span>
                                <span className="font-semibold text-[var(--text-display)]">
                                  {(item.estimatedVolumeKg / 1000).toFixed(1)} MT
                                </span>
                              </div>
                            )}

                            {item.negotiatedPriceKesPerKg && (
                              <div>
                                <span className="text-[var(--text-sub)] block text-[10px]">Agreed Price:</span>
                                <span className="font-bold text-[var(--brand)]">
                                  KES {item.negotiatedPriceKesPerKg}/kg
                                </span>
                              </div>
                            )}

                            {item.sampleSentDate && (
                              <div className="col-span-2 text-[10px] text-[var(--success)] font-medium flex items-center gap-1">
                                <FileCheck className="w-3 h-3" />
                                <span>Sample dispatched: {item.sampleSentDate}</span>
                              </div>
                            )}
                          </div>

                          {/* Recent Activity Log */}
                          <div className="bg-[var(--gray-100)] p-2 rounded-[4px] border border-[var(--gray-300)] text-[11px] space-y-1">
                            <div className="font-semibold text-[var(--text-sub)] flex items-center justify-between text-[10px] uppercase">
                              <span>Activity Log ({item.notes.length})</span>
                              <button
                                type="button"
                                onClick={() => setSelectedItemForNote(item.id)}
                                className="text-[var(--brand)] hover:underline flex items-center gap-0.5 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                Add note
                              </button>
                            </div>

                            <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                              {item.notes.map((n, idx) => (
                                <div key={idx} className="text-[10px] text-[var(--text-body)] leading-relaxed">
                                  • {n}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Move Stage Selector */}
                          <div className="pt-1 flex items-center justify-between gap-1 text-[11px]">
                            <button
                              type="button"
                              onClick={() => onSelectPartnerDetail(partner)}
                              className="text-[var(--brand)] font-semibold hover:underline"
                            >
                              Detail
                            </button>

                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-[var(--text-sub)]">Move:</span>
                              <select
                                value={item.stage}
                                onChange={(e) => onUpdateStage(item.id, e.target.value as PipelineStage)}
                                className="bg-white border border-[var(--gray-300)] rounded-[4px] text-[10px] font-semibold py-0.5 px-1 focus:border-[var(--brand)]"
                              >
                                <optgroup label="Active Stages">
                                  {activeStages.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </optgroup>
                                <optgroup label="Outcome">
                                  {terminalStages.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </optgroup>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Note Modal */}
      {selectedItemForNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-white rounded-[4px] border border-[var(--gray-300)] shadow-lg overflow-hidden text-xs">
            <div className="px-5 py-3.5 bg-[var(--gray-100)] border-b border-[var(--gray-300)] flex items-center justify-between">
              <h3 className="font-bold text-[var(--text-display)] text-sm">
                Add Commercial Activity Note
              </h3>
              <button
                onClick={() => setSelectedItemForNote(null)}
                className="text-[var(--text-sub)] hover:text-[var(--text-display)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => handleAddNoteSubmit(e, selectedItemForNote)} className="p-5 space-y-3">
              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Log Entry (e.g. Meeting outcome, sample dispatched via Gatuna, contract clause)
                </label>
                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Record discussions, courier airway bill, or specification revisions..."
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] focus:border-[var(--brand)] text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForNote(null)}
                  className="px-3 py-1.5 border border-[var(--gray-300)] rounded-[4px] hover:bg-[var(--gray-100)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[var(--brand)] text-white font-semibold rounded-[4px] hover:bg-[var(--brand-dark)] cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
