/**
 * Page 1: Home Page
 * Fully responsive across all devices (Mobile 320px+, Tablet 768px+, Desktop 1024px+, Large screens 1440px+):
 * - Unified with the Dashboard Sidebar Blue (#005A94, #2673A6, #DDEBF7) across all homepage sections
 * - Fluid typography for titles and subtitles that scale smoothly
 * - Symmetric grid for cards (1-col on phone, 2-col balanced on tablet, 3-col on desktop)
 * - Smooth moving video background with poster fallback
 * - Full multilingual support
 */

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  User,
  TrendingUp
} from 'lucide-react';
import { PageId, PublicLanguage } from '../types/publicSite';
import { TRANSLATIONS } from '../data/translations';
import { HowItWorksHighlights } from '../components/HowItWorksHighlights';
import { WhoTradeSquareIsFor } from '../components/WhoTradeSquareIsFor';
import { CreateAccountDropdown, AccountCreationType } from '../components/CreateAccountDropdown';
import heroPosterImg from '../assets/images/rwanda_summit_stage_1790763828776.jpg';

interface HomePageProps {
  onNavigate: (page: PageId, accountType?: AccountCreationType) => void;
  onOpenSignIn: () => void;
  currentLang: PublicLanguage;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSignIn, currentLang }) => {
  const [activeHeadlineIndex, setActiveHeadlineIndex] = useState<number>(0);

  const t = TRANSLATIONS[currentLang];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeadlineIndex((prev) => (prev + 1) % t.dynamicHeadlines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [t.dynamicHeadlines.length]);

  return (
    <div className="w-full flex flex-col">
      {/* =========================================================================
          HERO SECTION (Unified with Sidebar Blue #005A94)
          ========================================================================= */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center -mt-14 sm:-mt-16 pt-24 sm:pt-32 pb-20 sm:pb-28 bg-[#005A94] overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* Full-bleed HTML5 Video with Cinematic Zoom */}
        <div className="absolute -inset-6 sm:-inset-10 overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center scale-110 sm:scale-115 lg:scale-125 transform origin-center select-none pointer-events-none"
            poster={heroPosterImg}
          >
            <source src="/videos/rwanda-osaka-expo-2025.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Seamless Vignette & Gradient Overlays using Sidebar Blue (#005A94) */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#005A94]/65 via-[#005A94]/25 to-[#005A94]/95 z-[1] pointer-events-none"
          aria-hidden="true"
        />

        {/* Ambient subtle bottom feathered mist in #005A94 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 sm:h-72 bg-gradient-to-b from-transparent via-[#005A94]/80 to-[#005A94] z-[1] pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero Main Content Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative z-10 w-full">
          {/* Main Title */}
          <h1
            id="hero-title"
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-2 sm:mb-4 tracking-tight max-w-5xl mx-auto leading-[1.12] sm:leading-[1.08] drop-shadow-[0_2px_12px_rgba(0,90,148,0.9)]"
          >
            {t.heroMainTitle}
          </h1>

          {/* Dynamic Pulsing Subtitle */}
          <div className="min-h-[3.5rem] sm:min-h-[4.5rem] flex items-center justify-center px-2 sm:px-4 my-1 sm:my-2">
            <h2 className="text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-[#DDEBF7] to-white bg-clip-text text-transparent text-center leading-snug animate-pulse drop-shadow-[0_2px_10px_rgba(0,90,148,0.85)]">
              {t.dynamicHeadlines[activeHeadlineIndex]}
            </h2>
          </div>

          {/* Core Hero Description */}
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-[#DDEBF7] font-normal mb-8 sm:mb-10 max-w-3xl px-2 sm:px-4 mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,90,148,0.85)]">
            {t.heroSentence}
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 w-full max-w-xs sm:max-w-none px-2 sm:px-0 relative z-30">
            {/* Create Account Button with Business / Partner Dropdown */}
            <CreateAccountDropdown
              label={t.btnRequestAccess}
              onSelectAccountType={(type) => onNavigate('contact', type)}
              variant="hero"
              align="left"
            />

            {/* Sign In / Login Button */}
            <button
              type="button"
              onClick={onOpenSignIn}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs sm:text-sm font-bold text-white bg-[#005A94] hover:bg-[#2673A6] border border-white/30 transition-all shadow-xl h-11 sm:h-12 px-7 sm:px-8 cursor-pointer group"
              aria-label="Sign in"
            >
              <User className="w-4 h-4 text-white" aria-hidden="true" />
              <span>{t.btnSignIn}</span>
            </button>
          </div>

          {/* =========================================================================
               FLOATING HERO CARDS (100% Visual Match to Attached Reference Image)
               - Dark smoked translucent frosted glass outer shell
               - Staggered vertical offsets on desktop
               - Inner white-bordered metric & glowing green dot-sparkline box
               - 3 circular white badge rows below preserving all existing text & actions
              ========================================================================= */}
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 xl:gap-12 items-start text-left px-1 sm:px-4">
            {/* =====================================================================
                CARD 1: Sample Shortlist Match Preview (Left Staggered Box)
                ===================================================================== */}
            <div className="lg:mt-8 bg-[#0F172A]/45 hover:bg-[#0F172A]/55 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.38)] transition-all duration-300 flex flex-col justify-between">
              {/* Top Card Title */}
              <h3 className="text-sm sm:text-[15px] font-bold text-white leading-snug mb-3.5">
                {t.sampleCompanyName}
              </h3>

              {/* Inner White-Bordered Metric & Sparkline Box */}
              <div className="border border-white/65 rounded-xl p-4 sm:p-4.5 bg-white/[0.02] mb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                      94
                    </div>
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-white/80 mt-1">
                      {t.sampleCardTag}
                    </span>
                  </div>

                  <div className="flex flex-col items-start text-left">
                    <span className="text-[#22C55E] text-xs font-semibold flex items-center gap-1 leading-tight">
                      <span>↑</span>
                      <span>{t.sampleStrongMatch}</span>
                    </span>
                    <span className="text-xs text-white/95 font-normal mt-0.5">
                      {t.sampleScoreLabel}
                    </span>
                  </div>
                </div>

                {/* Glowing Green Connected-Dot Sparkline (Card 1 Pattern: flat then sharp rise) */}
                <div className="mt-4 pt-1">
                  <svg
                    viewBox="0 0 240 46"
                    className="w-full h-11 overflow-visible"
                    aria-hidden="true"
                  >
                    <defs>
                      <filter id="heroGlow1" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#22C55E" floodOpacity="0.85" />
                      </filter>
                    </defs>
                    <path
                      d="M 10 36 L 34 36 L 58 36 L 82 36 L 106 36 L 130 34.5 L 154 34.5 L 178 36 L 202 36 C 214 36, 222 22, 230 10"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      filter="url(#heroGlow1)"
                    />
                    {[
                      [10, 36],
                      [34, 36],
                      [58, 36],
                      [82, 36],
                      [106, 36],
                      [130, 34.5],
                      [154, 34.5],
                      [178, 36],
                      [202, 36],
                      [230, 10]
                    ].map(([cx, cy], idx) => (
                      <circle
                        key={idx}
                        cx={cx}
                        cy={cy}
                        r="2.6"
                        fill="#DCFCE7"
                        stroke="#22C55E"
                        strokeWidth="1.5"
                        filter="url(#heroGlow1)"
                      />
                    ))}
                  </svg>
                </div>
              </div>

              {/* Bottom 3 White-Circle Avatar Rows + Preserved Action */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="w-4 h-4 rounded-full bg-[#6D28D9] text-white flex items-center justify-center">
                      <MapPin className="w-2.5 h-2.5" />
                    </span>
                  </span>
                  <span className="text-white/95 font-medium leading-snug">
                    {t.sampleLocation} · {t.samplePartnerType} ·{' '}
                    <span className="font-mono text-[11px] text-white/80">{t.sampleKraPin}</span>
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <span className="w-4 h-4 rounded-full bg-[#0284C7] text-white flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </span>
                  </span>
                  <div className="text-white/95 leading-snug">
                    <span className="font-semibold block">{t.sampleEvidenceBadge}</span>
                    <span className="text-[11px] text-white/80">{t.sampleEvidenceDesc}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                      <span className="w-4 h-4 rounded-full bg-[#1D4ED8] text-white text-[9px] font-extrabold flex items-center justify-center">
                        TS
                      </span>
                    </span>
                    <span className="text-[11px] text-white/85 truncate">
                      {t.sampleDisclaimer}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenSignIn}
                    className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#DCFCE7] hover:text-white transition-colors cursor-pointer shrink-0"
                  >
                    <span>{t.samplePreviewBtn}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* =====================================================================
                CARD 2: Three-Step Summary Card (Center Lowest Staggered Box)
                ===================================================================== */}
            <div className="lg:mt-14 bg-[#0F172A]/45 hover:bg-[#0F172A]/55 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.38)] transition-all duration-300 flex flex-col justify-between">
              {/* Top Card Title */}
              <h3 className="text-sm sm:text-[15px] font-bold text-white leading-snug mb-3.5">
                {t.howItWorksTitle}
              </h3>

              {/* Inner White-Bordered Metric & Sparkline Box */}
              <div className="border border-white/65 rounded-xl p-4 sm:p-4.5 bg-white/[0.02] mb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                    {t.howItWorksBadge}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[#22C55E] font-semibold flex items-center gap-0.5">
                      <span>↑</span>
                      <span>100%</span>
                    </span>
                    <span className="text-white/95 font-normal">{t.pilotBadge}</span>
                  </div>
                </div>

                {/* Glowing Green Connected-Dot Sparkline (Card 2 Pattern: dense smooth S-curve) */}
                <div className="mt-4 pt-1">
                  <svg
                    viewBox="0 0 240 46"
                    className="w-full h-11 overflow-visible"
                    aria-hidden="true"
                  >
                    <defs>
                      <filter id="heroGlow2" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#22C55E" floodOpacity="0.85" />
                      </filter>
                    </defs>
                    <path
                      d="M 8 37 L 19 37 L 30 36.8 L 41 36.5 L 52 36.2 L 63 36 L 74 35.6 L 85 35.2 L 96 34.8 L 107 34 L 118 33 L 129 31.8 L 140 30.2 L 151 28.4 L 162 26.2 L 173 23.6 L 184 20.8 L 195 18.2 L 206 16 L 217 14.8 L 228 14.2"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      filter="url(#heroGlow2)"
                    />
                    {[
                      [8, 37],
                      [19, 37],
                      [30, 36.8],
                      [41, 36.5],
                      [52, 36.2],
                      [63, 36],
                      [74, 35.6],
                      [85, 35.2],
                      [96, 34.8],
                      [107, 34],
                      [118, 33],
                      [129, 31.8],
                      [140, 30.2],
                      [151, 28.4],
                      [162, 26.2],
                      [173, 23.6],
                      [184, 20.8],
                      [195, 18.2],
                      [206, 16],
                      [217, 14.8],
                      [228, 14.2]
                    ].map(([cx, cy], idx) => (
                      <circle
                        key={idx}
                        cx={cx}
                        cy={cy}
                        r="2.1"
                        fill="#DCFCE7"
                        stroke="#22C55E"
                        strokeWidth="1.3"
                        filter="url(#heroGlow2)"
                      />
                    ))}
                  </svg>
                </div>
              </div>

              {/* Bottom 3 White-Circle Avatar Rows + Preserved Action */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white text-[#D97706] font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    1
                  </span>
                  <div className="leading-snug">
                    <strong className="text-white font-semibold block">{t.step1Title}</strong>
                    <span className="text-white/80 text-[11px]">{t.step1Desc}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white text-[#15803D] font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    2
                  </span>
                  <div className="leading-snug">
                    <strong className="text-white font-semibold block">{t.step2Title}</strong>
                    <span className="text-white/80 text-[11px]">{t.step2Desc}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#0F172A] border border-white/80 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    3
                  </span>
                  <div className="leading-snug flex-1">
                    <strong className="text-white font-semibold block">{t.step3Title}</strong>
                    <span className="text-white/80 text-[11px] block">{t.step3Desc}</span>
                    <button
                      type="button"
                      onClick={() => onNavigate('how-it-works')}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#DCFCE7] hover:text-white transition-colors cursor-pointer"
                    >
                      <span>{t.btnExploreSignals}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================================
                CARD 3: Single Evidence Fact Card (Right Top Staggered Box)
                ===================================================================== */}
            <div className="lg:mt-0 bg-[#0F172A]/45 hover:bg-[#0F172A]/55 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.38)] transition-all duration-300 flex flex-col justify-between md:col-span-2 lg:col-span-1">
              {/* Top Card Title */}
              <h3 className="text-sm sm:text-[15px] font-bold text-white leading-snug mb-3.5">
                {t.evidenceFactTitle}
              </h3>

              {/* Inner White-Bordered Metric & Sparkline Box */}
              <div className="border border-white/65 rounded-xl p-4 sm:p-4.5 bg-white/[0.02] mb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                      30%
                    </div>
                    <span className="inline-block text-xs text-white/90 mt-1">
                      (2022)
                    </span>
                  </div>

                  <div className="flex flex-col items-start text-left max-w-[175px]">
                    <span className="text-[#22C55E] text-xs font-semibold flex items-center gap-1 leading-tight">
                      <span>↑</span>
                      <span>{t.liveBadge}</span>
                    </span>
                    <span className="text-[11px] text-white/95 font-normal leading-snug mt-0.5">
                      {t.evidenceFactStat}
                    </span>
                  </div>
                </div>

                {/* Glowing Green Connected-Dot Sparkline (Card 3 Pattern: stepped upward tiers) */}
                <div className="mt-4 pt-1">
                  <svg
                    viewBox="0 0 240 46"
                    className="w-full h-11 overflow-visible"
                    aria-hidden="true"
                  >
                    <defs>
                      <filter id="heroGlow3" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#22C55E" floodOpacity="0.85" />
                      </filter>
                    </defs>
                    <path
                      d="M 10 37 L 28 37 L 46 37 L 64 35 L 82 33.5 L 100 33.5 L 118 33.5 L 136 25 L 154 25 L 172 25 L 190 22 L 208 16 L 224 15.5 L 234 15"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      filter="url(#heroGlow3)"
                    />
                    {[
                      [10, 37],
                      [28, 37],
                      [46, 37],
                      [64, 35],
                      [82, 33.5],
                      [100, 33.5],
                      [118, 33.5],
                      [136, 25],
                      [154, 25],
                      [172, 25],
                      [190, 22],
                      [208, 16],
                      [224, 15.5],
                      [234, 15]
                    ].map(([cx, cy], idx) => (
                      <circle
                        key={idx}
                        cx={cx}
                        cy={cy}
                        r="2.4"
                        fill="#DCFCE7"
                        stroke="#22C55E"
                        strokeWidth="1.4"
                        filter="url(#heroGlow3)"
                      />
                    ))}
                  </svg>
                </div>
              </div>

              {/* Bottom 3 White-Circle Avatar Rows + Preserved Action */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white text-[#0F172A] font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                    <TrendingUp className="w-3 h-3 text-[#005A94]" />
                  </span>
                  <span className="text-white/95 font-medium leading-snug">
                    {t.evidenceFactSource}
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white text-[#0F172A] font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    I
                  </span>
                  <span className="text-white/85 text-[11px] leading-snug">
                    {t.evidenceFactDesc}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-white text-[#0F172A] font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                      D
                    </span>
                    <span className="text-white/95 font-medium truncate">
                      {t.corridorName}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('pilot')}
                    className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#DCFCE7] hover:text-white transition-colors cursor-pointer shrink-0"
                  >
                    <span>{t.corridorScopeBtn}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LOWER CONTENT SECTIONS (Clean White Canvas for Highlights & Audiences)
          ========================================================================= */}
      <div className="w-full bg-white pt-8 sm:pt-14 pb-16 sm:pb-24 space-y-12 sm:space-y-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* How Trade Square Works Highlights Carousel */}
          <HowItWorksHighlights
            onNavigate={onNavigate}
            currentLang={currentLang}
            onOpenSignIn={onOpenSignIn}
          />
        </div>

        {/* Who Trade Square Is For Section */}
        <WhoTradeSquareIsFor
          onNavigate={onNavigate}
          currentLang={currentLang}
        />
      </div>
    </div>
  );
};
