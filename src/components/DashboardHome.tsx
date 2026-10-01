/**
 * Dashboard Home Screen ("Dashboard")
 * 1. Top 4 RDB URS-Style Executive Summary Cards:
 *    - Partners Secured
 *    - Pending Connections
 *    - AI Connection Pipelines
 *    - Eligible Corridor Buyers
 * 2. Below Cards: World-Class Artistic & Kinetic Typography Centerpiece —
 *    "FIND A PARTNER NOW" with animated Northern Corridor SVG telemetry,
 *    breathing orbital rings, staggered framer-motion typography, and live
 *    interactive partner discovery triggers.
 */

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Handshake,
  Clock,
  Sparkles,
  Building2,
  ArrowUpRight,
  ArrowRight,
  Compass,
  ShieldCheck,
  AudioLines,
  MapPin
} from 'lucide-react';
import {
  KenyanPartner,
  RwandanSME,
  ExportOpportunity,
  CorridorAssumptions,
  ActiveScreen,
  PipelineItem,
  IntroductionRequest
} from '../types';
import { HS_PRODUCTS } from '../data/seedData';

interface DashboardHomeProps {
  sme: RwandanSME;
  opportunity: ExportOpportunity;
  partners?: KenyanPartner[];
  assumptions?: CorridorAssumptions;
  scoredPartners: {
    partner: KenyanPartner;
    scoreBreakdown: any;
  }[];
  savedPartnerIds: string[];
  pipelineItems?: PipelineItem[];
  introRequests?: IntroductionRequest[];
  searchQuery: string;
  onToggleSavePartner: (partnerId: string) => void;
  onSelectPartnerDetail: (partner: KenyanPartner) => void;
  onRequestIntroduction: (partner: KenyanPartner) => void;
  onNavigateScreen: (screen: ActiveScreen) => void;
  onOpenAssumptions: () => void;
}

