/**
 * Public Header Component
 * Fully responsive across all devices with clean 4-option navigation and
 * 4-language support powered by Google Cloud Translation REST API:
 * - Languages: English (en), Ikinyarwanda (rw), Kiswahili (sw), Français (fr)
 * - Left: Official Coat of Arms of Rwanda SVG (compact 34px) + TRADE SQUARE MINICOM branding
 * - Desktop Nav (lg:flex): Exactly 4 core, essential options (Home, How it works, For SMEs, Regional partners)
 * - Desktop Actions: [🌐 Language ⌄] (rounded pill with all 4 languages) + [👤 Login]
 * - Mobile & Tablet: Compact language switcher (EN/RW/SW/FR), Login, and mobile drawer
 * - Mobile Drawer: 4 core options with min-44px touch targets, 4-language selector pills, and portal access
 */

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Menu, X, ChevronDown, User, Check, ChevronRight } from 'lucide-react';
import { PageId, PublicLanguage } from '../types/publicSite';
import { TRANSLATIONS } from '../data/translations';

interface PublicHeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  currentLang: PublicLanguage;
  onLanguageChange: (lang: PublicLanguage) => void;
  onOpenSignIn: () => void;
  onOpenDashboard?: () => void;
}

const SUPPORTED_LANGUAGES: { code: PublicLanguage; label: string; shortCode: string; flag: string }[] = [
  { code: 'en', label: 'English', shortCode: 'EN', flag: '🇬🇧' },
  { code: 'rw', label: 'Ikinyarwanda', shortCode: 'RW', flag: '🇷🇼' },
  { code: 'sw', label: 'Kiswahili', shortCode: 'SW', flag: '🇰🇪' },
  { code: 'fr', label: 'Français', shortCode: 'FR', flag: '🇫🇷' }
];

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  currentPage,
  onNavigate,
  currentLang,
  onLanguageChange,
  onOpenSignIn,
  onOpenDashboard
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[currentLang];

  // Track scroll position to transition header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Exactly 4 essential navigation options
  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: t.navHome },
    { id: 'how-it-works', label: t.navHowItWorks },
    { id: 'for-smes', label: t.navForSmes },
    { id: 'for-regional-partners', label: t.navForPartners }
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const cycleMobileLanguage = () => {
    const currentIndex = SUPPORTED_LANGUAGES.findIndex((l) => l.code === currentLang);
    const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
    onLanguageChange(SUPPORTED_LANGUAGES[nextIndex].code);
  };

  return (
    <>
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[#005A94] focus:font-bold focus:border focus:border-[#005A94] focus:rounded-md focus:shadow-xl"
      >
        Skip to main content
      </a>

      {/* STICKY GLASS HEADER */}
      <header
        className={`w-full sticky top-0 z-50 text-white transition-all duration-300 ${
          isScrolled || currentPage !== 'home'
            ? 'bg-[#005A94]/95 backdrop-blur-md shadow-lg border-b border-white/15'
            : 'bg-transparent border-b border-transparent shadow-none'
        }`}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Main Navigation"
        >
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left: Official Coat of Arms & Compact Brand Typography */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2 sm:gap-2.5 text-left group focus-visible:outline-2 focus-visible:outline-[#DDEBF7] rounded-lg p-0.5 transition-opacity hover:opacity-95 cursor-pointer"
                aria-label="Trade Square homepage"
              >
                {/* Official Coat of Arms of Rwanda */}
                <img
                  src="https://www.minicom.gov.rw/fileadmin/Minaffet/resources/public/images/Coat_of_arms_of_Rwanda.svg"
                  alt="Coat of Arms of Rwanda"
                  className="h-7 sm:h-8 md:h-9 w-auto object-contain shrink-0 filter drop-shadow-xs"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
                <div
                  className="hidden h-7 w-7 rounded-full bg-white/10 border border-white/20 items-center justify-center text-[10px] font-bold text-white shrink-0"
                  aria-hidden="true"
                >
                  RW
                </div>

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-white/20 hidden sm:block" aria-hidden="true" />

                {/* Brand Typography */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm sm:text-base font-bold tracking-tight text-white leading-none whitespace-nowrap">
                      {t.brandTitle}
                    </span>
                    <span className="bg-[#DDEBF7] text-[#005A94] font-extrabold text-[9px] px-1 py-0.2 rounded tracking-wider uppercase">
                      {t.ministryBadge}
                    </span>
                  </div>
                  <span className="text-[9px] text-[#DDEBF7] tracking-wider font-medium mt-0.5 hidden md:block whitespace-nowrap">
                    {t.ministryName}
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Center Navigation Links (Exactly 4 Core Options) */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-8 ml-auto mr-6 xl:mr-8">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`text-[13px] xl:text-sm font-semibold tracking-normal transition-colors cursor-pointer relative py-1 whitespace-nowrap ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-white/80 hover:text-white'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#DDEBF7] rounded-full shadow-[0_0_8px_#DDEBF7]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Desktop Action Utilities (4-Language Dropdown + Login) */}
            <div className="hidden lg:flex items-center space-x-3 shrink-0">
              {/* Language Switcher Dropdown */}
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#2673A6]/80 hover:bg-[#2673A6] text-white border border-white/25 transition-colors cursor-pointer"
                  aria-expanded={langDropdownOpen}
                  aria-label="Select language"
                >
                  <Globe className="w-3.5 h-3.5 text-[#DDEBF7]" />
                  <span>{currentLangObj.label}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-[#005A94] border border-white/25 rounded-xl shadow-xl py-1.5 z-50 text-white">
                    <div className="px-3 py-1 text-[10px] text-[#DDEBF7] uppercase tracking-wider font-semibold border-b border-white/15 mb-1">
                      Choose Language
                    </div>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          currentLang === lang.code
                            ? 'bg-[#2673A6] text-white font-bold'
                            : 'hover:bg-white/10 text-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </div>
                        {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-[#DDEBF7]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* [📊 Dashboard] Button */}
              {onOpenDashboard && (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-xs font-semibold transition-all duration-150 text-white bg-white/10 hover:bg-white/20 border border-white/30 h-8 px-3.5 cursor-pointer shadow-xs"
                  aria-label="Open Pilot Dashboard"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Dashboard</span>
                </button>
              )}

              {/* [👤 Login] Button */}
              <button
                type="button"
                onClick={onOpenSignIn}
                className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-xs font-semibold transition-all duration-150 text-white bg-[#005A94] hover:bg-[#2673A6] border border-white/30 shadow-sm h-8 px-4 cursor-pointer"
                aria-label="Sign in"
              >
                <User className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                <span>{t.btnSignIn}</span>
              </button>
            </div>

            {/* Mobile & Tablet Controls (< lg) */}
            <div className="lg:hidden flex items-center space-x-1.5 sm:space-x-2">
              {/* Responsive 4-Language Cycle Button */}
              <button
                type="button"
                onClick={cycleMobileLanguage}
                className="text-[11px] font-bold bg-[#2673A6]/80 hover:bg-[#2673A6] text-white border border-white/25 px-2.5 py-1 rounded-full uppercase transition-colors cursor-pointer flex items-center gap-1"
                aria-label={`Current language: ${currentLangObj.label}. Click to switch.`}
              >
                <span>{currentLangObj.flag}</span>
                <span>{currentLangObj.shortCode}</span>
              </button>

              {/* Compact Login Pill Button */}
              <button
                type="button"
                onClick={onOpenSignIn}
                className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-[#005A94] hover:bg-[#2673A6] border border-white/30 px-3 py-1 rounded-full shadow-sm cursor-pointer whitespace-nowrap"
                aria-label="Sign in"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t.btnSignIn}</span>
              </button>

              {/* Hamburger Drawer Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5 text-white" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile & Tablet Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#005A94] border-t border-white/15 px-4 sm:px-6 py-4 text-white shadow-2xl animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-2 max-w-lg mx-auto">
              <div className="pb-2.5 mb-1 border-b border-white/15 flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-wider text-[#DDEBF7] font-semibold">
                  {t.mobileMenu} · Language
                </span>
                {/* 4-Language Pills on Mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => onLanguageChange(lang.code)}
                      className={`px-2.5 py-1.5 text-xs rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5 ${
                        currentLang === lang.code
                          ? 'bg-white text-[#005A94] shadow-sm'
                          : 'text-white/80 hover:text-white bg-white/10'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clean 4 Core Drawer Links */}
              <div className="flex flex-col space-y-1 py-1">
                {navItems.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center justify-between text-left py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors min-h-[44px] cursor-pointer ${
                        isActive
                          ? 'bg-[#2673A6] text-white font-bold border-l-4 border-[#DDEBF7]'
                          : 'text-[#DDEBF7] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive ? (
                        <Check className="w-4 h-4 text-[#DDEBF7]" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Portal Access Button in Drawer */}
              <div className="pt-3 border-t border-white/15 flex flex-col gap-2 mt-1">
                {onOpenDashboard && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDashboard();
                    }}
                    className="w-full text-center py-2.5 px-4 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/30 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center shadow-md gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Open Pilot Dashboard</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSignIn();
                  }}
                  className="w-full text-center py-2.5 px-4 rounded-full text-xs font-bold text-white bg-[#2673A6] hover:bg-[#004876] border border-white/30 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center shadow-md gap-1.5"
                >
                  <User className="w-4 h-4" />
                  <span>{t.btnSignIn}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
