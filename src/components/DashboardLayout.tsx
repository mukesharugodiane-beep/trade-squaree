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
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  User,
  Building2,
  Globe,
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
  Bell,
  Search,
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
  searchQuery,
  onSearchChange,
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'identity' | 'business'>('identity');
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
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
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
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setSearchDropdownOpen(false);
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

  const activeAvatarSrc = sme.avatarUrl || editAvatarUrl || defaultProfileWoman;
  const userFirstName = (sme.contactPerson || '').trim().split(/\s+/)[0] || 'Exporter';

  // Filtered global search results for partners & screens
  const trimmedSearch = (searchQuery || '').trim().toLowerCase();
  const matchingPartners = trimmedSearch
    ? (scoredPartners || [])
        .filter(({ partner }) => {
          const haystack = `${partner.name} ${partner.city} ${partner.country || 'Kenya'} ${partner.role}`.toLowerCase();
          return haystack.includes(trimmedSearch);
        })
        .slice(0, 4)
    : (scoredPartners || []).slice(0, 3);

  const quickNavPages: { id: ActiveScreen; label: string; subtitle: string }[] = [
    { id: 'dashboard-home', label: 'Dashboard', subtitle: 'Executive KPI summary & partner hub' },
    { id: 'trends', label: 'Market Trends', subtitle: 'Supply-demand analytics & corridor margins' },
    { id: 'partners-finder', label: 'Partners Finder', subtitle: 'AI regional buyer discovery & voice match' },
    { id: 'pipeline', label: 'Opportunity Pipeline', subtitle: 'Active corridor deals & negotiations' }
  ];

  const matchingNavPages = trimmedSearch
    ? quickNavPages.filter(
        (p) =>
          p.label.toLowerCase().includes(trimmedSearch) ||
          p.subtitle.toLowerCase().includes(trimmedSearch)
      )
    : quickNavPages.slice(0, 3);

  const notificationItems = [
    {
      id: 'notif-match',
      title: `${shortlistCount} Verified Corridor Buyers Matched`,
      detail: `Ready for HS ${opportunity?.productHs || sme.selectedHsCode} (${sme.monthlyCapacityKg.toLocaleString()} kg/mo capacity)`,
      time: 'Just now',
      screen: 'partners-finder' as ActiveScreen
    },
    {
      id: 'notif-trends',
      title: 'Northern Corridor Demand Update',
      detail: 'Realtime-Venus detected strong buyer absorption via Gatuna–Malaba OSBP',
      time: '12m ago',
      screen: 'trends' as ActiveScreen
    },
    {
      id: 'notif-pipeline',
      title: `Trade Pipeline (${pendingIntroCount} Active)`,
      detail: 'Track active bilateral partner introductions and deal stages',
      time: '1h ago',
      screen: 'pipeline' as ActiveScreen
    }
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#F4F6F9] text-slate-800 flex flex-col font-sans antialiased">
      {/* =========================================================================
          STICKY TOP HEADER BAR
          Left: Brand Mark | Middle: Responsive Global Search | Right: Notification, Settings & First Name
          ========================================================================= */}
      <header className="sticky top-0 z-40 shrink-0 w-full bg-[#F2F4F7] border-b border-slate-200/90 h-14 sm:h-16 px-2.5 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 shadow-2xs">
        {/* Left: Mobile Menu Button + Trade Square / MINICOM Brand Mark */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
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
                className="h-6 sm:h-8 w-auto object-contain shrink-0"
              />
              <span className="hidden xs:inline sm:inline text-xs sm:text-base font-extrabold tracking-tight text-[#005A94] leading-none whitespace-nowrap">
                TRADE SQUARE
              </span>
            </div>

            <div className="hidden xl:flex flex-col border-l border-[#005A94]/35 pl-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-[#005A94] leading-tight">
              <span>MINICOM RWANDA</span>
              <span>NORTHERN CORRIDOR PILOT</span>
            </div>
          </button>
        </div>

        {/* Middle: Fully Responsive Global Search Bar */}
        <div
          ref={searchContainerRef}
          className="relative flex-1 max-w-md min-w-[120px] mx-1 sm:mx-4"
        >
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 sm:left-3 pointer-events-none shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchDropdownOpen(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setSearchDropdownOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && matchingPartners.length > 0 && trimmedSearch) {
                  setSearchDropdownOpen(false);
                  if (onSelectPartnerDetail) {
                    onSelectPartnerDetail(matchingPartners[0].partner);
                  } else {
                    handleNavClick('partners-finder');
                  }
                }
                if (e.key === 'Escape') {
                  setSearchDropdownOpen(false);
                }
              }}
              placeholder="Search buyers, corridors, HS codes..."
              aria-label="Global search"
              className="w-full h-8 sm:h-9 pl-8 sm:pl-9 pr-7 rounded-lg bg-white border border-slate-300/90 text-[11px] sm:text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#005A94] focus:ring-2 focus:ring-[#005A94]/15 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setSearchDropdownOpen(false);
                }}
                aria-label="Clear search"
                className="absolute right-2 p-0.5 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Interactive Global Search Results Dropdown */}
          {searchDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs max-h-80 overflow-y-auto">
              {/* Matching Corridor Buyers */}
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>{trimmedSearch ? 'Matching Corridor Buyers' : 'Top Verified Buyers'}</span>
                <span className="font-mono">{matchingPartners.length}</span>
              </div>
              {matchingPartners.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {matchingPartners.map(({ partner, scoreBreakdown }) => (
                    <button
                      key={partner.id}
                      type="button"
                      onClick={() => {
                        setSearchDropdownOpen(false);
                        if (onSelectPartnerDetail) {
                          onSelectPartnerDetail(partner);
                        } else {
                          handleNavClick('partners-finder');
                        }
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-[#DDEBF7]/40 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-[11px] truncate">
                          {partner.name.replace(' (sample)', '')}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {partner.city}, {partner.country || 'Kenya'} · {partner.role}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#005A94] shrink-0">
                        {scoreBreakdown?.totalScore ?? 88}% Match
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-2 text-[11px] text-slate-500">
                  No direct buyer matches for "{searchQuery}".
                </div>
              )}

              {/* Quick Workspace Navigation */}
              {matchingNavPages.length > 0 && (
                <>
                  <div className="px-3 pt-2 pb-1 mt-1 border-t border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Workspace Views
                  </div>
                  {matchingNavPages.map((nav) => (
                    <button
                      key={nav.id}
                      type="button"
                      onClick={() => {
                        setSearchDropdownOpen(false);
                        handleNavClick(nav.id);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    >
                      <span className="font-semibold text-[#005A94] text-[11px] truncate">
                        {nav.label}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        {nav.subtitle}
                      </span>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Notification Icon + Settings Icon + User Avatar & First Name Only */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* 1. Notification Icon & Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-slate-200/90 bg-white hover:bg-[#DDEBF7]/50 hover:border-[#005A94]/40 text-slate-700 hover:text-[#005A94] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1A8754] ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Notifications</span>
                  <button
                    type="button"
                    onClick={() => setUnreadNotifications(false)}
                    className="text-[10px] font-semibold text-[#005A94] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notificationItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false);
                        setUnreadNotifications(false);
                        handleNavClick(item.screen);
                      }}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer block"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-[11px] truncate">
                          {item.title}
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-400 shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-600 mt-0.5 leading-snug">
                        {item.detail}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Settings Icon Button */}
          <button
            type="button"
            onClick={() => {
              setProfileDropdownOpen(false);
              setNotificationsOpen(false);
              setIsProfileSettingsOpen(true);
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-slate-200/90 bg-white hover:bg-[#DDEBF7]/50 hover:border-[#005A94]/40 text-slate-700 hover:text-[#005A94] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            title="Profile & Business Settings"
            aria-label="Open Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* 3. User Profile Trigger: Avatar + First Name ONLY (Full Username & Email Hidden) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 py-1 px-1.5 sm:px-2.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer text-left"
              aria-label="User Profile Menu"
            >
              {/* Circular Profile Picture Image with Online Status Dot */}
              <div className="relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full shrink-0">
                <img
                  src={activeAvatarSrc}
                  alt={userFirstName}
                  className="w-full h-full rounded-full object-cover border-2 border-[#005A94] shadow-2xs"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#1A8754] ring-2 ring-white" />
              </div>

              {/* First Name Only (Full Username and Email Hidden in Navbar) */}
              <span className="text-xs font-bold text-slate-800 truncate max-w-[80px] sm:max-w-[110px]">
                {userFirstName}
              </span>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform ${
                  profileDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu: Shows First Name & Company, Profile Settings, and Logout */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-lg shadow-xl py-1.5 z-50 text-xs text-slate-700">
                {/* Top User Summary */}
                <div className="px-3.5 py-2 border-b border-slate-100 flex items-center gap-2.5">
                  <img
                    src={activeAvatarSrc}
                    alt={userFirstName}
                    className="w-8 h-8 rounded-full object-cover border border-[#005A94]/40 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-xs truncate">
                      {userFirstName}
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
        </div>
      </header>

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
                <LayoutDashboard className="w-3.5 h-3.5 shrink-0 text-white" />
                {!sidebarCollapsed && <span className="truncate">Dashboard</span>}
              </button>

              {/* 2. Trends (Market Trends & Supply-Demand Intelligence) */}
              <button
                type="button"
                onClick={() => handleNavClick('trends')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs transition-colors cursor-pointer ${
                  activeScreen === 'trends'
                    ? 'bg-[#2673A6] text-white font-semibold'
                    : 'text-white/90 hover:bg-white/10 font-medium'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 shrink-0 text-white" />
                {!sidebarCollapsed && <span className="truncate">Trends</span>}
              </button>

              {/* 3. Partners Finder (AI Regional Trade Intelligence) */}
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

              {/* 4. Trade Pipeline */}
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
                    activeScreen === 'pipeline'
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
                        partnersSubmenuOpen || activeScreen === 'pipeline'
                          ? 'rotate-180'
                          : ''
                      }`}
                    />
                  )}
                </button>

                {!sidebarCollapsed &&
                  (partnersSubmenuOpen || activeScreen === 'pipeline') && (
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
