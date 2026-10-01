/**
 * PartnersFinder Component
 *
 * 1. ChatGPT-Style Compact Onboarding Questionnaire (4 Questions):
 *    - Minimalist, centered, ultra-compact card (`max-w-md`) modeled after ChatGPT's
 *      interactive clarifying questions UI: subtle step counter (`1 of 4`), single crisp question,
 *      numbered single-line option rows with instant selection & smooth spring transitions,
 *      optional inline custom write-in row, and compact Skip / Back / Next controls.
 * 2. Real AI Partner & Market Matchmaker (`/api/ai/partners-finder`):
 *    - Compact, scaled-down typography (`11px`–`13px`), compact Fluid Cloud Orb AI logo,
 *      intent-aware conversational answers (no unsolicited analytics on greetings), and
 *      compact tables + partner cards when matching partners.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  AudioLines,
  Bookmark,
  Check,
  Handshake,
  Mic,
  RotateCcw,
  SlidersHorizontal,
  Volume2,
  X
} from 'lucide-react';
import {
  KenyanPartner,
  RwandanSME,
  ExportOpportunity,
  CorridorAssumptions,
  RegionalCountry
} from '../types';
import {
  OfferingNature,
  PartnerPriority,
  OnboardingPreferences,
  ScoredPartnerCardData,
  StructuredTableData,
  deriveInitialOnboardingFromSme,
  queryRealtimeVenusFinder
} from '../services/aiService';

interface PartnersFinderProps {
  sme: RwandanSME;
  partners: KenyanPartner[];
  opportunity: ExportOpportunity;
  assumptions: CorridorAssumptions;
  savedPartnerIds: string[];
  onToggleSavePartner: (partnerId: string) => void;
  onSelectPartnerDetail: (partner: KenyanPartner) => void;
  onRequestIntroduction: (partner: KenyanPartner) => void;
  onSaveOpportunity: (updated: ExportOpportunity) => void;
  onBackToDashboard: () => void;
}

/* ============================================================================
   CHATGPT-STYLE ONBOARDING QUESTIONS & STATE
   ============================================================================ */

type OnboardingAnswers = OnboardingPreferences;

const Q1_OPTIONS: { id: OfferingNature; label: string; defaultCode: string }[] = [
  {
    id: 'services',
    label: 'B2B Services (Logistics, FinTech, Software, Clearing)',
    defaultCode: '9901'
  },
  {
    id: 'agro',
    label: 'Specialty Coffee, Tea & Fresh Agro-Produce',
    defaultCode: '0901'
  },
  {
    id: 'milling',
    label: 'Dry Grains, Beans & Milled Flours',
    defaultCode: '0713'
  },
  {
    id: 'retail',
    label: 'Packaged Honey, Retail Goods & Distribution',
    defaultCode: '0409'
  }
];

const Q2_OPTIONS_BY_NATURE: Record<
  OfferingNature,
  { code: string; label: string; sub: string }[]
> = {
  services: [
    {
      code: '9901',
      label: 'Cross-Border Logistics, Cold-Chain & Customs Clearing',
      sub: 'Fleet, warehousing & OSBP transit facilitation'
    },
    {
      code: '9902',
      label: 'Digital Supply-Chain, FinTech & Trade Advisory',
      sub: 'B2B software, payment settlement & quality consulting'
    }
  ],
  agro: [
    {
      code: '0901',
      label: 'Specialty Arabica Coffee (Green or Roasted)',
      sub: 'HS 0901 · Trial lots (100 kg+) to full containers'
    },
    {
      code: '0902',
      label: 'Rwandan Highland Black Tea',
      sub: 'HS 0902 · Bulk & specialty blending lots'
    },
    {
      code: '0804',
      label: 'Fresh Hass & Fuerte Avocado',
      sub: 'HS 0804 · Cold-chain horticultural consignments'
    }
  ],
  milling: [
    {
      code: '0713',
      label: 'Dried Beans & Legumes',
      sub: 'HS 0713 · Institutional & wholesale supply'
    },
    {
      code: '1102',
      label: 'Fortified Maize Flour',
      sub: 'HS 1102 · Commercial & cross-border wholesale'
    },
    {
      code: '1106',
      label: 'High Quality Cassava Flour',
      sub: 'HS 1106 · Industrial & supermarket supply'
    }
  ],
  retail: [
    {
      code: '0409',
      label: 'Certified Natural Honey (Shelf-Ready)',
      sub: 'HS 0409 · Packaged retail & hospitality supply'
    },
    {
      code: '0901',
      label: 'Packaged Roasted Coffee & Hospitality Lots',
      sub: 'HS 0901 · Supermarkets, hotels & cafes'
    },
    {
      code: '1106',
      label: 'Packaged Composite & Cassava Flours',
      sub: 'HS 1106 · Regional retail chains'
    }
  ]
};

