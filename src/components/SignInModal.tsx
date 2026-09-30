/**
 * Sign In Modal
 * Directs users to the official placeholder app address:
 * https://app.tradesquare.minicom.gov.rw (placeholder)
 * Explains authentication via RDB and TIN statutory single sign-on.
 */

import React, { useState } from 'react';
import { X, Lock, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchInteractivePortal?: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onLaunchInteractivePortal
}) => {
  const [tin, setTin] = useState('');
  const [rdbNumber, setRdbNumber] = useState('');
  const [signedInNotice, setSignedInNotice] = useState(false);

  if (!isOpen) return null;

  const handleDemoSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignedInNotice(true);
    setTimeout(() => {
      setSignedInNotice(false);
      onClose();
      if (onLaunchInteractivePortal) {
        onLaunchInteractivePortal();
      }
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-signin-title"
    >
      <div className="w-full max-w-md bg-white rounded-[4px] border border-[var(--gray-300)] shadow-lg overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[var(--gray-100)] border-b border-[var(--gray-300)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[var(--brand)]" />
            <h2 id="modal-signin-title" className="font-bold text-[var(--text-display)] text-sm">
              Trade Square SME Sign In
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[var(--text-sub)] hover:text-[var(--text-display)] cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {signedInNotice ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[var(--success)] mx-auto" />
            <h3 className="text-sm font-bold text-[var(--text-display)]">
              Authentication Verified
            </h3>
            <p className="text-xs text-[var(--text-body)]">
              Redirecting to Trade Square Pilot Application Portal...
            </p>
          </div>
        ) : (
          <form onSubmit={handleDemoSignIn} className="p-5 space-y-4">
            <div className="p-3 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] space-y-1">
              <div className="font-bold text-[var(--brand)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Government Pilot Application Address</span>
              </div>
              <div className="text-[11px] font-mono text-[var(--brand-dark)] break-all select-all">
                https://app.tradesquare.minicom.gov.rw (placeholder)
              </div>
              <p className="text-[11px] text-[var(--text-body)] pt-1">
                Access is restricted to Rwandan SMEs authorized during the Northern Corridor pilot phase with valid RDB and RRA credentials.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  Tax Identification Number (TIN - RRA)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 102938475"
                  value={tin}
                  onChange={(e) => setTin(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-mono focus:border-[var(--brand)]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-display)] mb-1">
                  RDB Registration Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 109238472"
                  value={rdbNumber}
                  onChange={(e) => setRdbNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[4px] font-mono focus:border-[var(--brand)]"
                  required
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--gray-300)] space-y-2">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[var(--brand)] text-white font-bold rounded-[4px] hover:bg-[var(--brand-dark)] transition-colors cursor-pointer"
              >
                Authenticate & Open Pilot Portal
              </button>

              <div className="text-center text-[11px] text-[var(--text-sub)]">
                Do not have pilot credentials yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.hash = '#contact';
                  }}
                  className="text-[var(--brand)] font-semibold hover:underline"
                >
                  Request pilot access
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
