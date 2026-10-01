import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2, Globe, ArrowRight } from 'lucide-react';

export type AccountCreationType = 'business' | 'partner';

interface CreateAccountDropdownProps {
  label?: string;
  onSelectAccountType: (type: AccountCreationType) => void;
  variant?: 'hero' | 'brand' | 'white-rect' | 'inline-link';
  align?: 'left' | 'right' | 'center';
  dropUp?: boolean;
}

export const CreateAccountDropdown: React.FC<CreateAccountDropdownProps> = ({
  label = 'Create account',
  onSelectAccountType,
  variant = 'brand',
  align = 'left',
  dropUp = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (type: AccountCreationType) => {
    setIsOpen(false);
    onSelectAccountType(type);
  };

  let buttonClasses = '';
  if (variant === 'hero') {
    buttonClasses =
      'w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs sm:text-sm font-bold cursor-pointer bg-white border border-[#DDEBF7] transition-all duration-200 group h-11 sm:h-12 px-7 sm:px-8 rounded-full hover:bg-[#DDEBF7] shadow-xl text-[#005A94]';
  } else if (variant === 'white-rect') {
    buttonClasses =
      'inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-[var(--brand-dark)] bg-white hover:bg-[var(--brand-light)] rounded-[4px] transition-colors cursor-pointer';
  } else if (variant === 'inline-link') {
    buttonClasses =
      'inline-flex items-center gap-1 font-bold text-[var(--brand)] hover:underline cursor-pointer';
  } else {
    buttonClasses =
      'inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[var(--brand)] hover:bg-[var(--brand-dark)] rounded-[4px] transition-colors cursor-pointer';
  }

  let menuPositionClasses = 'left-0';
  if (align === 'right') {
    menuPositionClasses = 'right-0';
  } else if (align === 'center') {
    menuPositionClasses = 'left-1/2 -translate-x-1/2';
  }

  const verticalClasses = dropUp ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <div
      ref={dropdownRef}
      className={`relative ${variant === 'hero' ? 'w-full sm:w-auto inline-block' : 'inline-block'}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={buttonClasses}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={label}
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Choose account type"
          className={`absolute ${menuPositionClasses} ${verticalClasses} w-56 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
            Select Account Type
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleSelect('business')}
            className="w-full px-3.5 py-2.5 text-left hover:bg-[#DDEBF7]/60 transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#DDEBF7] text-[#005A94] flex items-center justify-center shrink-0 group-hover:bg-[#005A94] group-hover:text-white transition-colors">
                <Building2 className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#005A94]">
                  Business
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  RDB Registered · Goods &amp; Services
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005A94] group-hover:translate-x-0.5 transition-all" />
          </button>

          <div className="my-1 border-t border-slate-100" />

          <button
            type="button"
            role="menuitem"
            onClick={() => handleSelect('partner')}
            className="w-full px-3.5 py-2.5 text-left hover:bg-[#DDEBF7]/60 transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#DDEBF7] text-[#005A94] flex items-center justify-center shrink-0 group-hover:bg-[#005A94] group-hover:text-white transition-colors">
                <Globe className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#005A94]">
                  Partner
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  Regional Buyer, Logistics &amp; Services
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005A94] group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      )}
    </div>
  );
};
