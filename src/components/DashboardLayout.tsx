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
  KanbanSquare,
  Settings,
  Camera,
  Save
} from 'lucide-react';
import {
  ActiveScreen,
  RwandanSME,
  ExportOpportunity,
  KenyanPartner,
  District,
  Certification
} from '../types';
import { HS_PRODUCTS } from '../data/seedData';
import coatOfArmsSvg from '../assets/images/Coat_of_arms_of_Rwanda.svg';
import defaultProfileWoman from '../assets/images/african_woman_exporter_1790779779290.jpg';
import defaultProfileMan from '../assets/images/african_male_distributor_1790779805199.jpg';
import defaultProfileSpecialist from '../assets/images/african_female_specialist_1790779793400.jpg';
import { TradeChat } from './TradeChat';

interface DashboardLayoutProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  sme: RwandanSME;
  allSmes: RwandanSME[];
  onSelectSme: (sme: RwandanSME) => void;
  onUpdateSme?: (updated: RwandanSME) => void;
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

const PRESET_AVATARS = [
  defaultProfileWoman,
  defaultProfileMan,
  defaultProfileSpecialist
];

const DISTRICTS: District[] = [
  'Musanze',
  'Rubavu',
  'Rwamagana',
  'Huye',
  'Nyagatare',
  'Kayonza',
  'Gicumbi',
  'Rusizi'
];

