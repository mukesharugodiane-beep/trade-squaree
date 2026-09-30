/**
 * Page 1: Home Page
 * Fully responsive across all devices (Mobile 320px+, Tablet 768px+, Desktop 1024px+, Large screens 1440px+):
 * - Fluid typography for titles and subtitles that scale smoothly
 * - Modern executive glassmorphism with high-contrast Rwandan blue aesthetic
 * - Symmetric grid for cards (1-col on phone, 2-col balanced on tablet, 3-col on desktop)
 * - Touch-friendly action buttons that adapt gracefully on mobile
 * - Smooth moving video background with poster fallback
 * - Full bilingual concept translation (English & Ikinyarwanda)
 * - Zero green text; purely cohesive blue tokens (#0096FC, #043E6B, #003893)
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
import heroPosterImg from '../assets/images/rwanda_summit_stage_1790763828776.jpg';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
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
          HERO SECTION (OSAKA Expo 2025 Video, seamlessly covers navbar & dissolves)
          ========================================================================= */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center -mt-14 sm:-mt-16 pt-24 sm:pt-32 pb-20 sm:pb-28 bg-[#011945] overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* Full-bleed HTML5 Video with Cinematic Zoom to fill both navbar and hero backgrounds */}
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

        {/* Seamless Vignette & Gradient Overlays:
            - Top soft vignette: Ensures navbar text/logo are crisp while dissolving seamlessly to top edge
            - Center: Transparent so the video is vividly clear
            - Bottom dissolve: Seamlessly blends into the background so you cannot tell where section ends */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#011945]/60 via-transparent to-[#011945]/95 z-[1] pointer-events-none"
          aria-hidden="true"
        />

        {/* Ambient subtle bottom feathered mist for seamless dissolution into subsequent content */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 sm:h-72 bg-gradient-to-b from-transparent via-[#011945]/75 to-[#011945] z-[1] pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero Main Content Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative z-10 w-full">
          {/* Main Title (Fluid responsive typography with drop shadow) */}
          <h1
            id="hero-title"
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-2 sm:mb-4 tracking-tight max-w-5xl mx-auto leading-[1.12] sm:leading-[1.08] drop-shadow-[0_2px_12px_rgba(1,25,69,0.9)]"
          >
            {t.heroMainTitle}
          </h1>

          {/* Dynamic Pulsing Subtitle (Adaptable height, zero clipping) */}
          <div className="min-h-[3.5rem] sm:min-h-[4.5rem] flex items-center justify-center px-2 sm:px-4 my-1 sm:my-2">
            <h2 className="text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-[#0096FC] to-[#93c5fd] bg-clip-text text-transparent text-center leading-snug animate-pulse drop-shadow-[0_2px_10px_rgba(1,25,69,0.8)]">
              {t.dynamicHeadlines[activeHeadlineIndex]}
            </h2>
          </div>

          {/* Core Hero Description */}
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-blue-50 font-normal mb-8 sm:mb-10 max-w-3xl px-2 sm:px-4 mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(1,25,69,0.85)]">
            {t.heroSentence}
          </p>

          {/* Action CTA Buttons (Full width stacked on mobile, row on tablet & desktop) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 w-full max-w-xs sm:max-w-none px-2 sm:px-0">
            {/* Request Access Button */}
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs sm:text-sm font-bold cursor-pointer bg-white border border-[#0096FC]/30 transition-all duration-200 group h-11 sm:h-12 px-7 sm:px-8 rounded-full hover:bg-blue-50 shadow-xl"
              aria-label="Request access"
            >
              <span className="text-[#043E6B]">
                {t.btnRequestAccess}
              </span>
              <ChevronRight className="w-4 h-4 text-[#0096FC] transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            {/* Sign In / Login Button */}
            <button
              type="button"
              onClick={onOpenSignIn}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#003893] to-[#0096FC] hover:from-[#003893]/90 hover:to-[#0096FC]/90 transition-all shadow-xl h-11 sm:h-12 px-7 sm:px-8 cursor-pointer group"
              aria-label="Sign in"
            >
              <User className="w-4 h-4 text-white" aria-hidden="true" />
              <span>{t.btnSignIn}</span>
            </button>
          </div>

          {/* =========================================================================
              FLOATING GLASS CARDS (Responsive: 1-col mobile, 2-col tablet, 3-col desktop)
              ========================================================================= */}
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-left px-1 sm:px-4">
            {/* CARD 1: Sample Shortlist Match Preview */}
            <div className="bg-[#043E6B]/65 backdrop-blur-xl border border-blue-400/25 rounded-2xl p-5 sm:p-6 text-white shadow-2xl flex flex-col justify-between hover:border-[#0096FC]/60 hover:shadow-[0_8px_30px_rgba(0,150,252,0.18)] transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-[#0096FC]/25 border border-[#0096FC]/40 px-2.5 py-0.5 rounded-full">
                    {t.sampleCardTag}
                  </span>
                  <div className="flex items-center gap-1.5 text-right">
                    <span className="text-xl font-extrabold text-white">94</span>
                    <span className="text-xs text-blue-200">{t.sampleScoreLabel}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    {t.sampleCompanyName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-blue-100 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#0096FC]" />
                      {t.sampleLocation}
                    </span>
                    <span>·</span>
                    <span className="text-white font-medium">{t.samplePartnerType}</span>
                    <span>·</span>
                    <span className="font-mono text-[10px] text-blue-200">{t.sampleKraPin}</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#0096FC] font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0096FC]" />
                    <span>{t.sampleEvidenceBadge}</span>
                  </div>
                  <p className="text-blue-100/80 text-[11px] leading-relaxed">
                    {t.sampleEvidenceDesc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-blue-200 italic">
                  {t.sampleDisclaimer}
                </span>
                <button
                  type="button"
                  onClick={onOpenSignIn}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0096FC] hover:text-white transition-colors cursor-pointer"
                >
                  <span>{t.samplePreviewBtn}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CARD 2: Three-Step Summary Card */}
            <div className="bg-[#043E6B]/65 backdrop-blur-xl border border-blue-400/25 rounded-2xl p-5 sm:p-6 text-white shadow-2xl flex flex-col justify-between hover:border-[#0096FC]/60 hover:shadow-[0_8px_30px_rgba(0,150,252,0.18)] transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {t.howItWorksTitle}
                  </h3>
                  <span className="text-xs text-[#0096FC] font-bold">{t.howItWorksBadge}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#0096FC] text-[#011945] font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-white block font-semibold">{t.step1Title}</strong>
                      <span className="text-blue-100/80 text-[11px]">
                        {t.step1Desc}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#0096FC] text-[#011945] font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-white block font-semibold">{t.step2Title}</strong>
                      <span className="text-blue-100/80 text-[11px]">
                        {t.step2Desc}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#0096FC] text-[#011945] font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-white block font-semibold">{t.step3Title}</strong>
                      <span className="text-blue-100/80 text-[11px]">
                        {t.step3Desc}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4">
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0096FC] hover:text-white transition-colors cursor-pointer"
                >
                  <span>{t.btnExploreSignals}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CARD 3: Single Evidence Fact Card (Spans 2 columns on tablet for symmetry) */}
            <div className="bg-[#043E6B]/65 backdrop-blur-xl border border-blue-400/25 rounded-2xl p-5 sm:p-6 text-white shadow-2xl flex flex-col justify-between hover:border-[#0096FC]/60 hover:shadow-[0_8px_30px_rgba(0,150,252,0.18)] transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {t.evidenceFactTitle}
                  </h3>
                  <TrendingUp className="w-4 h-4 text-[#0096FC]" />
                </div>

                <div className="border-l-2 border-[#0096FC] pl-3 py-1 space-y-2">
                  <p className="text-sm sm:text-base md:text-lg font-bold text-white leading-snug">
                    {t.evidenceFactStat}
                  </p>
                  <p className="text-xs text-blue-200">
                    {t.evidenceFactSource}
                  </p>
                </div>

                <p className="text-xs text-blue-100/80 leading-relaxed">
                  {t.evidenceFactDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-[#0096FC] font-medium">
                  {t.corridorName}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('pilot')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-[#0096FC] transition-colors cursor-pointer"
                >
                  <span>{t.corridorScopeBtn}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LOWER CONTENT SECTIONS (Seamlessly Dissolves from Hero Midnight Blue)
          ========================================================================= */}
      <div className="w-full bg-gradient-to-b from-[#011945] via-slate-50/70 to-white -mt-1 pt-6 sm:pt-10 pb-16 sm:pb-24 space-y-12 sm:space-y-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* How Trade Square Works Highlights Carousel */}
          <HowItWorksHighlights
            onNavigate={onNavigate}
            currentLang={currentLang}
            onOpenSignIn={onOpenSignIn}
          />
        </div>

        {/* Who Trade Square Is For Section (Full Screen Width 2x2 Showcase Grid) */}
        <WhoTradeSquareIsFor
          onNavigate={onNavigate}
          currentLang={currentLang}
        />
      </div>
    </div>
  );
};
