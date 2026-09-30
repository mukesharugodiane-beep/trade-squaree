/**
 * MINICOM Header Component
 * Strict compliance with Government of Rwanda web guideline and MINICOM specifications:
 * - National coat of arms placeholder (labelled empty box; emblem not drawn).
 * - Gap between symbol and text is 1/3 symbol height (16px for 48px symbol).
 * - Text height is 1/2 symbol height (24px), vertically centred, letter spacing -2%.
 * - Clear space around logo is 1/3 symbol height (16px).
 * - Top menu: Home, About, Directorate Generals, Services, Updates, Publications.
 * - Language switch (English | Kinyarwanda, with notice).
 * - GOV.RW link.
 */

import React from 'react';
import { Globe, ExternalLink, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateHome: () => void;
  onOpenAssumptions: () => void;
  exchangeRateKesToRwf: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onNavigateHome,
  onOpenAssumptions,
  exchangeRateKesToRwf
}) => {
  // Navigation labels with native speaker review note when in Kinyarwanda
  const navItems = [
    { en: 'Home', rw: 'Ahabanza' },
    { en: 'About', rw: 'Ibyerekeye' },
    { en: 'Directorate Generals', rw: 'Ubuyobozi Bukuru' },
    { en: 'Services', rw: 'Serivisi' },
    { en: 'Updates', rw: 'Amakuru Mashya' },
    { en: 'Publications', rw: 'Inyandiko' }
  ];

  return (
    <header className="w-full bg-white border-b border-[var(--gray-300)] text-[var(--text-body)]">
      {/* Top Government Official Utility Strip */}
      <div className="w-full bg-[var(--gray-100)] border-b border-[var(--gray-300)] text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[var(--text-sub)]">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--success)]" aria-hidden="true"></span>
            <span className="font-medium text-[var(--text-display)]">Official Portal of the Republic of Rwanda</span>
            <span className="hidden md:inline text-[var(--gray-500)]">·</span>
            <span className="hidden md:inline">Ministry of Trade and Industry (MINICOM) Pilot</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Exchange rate quick display & assumptions trigger */}
            <button
              onClick={onOpenAssumptions}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--brand)] hover:underline font-medium cursor-pointer"
              title="Click to view and edit corridor exchange rate and freight assumptions"
            >
              <span>Exchange Rate Assumption: 1 KES = {exchangeRateKesToRwf} RWF</span>
              <span className="text-[10px] uppercase tracking-wider bg-[var(--brand-light)] px-1.5 py-0.5 border border-[var(--brand)] text-[var(--brand)] rounded-[4px]">
                Editable
              </span>
            </button>

            {/* Language switch */}
            <div className="flex items-center gap-1 text-xs border-l border-[var(--gray-300)] pl-3">
              <Globe className="w-3.5 h-3.5 text-[var(--text-sub)]" aria-hidden="true" />
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 py-0.5 font-medium rounded-[4px] cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[var(--brand)] text-white'
                    : 'text-[var(--text-body)] hover:text-[var(--brand)]'
                }`}
                aria-pressed={currentLang === 'en'}
              >
                English
              </button>
              <span className="text-[var(--gray-500)]">|</span>
              <button
                type="button"
                onClick={() => onLanguageChange('rw')}
                className={`px-1.5 py-0.5 font-medium rounded-[4px] cursor-pointer ${
                  currentLang === 'rw'
                    ? 'bg-[var(--brand)] text-white'
                    : 'text-[var(--text-body)] hover:text-[var(--brand)]'
                }`}
                aria-pressed={currentLang === 'rw'}
              >
                Kinyarwanda
              </button>
            </div>

            {/* GOV.RW portal link */}
            <a
              href="https://gov.rw"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-xs text-[var(--brand)] hover:underline inline-flex items-center gap-1 border-l border-[var(--gray-300)] pl-3"
              title="Official Portal of the Republic of Rwanda"
            >
              GOV.RW
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* Main MINICOM Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-2">
          {/* Logo container with strict clear space = 16px (1/3 of 48px height) */}
          <div className="p-[16px] flex items-center">
            {/* Official Coat of Arms of Rwanda */}
            <img
              src="https://www.minicom.gov.rw/fileadmin/Minaffet/resources/public/images/Coat_of_arms_of_Rwanda.svg"
              alt="Coat of arms of Rwanda"
              className="w-[48px] h-[48px] object-contain flex-shrink-0"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/Coat_of_arms_of_Rwanda.svg')) {
                  target.src = '/Coat_of_arms_of_Rwanda.svg';
                }
              }}
            />

            {/* Gap between symbol and text is 1/3 of symbol height = 16px */}
            <div className="w-[16px] flex-shrink-0" aria-hidden="true" />

            {/* Text height is 1/2 of symbol height = 24px, vertically centred, letter spacing -2% */}
            <div
              onClick={onNavigateHome}
              className="h-[24px] flex flex-col justify-center cursor-pointer select-none"
              style={{ letterSpacing: '-0.02em' }}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-[17px] font-extrabold text-[var(--brand)] leading-none">
                  MINICOM
                </span>
                <span className="text-xs font-semibold text-[var(--text-display)] leading-none border-l border-[var(--gray-300)] pl-2">
                  Ministry of Trade and Industry
                </span>
              </div>
              <span className="text-[10px] text-[var(--text-sub)] tracking-normal mt-0.5">
                Republic of Rwanda
              </span>
            </div>
          </div>

          {/* Trade Square Pilot Banner Identifier */}
          <div className="px-4 py-2 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] self-start md:self-center my-2 md:my-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--brand)] flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-[var(--brand)]">
                  TRADE SQUARE PILOT
                </div>
                <div className="text-[11px] text-[var(--text-body)]">
                  Rwanda–Kenya Corridor (Kigali–Nairobi via Gatuna & Malaba)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Menu Bar */}
        <nav
          className="border-t border-[var(--gray-300)] py-2 flex flex-wrap items-center justify-between text-xs"
          aria-label="MINICOM Main Navigation"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-medium text-[var(--text-body)]">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={onNavigateHome}
                className="hover:text-[var(--brand)] hover:underline py-1 transition-colors cursor-pointer"
              >
                {currentLang === 'en' ? item.en : item.rw}
              </button>
            ))}
          </div>

          {currentLang === 'rw' && (
            <span className="text-[11px] text-[var(--text-sub)] italic bg-[var(--gray-100)] px-2 py-0.5 rounded-[4px]">
              * Kinyarwanda navigation labels: to be reviewed by a native speaker
            </span>
          )}
        </nav>
      </div>
    </header>
  );
};