const Q3_MARKET_OPTIONS: {
  id: RegionalCountry | 'ALL';
  label: string;
  sub: string;
}[] = [
  {
    id: 'ALL',
    label: 'Compare All Markets (Recommend Best Fit)',
    sub: 'AI compares Kenya, Burundi, Uganda, DRC & Tanzania'
  },
  {
    id: 'Uganda',
    label: 'Uganda (Plus AI Market Arbitrage Check)',
    sub: 'Gatuna — Kampala Corridor'
  },
  {
    id: 'Kenya',
    label: 'Kenya (Nairobi & Mombasa Hubs)',
    sub: 'Gatuna / Malaba — Northern Corridor'
  },
  {
    id: 'Burundi',
    label: 'Burundi (Bujumbura Hub)',
    sub: 'Nemba — Southern Corridor'
  },
  {
    id: 'DRC',
    label: 'DR Congo (Goma Cross-Border Hub)',
    sub: 'Rubavu / La Corniche OSBP'
  },
  {
    id: 'Tanzania',
    label: 'Tanzania (Arusha & Dar es Salaam)',
    sub: 'Rusumo — Central Corridor'
  }
];

const Q4_PRIORITY_OPTIONS: {
  id: PartnerPriority;
  label: string;
  sub: string;
}[] = [
  {
    id: 'margin',
    label: 'Highest Commercial Margin & Demand',
    sub: 'Best buyer offer price or service contract rate'
  },
  {
    id: 'reliability',
    label: 'Proven Payment & Contract History',
    sub: '95%–99% on-time settlement & verified OSBP records'
  },
  {
    id: 'speed',
    label: 'Fastest Border Clearance & Turnaround',
    sub: 'Shortest clearance time (0.7–1.3 days)'
  },
  {
    id: 'facilitation',
    label: 'Direct MINICOM Introduction Readiness',
    sub: 'Pre-vetted Trade Square registered partners'
  }
];

/* Analytics, Weighted Similarity Scoring & Table Formatting imported from ../services/aiService */

/* ============================================================================
   COMPACT SIGNATURE FLUID CLOUD ORB AI LOGO
   ============================================================================ */

