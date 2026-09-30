/**
 * MINICOM Footer Component
 * Styled 100% to match the official Republic of Rwanda Government web standard:
 * - Authentic deep petroleum blue background (#004866)
 * - Traditional Rwandan Imigongo geometric diamond pattern vertically along the left
 * - 4 Crisp columns: NAVIGATION, GOVERNMENT, PUBLICATIONS, CONNECT
 * - Vibrant sky-cyan (#00a2ea) uppercase category headers
 * - 6 Circular sky-blue social media buttons
 * - Official circular Coat of Arms of Rwanda emblem
 * - Centered "© 2026 Republic of Rwanda"
 * - Clean white floating Scroll-to-Top button (↑) in bottom right corner
 * - 100% preservation of all regulatory notices and MINICOM institutional trade info
 */

import React from 'react';
import { ArrowUp, ExternalLink } from 'lucide-react';
import coatOfArmsSvg from '../assets/images/Coat_of_arms_of_Rwanda.svg';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const quickLinks = [
    { title: 'Rwanda Trade Portal', url: 'https://rwandatrade.work' },
    { title: 'Made in Rwanda Portal', url: 'https://madeinrwanda.gov.rw' },
    { title: 'Non-Tariff Barriers Portal', url: 'https://tradebarriers.africa' },
    { title: 'African Trade Observatory', url: 'https://ato.africa' }
  ];

  return (
    <footer
      className="relative w-full text-white overflow-hidden mt-16 select-none"
      style={{ backgroundColor: '#004866' }}
      aria-label="Government of Rwanda Footer"
    >
      {/* Imigongo geometric pattern left border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-14 sm:w-20 md:w-24 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="imigongo-gor-footer-alt"
              width="60"
              height="90"
              patternUnits="userSpaceOnUse"
            >
              <polygon points="30,0 60,45 30,90 0,45" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.25" />
              <polygon points="30,9 54,45 30,81 6,45" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.22" />
              <polygon points="30,18 48,45 30,72 12,45" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.20" />
              <polygon points="30,27 42,45 30,63 18,45" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.18" />
              <polyline points="0,0 15,22.5 0,45" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.22" />
              <polyline points="0,45 15,67.5 0,90" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.22" />
              <polyline points="60,0 45,22.5 60,45" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.22" />
              <polyline points="60,45 45,67.5 60,90" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.22" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#imigongo-gor-footer-alt)" />
        </svg>
      </div>

      {/* 4 Columns */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pl-16 sm:pl-24 md:pl-28 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 xl:gap-16">
          {/* Column 1: Navigation */}
          <div className="flex flex-col space-y-3.5">
            <h2 className="text-[#00a2ea] font-bold text-xs tracking-wider uppercase">NAVIGATION</h2>
            <ul className="space-y-2.5 text-xs sm:text-[13px] font-medium text-white">
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Home</span></li>
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">About</span></li>
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Services</span></li>
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Highlights</span></li>
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">News</span></li>
            </ul>
          </div>

          {/* Column 2: Government */}
          <div className="flex flex-col space-y-3.5">
            <h2 className="text-[#00a2ea] font-bold text-xs tracking-wider uppercase">GOVERNMENT</h2>
            <ul className="space-y-2.5 text-xs sm:text-[13px] font-medium text-white">
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Overview</span></li>
              <li><span className="text-white/95 select-none">The President</span></li>
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Cabinet</span></li>
              <li><span className="text-white/95 select-none">Institutions (RDB, RSB, RRA, PSF)</span></li>
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Publications</span></li>
              <li><span className="text-white/95 select-none">Public Holidays</span></li>
            </ul>
          </div>

          {/* Column 3: Publications */}
          <div className="flex flex-col space-y-3.5">
            <h2 className="text-[#00a2ea] font-bold text-xs tracking-wider uppercase">PUBLICATIONS</h2>
            <ul className="space-y-2.5 text-xs sm:text-[13px] font-medium text-white">
              <li><span className="text-white/95 select-none">Cabinet Resolutions</span></li>
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Press Release</span></li>
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Laws and Regulations</span></li>
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Documents Archives</span></li>
              <li><span className="text-white/95 select-none">Muse report</span></li>
              <li><span className="text-white/95 select-none">Jobs</span></li>
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Newsletters</span></li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="flex flex-col space-y-3.5">
            <h2 className="text-[#00a2ea] font-bold text-xs tracking-wider uppercase">CONNECT</h2>
            <ul className="space-y-2.5 text-xs sm:text-[13px] font-medium text-white">
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Emergency</span></li>
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Check Mail</span></li>
              <li><span className="hover:text-[#00a2ea] transition-colors cursor-pointer">Privacy Policy</span></li>
            </ul>

            <div className="pt-2 flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <a href="https://twitter.com/RwandaTrade" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00a2ea] hover:bg-[#0091d2] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm" aria-label="X (Twitter)">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://www.youtube.com/@RwandaTrade" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00a2ea] hover:bg-[#0091d2] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm" aria-label="YouTube">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00a2ea] hover:bg-[#0091d2] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm" aria-label="Instagram">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-none stroke-white stroke-[2.2]" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="https://www.flickr.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00a2ea] hover:bg-[#0091d2] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm" aria-label="Flickr">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24"><circle cx="7" cy="12" r="4" /><circle cx="17" cy="12" r="4" /></svg>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00a2ea] hover:bg-[#0091d2] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm" aria-label="Facebook">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="https://wa.me/250788123456" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00a2ea] hover:bg-[#0091d2] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm" aria-label="WhatsApp">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Trade Portals */}
        <div className="mt-10 pt-6 border-t border-[#0a587d]/50 flex flex-wrap items-center justify-between gap-4 text-xs text-cyan-100/90">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Official Trade Portals:</span>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {quickLinks.map((portal, idx) => (
                <a key={idx} href={portal.url} target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-2 transition-colors flex items-center gap-1">
                  <span>{portal.title}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-cyan-200/80">Kigali City, Rwanda · KN 3 Ave · P.O. Box 73 · info@minicom.gov.rw</div>
        </div>
      </div>

      <div className="relative z-10 w-full border-t border-[#0a587d]/70" />

      {/* Bottom Center */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center mb-3">
          <img src={coatOfArmsSvg} alt="Official Coat of Arms of the Republic of Rwanda" className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-sm select-none" loading="lazy" />
        </div>
        <p className="text-white font-medium text-xs sm:text-[13px] tracking-wide mb-1">
          © 2026 Republic of Rwanda
        </p>
        <p className="text-cyan-200/70 text-[11px] max-w-xl mx-auto leading-relaxed">
          Relevance score supports decisions. It is not a guarantee. Do your own due diligence.
        </p>
        <div className="absolute right-4 sm:right-8 bottom-6 sm:bottom-8 z-20">
          <button
            type="button"
            onClick={scrollToTop}
            className="w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-slate-100 text-[#004866] shadow-lg rounded-lg flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00a2ea]"
            aria-label="Scroll to top of page"
            title="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 text-[#004866] stroke-[2.5]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};