const AVAILABLE_CERTIFICATIONS: Certification[] = [
  'RSB S-Mark',
  'HACCP',
  'GlobalG.A.P.',
  'Organic'
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeScreen,
  onSelectScreen,
  sme,
  allSmes,
  onSelectSme,
  onUpdateSme,
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
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'identity' | 'business'>('identity');
  const [exportSubmenuOpen, setExportSubmenuOpen] = useState(false);
  const [partnersSubmenuOpen, setPartnersSubmenuOpen] = useState(false);

  // Editable Profile & Business Settings State
  const [editContactPerson, setEditContactPerson] = useState(sme.contactPerson);
  const [editEmail, setEditEmail] = useState(sme.email);
  const [editPhone, setEditPhone] = useState(sme.phone);
  const [editBusinessName, setEditBusinessName] = useState(sme.businessName);
  const [editRdbNumber, setEditRdbNumber] = useState(sme.rdbNumber);
  const [editTin, setEditTin] = useState(sme.tin);
  const [editDistrict, setEditDistrict] = useState<District>(sme.district);
  const [editSelectedHsCode, setEditSelectedHsCode] = useState<string>(sme.selectedHsCode);
  const [editProducts, setEditProducts] = useState<string[]>(sme.products);
  const [editCertifications, setEditCertifications] = useState<Certification[]>(sme.certifications);
  const [editMonthlyCapacityKg, setEditMonthlyCapacityKg] = useState<number>(sme.monthlyCapacityKg);
  const [editExWorksPriceRwf, setEditExWorksPriceRwf] = useState<number>(sme.exWorksPriceRwf);
  const [editAvatarUrl, setEditAvatarUrl] = useState<string>(
    sme.avatarUrl || defaultProfileWoman
  );
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainScrollRef = useRef<HTMLElement>(null);

  // Sync editable form state whenever active SME changes
  useEffect(() => {
    setEditContactPerson(sme.contactPerson);
    setEditEmail(sme.email);
    setEditPhone(sme.phone);
    setEditBusinessName(sme.businessName);
    setEditRdbNumber(sme.rdbNumber);
    setEditTin(sme.tin);
    setEditDistrict(sme.district);
    setEditSelectedHsCode(sme.selectedHsCode);
    setEditProducts(sme.products);
    setEditCertifications(sme.certifications);
    setEditMonthlyCapacityKg(sme.monthlyCapacityKg);
    setEditExWorksPriceRwf(sme.exWorksPriceRwf);
    setEditAvatarUrl(sme.avatarUrl || defaultProfileWoman);
  }, [sme]);

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

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleCertification = (cert: Certification) => {
    setEditCertifications((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };

  const handleTogglePortfolioProduct = (hsCode: string) => {
    setEditProducts((prev) => {
      const exists = prev.includes(hsCode);
      const next = exists ? prev.filter((p) => p !== hsCode) : [...prev, hsCode];
      return next.length > 0 ? next : [hsCode];
    });
  };

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const ensuredProducts = editProducts.includes(editSelectedHsCode)
      ? editProducts
      : [editSelectedHsCode, ...editProducts];

    const updatedSme: RwandanSME = {
      ...sme,
      contactPerson: editContactPerson.trim() || sme.contactPerson,
      email: editEmail.trim() || sme.email,
      phone: editPhone.trim() || sme.phone,
      businessName: editBusinessName.trim() || sme.businessName,
      rdbNumber: editRdbNumber.trim() || sme.rdbNumber,
      tin: editTin.trim() || sme.tin,
      district: editDistrict,
      selectedHsCode: editSelectedHsCode,
      products: ensuredProducts,
      certifications: editCertifications,
      monthlyCapacityKg: Number(editMonthlyCapacityKg) || sme.monthlyCapacityKg,
      exWorksPriceRwf: Number(editExWorksPriceRwf) || sme.exWorksPriceRwf,
      avatarUrl: editAvatarUrl
    };
    if (onUpdateSme) {
      onUpdateSme(updatedSme);
    }
    setProfileSavedToast(true);
    setTimeout(() => {
      setProfileSavedToast(false);
      setIsProfileSettingsOpen(false);
    }, 900);
  };

  const topNavItems = [
    {
      id: 'dashboard-home' as ActiveScreen,
      label: 'Dashboard',
      icon: TrendingUp
    },
    {
      id: 'partners-finder' as ActiveScreen,
      label: 'Partners Finder',
      icon: Globe
    },
    {
      id: 'export-form' as ActiveScreen,
      label: 'Export Opportunity',
      icon: FileText
    },
    {
      id: 'pipeline' as ActiveScreen,
      label: 'Trade Pipeline',
      icon: Building2
    }
  ];

  const activeAvatarSrc = sme.avatarUrl || editAvatarUrl || defaultProfileWoman;

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

        {/* Right: User Profile Picture Image + Name + Email + Chevron Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 sm:gap-2.5 py-1 px-1.5 sm:px-2.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer text-left"
            aria-label="User Profile Menu"
          >
            {/* Circular Profile Picture Image with Online Status Dot */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0">
              <img
                src={activeAvatarSrc}
                alt={sme.contactPerson}
                className="w-full h-full rounded-full object-cover border-2 border-[#005A94] shadow-2xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#1A8754] ring-2 ring-white" />
            </div>

            {/* Name and Email */}
            <div className="hidden sm:flex flex-col leading-tight max-w-[150px] lg:max-w-[190px]">
              <span className="text-xs font-bold text-slate-800 truncate">
                {sme.contactPerson}
              </span>
              <span className="text-[11px] text-slate-500 truncate">
                {sme.email}
              </span>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform ${
                profileDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu: Shows Profile Summary, Profile Settings (Edit Profile), and Logout */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-lg shadow-xl py-1.5 z-50 text-xs text-slate-700">
              {/* Top User Summary */}
              <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center gap-2.5">
                <img
                  src={activeAvatarSrc}
                  alt={sme.contactPerson}
                  className="w-9 h-9 rounded-full object-cover border border-[#005A94]/40 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-xs truncate">
                    {sme.contactPerson}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {sme.email}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5 truncate">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{sme.businessName.replace(' (sample)', '')}</span>
                  </div>
                </div>
              </div>

              {/* Menu Options: Profile Settings & Logout */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setIsProfileSettingsOpen(true);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-[#DDEBF7]/50 hover:text-[#005A94] font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#005A94]" />
                  <span>Profile Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onExitPortal();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
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

              {/* 2. Partners Finder (AI Regional Trade Intelligence) */}
              <button
                type="button"
                onClick={() => handleNavClick('partners-finder')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs transition-colors cursor-pointer ${
                  activeScreen === 'partners-finder'
                    ? 'bg-[#2673A6] text-white font-semibold'
                    : 'text-white/90 hover:bg-white/10 font-medium'
                }`}
              >
                <Globe className="w-3.5 h-3.5 shrink-0 text-white" />
                {!sidebarCollapsed && <span className="truncate">Partners Finder</span>}
              </button>

              {/* 2. Export Opportunity & Shortlist */}
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

      {/* =========================================================================
          PROFILE SETTINGS MODAL (#profile-settings-container)
          Handles BOTH Personal Identity AND Complete SME Business / Export Settings
          ========================================================================= */}
      {isProfileSettingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-[2px] p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-settings-title"
        >
          <div
            id="profile-settings-container"
            className="w-full max-w-xl bg-white rounded-lg border border-slate-200/95 shadow-xl overflow-hidden text-xs flex flex-col max-h-[90vh]"
          >
            {/* Top RDB Institutional Header Bar */}
            <div className="px-4 py-2.5 bg-[#005A94] text-white flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={coatOfArmsSvg}
                  alt="Rwanda Coat of Arms"
                  className="w-5 h-5 object-contain shrink-0"
                />
                <div className="flex items-center gap-2 truncate">
                  <h2 id="profile-settings-title" className="font-bold text-xs sm:text-[13px] tracking-tight truncate">
                    Personal Identity & SME Business Settings
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1A8754] text-white text-[10px] font-semibold shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>RDB Verified</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProfileSettingsOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
                aria-label="Close Profile Settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* RDB-Style Segmented Tab Bar: Personal Identity vs Business & Export Settings */}
            <div className="px-4 pt-2.5 bg-[#F8FAFC] border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSettingsTab('identity')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-t-md text-xs border-b-2 transition-colors cursor-pointer ${
                    settingsTab === 'identity'
                      ? 'border-[#005A94] text-[#005A94] bg-white font-bold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>1. Personal Identity</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsTab('business')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-t-md text-xs border-b-2 transition-colors cursor-pointer ${
                    settingsTab === 'business'
                      ? 'border-[#005A94] text-[#005A94] bg-white font-bold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>2. Business & Export Settings</span>
                </button>
              </div>

              <span className="hidden sm:inline text-[10px] text-slate-500 font-semibold pb-1">
                RDB: {editRdbNumber} · TIN: {editTin}
              </span>
            </div>

            <form onSubmit={handleSaveProfileSettings} className="flex flex-col flex-1 min-h-0">
              <div className="p-4 space-y-3.5 overflow-y-auto flex-1">
                {settingsTab === 'identity' ? (
                  /* =========================================================
                     TAB 1: PERSONAL IDENTITY & REPRESENTATIVE ACCOUNT
                     ========================================================= */
                  <>
                    {/* Compact Identity & Avatar Strip */}
                    <div className="p-3 bg-[#F8FAFC] border border-slate-200/80 rounded-md flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={editAvatarUrl}
                            alt={editContactPerson}
                            className="w-14 h-14 rounded-full object-cover border-2 border-[#005A94] shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#005A94] hover:bg-[#2673A6] text-white flex items-center justify-center shadow-2xs border border-white transition-colors cursor-pointer"
                            title="Upload Profile Photo"
                          >
                            <Camera className="w-2.5 h-2.5" />
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileUpload}
                            className="hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="text-[11px] font-bold text-slate-800">
                            Representative Profile Picture
                          </div>
                          <div className="flex items-center gap-1.5">
                            {PRESET_AVATARS.map((presetUrl, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setEditAvatarUrl(presetUrl)}
                                className={`w-6 h-6 rounded-full overflow-hidden border transition-transform cursor-pointer ${
                                  editAvatarUrl === presetUrl
                                    ? 'border-[#005A94] ring-1 ring-[#005A94] scale-105'
                                    : 'border-slate-300 opacity-75 hover:opacity-100'
                                }`}
                                title={`Select photo ${idx + 1}`}
                              >
                                <img src={presetUrl} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-2 py-0.5 rounded bg-[#DDEBF7] hover:bg-[#cbe0f3] text-[#005A94] font-semibold text-[10px] transition-colors cursor-pointer"
                            >
                              Upload Photo
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quick Pilot Account Switcher */}
                      <div className="min-w-[180px]">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Switch Active Pilot Profile
                        </label>
                        <select
                          value={sme.id}
                          onChange={(e) => {
                            const found = allSmes.find((s) => s.id === e.target.value);
                            if (found) onSelectSme(found);
                          }}
                          className="w-full h-7 px-2 border border-slate-300 rounded text-[11px] font-semibold text-slate-800 bg-white focus:border-[#005A94] focus:outline-none cursor-pointer"
                        >
                          {allSmes.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.contactPerson} — {s.businessName.replace(' (sample)', '')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Personal Identity Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Authorized Representative Full Name
                        </label>
                        <input
                          type="text"
                          value={editContactPerson}
                          onChange={(e) => setEditContactPerson(e.target.value)}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded-md text-xs text-slate-900 focus:border-[#005A94] focus:ring-1 focus:ring-[#005A94]/20 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Official Email Address
                        </label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded-md text-xs text-slate-900 focus:border-[#005A94] focus:ring-1 focus:ring-[#005A94]/20 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Mobile / WhatsApp Phone
                        </label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded-md text-xs text-slate-900 focus:border-[#005A94] focus:ring-1 focus:ring-[#005A94]/20 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  /* =========================================================
                     TAB 2: BUSINESS IDENTITY, RDB/RRA & EXPORT SETTINGS
                     ========================================================= */
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Registered SME Business Name
                        </label>
                        <input
                          type="text"
                          value={editBusinessName}
                          onChange={(e) => setEditBusinessName(e.target.value)}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded-md text-xs text-slate-900 focus:border-[#005A94] focus:ring-1 focus:ring-[#005A94]/20 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Operating District (Rwanda)
                        </label>
                        <select
                          value={editDistrict}
                          onChange={(e) => setEditDistrict(e.target.value as District)}
                          className="w-full h-8 px-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:border-[#005A94] focus:ring-1 focus:ring-[#005A94]/20 focus:outline-none cursor-pointer"
                        >
                          {DISTRICTS.map((d) => (
                            <option key={d} value={d}>
                              {d} District
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          RDB Registration Number
                        </label>
                        <input
                          type="text"
                          value={editRdbNumber}
                          onChange={(e) => setEditRdbNumber(e.target.value)}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded-md text-xs text-slate-900 focus:border-[#005A94] focus:ring-1 focus:ring-[#005A94]/20 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          RRA Tax ID (TIN)
                        </label>
                        <input
                          type="text"
                          value={editTin}
                          onChange={(e) => setEditTin(e.target.value)}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded-md text-xs text-slate-900 focus:border-[#005A94] focus:ring-1 focus:ring-[#005A94]/20 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Primary Export Commodity
                        </label>
                        <select
                          value={editSelectedHsCode}
                          onChange={(e) => setEditSelectedHsCode(e.target.value)}
                          className="w-full h-8 px-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:border-[#005A94] focus:ring-1 focus:ring-[#005A94]/20 focus:outline-none cursor-pointer"
                        >
                          {HS_PRODUCTS.map((prod) => (
                            <option key={prod.hsCode} value={prod.hsCode}>
                              HS {prod.hsCode} — {prod.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Monthly Capacity (kg)
                        </label>
                        <input
                          type="number"
                          min={500}
                          step={500}
                          value={editMonthlyCapacityKg}
                          onChange={(e) => setEditMonthlyCapacityKg(Number(e.target.value))}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded-md text-xs text-slate-900 focus:border-[#005A94] focus:ring-1 focus:ring-[#005A94]/20 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Ex-Works Price (RWF/kg)
                        </label>
                        <input
                          type="number"
                          min={100}
                          step={50}
                          value={editExWorksPriceRwf}
                          onChange={(e) => setEditExWorksPriceRwf(Number(e.target.value))}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded-md text-xs text-slate-900 focus:border-[#005A94] focus:ring-1 focus:ring-[#005A94]/20 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Quality Certifications & Export Portfolio */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Standards & Quality Marks
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {AVAILABLE_CERTIFICATIONS.map((cert) => {
                            const active = editCertifications.includes(cert);
                            return (
                              <button
                                key={cert}
                                type="button"
                                onClick={() => handleToggleCertification(cert)}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                                  active
                                    ? 'bg-[#DDEBF7] border-[#005A94] text-[#005A94]'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                {active ? '✓ ' : ''}{cert}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Registered Commodity Portfolio
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {HS_PRODUCTS.map((prod) => {
                            const active = editProducts.includes(prod.hsCode);
                            return (
                              <button
                                key={prod.hsCode}
                                type="button"
                                onClick={() => handleTogglePortfolioProduct(prod.hsCode)}
                                className={`px-2 py-1 rounded text-[10px] font-semibold border transition-colors cursor-pointer ${
                                  active
                                    ? 'bg-emerald-50 border-[#1A8754] text-[#1A8754]'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                {active ? '✓ ' : ''}HS {prod.hsCode}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {profileSavedToast && (
                  <div className="px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-[#1A8754] text-[11px] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Identity and SME business settings saved to active session.</span>
                  </div>
                )}
              </div>

              {/* Compact Bottom Action Bar */}
              <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setSettingsTab(settingsTab === 'identity' ? 'business' : 'identity')
                  }
                  className="text-[11px] font-semibold text-[#005A94] hover:underline cursor-pointer"
                >
                  {settingsTab === 'identity'
                    ? 'Switch to Business & Export Settings →'
                    : '← Back to Personal Identity'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProfileSettingsOpen(false)}
                    className="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#005A94] hover:bg-[#2673A6] text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save All Settings</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