const FluidOrbAILogo: React.FC<{
  size?: 'xs' | 'sm' | 'md' | 'lg';
  state?: 'idle' | 'thinking' | 'speaking' | 'listening';
  onClick?: () => void;
}> = ({ size = 'sm', state = 'idle', onClick }) => {
  const dimensions = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-11 h-11',
    lg: 'w-16 h-16'
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center select-none ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <motion.div
        animate={{
          scale:
            state === 'thinking' || state === 'speaking'
              ? [1, 1.24, 1]
              : [1, 1.12, 1],
          opacity:
            state === 'thinking' || state === 'speaking'
              ? [0.3, 0.6, 0.3]
              : [0.18, 0.35, 0.18]
        }}
        transition={{
          duration: state === 'thinking' ? 1.3 : 2.8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#005A94]/40 via-[#0096FC]/35 to-[#38BDF8]/40 blur-xs pointer-events-none"
      />

      <motion.div
        animate={{
          scale:
            state === 'thinking'
              ? [1, 1.08, 0.94, 1]
              : state === 'speaking'
              ? [1, 1.12, 0.95, 1.06, 1]
              : [1, 1.05, 0.97, 1],
          borderRadius: [
            '50% 50% 50% 50%',
            '45% 55% 48% 52%',
            '53% 47% 54% 46%',
            '50% 50% 50% 50%'
          ]
        }}
        transition={{
          duration: state === 'thinking' ? 1.2 : 2.8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className={`relative ${dimensions} rounded-full overflow-hidden shadow-[0_4px_14px_rgba(0,150,252,0.4)] bg-[#005A94] shrink-0`}
      >
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.15, 1] }}
          transition={{
            duration: state === 'thinking' ? 2.2 : 5.5,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute -inset-2 rounded-full opacity-90"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #FFFFFF 0%, #7DD3FC 30%, #0096FC 60%, transparent 78%)'
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: state === 'thinking' ? 2.8 : 7.5,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute -inset-2.5 rounded-full mix-blend-screen opacity-85"
          style={{
            background:
              'radial-gradient(circle at 70% 65%, #E0F2FE 0%, #38BDF8 38%, #003893 75%, transparent 88%)'
          }}
        />
      </motion.div>
    </div>
  );
};

/* ============================================================================
   CHAT MESSAGE STRUCTURE & QUICK PROMPTS
   ============================================================================ */

/* StructuredTableData imported from ../services/aiService */

interface FinderChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  speechScript?: string;
  duplexMode?: string;
  harnessDelegated?: boolean;
  headline?: string;
  timestamp: string;
  includeAnalytics?: boolean;
  includePartnerMatches?: boolean;
  tableData?: StructuredTableData;
  partnerCards?: ScoredPartnerCardData[];
}

const QUICK_PROMPTS = [
  {
    category: 'B2B Services',
    title: 'Logistics & Clearing Partners',
    prompt:
      'We provide cross-border logistics, warehousing, and customs clearing services — which country and companies need us most?'
  },
  {
    category: 'Digital & FinTech',
    title: 'B2B Software & FinTech Partners',
    prompt:
      'We offer digital supply-chain software and FinTech services — find verified regional enterprise partners in Kenya or Burundi'
  },
  {
    category: 'Regional Arbitrage',
    title: 'Coffee: Uganda vs Best Market',
    prompt:
      'I want to trade specialty Arabica coffee in Uganda — compare where our business gets the best demand and history'
  },
  {
    category: 'Distribution',
    title: 'Verified Regional Distributors',
    prompt:
      'Find top-rated regional distribution partners in Kenya, DRC, and Burundi with the best payment track record'
  }
];

export const PartnersFinder: React.FC<PartnersFinderProps> = ({
  sme,
  partners,
  opportunity,
  assumptions,
  savedPartnerIds,
  onToggleSavePartner,
  onSelectPartnerDetail,
  onRequestIntroduction,
  onBackToDashboard
}) => {
  // ChatGPT-Style Onboarding State initialized from the SME's real profile
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers>(() =>
    deriveInitialOnboardingFromSme(sme, opportunity)
  );

  // Sync onboarding defaults if SME profile or selected product changes
  useEffect(() => {
    setOnboardingAnswers(deriveInitialOnboardingFromSme(sme, opportunity));
  }, [
    sme.id,
    sme.selectedHsCode,
    sme.monthlyCapacityKg,
    sme.exWorksPriceRwf,
    opportunity?.productHs,
    opportunity?.capacityKgMonth,
    opportunity?.exWorksPriceRwf
  ]);

  // AI Chatbot State (inclusionAI/Realtime-Venus Full-Duplex)
  const [messages, setMessages] = useState<FinderChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [aiState, setAiState] = useState<'idle' | 'thinking' | 'speaking' | 'listening'>('idle');
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeAbortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, aiState]);

  useEffect(() => {
    return () => {
      activeAbortRef.current?.abort();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.03;
      utterance.onstart = () => setAiState('speaking');
      utterance.onend = () => setAiState('idle');
      utterance.onerror = () => setAiState('idle');
      window.speechSynthesis.speak(utterance);
    } catch {
      setAiState('idle');
    }
  };

  // AutomaticSpeechRecognitionPipeline (Web Speech API) for full-duplex voice input
  const startVoiceRecognition = () => {
    if (typeof window === 'undefined') return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setIsVoiceMode(true);
      setAiState('listening');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsVoiceMode(true);
        setAiState('listening');
        setLiveTranscript('');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setLiveTranscript(transcript);
        if (event.results[event.results.length - 1]?.isFinal && transcript.trim()) {
          setIsVoiceMode(false);
          setLiveTranscript('');
          handleSendMessage(transcript.trim(), true);
        }
      };

      recognition.onerror = () => {
        setAiState('idle');
      };

      recognition.onend = () => {
        setAiState((prev) => (prev === 'listening' ? 'idle' : prev));
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsVoiceMode(true);
      setAiState('listening');
    }
  };

  const handleSendMessage = async (
    customText?: string,
    speakResponse = false,
    overrideOnboarding?: OnboardingAnswers
  ) => {
    const activeAnswers = overrideOnboarding || onboardingAnswers;
    const queryText = (customText ?? inputPrompt).trim();
    if (!queryText) return;

    // Realtime-Venus Native Full-Duplex Semantic Interruption:
    // If the user sends a prompt while the model is speaking or generating, interrupt immediately
    if (activeAbortRef.current) {
      activeAbortRef.current.abort();
      activeAbortRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const abortController = new AbortController();
    activeAbortRef.current = abortController;

    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const userMsg: FinderChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: queryText,
      timestamp: nowTime
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!customText) {
      setInputPrompt('');
    }
    setAiState('thinking');

    try {
      const venusResult = await queryRealtimeVenusFinder({
        queryText,
        sme,
        opportunity,
        partners,
        assumptions,
        onboardingAnswers: activeAnswers,
        history: updatedHistory.slice(-6).map((m) => ({
          role: m.role,
          text: m.text
        })),
        signal: abortController.signal
      });

      const assistantMsg: FinderChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: venusResult.replyText,
        speechScript: venusResult.speechScript,
        duplexMode: venusResult.duplexMode,
        harnessDelegated: venusResult.harnessDelegated,
        headline: venusResult.headline,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        includeAnalytics: venusResult.includeAnalytics,
        includePartnerMatches: venusResult.includePartnerMatches,
        tableData: venusResult.tableData,
        partnerCards: venusResult.partnerCards
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (speakResponse) {
        speakText(venusResult.speechScript || venusResult.replyText);
      } else {
        setAiState('idle');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return;
      }
      setAiState('idle');
    }
  };

  // Finish Onboarding & Trigger Personalized AI Match
  const finishOnboarding = (finalAnswers: OnboardingAnswers) => {
    setIsOnboardingComplete(true);

    const q2List = Q2_OPTIONS_BY_NATURE[finalAnswers.offeringNature];
    const selectedCat =
      q2List.find((c) => c.code === finalAnswers.selectedCode) || q2List[0];
    const prioObj =
      Q4_PRIORITY_OPTIONS.find((p) => p.id === finalAnswers.priority) ||
      Q4_PRIORITY_OPTIONS[0];
    const customPart = finalAnswers.customNote.trim()
      ? ` (${finalAnswers.customNote.trim()})`
      : '';
    const marketPart =
      finalAnswers.targetCountry === 'ALL'
        ? 'across East Africa (comparing Kenya, Burundi, Uganda, DRC, and Tanzania)'
        : `in ${finalAnswers.targetCountry} (and compare if another neighboring country has stronger demand)`;

    const prompt = `We offer ${selectedCat.label}${customPart} and want to find the best-fit partner companies ${marketPart}, prioritizing ${prioObj.label.toLowerCase()}.`;
    handleSendMessage(prompt, false, finalAnswers);
  };

  const activeQ2List = Q2_OPTIONS_BY_NATURE[onboardingAnswers.offeringNature];
  const currentCatLabel =
    activeQ2List.find((c) => c.code === onboardingAnswers.selectedCode)?.label ||
    activeQ2List[0].label;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col justify-between min-h-[calc(100vh-7.2rem)] pb-2 px-1">
      {/* =====================================================================
          ULTRA-COMPACT TOP HEADER BAR
          ===================================================================== */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-[#005A94] text-[11px] font-semibold text-[#005A94] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Dashboard</span>
          </button>

          <span className="text-xs font-bold text-slate-900 truncate">
            Partners Finder AI
          </span>

          {isOnboardingComplete && (
            <span className="hidden md:inline text-[11px] text-slate-500 truncate">
              · {currentCatLabel} ({onboardingAnswers.targetCountry === 'ALL' ? 'All Markets' : onboardingAnswers.targetCountry})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isOnboardingComplete ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsOnboardingComplete(false);
                  setOnboardingStep(1);
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-[#005A94] text-[11px] font-semibold text-[#005A94] transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-2.5 h-2.5" />
                <span>Preferences</span>
              </button>

              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setMessages([]);
                    setAiState('idle');
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-medium text-slate-600 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (isVoiceMode) {
                    if (recognitionRef.current) {
                      try {
                        recognitionRef.current.stop();
                      } catch {
                        // ignore
                      }
                    }
                    setIsVoiceMode(false);
                    setAiState('idle');
                  } else {
                    startVoiceRecognition();
                  }
                }}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  isVoiceMode
                    ? 'bg-[#005A94] text-white'
                    : 'bg-[#DDEBF7] text-[#005A94] hover:bg-[#005A94] hover:text-white'
                }`}
              >
                <AudioLines className="w-3 h-3" />
                <span>{isVoiceMode ? 'Close Voice' : 'Voice'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsOnboardingComplete(true)}
              className="text-[11px] font-semibold text-slate-500 hover:text-[#005A94] px-2 py-0.5 rounded hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              Skip →
            </button>
          )}
        </div>
      </div>

      {/* =====================================================================
          STAGE 1: CHATGPT-STYLE COMPACT ONBOARDING QUESTIONNAIRE CARD
          ===================================================================== */}
      {!isOnboardingComplete ? (
        <div className="flex-1 flex flex-col items-center justify-center py-2">
          <div className="w-full max-w-md mx-auto">
            {/* Compact AI Greeting Header above the ChatGPT-style card */}
            <div className="flex items-center gap-2.5 mb-2.5 px-1">
              <FluidOrbAILogo size="sm" state="idle" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  Let’s tailor your partner matches
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Answer 4 quick questions so Trade Square AI knows your exact needs
                </div>
              </div>
            </div>

            {/* ChatGPT-Style Interactive Question Box */}
            <motion.div
              layout
              className="bg-white border border-slate-200/95 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] overflow-hidden"
            >
              {/* Subtle Top Progress Bar + Step Counter */}
              <div className="px-4 pt-3 pb-2 border-b border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-400 font-mono tabular-nums">
                  Question {onboardingStep} of 4
                </span>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => setOnboardingStep(step)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        onboardingStep === step
                          ? 'w-5 bg-[#005A94]'
                          : onboardingStep > step
                          ? 'w-2.5 bg-[#005A94]/45'
                          : 'w-2 bg-slate-200'
                      }`}
                      aria-label={`Step ${step}`}
                    />
                  ))}
                </div>
              </div>

              {/* Animated Question Content */}
              <div className="p-3.5 sm:p-4">
                <AnimatePresence mode="wait">
                  {onboardingStep === 1 && (
                    <motion.div
                      key="q1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-2.5"
                    >
                      <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                        What type of business offering are you looking to match?
                      </h2>

                      <div className="space-y-1.5">
                        {Q1_OPTIONS.map((opt, idx) => {
                          const isSelected = onboardingAnswers.offeringNature === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setOnboardingAnswers((prev) => ({
                                  ...prev,
                                  offeringNature: opt.id,
                                  selectedCode: opt.defaultCode
                                }));
                                setTimeout(() => setOnboardingStep(2), 140);
                              }}
                              className={`w-full px-3 py-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                isSelected
                                  ? 'bg-[#DDEBF7]/55 border-[#005A94] text-[#005A94] font-semibold'
                                  : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span
                                  className={`w-5 h-5 rounded-md text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'bg-[#005A94] text-white'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {idx + 1}
                                </span>
                                <span className="text-xs truncate">{opt.label}</span>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#005A94] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {onboardingStep === 2 && (
                    <motion.div
                      key="q2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-2.5"
                    >
                      <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                        Which specific service or product do you provide?
                      </h2>

                      <div className="space-y-1.5">
                        {activeQ2List.map((item, idx) => {
                          const isSelected = onboardingAnswers.selectedCode === item.code;
                          return (
                            <button
                              key={item.code}
                              type="button"
                              onClick={() => {
                                setOnboardingAnswers((prev) => ({
                                  ...prev,
                                  selectedCode: item.code
                                }));
                              }}
                              className={`w-full px-3 py-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                isSelected
                                  ? 'bg-[#DDEBF7]/55 border-[#005A94] text-[#005A94]'
                                  : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span
                                  className={`w-5 h-5 rounded-md text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'bg-[#005A94] text-white'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold truncate">
                                    {item.label}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate">
                                    {item.sub}
                                  </div>
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#005A94] shrink-0" />
                              )}
                            </button>
                          );
                        })}

                        {/* ChatGPT-Style Write-In Row for Custom Scope / Volume */}
                        <div className="pt-1">
                          <input
                            type="text"
                            value={onboardingAnswers.customNote}
                            onChange={(e) =>
                              setOnboardingAnswers((prev) => ({
                                ...prev,
                                customNote: e.target.value
                              }))
                            }
                            placeholder="Optional: Specify volume or service scope (e.g., 100kg, 10 trucks, FinTech API)..."
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#005A94] focus:outline-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {onboardingStep === 3 && (
                    <motion.div
                      key="q3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-2.5"
                    >
                      <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                        Which regional market are you targeting?
                      </h2>

                      <div className="space-y-1.5">
                        {Q3_MARKET_OPTIONS.map((mkt, idx) => {
                          const isSelected = onboardingAnswers.targetCountry === mkt.id;
                          return (
                            <button
                              key={mkt.id}
                              type="button"
                              onClick={() => {
                                setOnboardingAnswers((prev) => ({
                                  ...prev,
                                  targetCountry: mkt.id
                                }));
                                setTimeout(() => setOnboardingStep(4), 140);
                              }}
                              className={`w-full px-3 py-1.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                isSelected
                                  ? 'bg-[#DDEBF7]/55 border-[#005A94] text-[#005A94]'
                                  : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span
                                  className={`w-5 h-5 rounded-md text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'bg-[#005A94] text-white'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold truncate">
                                    {mkt.label}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate">
                                    {mkt.sub}
                                  </div>
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#005A94] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {onboardingStep === 4 && (
                    <motion.div
                      key="q4"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-2.5"
                    >
                      <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                        What should the AI prioritize when ranking partners?
                      </h2>

                      <div className="space-y-1.5">
                        {Q4_PRIORITY_OPTIONS.map((prio, idx) => {
                          const isSelected = onboardingAnswers.priority === prio.id;
                          return (
                            <button
                              key={prio.id}
                              type="button"
                              onClick={() => {
                                const updated: OnboardingAnswers = {
                                  ...onboardingAnswers,
                                  priority: prio.id
                                };
                                setOnboardingAnswers(updated);
                              }}
                              className={`w-full px-3 py-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                isSelected
                                  ? 'bg-[#DDEBF7]/55 border-[#005A94] text-[#005A94]'
                                  : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span
                                  className={`w-5 h-5 rounded-md text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'bg-[#005A94] text-white'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold truncate">
                                    {prio.label}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate">
                                    {prio.sub}
                                  </div>
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#005A94] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Compact Footer Controls inside ChatGPT-style card */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={onboardingStep === 1}
                    onClick={() => setOnboardingStep((s) => Math.max(1, s - 1))}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    Back
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsOnboardingComplete(true)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Skip
                    </button>

                    {onboardingStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => setOnboardingStep((s) => Math.min(4, s + 1))}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#005A94] hover:bg-[#004876] text-white text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => finishOnboarding(onboardingAnswers)}
                        className="inline-flex items-center gap-1 px-3.5 py-1 rounded-lg bg-[#005A94] hover:bg-[#004876] text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        <span>Find Matches</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        /* ===================================================================
           STAGE 2: ULTRA-COMPACT REAL AI CHATBOT (Opens after Onboarding)
           =================================================================== */
        <>
          <div className="flex-1 flex flex-col justify-center my-2 min-h-0">
            <AnimatePresence mode="wait">
              {isVoiceMode ? (
                <motion.div
                  key="voice-stage"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="max-w-lg mx-auto w-full rounded-2xl bg-gradient-to-br from-[#002B49] via-[#005A94] to-[#003B64] border border-[#2673A6]/60 shadow-md p-5 text-white flex flex-col items-center text-center justify-between gap-4"
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#DDEBF7]">
                      Voice Partner Matchmaker
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsVoiceMode(false);
                        setAiState('idle');
                      }}
                      className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-2.5 my-1">
                    <FluidOrbAILogo
                      size="lg"
                      state={aiState === 'thinking' ? 'thinking' : 'speaking'}
                      onClick={() => startVoiceRecognition()}
                    />
                    <div className="space-y-0.5 max-w-sm">
                      <h2 className="text-sm sm:text-base font-bold">
                        {liveTranscript
                          ? `"${liveTranscript}"`
                          : 'Speak your service or product need'}
                      </h2>
                      <p className="text-[11px] text-[#DDEBF7]">
                        Listening in full-duplex mode — speak now or tap a prompt below.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 w-full">
                    {QUICK_PROMPTS.map((q) => (
                      <button
                        key={q.title}
                        type="button"
                        onClick={() => {
                          setIsVoiceMode(false);
                          handleSendMessage(q.prompt, true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-left text-[11px] text-white transition-colors cursor-pointer truncate"
                      >
                        {q.title}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : messages.length === 0 && aiState !== 'thinking' ? (
                <motion.div
                  key="welcome-stage"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-xl mx-auto w-full rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-4 sm:p-5 flex flex-col items-center text-center"
                >
                  <div className="mb-2.5">
                    <FluidOrbAILogo size="md" state="idle" />
                  </div>

                  <h1 className="text-sm sm:text-base font-bold text-slate-900">
                    How can Trade Square AI help your business today?
                  </h1>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-md">
                    Ask about regional partners for B2B services or products. Data tables and
                    matches appear only when relevant to your question.
                  </p>

                  <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full text-left">
                    {QUICK_PROMPTS.map((item) => (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => handleSendMessage(item.prompt)}
                        className="group p-2.5 rounded-xl bg-slate-50/70 hover:bg-[#DDEBF7]/40 border border-slate-200/80 hover:border-[#005A94] transition-all cursor-pointer flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-[#005A94] truncate">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {item.category}
                          </div>
                        </div>
                        <ArrowUpRight className="w-3 h-3 text-[#005A94] shrink-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-3 overflow-y-auto pr-0.5">
                  {messages.map((msg) => {
                    if (msg.role === 'user') {
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-end"
                        >
                          <div className="max-w-lg bg-[#005A94] text-white rounded-2xl rounded-tr-xs px-3.5 py-2 shadow-2xs">
                            <p className="text-xs leading-relaxed">{msg.text}</p>
                          </div>
                        </motion.div>
                      );
                    }

                    const hasRichContent =
                      (msg.includeAnalytics && msg.tableData) ||
                      (msg.includePartnerMatches &&
                        msg.partnerCards &&
                        msg.partnerCards.length > 0);

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-slate-200/95 rounded-2xl shadow-2xs overflow-hidden"
                      >
                        {/* Ultra-Compact Assistant Bar */}
                        <div className="bg-[#F8FAFC] border-b border-slate-100 px-3.5 py-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <FluidOrbAILogo size="xs" state="idle" />
                            <span className="text-[11px] font-bold text-slate-900 truncate">
                              {msg.headline || 'Trade Square AI'}
                            </span>
                            {msg.duplexMode && (
                              <span className="hidden sm:inline text-[10px] font-medium text-[#005A94] bg-[#DDEBF7]/60 px-1.5 py-0.5 rounded">
                                {msg.duplexMode}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                              {msg.timestamp}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => speakText(msg.speechScript || msg.text)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#005A94] hover:bg-[#DDEBF7]/50 transition-colors cursor-pointer shrink-0"
                            title="Listen (Token2wav Voice)"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </button>
                        </div>

                        <div className="p-3.5 space-y-3">
                          <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                            {msg.text}
                          </p>

                          {/* Compact On-Demand SME-Profile-Driven Table */}
                          {msg.includeAnalytics && msg.tableData && (
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <div className="text-[11px] font-bold text-[#005A94]">
                                  {msg.tableData.title}
                                </div>
                                {msg.tableData.smeContextSubtitle && (
                                  <span className="text-[10px] font-mono text-slate-500">
                                    {msg.tableData.smeContextSubtitle}
                                  </span>
                                )}
                              </div>

                              <div className="overflow-x-auto border border-slate-300 rounded-lg">
                                <table className="w-full text-left border-collapse text-[10px] leading-tight">
                                  <thead>
                                    <tr className="bg-[#005A94] text-white font-bold uppercase tracking-wider text-[10px]">
                                      {msg.tableData.headers.map((header, hIdx) => (
                                        <th
                                          key={hIdx}
                                          className="py-1 px-2 border-r border-white/20 last:border-r-0 whitespace-nowrap"
                                        >
                                          {header}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200">
                                    {msg.tableData.rows.map((row, rIdx) => (
                                      <tr
                                        key={rIdx}
                                        className={
                                          rIdx === 0
                                            ? 'bg-[#DDEBF7]/50'
                                            : rIdx % 2 === 1
                                              ? 'bg-slate-50/70 hover:bg-slate-100/80'
                                              : 'bg-white hover:bg-slate-100/80'
                                        }
                                      >
                                        {row.map((cell, cIdx) => (
                                          <td
                                            key={cIdx}
                                            className={`py-1 px-2 border-r border-slate-200 last:border-r-0 whitespace-nowrap ${
                                              cIdx === 0
                                                ? 'font-bold text-slate-950'
                                                : 'text-slate-900 font-semibold font-mono tabular-nums'
                                            }`}
                                          >
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Compact On-Demand Partner Cards */}
                          {msg.includePartnerMatches &&
                            msg.partnerCards &&
                            msg.partnerCards.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-[11px] font-bold text-slate-800">
                                  Top Verified Partner Matches ({msg.partnerCards.length})
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {msg.partnerCards.map((card, idx) => {
                                    const { partner } = card;
                                    const isSaved = savedPartnerIds.includes(partner.id);

                                    return (
                                      <div
                                        key={partner.id}
                                        className="p-2.5 rounded-xl border border-slate-200 hover:border-[#005A94] bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between gap-2"
                                      >
                                        <div className="space-y-0.5">
                                          <div className="flex items-center justify-between gap-1 text-[10px]">
                                            <span className="font-bold text-[#005A94]">
                                              #{idx + 1} · {partner.city}, {card.country}
                                            </span>
                                            <span className="font-mono tabular-nums font-extrabold text-[#1A8754]">
                                              {card.weightedScore}% Fit
                                            </span>
                                          </div>

                                          <h4 className="text-xs font-bold text-slate-900 truncate">
                                            {partner.name.replace(' (sample)', '')}
                                          </h4>

                                          <p className="text-[10px] text-slate-600 line-clamp-2 leading-snug">
                                            {card.customFitReason}
                                          </p>
                                        </div>

                                        <div className="pt-1.5 border-t border-slate-200/70 flex items-center justify-between gap-1">
                                          <span className="text-[10px] font-mono tabular-nums text-slate-500 truncate">
                                            {card.onTimePaymentPct}% paid · {card.completedContractsOrLots} lots
                                          </span>

                                          <div className="flex items-center gap-1 shrink-0">
                                            <button
                                              type="button"
                                              onClick={() => onToggleSavePartner(partner.id)}
                                              className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold cursor-pointer ${
                                                isSaved
                                                  ? 'bg-[#DDEBF7] border-[#005A94] text-[#005A94]'
                                                  : 'bg-white border-slate-300 text-slate-600'
                                              }`}
                                            >
                                              <Bookmark className="w-2.5 h-2.5 inline" />
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => onSelectPartnerDetail(partner)}
                                              className="px-2 py-0.5 rounded border border-[#005A94]/40 bg-white text-[#005A94] text-[10px] font-semibold cursor-pointer"
                                            >
                                              Dossier
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => onRequestIntroduction(partner)}
                                              className="px-2 py-0.5 rounded bg-[#005A94] text-white text-[10px] font-semibold cursor-pointer"
                                            >
                                              Connect
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                          {!hasRichContent && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {QUICK_PROMPTS.slice(0, 3).map((q) => (
                                <button
                                  key={q.title}
                                  type="button"
                                  onClick={() => handleSendMessage(q.prompt)}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-[#DDEBF7] text-[10px] font-medium text-[#005A94] transition-colors cursor-pointer"
                                >
                                  {q.title} →
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {aiState === 'thinking' && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 max-w-md"
                    >
                      <FluidOrbAILogo size="xs" state="thinking" />
                      <span className="text-[11px] font-semibold text-slate-600">
                        Realtime-Venus Harness analyzing regional dataset & matches...
                      </span>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================================
              COMPACT CHATGPT-STYLE BOTTOM COMPOSER PILL (Full-Duplex Interrupt Ready)
              ================================================================= */}
          <div className="sticky bottom-0 z-20 pt-1 bg-[#F4F6F9] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="max-w-2xl mx-auto bg-white border border-slate-300/90 focus-within:border-[#005A94] rounded-full px-2.5 py-1 shadow-xs flex items-center gap-1.5"
            >
              <FluidOrbAILogo size="xs" state={aiState} />

              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask or interrupt in real time — describe your service or product need..."
                className="flex-1 bg-transparent px-1.5 py-1 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none min-w-0"
              />

              <button
                type="button"
                onClick={() => startVoiceRecognition()}
                className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-[#005A94] transition-colors cursor-pointer shrink-0"
                title="Full-Duplex Voice Input (ASR Pipeline)"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              <button
                type="submit"
                disabled={!inputPrompt.trim()}
                className="w-7 h-7 rounded-full bg-[#005A94] hover:bg-[#004876] disabled:opacity-35 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Send (Full-Duplex)"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
