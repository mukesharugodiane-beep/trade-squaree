/**
 * Dashboard Home Screen ("Dashboard")
 * Clean executive canvas overlaid by the centered TradeChat interface in DashboardLayout.
 */

import React from 'react';
import { KenyanPartner, RwandanSME, ExportOpportunity, ActiveScreen } from '../types';

interface DashboardHomeProps {
  sme: RwandanSME;
  opportunity: ExportOpportunity;
  scoredPartners: {
    partner: KenyanPartner;
    scoreBreakdown: any;
  }[];
  savedPartnerIds: string[];
  searchQuery: string;
  onToggleSavePartner: (partnerId: string) => void;
  onSelectPartnerDetail: (partner: KenyanPartner) => void;
  onRequestIntroduction: (partner: KenyanPartner) => void;
  onNavigateScreen: (screen: ActiveScreen) => void;
  onOpenAssumptions: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = () => {
  return <div className="w-full h-full min-h-[calc(100vh-5rem)]" />;
};