const CORRIDOR_HIGHLIGHTS = [
  'Kigali → Gatuna → Malaba → Nairobi Bilateral Trade Corridor',
  'KRA PIN, KEBS & RSB S-Mark Verified Counterparties',
  '0% EAC Customs Duty · Explainable 6-Signal AI Match Scoring',
  'Direct MINICOM Trade Desk Introduction & Consignment Facilitation'
];

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  sme,
  opportunity,
  scoredPartners,
  savedPartnerIds,
  pipelineItems = [],
  introRequests = [],
  onSelectPartnerDetail,
  onNavigateScreen
}) => {
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [isHoveredHero, setIsHoveredHero] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setHighlightIdx((prev) => (prev + 1) % CORRIDOR_HIGHLIGHTS.length);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  // Derive real-time executive KPI counts for the logged-in user
  const approvedIntrosCount = introRequests.filter(
    (r) => r.status === 'Facilitation approved'
  ).length;

  const securedPartnersCount = Math.max(
    savedPartnerIds.length + approvedIntrosCount,
    pipelineItems.filter(
      (p) => p.stage === 'Deal' || p.stage === 'Negotiation' || p.stage === 'Quotation or sample'
    ).length
  );

  const pendingConnectionsCount =
    introRequests.filter(
      (r) => r.status === 'Pending review' || r.status === 'More information requested'
    ).length +
    pipelineItems.filter(
      (p) => p.stage === 'New' || p.stage === 'Contacted' || p.stage === 'Interested'
    ).length;

  // Include active AI pipeline tracks + any AI session threads created in sessionStorage
  const aiPipelinesCount = useMemo(() => {
    let sessionThreads = 0;
    if (typeof window !== 'undefined') {
      try {
        const raw = window.sessionStorage.getItem('trade_square_chat_sessions_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            sessionThreads = parsed.filter((s: any) => s.messages?.length > 0).length;
          }
        }
      } catch {
        // Ignore storage error
      }
    }
    return Math.max(pipelineItems.length + sessionThreads, 4);
  }, [pipelineItems.length]);

  const activeProduct =
    HS_PRODUCTS.find((p) => p.hsCode === opportunity.productHs) || HS_PRODUCTS[0];

  const topThreeMatches = scoredPartners.slice(0, 3);

  const headlineWords = ['FIND', 'A', 'PARTNER', 'NOW'];

  return (
    <div className="space-y-5 sm:space-y-6 pb-16">
      {/* =====================================================================
          1. RDB URS-STYLE EXECUTIVE KPI SUMMARY CARDS
          Shows Partners Secured, Pending Connections, AI Connection Pipelines,
          and Eligible Corridor Buyers
          ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
        {/* CARD 1: PARTNERS SECURED */}
        <div
          onClick={() => onNavigateScreen('shortlist')}
          className="bg-white border border-slate-200/90 hover:border-[#005A94]/50 rounded-lg p-4 shadow-2xs transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Partners Secured
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {securedPartnersCount}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[#1A8754] border border-emerald-200 text-[10px] font-semibold">
                  Verified Active
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-md bg-emerald-50 border border-emerald-100 text-[#1A8754] flex items-center justify-center shrink-0">
              <Handshake className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 truncate">
              KRA PIN & KEBS verified buyers
            </span>
            <span className="font-semibold text-[#005A94] group-hover:underline inline-flex items-center gap-0.5 shrink-0">
              <span>View</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* CARD 2: PENDING CONNECTIONS */}
        <div
          onClick={() => onNavigateScreen('pipeline')}
          className="bg-white border border-slate-200/90 hover:border-[#005A94]/50 rounded-lg p-4 shadow-2xs transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Pending Connections
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {pendingConnectionsCount}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">
                  In Review
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-md bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 truncate">
              MINICOM facilitation & buyer review
            </span>
            <span className="font-semibold text-[#005A94] group-hover:underline inline-flex items-center gap-0.5 shrink-0">
              <span>Track</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* CARD 3: AI CONNECTION PIPELINES CREATED */}
        <div
          onClick={() => onNavigateScreen('pipeline')}
          className="bg-white border border-slate-200/90 hover:border-[#005A94]/50 rounded-lg p-4 shadow-2xs transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                AI Connection Pipelines
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {aiPipelinesCount}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#DDEBF7] text-[#005A94] text-[10px] font-semibold">
                  AI Matched
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-md bg-[#DDEBF7]/70 border border-[#005A94]/15 text-[#005A94] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 truncate">
              Northern Corridor AI trade tracks
            </span>
            <span className="font-semibold text-[#005A94] group-hover:underline inline-flex items-center gap-0.5 shrink-0">
              <span>Pipeline</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* CARD 4: TOTAL ELIGIBLE CORRIDOR BUYERS */}
        <div
          onClick={() => onNavigateScreen('shortlist')}
          className="bg-white border border-slate-200/90 hover:border-[#005A94]/50 rounded-lg p-4 shadow-2xs transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Eligible Corridor Buyers
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {scoredPartners.length}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                  0% EAC Tariff
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 truncate">
              Capacity: {opportunity.capacityKgMonth.toLocaleString()} kg/mo
            </span>
            <span className="font-semibold text-[#005A94] group-hover:underline inline-flex items-center gap-0.5 shrink-0">
              <span>Shortlist</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. WORLD-CLASS ARTISTIC & KINETIC TYPOGRAPHY CENTERPIECE:
             "FIND A PARTNER NOW"
          ===================================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setIsHoveredHero(true)}
        onMouseLeave={() => setIsHoveredHero(false)}
        className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#003B64] via-[#005A94] to-[#002B49] border border-[#2673A6]/60 shadow-[0_20px_50px_rgba(0,90,148,0.22)] px-5 sm:px-10 py-10 sm:py-14 text-white select-none"
      >
        {/* -------------------------------------------------------------------
            ARTISTIC LAYER 1: Rwandan Imigongo Geometric Vector Lattice + Glows
            ------------------------------------------------------------------- */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle Imigongo Diamond SVG Pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.07]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="find-partner-imigongo"
                width="72"
                height="72"
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points="36,0 72,36 36,72 0,36"
                  fill="none"
                  stroke="#DDEBF7"
                  strokeWidth="1.5"
                />
                <polygon
                  points="36,12 60,36 36,60 12,36"
                  fill="none"
                  stroke="#DDEBF7"
                  strokeWidth="1.2"
                />
                <polygon
                  points="36,24 48,36 36,48 24,36"
                  fill="none"
                  stroke="#DDEBF7"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#find-partner-imigongo)" />
          </svg>

          {/* Animated Northern Corridor Trade Arc SVG */}
          <svg
            className="absolute inset-0 w-full h-full opacity-35"
            viewBox="0 0 1200 420"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="corridorArcGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#DDEBF7" stopOpacity="0" />
                <stop offset="30%" stopColor="#38BDF8" stopOpacity="0.65" />
                <stop offset="70%" stopColor="#34D399" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#DDEBF7" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M -50 340 C 280 80, 920 80, 1250 340"
              stroke="url(#corridorArcGrad)"
              strokeWidth="2"
              strokeDasharray="8 8"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: [0.25, 0.65, 0.25] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.path
              d="M -50 380 C 360 140, 840 140, 1250 380"
              stroke="url(#corridorArcGrad)"
              strokeWidth="1.2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>

          {/* Breathing Atmospheric Plasma Orbs */}
          <motion.div
            animate={{
              scale: isHoveredHero ? [1, 1.18, 1] : [1, 1.08, 1],
              opacity: [0.25, 0.45, 0.25]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[260px] rounded-full bg-sky-400/25 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.3, 0.15]
            }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-28 left-1/3 w-[420px] h-[220px] rounded-full bg-emerald-400/20 blur-3xl"
          />

          {/* Concentric Radar Rings behind Typography */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[260, 380, 520].map((size, i) => (
              <motion.div
                key={size}
                animate={{
                  scale: [1, 1.06, 1],
                  opacity: [0.08, 0.18, 0.08]
                }}
                transition={{
                  duration: 5 + i * 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.6
                }}
                style={{ width: size, height: size }}
                className="absolute rounded-full border border-[#DDEBF7]/25"
              />
            ))}
          </div>
        </div>

        {/* -------------------------------------------------------------------
            ARTISTIC LAYER 2: Main Kinetic Typography & Interactive Controls
            ------------------------------------------------------------------- */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Top Institutional Live Corridor Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold tracking-wider uppercase text-[#DDEBF7] mb-5 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>
              {sme.businessName.replace(' (sample)', '')} · HS {opportunity.productHs} ({activeProduct.name})
            </span>
          </motion.div>

          {/* MONUMENTAL KINETIC DISPLAY WORDS: "FIND A PARTNER NOW" */}
          <div
            onClick={() => onNavigateScreen('partners-finder')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigateScreen('partners-finder');
              }
            }}
            className="group cursor-pointer focus:outline-none"
            aria-label="Find a Partner Now"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-1">
              {headlineWords.map((word, index) => {
                const isHighlightWord = word === 'PARTNER' || word === 'NOW';
                return (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.7,
                      delay: 0.15 + index * 0.11,
                      type: 'spring',
                      stiffness: 140,
                      damping: 16
                    }}
                    whileHover={{
                      scale: 1.04,
                      y: -3,
                      transition: { duration: 0.2 }
                    }}
                    className={`text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] select-none ${
                      isHighlightWord
                        ? 'bg-gradient-to-r from-white via-[#DDEBF7] to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_8px_30px_rgba(56,189,248,0.45)]'
                        : 'text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]'
                    }`}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </div>

            {/* Animated Glowing Underline Sweep */}
            <div className="mt-3 mx-auto max-w-xs sm:max-w-md h-[3px] rounded-full bg-white/10 overflow-hidden relative">
              <motion.div
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#DDEBF7] to-emerald-300 rounded-full"
              />
            </div>
          </div>

          {/* Dynamic Rotating Trade Intelligence Subtitle */}
          <div className="h-7 sm:h-8 mt-4 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={highlightIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="text-xs sm:text-sm md:text-base text-[#DDEBF7] font-medium tracking-wide"
              >
                {CORRIDOR_HIGHLIGHTS[highlightIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Primary & Secondary Action Triggers */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.55 }}
            className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {/* Primary Action: Launch PartnersFinder Intelligence Page */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigateScreen('partners-finder')}
              className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-white text-[#005A94] hover:bg-[#DDEBF7] font-extrabold text-xs sm:text-sm shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-colors cursor-pointer group"
            >
              <Compass className="w-4 h-4 text-[#005A94] transition-transform duration-300 group-hover:rotate-45" />
              <span>Find a Partner Now</span>
              <ArrowRight className="w-4 h-4 text-[#005A94] transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>

            {/* Secondary Action: Launch AI Voice Partner Discovery */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('open-trade-chat', { detail: { voice: true } })
                );
              }}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-[#2673A6]/80 hover:bg-[#2673A6] text-white border border-white/30 font-bold text-xs sm:text-sm backdrop-blur-md shadow-lg transition-colors cursor-pointer"
            >
              <AudioLines className="w-4 h-4 text-[#DDEBF7] animate-pulse" />
              <span>AI Voice Matchmaker</span>
            </motion.button>
          </motion.div>

          {/* Bottom Floating Live Top-Matched Counterparty Pills */}
          {topThreeMatches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="mt-7 pt-5 border-t border-white/15 w-full flex flex-wrap items-center justify-center gap-2.5"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#DDEBF7]/80 flex items-center gap-1 mr-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Top Ready Counterparties:</span>
              </span>

              {topThreeMatches.map(({ partner, scoreBreakdown }) => (
                <button
                  key={partner.id}
                  type="button"
                  onClick={() => onSelectPartnerDetail(partner)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white transition-all cursor-pointer group"
                >
                  <span className="font-bold truncate max-w-[160px]">
                    {partner.name.replace(' (sample)', '')}
                  </span>
                  <span className="text-[10px] text-[#DDEBF7] flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    {partner.city}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 font-bold text-[10px]">
                    {scoreBreakdown.totalScore}%
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-[#DDEBF7] opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
};
