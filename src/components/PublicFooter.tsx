/**
 * Public Footer Component
 * Styled 100% to match the official Republic of Rwanda Government web standard:
 * - Authentic deep petroleum blue background (#004866)
 * - Traditional Rwandan Imigongo geometric diamond pattern vertically along the left
 * - 4 Crisp, symmetric columns: NAVIGATION, GOVERNMENT, PUBLICATIONS, CONNECT
 * - Vibrant sky-cyan (#00a2ea) uppercase category headers
 * - 6 Circular sky-blue social media buttons (X, YouTube, Instagram, Flickr, Facebook, WhatsApp)
 * - Official circular Coat of Arms of Rwanda emblem
 * - Centered "© 2026 Republic of Rwanda"
 * - Clean white floating Scroll-to-Top button (↑) in bottom right corner
 * - 100% preservation of all regulatory notices, MINICOM trade links, portals, and bilingual support (EN/RW)
 */

import React from 'react';
import { ArrowUp, ExternalLink } from 'lucide-react';
import { PageId, PublicLanguage } from '../types/publicSite';
import { TRANSLATIONS } from '../data/translations';
import coatOfArmsSvg from '../assets/images/Coat_of_arms_of_Rwanda.svg';

interface PublicFooterProps {
  onNavigate: (page: PageId) => void;
  currentLang?: PublicLanguage;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate, currentLang = 'en' }) => {
  const t = TRANSLATIONS[currentLang];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const tradePortals = [
    { title: 'Rwanda Trade Portal', url: 'https://rwandatrade.work' },
    { title: 'Made in Rwanda Portal', url: 'https://madeinrwanda.gov.rw' },
    { title: 'Non-Tariff Barriers Portal', url: 'https://tradebarriers.africa' },
    { title: 'African Trade Observatory', url: 'https://ato.africa' }
  ];

  const getFooterText = (en: string, rw: string, sw: string, fr: string) => {
    if (currentLang === 'rw') return rw;
    if (currentLang === 'sw') return sw;
    if (currentLang === 'fr') return fr;
    return en;
  };

  return (
    <footer
      className="relative w-full text-white overflow-hidden mt-16 select-none bg-[#005A94]"
      aria-label="Government of Rwanda Footer"
    >
      {/* =========================================================================
          TRADITIONAL RWANDAN IMIGONGO GEOMETRIC PATTERN (Vertical left strip)
          Authentic repeating diamond & chevron motif in soft translucent cyan/teal
          ========================================================================= */}
      <div
        className="absolute left-0 top-0 bottom-0 w-14 sm:w-20 md:w-24 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="imigongo-gor-footer"
              width="60"
              height="90"
              patternUnits="userSpaceOnUse"
            >
              {/* Primary Diamond Outline */}
              <polygon
                points="30,0 60,45 30,90 0,45"
                fill="none"
                stroke="#DDEBF7"
                strokeWidth="2"
                strokeOpacity="0.25"
              />
              {/* Concentric Inner Diamonds */}
              <polygon
                points="30,9 54,45 30,81 6,45"
                fill="none"
                stroke="#DDEBF7"
                strokeWidth="2"
                strokeOpacity="0.22"
              />
              <polygon
                points="30,18 48,45 30,72 12,45"
                fill="none"
                stroke="#DDEBF7"
                strokeWidth="2"
                strokeOpacity="0.20"
              />
              <polygon
                points="30,27 42,45 30,63 18,45"
                fill="none"
                stroke="#DDEBF7"
                strokeWidth="2"
                strokeOpacity="0.18"
              />
              <polygon
                points="30,36 36,45 30,54 24,45"
                fill="none"
                stroke="#DDEBF7"
                strokeWidth="1.75"
                strokeOpacity="0.16"
              />

              {/* Left Edge Concentric Chevrons */}
              <polyline
                points="0,0 15,22.5 0,45"
                fill="none"
                stroke="#DDEBF7"
                strokeWidth="2"
                strokeOpacity="0.22"
              />
              <polyline
                points="0,9 9,22.5 0,36"
                fill="none"
                stroke="#DDEBF7"
                strokeWidth="1.75"
                strokeOpacity="0.20"
              />
              <polyline
                points="0,45 15,67.5 0,90"
                fill="none"
                stroke="#DDEBF7"
                strokeWidth="2"
                strokeOpacity="0.22"
              />
              <polyline
                points="0,54 9,67.5 0,81"
                fill="none"
                stroke="#DDEBF7"
                strokeWidth="1.75"
                strokeOpacity="0.20"
              />

              {/* Right Edge Concentric Chevrons */}
              <polyline
                points="60,0 45,22.5 60,45"
                fill="none"
                stroke="#DDEBF7"
                strokeWidth="2"
                strokeOpacity="0.22"
              />
              <polyline
                points="60,9 51,22.5 60,36"
                fill="none"
                stroke="#DDEBF7"
                strokeWidth="1.75"
                strokeOpacity="0.20"
              />
              <polyline
                points="60,45 45,67.5 60,90"
                fill="none"
                stroke="#DDEBF7"
                strokeWidth="2"
                strokeOpacity="0.22"
              />
              <polyline
                points="60,54 51,67.5 60,81"
                fill="none"
                stroke="#DDEBF7"
                strokeWidth="1.75"
                strokeOpacity="0.20"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#imigongo-gor-footer)" />
        </svg>
      </div>

      {/* =========================================================================
          MAIN 4-COLUMN BODY (NAVIGATION | GOVERNMENT | PUBLICATIONS | CONNECT)
          Exact typography, alignment, and spacing matching the government template
          ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pl-16 sm:pl-24 md:pl-28 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 xl:gap-16">
          {/* -------------------------------------------------------------------
              COLUMN 1: NAVIGATION
              ------------------------------------------------------------------- */}
          <div className="flex flex-col space-y-3.5">
            <h2 className="text-[#DDEBF7] font-bold text-xs tracking-wider uppercase">
              {getFooterText('NAVIGATION', 'GUSHAKISHA', 'URAMBAZAJI', 'NAVIGATION')}
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-[13px] font-medium text-white">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Home', 'Ahabanza', 'Nyumbani', 'Accueil')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('About', 'Ibyerekeye', 'Kuhusu', 'À Propos')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('for-smes')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Services', 'Serivisi za ba Rwiyemezamirimo', 'Huduma za SMEs', 'Services PME')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Highlights', 'Iby\'ingenzi', 'Vivutio', 'Points Clés')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('faq')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('News & FAQ', 'Amakuru & Ibibazo', 'Habari & Maswali', 'Actualités & FAQ')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('for-regional-partners')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Regional Partners', 'Abafatanyabikorwa bo mu Karere', 'Washirika wa Kikanda', 'Partenaires Régionaux')}
                </button>
              </li>
            </ul>
          </div>

          {/* -------------------------------------------------------------------
              COLUMN 2: GOVERNMENT
              ------------------------------------------------------------------- */}
          <div className="flex flex-col space-y-3.5">
            <h2 className="text-[#DDEBF7] font-bold text-xs tracking-wider uppercase">
              {getFooterText('GOVERNMENT', 'LETA', 'SERIKALI', 'GOUVERNEMENT')}
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-[13px] font-medium text-white">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('trust-and-data')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Overview', 'Incamake ya MINICOM', 'Maelezo ya MINICOM', 'Aperçu du MINICOM')}
                </button>
              </li>
              <li>
                <span className="text-white/95 select-none">
                  {getFooterText('The President', 'Perezida wa Repubulika', 'Rais wa Jamhuri', 'Présidence de la République')}
                </span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('pilot')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Cabinet', 'Inama y\'Abaminisitiri', 'Baraza la Mawaziri', 'Conseil des Ministres')}
                </button>
              </li>
              <li>
                <span className="text-white/95 select-none" title="RDB, RSB, RRA, PSF, NAEB">
                  {getFooterText('Institutions (RDB, RSB, RRA, PSF)', 'Inzego za Leta (RDB, RSB, RRA, PSF)', 'Taasisi za Umma (RDB, RSB, RRA, PSF)', 'Institutions (RDB, RSB, RRA, PSF)')}
                </span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('trust-and-data')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Publications', 'Ibitangazwa', 'Machapisho', 'Publications')}
                </button>
              </li>
              <li>
                <span className="text-white/95 select-none">
                  {getFooterText('Public Holidays', 'Iminsi Mikuru ya Leta', 'Sikukuu za Kitaifa', 'Jours Fériés')}
                </span>
              </li>
            </ul>
          </div>

          {/* -------------------------------------------------------------------
              COLUMN 3: PUBLICATIONS
              ------------------------------------------------------------------- */}
          <div className="flex flex-col space-y-3.5">
            <h2 className="text-[#DDEBF7] font-bold text-xs tracking-wider uppercase">
              {getFooterText('PUBLICATIONS', 'IBITANGAZWA', 'MACHAPISHO', 'PUBLICATIONS')}
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-[13px] font-medium text-white">
              <li>
                <span className="text-white/95 select-none">
                  {getFooterText('Cabinet Resolutions', 'Imyanzuro y\'Inama y\'Abaminisitiri', 'Maazimio ya Baraza', 'Résolutions du Conseil')}
                </span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('pilot')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Press Release', 'Itangazo ku Binyamakuru', 'Taarifa kwa Vyombo vya Habari', 'Communiqués de Presse')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('trust-and-data')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Laws and Regulations', 'Amategeko n\'Amabwiriza', 'Sheria na Kanuni', 'Lois et Règlements')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('trust-and-data')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Documents Archives', 'Ububiko bw\'Inyandiko', 'Nyaraka za Kumbukumbu', 'Archives Documentaires')}
                </button>
              </li>
              <li>
                <span className="text-white/95 select-none">
                  {getFooterText('Muse report', 'Raporo ya Muse', 'Ripoti ya Muse', 'Rapport Muse')}
                </span>
              </li>
              <li>
                <span className="text-white/95 select-none">
                  {getFooterText('Jobs', 'Imyanya y\'Akazi', 'Nafasi za Kazi', 'Offres d\'Emploi')}
                </span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Newsletters', 'Amakuru Mashya', 'Jarida la Habari', 'Bulletins d\'Information')}
                </button>
              </li>
            </ul>
          </div>

          {/* -------------------------------------------------------------------
              COLUMN 4: CONNECT & SOCIAL MEDIA
              ------------------------------------------------------------------- */}
          <div className="flex flex-col space-y-3.5">
            <h2 className="text-[#DDEBF7] font-bold text-xs tracking-wider uppercase">
              {getFooterText('CONNECT', 'TWANDIKIRE', 'WASILIANA', 'CONTACT')}
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-[13px] font-medium text-white">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Contact Us', 'Twandikire', 'Wasiliana Nasi', 'Contactez-nous')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Emergency / MINICOM Desk', 'Ubutabazi / Ibiro bya MINICOM', 'Dawati la Dharura la MINICOM', 'Urgences / MINICOM')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Check Mail', 'Imeri ya Leta', 'Barua Pepe ya Serikali', 'Messagerie Gouvernementale')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('trust-and-data')}
                  className="hover:text-[#DDEBF7] transition-colors cursor-pointer text-left"
                >
                  {getFooterText('Privacy Policy', 'Ibijyanye n\'Amabanga', 'Sera ya Faragha', 'Politique de Confidentialité')}
                </button>
              </li>
            </ul>

            {/* 6 Circular Social Media Icons */}
            <div className="pt-2 flex items-center gap-2 sm:gap-2.5 flex-wrap">
              {/* 1. X */}
              <a
                href="https://twitter.com/RwandaTrade"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2673A6] hover:bg-[#004876] border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm"
                aria-label="X (Twitter)"
                title="Follow Republic of Rwanda on X"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* 2. YouTube */}
              <a
                href="https://www.youtube.com/@RwandaTrade"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2673A6] hover:bg-[#004876] border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm"
                aria-label="YouTube"
                title="Watch on YouTube"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* 3. Instagram */}
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2673A6] hover:bg-[#004876] border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm"
                aria-label="Instagram"
                title="Follow on Instagram"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-none stroke-white stroke-[2.2]" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* 4. Flickr */}
              <a
                href="https://www.flickr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2673A6] hover:bg-[#004876] border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm"
                aria-label="Flickr"
                title="View Photo Gallery"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="7" cy="12" r="4" />
                  <circle cx="17" cy="12" r="4" />
                </svg>
              </a>

              {/* 5. Facebook */}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2673A6] hover:bg-[#004876] border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm"
                aria-label="Facebook"
                title="Connect on Facebook"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* 6. WhatsApp */}
              <a
                href="https://wa.me/250788123456"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2673A6] hover:bg-[#004876] border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm"
                aria-label="WhatsApp"
                title="Contact Trade Desk on WhatsApp"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            GOVERNMENT OFFICIAL TRADE PORTALS BAR
            ========================================================================= */}
        <div className="mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs text-[#DDEBF7]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              {getFooterText('Official Trade Portals:', 'Imbuga z\'Ubucuruzi za Leta:', 'Milango Rasmi ya Biashara:', 'Portails Commerciaux Officiels :')}
            </span>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {tradePortals.map((portal, idx) => (
                <a
                  key={idx}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline underline-offset-2 transition-colors flex items-center gap-1"
                >
                  <span>{portal.title}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-[#DDEBF7]/90">
            {t.footerAddress} · {t.footerEmail}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SUBTLE HORIZONTAL DIVIDER
          ========================================================================= */}
      <div className="relative z-10 w-full border-t border-white/15" />

      {/* =========================================================================
          BOTTOM CENTERED SECTION
          ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center mb-3">
          <img
            src={coatOfArmsSvg}
            alt="Official Coat of Arms of the Republic of Rwanda"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-sm select-none"
            loading="lazy"
          />
        </div>

        <p className="text-white font-medium text-xs sm:text-[13px] tracking-wide mb-1">
          © 2026 Republic of Rwanda
        </p>

        <p className="text-[#DDEBF7]/85 text-[11px] max-w-xl mx-auto leading-relaxed">
          {t.dueDiligenceNotice}
        </p>

        <div className="absolute right-4 sm:right-8 bottom-6 sm:bottom-8 z-20">
          <button
            type="button"
            onClick={scrollToTop}
            className="w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-[#DDEBF7] text-[#005A94] shadow-lg rounded-lg flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#DDEBF7]"
            aria-label="Scroll to top of page"
            title="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 text-[#005A94] stroke-[2.5]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};
