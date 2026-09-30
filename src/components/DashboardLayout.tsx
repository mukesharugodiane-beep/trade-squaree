/**
 * Dashboard Layout Component
 * 100% Visual Layout Clone of the RDB / Government Portal Dashboard Reference Image:
 * - Full-viewport app shell (h-screen overflow-hidden) with sticky Top Header, fixed/sticky Left Sidebar,
 *   scrollable main content area, and sticky Bottom Dashboard Footer.
 * - Refined compact typography (11px–13px) and full responsiveness across mobile (320px+), tablet (768px+), and desktop (1024px–1440px+)
 * - Standalone dashboard layout (no public website navbar or footer)
 * - Preserves 100% of Trade Square content and terminology.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingUp,
  User,
  FileText,
  Building2,
  Globe,
  ShieldCheck,
  Sliders,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  X,
  CheckCircle2,
  LogOut,
  KanbanSquare
} from 'lucide-react';
import { ActiveScreen, RwandanSME, ExportOpportunity, KenyanPartner } from '../types';
import coatOfArmsSvg from '../assets/images/Coat_of_arms_of_Rwanda.svg';
import { TradeChat } from './TradeChat';

interface DashboardLayoutProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  sme: RwandanSME;
  allSmes: RwandanSME[];
  onSelectSme: (sme: RwandanSME) => void;
  shortlistCount: number;
  pendingIntroCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAssumptions: () => void;
  onExitPortal: () => void;
  opportunity?: ExportOpportunity;
  scoredPartners?: {
    partner: KenyanPartner;
    scoreBreakdown: any;
  }[];
  onSelectPartnerDetail?: (partner: KenyanPartner) => void;
  onRequestIntroduction?: (partner: KenyanPartner) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeScreen,
  onSelectScreen,
  sme,
  allSmes,
  onSelectSme,
  shortlistCount,
  pendingIntroCount,
  onOpenAssumptions,
  onExitPortal,
  opportunity,
  scoredPartners,
  onSelectPartnerDetail,
  onRequestIntroduction,
  children
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [exportSubmenuOpen, setExportSubmenuOpen] = useState(false);
  const [partnersSubmenuOpen, setPartnersSubmenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (screen: ActiveScreen) => {
    onSelectScreen(screen);
    setMobileSidebarOpen(false);
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const topNavItems = [
    {
      id: 'dashboard-home' as ActiveScreen,
      label: 'Dashboard',
      icon: TrendingUp
    },
    {
      id: 'export-form' as ActiveScreen,
      label: 'Export Opportunity',
      icon: FileText
    },
    {
      id: 'pipeline' as ActiveScreen,
      label: 'Trade Pipeline',
      icon: Globe
    }
  ];

  const contactInitial = (sme.contactPerson || sme.businessName || 'T').trim().charAt(0).toUpperCase();

  return (
    <div className="h-screen overflow-hidden bg-[#F4F6F9] text-slate-800 flex flex-col font-sans antialiased">
      {/* =========================================================================
          STICKY TOP HEADER BAR
          ========================================================================= */}
      <header className="sticky top-0 z-40 shrink-0 w-full bg-[#F2F4F7] border-b border-slate-200/90 h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between gap-2 shadow-2xs">
        {/* Left: Mobile Menu Button + Trade Square / MINICOM Brand Mark */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('dashboard-home')}
            className="flex items-center gap-2 cursor-pointer text-left group min-w-0"
          >
            <div className="flex items-center gap-1.5 shrink-0">
              <img
                src={coatOfArmsSvg}
                alt="Republic of Rwanda Coat of Arms"
                referrerPolicy="no-referrer"
                className="h-7 sm:h-8 w-auto object-contain shrink-0"
              />
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-[#005A94] leading-none whitespace-nowrap">
                TRADE SQUARE
              </span>
            </div>

            <div className="hidden xl:flex flex-col border-l border-[#005A94]/35 pl-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-[#005A94] leading-tight">
              <span>MINICOM RWANDA</span>
              <span>NORTHERN CORRIDOR PILOT</span>
            </div>
          </button>
        </div>

        {/* Center: 3 Horizontal Navigation Tabs with Soft Blue Active Pill (#DDEBF7) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 shrink-0">
          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeScreen === item.id ||
              (item.id === 'dashboard-home' &&
                (activeScreen === 'shortlist' || activeScreen === 'match-detail'));

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#DDEBF7] text-[#005A94] font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#005A94]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: User Profile Avatar + Name + Email + Chevron Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 sm:gap-2.5 py-1 px-1.5 sm:px-2 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer text-left"
            aria-label="SME Account Menu"
          >
            {/* Circular Soft-Blue Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#DCEBF7] text-[#005A94] font-bold text-xs flex items-center justify-center shrink-0">
              {contactInitial}
            </div>

            {/* Name and Email */}
            <div className="hidden sm:flex flex-col leading-tight max-w-[150px] lg:max-w-[190px]">
              <span className="text-xs font-semibold text-slate-800 truncate">
                {sme.contactPerson}
              </span>
              <span className="text-[11px] text-slate-500 truncate">
                {sme.email}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          </button>

          {/* Dropdown Menu to switch active Rwandan SME or return to public site */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-64 sm:w-72 bg-white border border-slate-200 rounded-md shadow-lg py-1.5 z-50 text-xs text-slate-700">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <div className="font-bold text-slate-900 text-xs truncate">
                  {sme.businessName}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5 tabular-nums">
                  RDB: {sme.rdbNumber} · TIN: {sme.tin}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{sme.district} District · Active Pilot SME</span>
                </div>
              </div>

              <div className="py-1 max-h-56 overflow-y-auto">
                <div className="px-3.5 py-1 text-[10px] font-semibold text-slate-400">
                  Switch Rwandan SME Profile
                </div>
                {allSmes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onSelectSme(s);
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      sme.id === s.id ? 'font-semibold text-[#005A94] bg-[#DDEBF7]/40' : ''
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate text-xs">{s.businessName.replace(' (sample)', '')}</div>
                      <div className="text-[10px] text-slate-400">{s.contactPerson} · {s.district}</div>
                    </div>
                    {sme.id === s.id && <span className="text-[#005A94] font-bold">✓</span>}
                  </button>
                ))}
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenAssumptions();
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>Corridor Rate & Freight Assumptions</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onExitPortal();
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-[11px] text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sticky Secondary Quick-Tab Bar (Visible only on phones < md) */}
      <div className="md:hidden shrink-0 bg-[#F2F4F7] border-b border-slate-200 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {topNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeScreen === item.id ||
            (item.id === 'dashboard-home' &&
              (activeScreen === 'shortlist' || activeScreen === 'match-detail'));

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#DDEBF7] text-[#005A94] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          MAIN WORKSPACE: FIXED/STICKY LEFT SIDEBAR + SCROLLABLE CONTENT + STICKY FOOTER
          ========================================================================= */}
      <div className="flex-1 flex w-full relative min-w-0 min-h-0 overflow-hidden">
        {/* Mobile Backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}

        {/* -----------------------------------------------------------------------
            LEFT SIDEBAR (#005A94 Deep Rwandan Blue)
            ----------------------------------------------------------------------- */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 top-14 sm:top-16 lg:top-0 z-30 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] lg:h-full bg-[#005A94] text-white flex flex-col justify-between transition-all duration-200 ease-in-out shrink-0 ${
            sidebarCollapsed ? 'w-16' : 'w-56'
          } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="overflow-y-auto">
            {/* Top Collapse Button Bar with subtle bottom divider line */}
            <div className="px-3 py-2.5 border-b border-white/15 flex items-center justify-between lg:justify-end">
              <span className="lg:hidden text-[11px] font-semibold text-white/80 pl-1">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => {
                  if (mobileSidebarOpen) {
                    setMobileSidebarOpen(false);
                  } else {
                    setSidebarCollapsed(!sidebarCollapsed);
                  }
                }}
                className="w-7 h-7 rounded bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronsRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronsLeft className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Primary Navigation Links */}
            <div className="px-2.5 py-3.5 space-y-1">
              {/* 1. Dashboard (Dashboard Home) */}
              <button
                type="button"
                onClick={() => handleNavClick('dashboard-home')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs transition-colors cursor-pointer ${
                  activeScreen === 'dashboard-home'
                    ? 'bg-[#2673A6] text-white font-semibold'
                    : 'text-white/90 hover:bg-white/10 font-medium'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 shrink-0 text-white" />
                {!sidebarCollapsed && <span className="truncate">Dashboard</span>}
              </button>

              {/* 2. SME Profile */}
              <button
                type="button"
                onClick={() => handleNavClick('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs transition-colors cursor-pointer ${
                  activeScreen === 'profile'
                    ? 'bg-[#2673A6] text-white font-semibold'
                    : 'text-white/90 hover:bg-white/10 font-medium'
                }`}
              >
                <User className="w-3.5 h-3.5 shrink-0 text-white" />
                {!sidebarCollapsed && <span className="truncate">SME Profile</span>}
              </button>

              {/* 3. Export Opportunity & Shortlist */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (sidebarCollapsed) {
                      handleNavClick('export-form');
                    } else {
                      setExportSubmenuOpen(!exportSubmenuOpen);
                      handleNavClick('export-form');
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs transition-colors cursor-pointer ${
                    activeScreen === 'export-form' ||
                    activeScreen === 'shortlist' ||
                    activeScreen === 'match-detail'
                      ? 'bg-[#2673A6] text-white font-semibold'
                      : 'text-white/90 hover:bg-white/10 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-3.5 h-3.5 shrink-0 text-white" />
                    {!sidebarCollapsed && <span className="truncate">Export Opportunity</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-white/80 transition-transform shrink-0 ${
                        exportSubmenuOpen ||
                        activeScreen === 'shortlist' ||
                        activeScreen === 'match-detail'
                          ? 'rotate-180'
                          : ''
                      }`}
                    />
                  )}
                </button>

                {!sidebarCollapsed &&
                  (exportSubmenuOpen ||
                    activeScreen === 'export-form' ||
                    activeScreen === 'shortlist' ||
                    activeScreen === 'match-detail') && (
                    <div className="mt-1 ml-6 pl-2.5 border-l border-white/20 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => handleNavClick('export-form')}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] transition-colors cursor-pointer ${
                          activeScreen === 'export-form'
                            ? 'text-white font-semibold bg-white/10'
                            : 'text-white/80 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Opportunity Parameters
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavClick('shortlist')}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] flex items-center justify-between transition-colors cursor-pointer ${
                          activeScreen === 'shortlist' || activeScreen === 'match-detail'
                            ? 'text-white font-semibold bg-white/10'
                            : 'text-white/80 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>Partner Shortlist</span>
                        <span className="text-[10px] font-mono tabular-nums text-white/90">
                          ({shortlistCount})
                        </span>
                      </button>
                    </div>
                  )}
              </div>

              {/* 4. Trade Pipeline & Officer View */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (sidebarCollapsed) {
                      handleNavClick('pipeline');
                    } else {
                      setPartnersSubmenuOpen(!partnersSubmenuOpen);
                      handleNavClick('pipeline');
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs transition-colors cursor-pointer ${
                    activeScreen === 'pipeline' || activeScreen === 'officer-view'
                      ? 'bg-[#2673A6] text-white font-semibold'
                      : 'text-white/90 hover:bg-white/10 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-white" />
                    {!sidebarCollapsed && <span className="truncate">Trade Pipeline</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-white/80 transition-transform shrink-0 ${
                        partnersSubmenuOpen ||
                        activeScreen === 'pipeline' ||
                        activeScreen === 'officer-view'
                          ? 'rotate-180'
                          : ''
                      }`}
                    />
                  )}
                </button>

                {!sidebarCollapsed &&
                  (partnersSubmenuOpen ||
                    activeScreen === 'pipeline' ||
                    activeScreen === 'officer-view') && (
                    <div className="mt-1 ml-6 pl-2.5 border-l border-white/20 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => handleNavClick('pipeline')}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                          activeScreen === 'pipeline'
                            ? 'text-white font-semibold bg-white/10'
                            : 'text-white/80 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <KanbanSquare className="w-3 h-3 shrink-0" />
                        <span className="truncate">Opportunity Pipeline</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavClick('officer-view')}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] flex items-center justify-between transition-colors cursor-pointer ${
                          activeScreen === 'officer-view'
                            ? 'text-white font-semibold bg-white/10'
                            : 'text-white/80 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <ShieldCheck className="w-3 h-3 shrink-0" />
                          <span className="truncate">MINICOM Officer View</span>
                        </span>
                        {pendingIntroCount > 0 && (
                          <span className="text-[10px] font-mono tabular-nums text-amber-300 font-bold">
                            ({pendingIntroCount})
                          </span>
                        )}
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Bottom Sidebar Utilities */}
          <div className="p-2.5 border-t border-white/15 space-y-1">
            <button
              type="button"
              onClick={onOpenAssumptions}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[11px] font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Corridor Assumptions"
            >
              <Sliders className="w-3.5 h-3.5 shrink-0 text-white/80" />
              {!sidebarCollapsed && <span className="truncate">Corridor Assumptions</span>}
            </button>

            <button
              type="button"
              onClick={onExitPortal}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[11px] font-semibold text-white hover:bg-white/15 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0 text-white/90" />
              {!sidebarCollapsed && <span className="truncate">Logout</span>}
            </button>
          </div>
        </aside>

        {/* -----------------------------------------------------------------------
            RIGHT COLUMN: SCROLLABLE MAIN CONTENT + CENTERED TRADECHAT OVERLAY
            ----------------------------------------------------------------------- */}
        <div className="relative flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          <main
            ref={mainScrollRef}
            className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 w-full"
          >
            {children}
          </main>

          {/* Centered OpenAI Voice-Mode Animated TradeChat Overlay */}
          <TradeChat
            sme={sme}
            opportunity={opportunity}
            scoredPartners={scoredPartners}
            onSelectPartnerDetail={onSelectPartnerDetail}
            onRequestIntroduction={onRequestIntroduction}
            onNavigateScreen={onSelectScreen}
            onOpenAssumptions={onOpenAssumptions}
          />
        </div>
      </div>
    </div>
  );
};
