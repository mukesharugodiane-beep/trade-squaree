/**
 * Secondary Navigation Bar for Trade Square Portal
 * Provides responsive, clean access across all 6 key pilot screens.
 */

import React from 'react';
import {
  Building2,
  FileSpreadsheet,
  ListFilter,
  BarChart3,
  KanbanSquare,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { ActiveScreen, RwandanSME } from '../types';

interface NavigationProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  selectedSme: RwandanSME;
  shortlistCount: number;
  pendingIntroCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeScreen,
  onSelectScreen,
  selectedSme,
  shortlistCount,
  pendingIntroCount
}) => {
  const tabs = [
    {
      id: 'profile' as ActiveScreen,
      label: 'SME Profile & Sign In',
      shortLabel: 'Profile',
      icon: Building2,
      sub: selectedSme.businessName.replace(' (sample)', '')
    },
    {
      id: 'export-form' as ActiveScreen,
      label: 'Export Opportunity Form',
      shortLabel: 'Export Form',
      icon: FileSpreadsheet,
      sub: 'Define capacity & pricing'
    },
    {
      id: 'shortlist' as ActiveScreen,
      label: 'Partner Shortlist',
      shortLabel: 'Shortlist',
      icon: ListFilter,
      badge: `${shortlistCount}`,
      sub: 'Evidence-backed matches'
    },
    {
      id: 'match-detail' as ActiveScreen,
      label: 'Match Detail ("Why this match?")',
      shortLabel: 'Match Detail',
      icon: BarChart3,
      sub: 'Signal audit & procedures'
    },
    {
      id: 'pipeline' as ActiveScreen,
      label: 'Opportunity Pipeline',
      shortLabel: 'Pipeline',
      icon: KanbanSquare,
      sub: 'Deal & sample tracking'
    },
    {
      id: 'officer-view' as ActiveScreen,
      label: 'MINICOM Officer View',
      shortLabel: 'Officer View',
      icon: ShieldAlert,
      badge: pendingIntroCount > 0 ? `${pendingIntroCount} new` : undefined,
      badgeHighlight: pendingIntroCount > 0,
      sub: 'Queue & market gaps'
    }
  ];

  return (
    <div className="w-full bg-white border-b border-[var(--gray-300)] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Active SME Banner Strip */}
        <div className="py-2 border-b border-[var(--gray-100)] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text-sub)]">Active SME:</span>
            <span className="font-bold text-[var(--text-display)]">
              {selectedSme.businessName}
            </span>
            <span className="text-[var(--text-sub)] hidden sm:inline">
              (RDB: {selectedSme.rdbNumber} · TIN: {selectedSme.tin} · District: {selectedSme.district})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectScreen('profile')}
              className="text-xs text-[var(--brand)] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              Switch SME profile
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex overflow-x-auto no-scrollbar py-1 gap-1 text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeScreen === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectScreen(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 border-b-2 rounded-t-[4px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'border-[var(--brand)] text-[var(--brand)] bg-[var(--brand-light)]/40 font-bold'
                    : 'border-transparent text-[var(--text-body)] hover:text-[var(--brand)] hover:bg-[var(--gray-100)]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--brand)]' : 'text-[var(--text-sub)]'}`} />
                <span className="whitespace-nowrap">{tab.label}</span>

                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] border ${
                      tab.badgeHighlight
                        ? 'bg-[var(--warning)] text-white border-[var(--warning)]'
                        : isActive
                        ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                        : 'bg-[var(--gray-100)] text-[var(--text-body)] border-[var(--gray-300)]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
