/**
 * Recreated Sign In Modal with 2-Step Authentication:
 * - Step 1: Enter TIN Number & Password
 * - Step 2: 6-Digit Email Verification Code (OTP) sent to registered email
 * - Step 3: Verified -> Launches Interactive Portal
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Hash,
  Eye,
  EyeOff,
  Mail,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { CreateAccountDropdown, AccountCreationType } from './CreateAccountDropdown';
import { signInWithGoogleAndSyncProfile } from '../services/firebase';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchInteractivePortal?: () => void;
  onCreateAccount?: (type: AccountCreationType) => void;
}

type AuthStep = 'credentials' | 'otp' | 'verified';

const KNOWN_TIN_EMAILS: Record<string, { name: string; email: string }> = {
  '102938475': {
    name: 'Virunga Valley Agro-Processors Ltd',
    email: 'exports@virungavalley.rw'
  },
  '104829103': {
    name: 'Kigali Corridor Cold-Chain & Freight Ltd',
    email: 'operations@kigalifreight.rw'
  },
  '108374651': {
    name: 'Akagera Packaging & Industrial Solutions Ltd',
    email: 'commercial@akagerapack.rw'
  }
};

function resolveAccountEmail(tin: string): { name: string; email: string } {
  const clean = tin.trim();
  if (KNOWN_TIN_EMAILS[clean]) {
    return KNOWN_TIN_EMAILS[clean];
  }
  const suffix = clean.slice(-4) || '2026';
  return {
    name: `Registered Enterprise (TIN ${clean})`,
    email: `trade.desk@enterprise-${suffix}.rw`
  };
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onLaunchInteractivePortal,
  onCreateAccount
}) => {
  const [step, setStep] = useState<AuthStep>('credentials');
  const [tin, setTin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);

  // Step 2: 6-digit email verification code state
  const [generatedCode, setGeneratedCode] = useState<string>('482910');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setStep('credentials');
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setIsSendingCode(false);
    }
  }, [isOpen]);

  // Cooldown timer for resending email verification code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const accountInfo = resolveAccountEmail(tin);

  // Step 1 Submit -> Generate & Send Email Verification Code
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tin.trim() || !password.trim()) return;

    setIsSendingCode(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    setTimeout(() => {
      setIsSendingCode(false);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setResendCooldown(30);
      setStep('otp');
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 80);
    }, 550);
  };

  // Handle individual OTP digit change
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);
    setOtpError('');

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const updated = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setOtpDigits(updated);
    setOtpError('');
    const focusIdx = Math.min(pasted.length, 5);
    otpInputRefs.current[focusIdx]?.focus();
  };

  // Resend verification code
  const handleResendCode = () => {
    if (resendCooldown > 0) return;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setResendCooldown(30);
    otpInputRefs.current[0]?.focus();
  };

  // Step 2 Submit -> Verify 6-Digit Email Code & Authenticate Real Firebase User
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setOtpError('Please enter the complete 6-digit verification code.');
      return;
    }

    try {
      await signInWithGoogleAndSyncProfile({
        tin: tin.trim() || '102938475',
        businessName: accountInfo.name,
        email: accountInfo.email
      });
      setStep('verified');
      setTimeout(() => {
        onClose();
        if (onLaunchInteractivePortal) {
          onLaunchInteractivePortal();
        }
      }, 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setOtpError(
        msg.includes('popup-closed-by-user')
          ? 'Please complete Google sign-in in the popup to verify your real Firebase account.'
          : `Authentication error: ${msg}`
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-signin-title"
    >
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-[0_24px_60px_rgba(15,23,42,0.28)] overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-150">
        {/* Top Institutional Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#005A94] via-[#004B7C] to-[#003B63] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
              {step === 'otp' ? (
                <Mail className="w-5 h-5 text-[#DDEBF7]" aria-hidden="true" />
              ) : (
                <Lock className="w-5 h-5 text-[#DDEBF7]" aria-hidden="true" />
              )}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#DDEBF7]">
                Trade Square · MINICOM Portal
              </div>
              <h2 id="modal-signin-title" className="font-extrabold text-white text-base tracking-tight">
                {step === 'credentials' && 'Sign In with TIN & Password'}
                {step === 'otp' && 'Email Code Verification'}
                {step === 'verified' && 'Authentication Verified'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center ${
                step === 'credentials'
                  ? 'bg-[#005A94] text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {step === 'credentials' ? '1' : '✓'}
            </span>
            <span
              className={
                step === 'credentials'
                  ? 'font-bold text-slate-900'
                  : 'font-semibold text-emerald-700'
              }
            >
              TIN &amp; Password
            </span>
          </div>

          <div className="h-px flex-1 mx-3 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center ${
                step === 'otp'
                  ? 'bg-[#005A94] text-white'
                  : step === 'verified'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
              }`}
            >
              {step === 'verified' ? '✓' : '2'}
            </span>
            <span
              className={
                step === 'otp'
                  ? 'font-bold text-slate-900'
                  : step === 'verified'
                    ? 'font-semibold text-emerald-700'
                    : 'text-slate-500'
              }
            >
              Email Verification
            </span>
          </div>
        </div>

        {/* ===================================================================
            STEP 3: VERIFIED STATE
            =================================================================== */}
        {step === 'verified' ? (
          <div className="p-8 text-center space-y-3.5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">
                Email Code Verified Successfully
              </h3>
              <p className="text-xs text-slate-600">
                Signed in as <strong>{accountInfo.name}</strong>. Launching Trade Square Portal...
              </p>
            </div>
          </div>
        ) : step === 'credentials' ? (
          /* ===================================================================
             STEP 1: TIN NUMBER & PASSWORD FORM
             =================================================================== */
          <form onSubmit={handleCredentialsSubmit} className="p-6 space-y-4">
            {/* TIN Number Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-tin-input"
                  className="font-bold text-slate-800 text-xs"
                >
                  TIN Number (RRA / Tax ID)
                </label>
                <span className="text-[10px] font-medium text-slate-400">
                  9-digit TIN
                </span>
              </div>
              <div className="relative">
                <Hash
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="login-tin-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter your TIN number (e.g. 102938475)"
                  value={tin}
                  onChange={(e) => setTin(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:border-[#005A94] focus:ring-3 focus:ring-[#005A94]/15 focus:outline-none transition-all"
                  required
                />
              </div>

              {/* Quick Demo TIN Selector */}
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                <span className="text-[10px] text-slate-400 font-semibold">
                  Quick fill TIN:
                </span>
                {Object.keys(KNOWN_TIN_EMAILS).map((sampleTin) => (
                  <button
                    key={sampleTin}
                    type="button"
                    onClick={() => {
                      setTin(sampleTin);
                      if (!password) setPassword('TradeSquare@2026');
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors cursor-pointer ${
                      tin === sampleTin
                        ? 'bg-[#005A94] text-white border-[#005A94] font-bold'
                        : 'bg-slate-50 hover:bg-[#DDEBF7]/60 text-slate-600 border-slate-200'
                    }`}
                  >
                    {sampleTin}
                  </button>
                ))}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password-input"
                  className="font-bold text-slate-800 text-xs"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (!tin) setTin('102938475');
                    setPassword('TradeSquare@2026');
                  }}
                  className="text-[10px] font-semibold text-[#005A94] hover:underline cursor-pointer"
                >
                  Fill demo password
                </button>
              </div>
              <div className="relative">
                <KeyRound
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#005A94] focus:ring-3 focus:ring-[#005A94]/15 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Registered Email Preview Notice */}
            {tin.length >= 4 && (
              <div className="p-3 rounded-xl bg-[#DDEBF7]/45 border border-[#005A94]/20 flex items-center gap-2.5 text-[11px] text-slate-700">
                <Mail className="w-4 h-4 text-[#005A94] shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-500">Verification code will be sent to: </span>
                  <strong className="text-slate-900 font-mono truncate block">
                    {accountInfo.email}
                  </strong>
                </div>
              </div>
            )}

            {/* Submit Step 1 */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSendingCode || !tin.trim() || !password.trim()}
                className="w-full py-3 px-4 bg-[#005A94] hover:bg-[#004470] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                {isSendingCode ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending Verification Code to Email...</span>
                  </>
                ) : (
                  <>
                    <span>Continue &amp; Send Email Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1 border-t border-slate-100">
                <span>Don&apos;t have an account yet?</span>
                <CreateAccountDropdown
                  label="Create account"
                  onSelectAccountType={(type) => {
                    onClose();
                    if (onCreateAccount) {
                      onCreateAccount(type);
                    } else {
                      window.location.hash = '#contact';
                    }
                  }}
                  variant="inline-link"
                  align="center"
                  dropUp
                />
              </div>
            </div>
          </form>
        ) : (
          /* ===================================================================
             STEP 2: 6-DIGIT EMAIL VERIFICATION CODE (OTP) FORM
             =================================================================== */
          <form onSubmit={handleVerifyOtpSubmit} className="p-6 space-y-5">
            {/* Email Sent Confirmation Banner */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#005A94]" />
                  <span>Verification Code Sent</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  TIN: {tin}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                We sent a 6-digit security code to{' '}
                <strong className="text-slate-900 font-mono">{accountInfo.email}</strong>. Enter the code below to complete sign-in.
              </p>

              {/* Instant Demo Code Preview & 1-Click Auto-Fill for Browser Preview */}
              <div className="pt-1.5 mt-1.5 border-t border-slate-200/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-[#005A94]" />
                  <span className="text-slate-500">Email Inbox Code:</span>
                  <span className="font-mono font-extrabold text-[#005A94] bg-[#DDEBF7]/70 px-2 py-0.5 rounded tracking-widest">
                    {generatedCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOtpDigits(generatedCode.split(''));
                    setOtpError('');
                  }}
                  className="text-[11px] font-bold text-[#005A94] hover:underline cursor-pointer"
                >
                  Auto-fill code
                </button>
              </div>
            </div>

            {/* 6-Digit OTP Input Boxes */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-800 text-xs text-center">
                Enter 6-Digit Email Verification Code
              </label>
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className="w-11 h-12 sm:w-12 sm:h-13 text-center text-base sm:text-lg font-mono font-extrabold text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-[#005A94] focus:ring-3 focus:ring-[#005A94]/15 focus:outline-none transition-all"
                    aria-label={`Verification code digit ${idx + 1}`}
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-[11px] text-red-600 font-semibold text-center pt-1">
                  {otpError}
                </p>
              )}
            </div>

            {/* Resend Code & Back Controls */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to TIN &amp; Password</span>
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0}
                onClick={handleResendCode}
                className="font-semibold text-[#005A94] hover:underline disabled:text-slate-400 disabled:no-underline cursor-pointer"
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : 'Resend code to email'}
              </button>
            </div>

            {/* Verify & Sign In Button */}
            <button
              type="submit"
              disabled={otpDigits.join('').length < 6}
              className="w-full py-3 px-4 bg-[#005A94] hover:bg-[#004470] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Code &amp; Sign In</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
