/**
 * Who Trade Square Is For Component
 * 100% UI/UX Clone of the Apple TV+ full-bleed cinematic carousel slider (from reference image)
 * with full 4-language support (English, Kinyarwanda, Kiswahili, French)
 * Powered by Google Cloud Translation REST API standards:
 * - Headline: "Who Trade Square Is For."
 * - Infinite cinematic horizontal carousel with active center card and peeking side cards
 * - High-res full-bleed visual (African portraits & corridor artwork)
 * - Top-right official "TRADE SQUARE • MINICOM" badge
 * - Big bold cinematic title overlaid over image
 * - Bottom bar with white rounded pill action button ("[ Stream now ]" style)
 * - Metadata line: Category in bold • Preserved description
 * - Interactive slide selection, autoplay with pause-on-hover, full responsiveness
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { PageId, PublicLanguage } from '../types/publicSite';
import { TRANSLATIONS } from '../data/translations';

import womanExporterImg from '../assets/images/african_woman_exporter_1790779779290.jpg';
import femaleSpecialistImg from '../assets/images/african_female_specialist_1790779793400.jpg';
import maleDistributorImg from '../assets/images/african_male_distributor_1790779805199.jpg';
import corridorGraphicImg from '../assets/images/rwanda_trade_corridor_1790779817814.jpg';

interface WhoTradeSquareIsForProps {
  onNavigate: (page: PageId) => void;
  currentLang: PublicLanguage;
}

interface CarouselItem {
  id: string;
  category: Record<PublicLanguage, string>;
  title: Record<PublicLanguage, string>;
  subtitle: Record<PublicLanguage, string>;
  description: Record<PublicLanguage, string>;
  buttonLabel: Record<PublicLanguage, string>;
  targetPage: PageId;
  image: string;
  imageAlt: Record<PublicLanguage, string>;
  tagline: Record<PublicLanguage, string>;
}

export const WhoTradeSquareIsFor: React.FC<WhoTradeSquareIsForProps> = ({
  onNavigate,
  currentLang
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const items: CarouselItem[] = [
    {
      id: 'rwandan-smes',
      category: {
        en: 'SME Exporters',
        rw: 'Ba Rwiyemezamirimo',
        sw: 'Wauzaji wa SMEs',
        fr: 'PME Exportatrices'
      },
      title: {
        en: 'Rwandan SME Owners',
        rw: 'Ba Rwiyemezamirimo bo mu Rwanda',
        sw: 'Wamiliki wa SMEs za Rwanda',
        fr: 'Propriétaires de PME Rwandaises'
      },
      subtitle: {
        en: 'Mobile-first capacity definition without broker fees',
        rw: 'Gutangaza umusaruro kuri telefone nta kiguzi cy\'abamamyi',
        sw: 'Kueleza uwezo wa kuuza nje bila ada ya madalali',
        fr: 'Déclaration des capacités sans frais d\'intermédiaires'
      },
      description: {
        en: TRANSLATIONS.en.aud1Desc,
        rw: TRANSLATIONS.rw.aud1Desc,
        sw: TRANSLATIONS.sw.aud1Desc,
        fr: TRANSLATIONS.fr.aud1Desc
      },
      buttonLabel: {
        en: TRANSLATIONS.en.aud1Btn,
        rw: TRANSLATIONS.rw.aud1Btn,
        sw: TRANSLATIONS.sw.aud1Btn,
        fr: TRANSLATIONS.fr.aud1Btn
      },
      targetPage: 'for-smes',
      image: womanExporterImg,
      imageAlt: {
        en: 'African Rwandan woman agri-business exporter and founder',
        rw: 'Rwiyemezamirimo w\'umunyarwandakazi wohereza ibikomoka ku buhinzi',
        sw: 'Mwanamke mjasiriamali wa Rwanda anayeuza mazao ya kilimo nje',
        fr: 'Femme entrepreneure rwandaise exportatrice de produits agricoles'
      },
      tagline: {
        en: 'Verified Corridor Beneficiary • RSB Standards Compliant',
        rw: 'Wemerewe muri Koridori • Yujuje Ubuziranenge bwa RSB',
        sw: 'Mfaidika wa Ukanda Aliyethibitishwa • Viwango vya RSB',
        fr: 'Bénéficiaire Vérifié du Corridor • Conforme aux Normes RSB'
      }
    },
    {
      id: 'regional-buyers',
      category: {
        en: 'Regional Off-takers',
        rw: 'Abaguzi bo mu Karere',
        sw: 'Wanunuzi wa Kikanda',
        fr: 'Acheteurs Régionaux'
      },
      title: {
        en: 'Kenyan Buyers & Distributors',
        rw: 'Abaguzi n\'Abakwirakwiza bo muri Kenya',
        sw: 'Wanunuzi na Wasambazaji wa Kenya',
        fr: 'Acheteurs et Distributeurs Kényans'
      },
      subtitle: {
        en: 'Direct bilateral consignment sourcing',
        rw: 'Kugura ibicuruzwa byizewe nta nzira z\'amanyanga',
        sw: 'Kununua bidhaa moja kwa moja bila madalali',
        fr: 'Approvisionnement bilatéral direct de consignations'
      },
      description: {
        en: TRANSLATIONS.en.aud2Desc,
        rw: TRANSLATIONS.rw.aud2Desc,
        sw: TRANSLATIONS.sw.aud2Desc,
        fr: TRANSLATIONS.fr.aud2Desc
      },
      buttonLabel: {
        en: TRANSLATIONS.en.aud2Btn,
        rw: TRANSLATIONS.rw.aud2Btn,
        sw: TRANSLATIONS.sw.aud2Btn,
        fr: TRANSLATIONS.fr.aud2Btn
      },
      targetPage: 'for-regional-partners',
      image: femaleSpecialistImg,
      imageAlt: {
        en: 'African Rwandan female trade specialist and quality assurance scientist',
        rw: 'Inzobere mu by\'ubuziranenge n\'ubucuruzi bwo mu karere',
        sw: 'Mtaalamu wa ubora na biashara ya kikanda wa kike',
        fr: 'Spécialiste du commerce et de la qualité régionale'
      },
      tagline: {
        en: 'Verified Off-takers • Direct Consignment Contracts',
        rw: 'Abaguzi Bemejwe • Amasezerano Aziguye',
        sw: 'Wanunuzi Waliothibitishwa • Mikataba ya Moja kwa Moja',
        fr: 'Acheteurs Vérifiés • Contrats Directs de Consignation'
      }
    },
    {
      id: 'trade-facilitators',
      category: {
        en: 'Institutional Desk',
        rw: 'Inzego za Leta',
        sw: 'Dawati la Kitaasisi',
        fr: 'Pôle Institutionnel'
      },
      title: {
        en: 'Trade Support Bodies & Facilitators',
        rw: 'Inzego z\'Ubucuruzi n\'Abanyamakuru',
        sw: 'Taasisi za Biashara na Wawezeshaji',
        fr: 'Organismes d\'Appui au Commerce & Facilitateurs'
      },
      subtitle: {
        en: 'Public pilot transparency on the Northern Corridor',
        rw: 'Umucyo usesuye mu Igerageza rya Koridori y\'Amajyaruguru',
        sw: 'Uwazi wa mradi wa majaribio kwenye Ukanda wa Kaskazini',
        fr: 'Transparence publique du pilote sur le Corridor Nord'
      },
      description: {
        en: TRANSLATIONS.en.aud3Desc,
        rw: TRANSLATIONS.rw.aud3Desc,
        sw: TRANSLATIONS.sw.aud3Desc,
        fr: TRANSLATIONS.fr.aud3Desc
      },
      buttonLabel: {
        en: TRANSLATIONS.en.aud3Btn,
        rw: TRANSLATIONS.rw.aud3Btn,
        sw: TRANSLATIONS.sw.aud3Btn,
        fr: TRANSLATIONS.fr.aud3Btn
      },
      targetPage: 'pilot',
      image: maleDistributorImg,
      imageAlt: {
        en: 'African Rwandan trade enterprise leader and logistics facilitator',
        rw: 'Umuyobozi w\'ubucuruzi n\'itwarwa ry\'ibicuruzwa mu karere',
        sw: 'Kiongozi wa biashara na vifaa wa kikanda',
        fr: 'Responsable d\'entreprise commerciale et logistique'
      },
      tagline: {
        en: 'Public Transparency • MINICOM, RDB, RSB, RRA & PSF Facilitation',
        rw: 'Umucyo Usesuye • MINICOM, RDB, RSB, RRA na PSF',
        sw: 'Uwazi Kamili • Ushirikiano wa MINICOM, RDB, RSB, RRA na PSF',
        fr: 'Transparence Publique • Facilitation MINICOM, RDB, RSB, RRA & PSF'
      }
    },
    {
      id: 'corridor-impact',
      category: {
        en: 'Bilateral Corridor',
        rw: 'Koridori y\'Amajyaruguru',
        sw: 'Ukanda wa Pande Mbili',
        fr: 'Corridor Bilatéral'
      },
      title: {
        en: 'Northern Corridor Commerce',
        rw: 'Ubucuruzi bwa Koridori y\'Amajyaruguru',
        sw: 'Biashara ya Ukanda wa Kaskazini',
        fr: 'Commerce du Corridor Nord'
      },
      subtitle: {
        en: 'Kigali to Nairobi via Gatuna and Malaba',
        rw: 'Kigali yerekeza Nairobi binyuze Gatuna na Malaba',
        sw: 'Kigali hadi Nairobi kupitia Gatuna na Malaba',
        fr: 'Kigali à Nairobi via Gatuna et Malaba'
      },
      description: {
        en: 'Connecting Kigali suppliers across Gatuna and Malaba directly to Nairobi, accelerating customs clearance and economic integration along the Northern Corridor.',
        rw: 'Guhuza abacuruzi ba Kigali na Nairobi binyuze ku mipaka ya Gatuna na Malaba, byoroshya gasutamo no kwihutisha ubucuruzi bw\'ibihingwa byatoranyijwe.',
        sw: 'Kuunganisha wasambazaji wa Kigali kupitia Gatuna na Malaba moja kwa moja hadi Nairobi, kuharakisha taratibu za forodha na ujumuishaji wa kiuchumi.',
        fr: 'Connecter les fournisseurs de Kigali directement à Nairobi via Gatuna et Malaba, accélérant le dédouanement et l\'intégration économique.'
      },
      buttonLabel: {
        en: 'Explore corridor scope',
        rw: 'Reba iby\'umuhora w\'ubucuruzi',
        sw: 'Chunguza upeo wa ukanda',
        fr: 'Explorer le périmètre du corridor'
      },
      targetPage: 'pilot',
      image: corridorGraphicImg,
      imageAlt: {
        en: 'Northern Corridor trade route and economic growth landscape',
        rw: 'Umuhora w\'ubucuruzi bwa Koridori y\'Amajyaruguru',
        sw: 'Njia ya biashara ya Ukanda wa Kaskazini na ukuaji wa uchumi',
        fr: 'Itinéraire commercial du Corridor Nord et paysage de croissance'
      },
      tagline: {
        en: 'Kigali · Gatuna · Malaba · Nairobi • Fast-Track Customs',
        rw: 'Kigali · Gatuna · Malaba · Nairobi • Kwihutisha Gasutamo',
        sw: 'Kigali · Gatuna · Malaba · Nairobi • Forodha ya Haraka',
        fr: 'Kigali · Gatuna · Malaba · Nairobi • Dédouanement Accéléré'
      }
    }
  ];

  const total = items.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Autoplay functionality with smooth pause on hover
  useEffect(() => {
    if (isPaused) return;
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 5500);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, total]);

  return (
    <section
      className="w-full py-10 sm:py-14 bg-transparent select-none overflow-hidden"
      aria-labelledby="audiences-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =========================================================================
          SECTION HEADER: Apple-Style Headline ("Endless entertainment." clone)
          ========================================================================= */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-6 sm:mb-8 space-y-2">
        <h2
          id="audiences-title"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight"
        >
          {t.audiencesTitle}.
        </h2>
        <p className="text-sm sm:text-base text-slate-500 font-normal max-w-2xl mx-auto">
          {currentLang === 'rw' &&
            'Yagenewe ba rwiyemezamirimo bo mu Rwanda, abaguzi bo mu karere, n\'inzego zishyigikira ubucuruzi muri Koridori y\'Amajyaruguru.'}
          {currentLang === 'sw' &&
            'Imeundwa kwa wafanyabiashara wa Rwanda, wanunuzi wa kikanda, na taasisi za uwezeshaji wa biashara kwenye Ukanda wa Kaskazini.'}
          {currentLang === 'fr' &&
            'Conçu pour les PME exportatrices rwandaises, les acheteurs régionaux et les institutions de facilitation du commerce sur le Corridor Nord.'}
          {currentLang === 'en' &&
            'Explore target beneficiaries, regional off-takers, and trade facilitation partners along the Northern Corridor.'}
        </p>
      </div>

      {/* =========================================================================
          FULL-BLEED CINEMATIC CAROUSEL SLIDER (Apple TV+ UI/UX Clone)
          ========================================================================= */}
      <div className="relative w-full overflow-hidden flex items-center justify-center">
        {/* Navigation Chevron Left */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-6 lg:left-12 z-30 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg border border-white/10 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Navigation Chevron Right */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-2 sm:right-6 lg:right-12 z-30 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg border border-white/10 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Cards Track */}
        <div className="relative w-full flex items-center justify-center min-h-[420px] sm:min-h-[500px] md:min-h-[560px] lg:min-h-[620px] px-2 sm:px-4">
          {items.map((item, index) => {
            const offset = (index - activeIndex + total) % total;
            const isCenter = offset === 0;
            const isRight = offset === 1;
            const isLeft = offset === total - 1;

            if (!isCenter && !isRight && !isLeft) {
              return null;
            }

            let positionClasses = '';
            if (isCenter) {
              positionClasses =
                'z-20 scale-100 opacity-100 translate-x-0 shadow-2xl';
            } else if (isLeft) {
              positionClasses =
                'z-10 scale-[0.88] sm:scale-[0.92] opacity-55 hover:opacity-80 -translate-x-[68%] sm:-translate-x-[58%] md:-translate-x-[52%] lg:-translate-x-[48%] cursor-pointer';
            } else if (isRight) {
              positionClasses =
                'z-10 scale-[0.88] sm:scale-[0.92] opacity-55 hover:opacity-80 translate-x-[68%] sm:translate-x-[58%] md:translate-x-[52%] lg:translate-x-[48%] cursor-pointer';
            }

            const itemCategory = item.category[currentLang] || item.category.en;
            const itemTitle = item.title[currentLang] || item.title.en;
            const itemDescription = item.description[currentLang] || item.description.en;
            const itemButtonLabel = item.buttonLabel[currentLang] || item.buttonLabel.en;
            const itemTagline = item.tagline[currentLang] || item.tagline.en;
            const itemImageAlt = item.imageAlt[currentLang] || item.imageAlt.en;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(index);
                  }
                }}
                className={`absolute w-[92vw] sm:w-[84vw] md:w-[76vw] lg:w-[70vw] max-w-[1140px] aspect-[16/10] sm:aspect-[16/9] md:aspect-[1.9/1] lg:aspect-[2.1/1] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-700 ease-out select-none ${positionClasses}`}
              >
                {/* -------------------------------------------------------------
                    BACKGROUND VISUAL (Pure Image Filling Entire Slide)
                    ------------------------------------------------------------- */}
                <img
                  src={item.image}
                  alt={itemImageAlt}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Scrim Gradients: Top subtle dark + Bottom cinematic dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 pointer-events-none" />

                {/* -------------------------------------------------------------
                    TOP RIGHT BRAND BADGE
                    ------------------------------------------------------------- */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#005A94]/85 backdrop-blur-md border border-white/20 text-white shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#DDEBF7]" />
                  <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                    TRADE SQUARE
                  </span>
                </div>

                {/* -------------------------------------------------------------
                    MIDDLE / LOWER CINEMATIC TITLE & CONTENT
                    ------------------------------------------------------------- */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 md:p-10 flex flex-col justify-end text-white z-10">
                  {/* Category Pill Tag */}
                  <div className="mb-2">
                    <span className="inline-block bg-[#005A94] backdrop-blur-xs text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs border border-white/20">
                      {itemCategory}
                    </span>
                  </div>

                  {/* Big Cinematic Display Headline */}
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-md leading-[1.1]">
                    {itemTitle}
                  </h3>

                  {/* Subtitle / Preserved Description */}
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl line-clamp-2 sm:line-clamp-2 drop-shadow-sm font-normal leading-relaxed">
                    {itemDescription}
                  </p>

                  {/* -----------------------------------------------------------
                      BOTTOM BAR (Action Pill Button + Metadata String)
                      ----------------------------------------------------------- */}
                  <div className="mt-4 sm:mt-6 flex items-center gap-3 sm:gap-4 flex-wrap">
                    {/* Primary Button: White Pill with #005A94 text */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(item.targetPage);
                      }}
                      className="bg-white hover:bg-[#DDEBF7] text-[#005A94] font-bold px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm tracking-normal shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{itemButtonLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#005A94]" />
                    </button>

                    {/* Metadata line: Category in bold • Tagline */}
                    <div className="hidden sm:flex items-center text-xs sm:text-sm text-slate-300 font-medium">
                      <span className="font-bold text-white">
                        {itemCategory}
                      </span>
                      <span className="mx-2 text-white/50">•</span>
                      <span className="text-slate-300 truncate max-w-xs md:max-w-md">
                        {itemTagline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          CAROUSEL PAGINATION PILL DOTS
          ========================================================================= */}
      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2">
        {items.map((_, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#005A94]/50 ${
                isActive
                  ? 'w-7 sm:w-8 h-2 bg-[#005A94]'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
};
