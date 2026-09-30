/**
 * TradeChat Component
 * Fixed, animated chatbot interface positioned in the center of the dashboard.
 * - Uses framer-motion to replicate the smooth, pulsing expansion animation found in OpenAI's Voice Mode.
 * - Idle State: Displays a compact, professional floating bubble in the center of the dashboard with
 *   a live pulsing OpenAI-style fluid orb, concentric acoustic rings, and active session turn badge.
 * - Active / Clicked State: Smoothly expands via spring layout animation into an authentic
 *   OpenAI Voice Mode listening pulse and a simplified, executive business-focused conversational view.
 * - State-Managed Chat History: Tracks all conversational turns and multi-session threads during
 *   the user's session (backed by sessionStorage) so users can inspect, replay, switch between,
 *   and resume any previous conversational turns.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  AudioLines,
  Mic,
  X,
  Minimize2,
  RotateCcw,
  ArrowUpRight,
  History,
  Plus,
  Trash2,
  Clock,
  MessageSquare,
  Volume2
} from 'lucide-react';
import { KenyanPartner, RwandanSME, ExportOpportunity, ActiveScreen } from '../types';

export interface TradeChatProps {
  sme?: RwandanSME;
  opportunity?: ExportOpportunity;
  scoredPartners?: {
    partner: KenyanPartner;
    scoreBreakdown: any;
  }[];
  onSelectPartnerDetail?: (partner: KenyanPartner) => void;
  onRequestIntroduction?: (partner: KenyanPartner) => void;
  onNavigateScreen?: (screen: ActiveScreen) => void;
  onOpenAssumptions?: () => void;
  defaultOpen?: boolean;
}

type VoicePhase = 'coalescing' | 'listening' | 'thinking' | 'speaking';

export interface ChatMessage {
  id: string;
  turnIndex: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode: 'voice' | 'text';
  recommendedPartners?: {
    partner: KenyanPartner;
    score: number;
  }[];
}

export interface ChatSession {
  id: string;
  title: string;
  smeName: string;
  productHs: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

const SESSION_STORAGE_KEY = 'trade_square_chat_sessions_v1';

const BUSINESS_PROMPTS = [
  'Shortlist verified Kenyan buyers',
  'Calculate Nairobi landed price',
  'Request MINICOM facilitation'
];

function formatTimeNow(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function createEmptySession(smeName: string, productHs: string): ChatSession {
  const nowStr = formatTimeNow();
  return {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: 'New Corridor Consultation',
    smeName,
    productHs,
    createdAt: nowStr,
    updatedAt: nowStr,
    messages: []
  };
}

export const TradeChat: React.FC<TradeChatProps> = ({
  sme,
  opportunity,
  scoredPartners = [],
  onSelectPartnerDetail,
  onRequestIntroduction,
  defaultOpen = false
}) => {
  const businessName = sme?.businessName?.replace(' (sample)', '') || 'Rwandan Exporter';
  const productHs = opportunity?.productHs || '0713.33';
  const capacityKg = opportunity?.capacityKgMonth || 20000;
  const exWorksRwf = opportunity?.exWorksPriceRwf || 950;

  // Idle (small professional bubble) vs Active (expanded business conversational view)
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  // OpenAI Voice Mode overlay state inside the expanded view
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [voicePhase, setVoicePhase] = useState<VoicePhase>('coalescing');
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  // History drawer toggle inside the expanded view
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // State-Managed Session & Turn History (persisted in sessionStorage for the current browser session)
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Ignore storage read errors
      }
    }
    return [createEmptySession(businessName, productHs)];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || '';
  });

  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active session & its conversational turns
  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  // Total turns across the active session (1 user + 1 assistant = 1 exchange turn, or count of messages)
  const activeTurnCount = Math.ceil(messages.length / 2);
  const totalSavedSessionsCount = sessions.filter((s) => s.messages.length > 0).length;

  // Sync sessions to sessionStorage whenever updated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
      } catch {
        // Ignore storage quota errors
      }
    }
  }, [sessions]);

  useEffect(() => {
    if (!isHistoryOpen && !isVoiceActive) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isTyping, isHistoryOpen, isVoiceActive]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Append messages to the active session state
  const appendMessagesToActiveSession = (newMsgs: ChatMessage[], firstPromptTitle?: string) => {
    const nowStr = formatTimeNow();
    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id !== activeSession.id) return sess;
        const updatedMessages = [...sess.messages, ...newMsgs];
        const nextTitle =
          sess.messages.length === 0 && firstPromptTitle
            ? firstPromptTitle.length > 42
              ? `${firstPromptTitle.slice(0, 42)}...`
              : firstPromptTitle
            : sess.title;
        return {
          ...sess,
          title: nextTitle,
          smeName: businessName,
          productHs,
          updatedAt: nowStr,
          messages: updatedMessages
        };
      })
    );
  };

  // Start a new conversation session while preserving all previous sessions in state history
  const handleStartNewSession = () => {
    // If current session is already empty, just switch to chat view
    if (messages.length === 0) {
      setIsHistoryOpen(false);
      setIsVoiceActive(false);
      return;
    }
    const fresh = createEmptySession(businessName, productHs);
    setSessions((prev) => [fresh, ...prev]);
    setActiveSessionId(fresh.id);
    setIsHistoryOpen(false);
    setIsVoiceActive(false);
  };

  // Select a previous session from history to view/continue its turns
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setIsHistoryOpen(false);
    setIsVoiceActive(false);
  };

  // Delete a specific session from history
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== sessionId);
      if (remaining.length === 0) {
        const fresh = createEmptySession(businessName, productHs);
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (sessionId === activeSession.id) {
        setActiveSessionId(remaining[0].id);
      }
      return remaining;
    });
  };

  // Clear all session history
  const handleClearAllHistory = () => {
    const fresh = createEmptySession(businessName, productHs);
    setSessions([fresh]);
    setActiveSessionId(fresh.id);
    setIsHistoryOpen(false);
  };

  // Expand from Idle Bubble -> OpenAI Voice Pulse -> Simplified Business Chat
  const handleExpandFromBubble = (startInVoice = false) => {
    setIsOpen(true);
    setIsHistoryOpen(false);

    // If user already has turns in the active session and didn't explicitly click the voice icon,
    // open directly to their conversation turns after a crisp 900ms voice-orb pulse
    setIsVoiceActive(true);
    setVoicePhase('coalescing');
    setVoiceTranscript('');

    const t1 = setTimeout(() => {
      setVoicePhase('listening');
    }, 450);

    if (!startInVoice) {
      const delayMs = messages.length > 0 ? 1050 : 1650;
      const t2 = setTimeout(() => {
        setIsVoiceActive(false);
      }, delayMs);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      startBrowserSpeechRecognition();
    }
  };

  const speakResponse = (text: string) => {
    const cleanText = text.replace(/[*`_#•]/g, '');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.02;
      utterance.onstart = () => setVoicePhase('speaking');
      utterance.onend = () => setVoicePhase('listening');
      utterance.onerror = () => setVoicePhase('listening');
      window.speechSynthesis.speak(utterance);
    } else {
      setVoicePhase('speaking');
      setTimeout(() => setVoicePhase('listening'), 2800);
    }
  };

  const startBrowserSpeechRecognition = () => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      try {
        const recognition = new SpeechRecognitionAPI();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            handleSend(transcript, true);
          }
        };

        recognition.onerror = () => {
          setVoicePhase('listening');
        };

        recognition.start();
      } catch {
        setVoicePhase('listening');
      }
    }
  };

  const handleToggleVoiceMode = () => {
    setIsHistoryOpen(false);
    setIsVoiceActive(true);
    setVoicePhase('listening');
    setVoiceTranscript('');
    startBrowserSpeechRecognition();
  };

  const handleMinimizeToBubble = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsVoiceActive(false);
    setIsHistoryOpen(false);
    setIsOpen(false);
  };

  const handleSend = async (overridePrompt?: string, fromVoice = false) => {
    const text = (overridePrompt ?? input).trim();
    if (!text || isTyping) return;

    const nextTurnIndex = Math.floor(messages.length / 2) + 1;
    const nowStr = formatTimeNow();
    const mode: 'voice' | 'text' = fromVoice || isVoiceActive ? 'voice' : 'text';

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      turnIndex: nextTurnIndex,
      role: 'user',
      content: text,
      timestamp: nowStr,
      mode
    };

    // Build history payload of previous turns before appending
    const priorHistory = messages.map((m) => ({
      role: m.role,
      content: m.content
    }));

    appendMessagesToActiveSession([userMsg], text);
    if (!overridePrompt) setInput('');
    setIsTyping(true);

    if (fromVoice || isVoiceActive) {
      setVoicePhase('thinking');
      setVoiceTranscript(text);
    }

    const topMatches = scoredPartners.slice(0, 2).map((sp) => ({
      partner: sp.partner,
      score: sp.scoreBreakdown?.totalScore ?? 88
    }));

    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          partnerCategory: 'Verified Kenyan Buyers',
          regionalMarket: 'Kenya (Northern Corridor)',
          symbolContext: `HS ${productHs} (${capacityKg.toLocaleString()} kg/mo at ${exWorksRwf.toLocaleString()} RWF/kg)`,
          smeContext: businessName,
          history: priorHistory
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.answer) {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            turnIndex: nextTurnIndex,
            role: 'assistant',
            content: data.answer,
            timestamp: formatTimeNow(),
            mode,
            recommendedPartners: topMatches
          };
          appendMessagesToActiveSession([aiMsg]);
          setIsTyping(false);
          if (fromVoice) {
            speakResponse(data.answer);
            setTimeout(() => setIsVoiceActive(false), 1800);
          }
          return;
        }
      }
      throw new Error('Fallback');
    } catch {
      setTimeout(() => {
        const landedKes = ((exWorksRwf + 85) / 9.85).toFixed(1);
        const topBuyer = topMatches[0]?.partner;

        const reply = `For ${businessName} (HS ${productHs}, ${capacityKg.toLocaleString()} kg/mo), the estimated Nairobi landed cost is KES ${landedKes}/kg under 0% EAC tariff.\n\nRecommended counterparty: ${
          topBuyer?.name || 'Nairobi Grain & Pulses Ltd (sample)'
        } (${topBuyer?.city || 'Nairobi'}, KRA PIN ${topBuyer?.kraPin || 'P051209384K'}).`;

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          turnIndex: nextTurnIndex,
          role: 'assistant',
          content: reply,
          timestamp: formatTimeNow(),
          mode,
          recommendedPartners: topMatches
        };
        appendMessagesToActiveSession([aiMsg]);
        setIsTyping(false);
        if (fromVoice) {
          speakResponse(reply);
          setTimeout(() => setIsVoiceActive(false), 1800);
        }
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 lg:left-56 top-14 sm:top-16 z-30 pointer-events-none flex items-center justify-center p-4 sm:p-6">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* =====================================================================
              STATE 1: IDLE — SMALL PROFESSIONAL PULSING VOICE-MODE BUBBLE
              Positioned in the center of the dashboard; expands on click
              ===================================================================== */
          <motion.div
            key="idle-bubble"
            layoutId="trade-chat-shell"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="pointer-events-auto relative flex flex-col items-center justify-center group"
          >
            {/* Outer OpenAI Voice-Mode Pulsing Aura Rings */}
            <motion.div
              animate={{
                scale: [1, 1.32, 1],
                opacity: [0.28, 0.04, 0.28]
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#005A94]/30 via-[#0096FC]/25 to-[#38BDF8]/30 blur-md pointer-events-none"
            />

            <motion.div
              animate={{
                scale: [1.02, 1.18, 1.02],
                opacity: [0.35, 0.08, 0.35]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.3
              }}
              className="absolute w-24 h-24 rounded-full border border-[#0096FC]/35 pointer-events-none"
            />

            {/* Main Interactive Bubble Button */}
            <motion.button
              type="button"
              onClick={() => handleExpandFromBubble(false)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="relative flex items-center gap-3.5 pl-2.5 pr-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_14px_40px_rgba(0,90,148,0.22)] hover:border-[#005A94]/50 transition-colors cursor-pointer"
              aria-label="Open Trade Square AI Assistant"
            >
              {/* Signature OpenAI Fluid Cloud Orb */}
              <motion.div
                layoutId="trade-chat-orb"
                animate={{
                  scale: [1, 1.06, 0.97, 1],
                  borderRadius: [
                    '50% 50% 50% 50%',
                    '46% 54% 48% 52%',
                    '53% 47% 54% 46%',
                    '50% 50% 50% 50%'
                  ]
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="relative w-11 h-11 rounded-full overflow-hidden shadow-[0_4px_16px_rgba(0,150,252,0.45)] bg-[#005A94] shrink-0"
              >
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.15, 1] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-2 rounded-full opacity-90"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 30%, #FFFFFF 0%, #7DD3FC 30%, #0096FC 60%, transparent 78%)'
                  }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-3 rounded-full mix-blend-screen opacity-80"
                  style={{
                    background:
                      'radial-gradient(circle at 70% 65%, #E0F2FE 0%, #38BDF8 38%, #003893 75%, transparent 88%)'
                  }}
                />
              </motion.div>

              {/* Concise Professional Business Label + Active Session Turn Indicator */}
              <div className="text-left pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 tracking-tight">
                    Trade Square AI
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {activeTurnCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded bg-[#DDEBF7] text-[#005A94] text-[10px] font-semibold tabular-nums">
                      {activeTurnCount} {activeTurnCount === 1 ? 'turn' : 'turns'}
                    </span>
                  )}
                </div>
                <span className="block text-[11px] text-slate-500 font-medium">
                  {activeTurnCount > 0
                    ? 'Tap to resume conversation'
                    : 'Tap to open · Corridor Copilot'}
                </span>
              </div>

              {/* Quick Voice Mode Trigger Pill */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandFromBubble(true);
                }}
                className="w-8 h-8 rounded-full bg-[#F2F4F7] hover:bg-[#DDEBF7] text-[#005A94] flex items-center justify-center transition-colors"
                title="Start live voice conversation"
              >
                <AudioLines className="w-4 h-4" />
              </div>
            </motion.button>
          </motion.div>
        ) : (
          /* =====================================================================
              STATE 2: EXPANDED — OPENAI VOICE PULSE, TURN THREAD & SESSION HISTORY
              ===================================================================== */
          <motion.div
            key="expanded-chat"
            layoutId="trade-chat-shell"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="pointer-events-auto w-full max-w-xl bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.16)] flex flex-col justify-between overflow-hidden max-h-[580px]"
          >
            {/* Minimal Executive Top Header */}
            <div className="px-4 sm:px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC] gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Miniature Live Fluid Orb */}
                <motion.button
                  type="button"
                  onClick={handleToggleVoiceMode}
                  className="relative w-6 h-6 rounded-full overflow-hidden shadow-xs bg-[#005A94] shrink-0 cursor-pointer"
                  title="Switch to OpenAI Voice Mode"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-1.5 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 30%, #FFFFFF 0%, #38BDF8 40%, #005A94 82%)'
                    }}
                  />
                </motion.button>

                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs font-bold text-slate-900">
                    Trade Square AI
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[11px] text-slate-500 truncate">
                    {businessName} (HS {productHs})
                  </span>
                </div>
              </div>

              {/* Right Header Controls: Session History, New Chat, Minimize */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Session Turn History Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsVoiceActive(false);
                    setIsHistoryOpen((prev) => !prev);
                  }}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    isHistoryOpen
                      ? 'bg-[#DDEBF7] text-[#005A94] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title="View previous conversational turns & sessions"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>History</span>
                  {(activeTurnCount > 0 || totalSavedSessionsCount > 0) && (
                    <span className="px-1 py-0.2 rounded bg-[#005A94]/10 text-[#005A94] text-[10px] font-mono tabular-nums">
                      {activeTurnCount > 0 ? activeTurnCount : totalSavedSessionsCount}
                    </span>
                  )}
                </button>

                {/* New Conversation Session Button */}
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleStartNewSession}
                    className="p-1.5 rounded-md text-slate-500 hover:text-[#005A94] hover:bg-slate-200/60 transition-colors cursor-pointer"
                    title="Start new conversation (saves current turns to history)"
                    aria-label="New conversation"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Minimize to Idle Bubble */}
                <button
                  type="button"
                  onClick={handleMinimizeToBubble}
                  className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Minimize to bubble"
                  aria-label="Minimize chatbot"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Center Workspace: History Drawer OR Voice Mode Animation OR Business Chat Thread */}
            <AnimatePresence mode="wait">
              {isHistoryOpen ? (
                /* -----------------------------------------------------------------
                    SESSION & CONVERSATIONAL TURN HISTORY VIEW
                    Allows viewing previous turns in the active session or switching
                    across all saved sessions from this browser session.
                    ----------------------------------------------------------------- */
                <motion.div
                  key="session-history-view"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-y-auto px-5 py-4 flex flex-col min-h-[340px] max-h-[430px] space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        Session Conversation History
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Review previous conversational turns or resume an earlier thread
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleStartNewSession}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#005A94] hover:bg-[#004876] text-white text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>New Chat</span>
                      </button>
                      {totalSavedSessionsCount > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAllHistory}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-500 hover:text-red-600 text-[11px] transition-colors cursor-pointer"
                          title="Clear all session history"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active Session Turn-by-Turn Log */}
                  {messages.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <span>Current Thread Turns ({activeTurnCount})</span>
                        <button
                          type="button"
                          onClick={() => setIsHistoryOpen(false)}
                          className="text-[#005A94] hover:underline normal-case font-medium cursor-pointer"
                        >
                          Return to active thread →
                        </button>
                      </div>

                      <div className="space-y-2">
                        {Array.from({ length: activeTurnCount }).map((_, idx) => {
                          const turnNum = idx + 1;
                          const userTurn = messages[idx * 2];
                          const aiTurn = messages[idx * 2 + 1];
                          if (!userTurn) return null;

                          return (
                            <div
                              key={userTurn.id}
                              onClick={() => setIsHistoryOpen(false)}
                              className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-[#005A94]/40 transition-colors cursor-pointer space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.2 rounded bg-[#DDEBF7] text-[#005A94] font-bold font-mono">
                                    Turn #{turnNum}
                                  </span>
                                  <span className="uppercase font-medium text-slate-400">
                                    {userTurn.mode === 'voice' ? 'Voice Turn' : 'Text Turn'}
                                  </span>
                                </div>
                                <span className="font-mono tabular-nums flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {userTurn.timestamp}
                                </span>
                              </div>

                              <div className="text-xs font-semibold text-slate-900">
                                Q: {userTurn.content}
                              </div>

                              {aiTurn && (
                                <div className="text-[11px] text-slate-600 line-clamp-2 pl-2 border-l-2 border-[#005A94]/40">
                                  {aiTurn.content}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* All Saved Sessions in Browser Session */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Session Threads ({sessions.filter((s) => s.messages.length > 0).length})
                    </div>

                    {sessions.filter((s) => s.messages.length > 0).length === 0 ? (
                      <div className="py-10 text-center space-y-2 border border-dashed border-slate-200 rounded-xl">
                        <MessageSquare className="w-5 h-5 text-slate-300 mx-auto" />
                        <p className="text-xs font-medium text-slate-600">
                          No conversational turns recorded yet in this session.
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Ask a trade question or use Voice Mode to build your session history.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {sessions
                          .filter((s) => s.messages.length > 0)
                          .map((sess) => {
                            const isCurrent = sess.id === activeSession.id;
                            const turnTotal = Math.ceil(sess.messages.length / 2);
                            const lastMsg = sess.messages[sess.messages.length - 1];

                            return (
                              <div
                                key={sess.id}
                                onClick={() => handleSelectSession(sess.id)}
                                className={`p-3 rounded-xl border transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                                  isCurrent
                                    ? 'bg-[#DDEBF7]/35 border-[#005A94]/50'
                                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                                }`}
                              >
                                <div className="min-w-0 flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-900 truncate">
                                      {sess.title}
                                    </span>
                                    {isCurrent && (
                                      <span className="px-1.5 py-0.2 rounded bg-[#005A94] text-white text-[9px] font-semibold">
                                        Active
                                      </span>
                                    )}
                                  </div>

                                  {lastMsg && (
                                    <p className="text-[11px] text-slate-500 line-clamp-1">
                                      {lastMsg.content}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono tabular-nums">
                                    <span>
                                      {turnTotal} {turnTotal === 1 ? 'turn' : 'turns'}
                                    </span>
                                    <span>·</span>
                                    <span>HS {sess.productHs}</span>
                                    <span>·</span>
                                    <span>Updated {sess.updatedAt}</span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteSession(sess.id, e)}
                                  className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                                  title="Remove session"
                                  aria-label="Remove session"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : isVoiceActive ? (
                /* -----------------------------------------------------------------
                    OPENAI VOICE MODE FLUID EXPANSION & LISTENING VIEW
                    ----------------------------------------------------------------- */
                <motion.div
                  key="voice-listening-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 min-h-[360px] flex flex-col items-center justify-between py-6 px-6 select-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      Voice Conversation Mode
                    </span>
                    {activeTurnCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsVoiceActive(false)}
                        className="px-2 py-0.5 rounded-full bg-[#DDEBF7] text-[#005A94] text-[10px] font-semibold hover:bg-[#005A94] hover:text-white transition-colors cursor-pointer"
                      >
                        View {activeTurnCount} previous {activeTurnCount === 1 ? 'turn' : 'turns'} →
                      </button>
                    )}
                  </div>

                  {/* Center Morphing Fluid Sphere / 4-Dot Cloud */}
                  <div className="relative flex flex-col items-center justify-center my-auto">
                    <AnimatePresence mode="wait">
                      {voicePhase === 'coalescing' || voicePhase === 'thinking' ? (
                        <motion.div
                          key="coalescing-dots"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1, rotate: [0, 180, 360] }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{
                            rotate: { duration: 2.2, repeat: Infinity, ease: 'linear' },
                            scale: { duration: 0.25 }
                          }}
                          className="w-32 h-32 flex items-center justify-center gap-2"
                        >
                          {[0, 1, 2, 3].map((i) => (
                            <motion.span
                              key={i}
                              animate={{
                                height: [18, 40, 18],
                                scale: [0.95, 1.1, 0.95]
                              }}
                              transition={{
                                duration: 0.85,
                                repeat: Infinity,
                                delay: i * 0.13,
                                ease: 'easeInOut'
                              }}
                              className="w-4 rounded-full bg-gradient-to-b from-[#38BDF8] via-[#0096FC] to-[#005A94] shadow-[0_0_16px_rgba(0,150,252,0.4)]"
                            />
                          ))}
                        </motion.div>
                      ) : (
                        <div
                          key="listening-sphere"
                          onClick={() =>
                            handleSend(
                              'Shortlist verified Kenyan buyers for my commodity',
                              true
                            )
                          }
                          className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center cursor-pointer"
                          title="Speak now or tap the orb"
                        >
                          {/* Pulsing Acoustic Rings */}
                          <motion.div
                            animate={{
                              scale: voicePhase === 'speaking' ? [1, 1.36, 1] : [1, 1.2, 1],
                              opacity:
                                voicePhase === 'speaking'
                                  ? [0.35, 0.05, 0.35]
                                  : [0.24, 0.04, 0.24]
                            }}
                            transition={{
                              duration: voicePhase === 'speaking' ? 1.3 : 2.4,
                              repeat: Infinity,
                              ease: 'easeInOut'
                            }}
                            className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#005A94]/30 via-[#0096FC]/25 to-[#7DD3FC]/30 blur-md"
                          />

                          <motion.div
                            animate={{
                              scale:
                                voicePhase === 'speaking'
                                  ? [1.04, 1.22, 1.04]
                                  : [1.02, 1.12, 1.02],
                              opacity: [0.32, 0.08, 0.32]
                            }}
                            transition={{
                              duration: 1.9,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: 0.2
                            }}
                            className="absolute inset-2 rounded-full border border-[#0096FC]/30"
                          />

                          {/* Fluid Sky-Blue Orb */}
                          <motion.div
                            layoutId="trade-chat-orb"
                            animate={{
                              scale:
                                voicePhase === 'speaking'
                                  ? [1, 1.12, 0.96, 1.08, 1]
                                  : [1, 1.05, 0.98, 1],
                              borderRadius: [
                                '50% 50% 50% 50% / 50% 50% 50% 50%',
                                '45% 55% 48% 52% / 52% 46% 54% 48%',
                                '53% 47% 54% 46% / 47% 53% 47% 53%',
                                '50% 50% 50% 50% / 50% 50% 50% 50%'
                              ]
                            }}
                            transition={{
                              duration: voicePhase === 'speaking' ? 1.5 : 3.0,
                              repeat: Infinity,
                              ease: 'easeInOut'
                            }}
                            className="relative w-28 h-28 sm:w-32 sm:h-32 overflow-hidden shadow-[0_14px_40px_rgba(0,90,148,0.36)] bg-[#005A94]"
                          >
                            <motion.div
                              animate={{ rotate: 360, scale: [1, 1.14, 1] }}
                              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                              className="absolute -inset-5 rounded-full opacity-90"
                              style={{
                                background:
                                  'radial-gradient(circle at 30% 30%, #FFFFFF 0%, #7DD3FC 28%, #0096FC 58%, transparent 76%)'
                              }}
                            />
                            <motion.div
                              animate={{ rotate: -360, scale: [1.1, 0.95, 1.1] }}
                              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                              className="absolute -inset-6 rounded-full mix-blend-screen opacity-85"
                              style={{
                                background:
                                  'radial-gradient(circle at 70% 65%, #E0F2FE 0%, #38BDF8 35%, #003893 70%, transparent 85%)'
                              }}
                            />
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>

                    <div className="mt-5 text-center space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">
                        {voicePhase === 'coalescing' && 'Calibrating voice & trade intelligence...'}
                        {voicePhase === 'listening' && 'Listening...'}
                        {voicePhase === 'thinking' && 'Analyzing verified corridor records...'}
                        {voicePhase === 'speaking' && 'Speaking...'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {voiceTranscript
                          ? `"${voiceTranscript}"`
                          : 'Speak naturally or select a prompt below'}
                      </p>
                    </div>
                  </div>

                  {/* Voice Controls */}
                  <div className="w-full flex flex-col items-center gap-3">
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {BUSINESS_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleSend(prompt, true)}
                          className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-[#005A94] text-[11px] font-medium text-slate-700 hover:text-[#005A94] transition-colors cursor-pointer"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={startBrowserSpeechRecognition}
                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-[#005A94] flex items-center justify-center transition-colors cursor-pointer"
                        title="Tap to speak"
                        aria-label="Tap to speak"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsVoiceActive(false)}
                        className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Switch to text view"
                        aria-label="Switch to text view"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* -----------------------------------------------------------------
                    SIMPLIFIED BUSINESS-FOCUSED CONVERSATIONAL VIEW (WITH TURN HISTORY)
                    ----------------------------------------------------------------- */
                <motion.div
                  key="business-chat-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-y-auto px-5 py-5 flex flex-col min-h-[340px] max-h-[430px]"
                >
                  {messages.length === 0 ? (
                    <div className="m-auto text-center space-y-4 max-w-md py-4">
                      {/* Pulsing Center Fluid Orb (Click for Live Voice Mode) */}
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.24, 1], opacity: [0.25, 0.04, 0.25] }}
                          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute inset-0 rounded-full bg-[#0096FC]/25 blur-xs"
                        />
                        <motion.button
                          layoutId="trade-chat-orb"
                          type="button"
                          onClick={handleToggleVoiceMode}
                          animate={{
                            scale: [1, 1.05, 1],
                            borderRadius: [
                              '50% 50% 50% 50%',
                              '46% 54% 49% 51%',
                              '52% 48% 53% 47%',
                              '50% 50% 50% 50%'
                            ]
                          }}
                          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                          className="relative w-14 h-14 overflow-hidden shadow-[0_8px_24px_rgba(0,90,148,0.28)] bg-[#005A94] cursor-pointer"
                          title="Tap for live voice mode"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                            className="absolute -inset-2.5 rounded-full"
                            style={{
                              background:
                                'radial-gradient(circle at 30% 30%, #FFFFFF 0%, #7DD3FC 32%, #0096FC 62%, #003893 100%)'
                            }}
                          />
                        </motion.button>
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight">
                          How can I assist your export trade?
                        </h2>
                        <p className="text-[11px] text-slate-500">
                          HS {productHs} · {capacityKg.toLocaleString()} kg/mo · Northern Corridor
                        </p>
                      </div>

                      {/* 3 Executive Business Quick Prompts */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                        {BUSINESS_PROMPTS.map((label) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => handleSend(label)}
                            className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-[#005A94] text-[11px] font-medium text-slate-700 hover:text-[#005A94] bg-slate-50/70 hover:bg-white transition-colors cursor-pointer"
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* Quick Link to Previous Session History if earlier threads exist */}
                      {totalSavedSessionsCount > 0 && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setIsHistoryOpen(true)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#005A94] hover:underline cursor-pointer"
                          >
                            <History className="w-3 h-3" />
                            <span>
                              View {totalSavedSessionsCount} previous conversation{' '}
                              {totalSavedSessionsCount === 1 ? 'thread' : 'threads'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3.5 w-full">
                      {/* Sticky Session Turn Counter Bar */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[10px] text-slate-400">
                        <span className="font-semibold uppercase tracking-wider">
                          Session History · {activeTurnCount}{' '}
                          {activeTurnCount === 1 ? 'Conversational Turn' : 'Conversational Turns'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsHistoryOpen(true)}
                          className="text-[#005A94] hover:underline font-medium cursor-pointer"
                        >
                          Turn Log & Threads
                        </button>
                      </div>

                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex flex-col ${
                            msg.role === 'user' ? 'items-end' : 'items-start'
                          }`}
                        >
                          {/* Turn Metadata Header */}
                          <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                            <span className="font-mono font-semibold text-slate-500">
                              Turn #{msg.turnIndex}
                            </span>
                            <span>·</span>
                            <span>{msg.role === 'user' ? 'You' : 'Trade Square AI'}</span>
                            {msg.mode === 'voice' && (
                              <>
                                <span>·</span>
                                <span className="text-[#005A94] font-medium">Voice</span>
                              </>
                            )}
                            <span>·</span>
                            <span className="font-mono tabular-nums">{msg.timestamp}</span>
                            {msg.role === 'assistant' && (
                              <button
                                type="button"
                                onClick={() => speakResponse(msg.content)}
                                className="ml-1 text-slate-400 hover:text-[#005A94] transition-colors cursor-pointer"
                                title="Read response aloud"
                                aria-label="Read response aloud"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div
                            className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-[#005A94] text-white'
                                : 'bg-slate-50 text-slate-800 border border-slate-200/80'
                            }`}
                          >
                            <div className="whitespace-pre-line">{msg.content}</div>

                            {/* Verified Kenyan Partner Action Rows */}
                            {msg.role === 'assistant' &&
                              msg.recommendedPartners &&
                              msg.recommendedPartners.length > 0 && (
                                <div className="mt-2.5 pt-2 border-t border-slate-200/70 space-y-1.5">
                                  {msg.recommendedPartners.map(({ partner, score }) => (
                                    <div
                                      key={partner.id}
                                      className="flex items-center justify-between gap-2.5 py-1.5 px-2.5 rounded-lg bg-white border border-slate-200/80 text-[11px]"
                                    >
                                      <div className="min-w-0">
                                        <span className="font-semibold text-slate-900 truncate block">
                                          {partner.name}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                                          {partner.city} · {partner.kraPin} · Score {score}/100
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        {onSelectPartnerDetail && (
                                          <button
                                            type="button"
                                            onClick={() => onSelectPartnerDetail(partner)}
                                            className="text-[10px] font-medium text-[#005A94] hover:underline flex items-center gap-0.5 cursor-pointer"
                                          >
                                            <span>View</span>
                                            <ArrowUpRight className="w-3 h-3" />
                                          </button>
                                        )}
                                        {onRequestIntroduction && (
                                          <button
                                            type="button"
                                            onClick={() => onRequestIntroduction(partner)}
                                            className="px-2 py-0.5 rounded bg-[#005A94] text-white text-[10px] font-medium hover:bg-[#004876] cursor-pointer"
                                          >
                                            Introduce
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        </motion.div>
                      ))}

                      {isTyping && (
                        <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-slate-400">
                          <motion.span
                            animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-[#005A94]"
                          />
                          <span>Analyzing corridor data...</span>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Streamlined Business Composer */}
            <div className="p-3 border-t border-slate-100 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (isVoiceActive) setIsVoiceActive(false);
                  if (isHistoryOpen) setIsHistoryOpen(false);
                  handleSend();
                }}
                className="flex items-center gap-2 bg-slate-50 focus-within:bg-white border border-slate-200 focus-within:border-slate-400 rounded-full px-3.5 py-1.5 transition-colors"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a business or trade question..."
                  className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={handleToggleVoiceMode}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isVoiceActive
                      ? 'bg-[#005A94] text-white'
                      : 'hover:bg-slate-200/70 text-slate-600 hover:text-slate-900'
                  }`}
                  title="Voice conversation mode"
                  aria-label="Voice conversation mode"
                >
                  <AudioLines className="w-3.5 h-3.5" />
                </button>

                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-7 h-7 rounded-full bg-[#005A94] hover:bg-[#004876] text-white disabled:opacity-25 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Send message"
                >
                  <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
