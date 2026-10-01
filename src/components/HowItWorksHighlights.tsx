/**
 * How Trade Square Works Highlights Component
 * 100% clone of the reference image layout:
 * - 4-language support (English, Kinyarwanda, Kiswahili, French)
 * - 16:9 large landscape photograph on the left with subtle zoom & rounded borders
 * - Minimal, centered typography container on the right:
 *   * Small uppercase subtitle ("Highlights")
 *   * Light, elegant headline
 *   * Three compact centered paragraphs with generous line-height
 *   * Dark rounded button with right arrow ("View Activities" clone)
 *   * 4 clean carousel pagination indicator dots [○ ● ○ ○]
 * - Smooth auto-play carousel with pause-on-hover & interactive dot clicks
 * - Fully responsive (stacked on mobile/tablet, symmetric split on desktop)
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageId, PublicLanguage } from '../types/publicSite';

import innovateRwandaImg from '../assets/images/innovate_rwanda_kigali_1790764294948.jpg';
import kigaliTradeCorridorImg from '../assets/images/kigali_trade_corridor_1790763840566.jpg';
import exportReadinessFbImg from '../assets/images/export-readiness-fb.png';

interface HowItWorksHighlightsProps {
  onNavigate: (page: PageId) => void;
  onOpenSignIn: () => void;
  currentLang: PublicLanguage;
}

interface SlideData {
  category: Record<PublicLanguage, string>;
  title: Record<PublicLanguage, string>;
  paragraphs: Record<PublicLanguage, [string, string, string]>;
  buttonLabel: Record<PublicLanguage, string>;
  targetPage: PageId;
  image: string;
  imageAlt: Record<PublicLanguage, string>;
}

const SLIDES: SlideData[] = [
  {
    category: {
      en: 'Highlights',
      rw: 'Iby\'ingenzi',
      sw: 'Vivutio Muhimu',
      fr: 'Points Clés'
    },
    title: {
      en: 'Signal Submission & Export Readiness',
      rw: 'Gutanga Icyifuzo & Kugenzura Ubushobozi',
      sw: 'Uwasilishaji wa Nia & Utayari wa Mauzo ya Nje',
      fr: 'Déclaration d\'Offre & Préparation à l\'Exportation'
    },
    paragraphs: {
      en: [
        'Rwandan SME exporters submit verified product supply signals from phone or desktop—specifying HS codes, available metric tonnage, packaging type, and warehouse readiness.',
        'Every signal is cross-referenced against official export quality standards, including Rwanda Standards Board (RSB) compliance, RRA tax standing, and phytosanitary clearance.',
        'By digitizing verification, Trade Square eliminates costly informal intermediaries and establishes trusted trade credentials directly backed by MINICOM institutional frameworks.'
      ],
      rw: [
        'Ba rwiyemezamirimo bo mu Rwanda batangaza ibicuruzwa bafite byiteguye koherezwa mu mahanga—bagashyiraho kode ya HS, ingano ya toni zihari, n\'aho biherereye.',
        'Buri cyifuzo cy\'igicuruzwa kigenzurwa ku buryo bwizewe hakurikijwe amabwiriza y\'ubuziranenge ya RSB, imisoro ya RRA, n\'ibyangombwa by\'ubuziranenge bwo muri Koridori y\'Amajyaruguru.',
        'Gushyira ubu buryo mu ikoranabuhanga bivanamo abamamyi bahenze, bigatuma ubucuruzi bwizewe ku buryo butaziguye buyobowe na Minisiteri y\'Ubucuruzi n\'Inganda (MINICOM).'
      ],
      sw: [
        'Wauzaji wa SMEs wa Rwanda huwasilisha nia ya usambazaji wa bidhaa zilizothibitishwa kupitia simu au kompyuta—wakibainisha nambari za HS, tani zilizopo, na utayari wa ghala.',
        'Kila nia inalinganishwa na viwango rasmi vya ubora wa mauzo ya nje, ikiwa ni pamoja na viwango vya RSB, kodi ya RRA, na vyeti vya afya ya mimea.',
        'Kwa kuweka taratibu za uthibitisho kidijitali, Trade Square huondoa madalali ghali na kuanzisha uaminifu thabiti unaosimamiwa moja kwa moja na MINICOM.'
      ],
      fr: [
        'Les PME exportatrices rwandaises soumettent leurs offres vérifiées depuis leur téléphone ou ordinateur : codes SH, tonnage disponible, type d\'emballage et disponibilité en entrepôt.',
        'Chaque signal est recoupé avec les normes officielles de qualité à l\'exportation, notamment la conformité du RSB, la situation fiscale RRA et les certificats phytosanitaires.',
        'En numérisant la vérification, Trade Square élimine les intermédiaires onéreux et établit des références commerciales fiables directement soutenues par le MINICOM.'
      ]
    },
    buttonLabel: {
      en: 'View Methodology',
      rw: 'Soma Uburyo Bikora',
      sw: 'Tazama Mbinu',
      fr: 'Voir la Méthodologie'
    },
    targetPage: 'how-it-works',
    image: innovateRwandaImg,
    imageAlt: {
      en: 'High quality Rwandan agricultural export harvest ready for market',
      rw: 'Ibicuruzwa by\'ubuhinzi byo mu Rwanda byiteguye koherezwa mu mahanga',
      sw: 'Mazao ya kilimo ya ubora wa juu ya Rwanda tayari kwa soko',
      fr: 'Récolte agricole rwandaise de haute qualité prête pour l\'exportation'
    }
  },
  {
    category: {
      en: 'Highlights',
      rw: 'Iby\'ingenzi',
      sw: 'Vivutio Muhimu',
      fr: 'Points Clés'
    },
    title: {
      en: 'Algorithmic Match Scoring & Shortlisting',
      rw: 'Gusesengura & Gutoranya Abafatanyabikorwa',
      sw: 'Alama za Ulinganifu wa Kikanuni & Orodha Fupi',
      fr: 'Scoring Algorithmique & Sélection de Partenaires'
    },
    paragraphs: {
      en: [
        'Our explainable matching engine evaluates Rwandan exporters against verified regional buyers in Nairobi and across East Africa using six deterministic trade signals.',
        'Exporters receive a transparent shortlist of 5 to 10 prospective partners ranked by commodity compatibility, buyer volume demand, past customs clearance, and payment compliance.',
        'Every match score comes with itemized evidence—there are no random numbers, black-box algorithms, or fictitious companies, ensuring accountable decision-making.'
      ],
      rw: [
        'Ikoranabuhanga ryacu risesengura ba rwiyemezamirimo b\'i Rwanda ribahuza n\'abaguzi bagenzuwe i Nairobi no mu karere hakoreshejwe ibipimo 6 byizewe.',
        'Uwohereza ahabwa urutonde rw\'abafatanyabikorwa 5 kugeza ku 10 batoranyijwe hashingiwe ku bwoko bw\'igicuruzwa, ubushobozi bwo kwakira toni, n\'amateka yo kwishyura neza.',
        'Amanota yose atangwa mu mucyo usesuye—nta mibare ipfuye cyangwa ibigo by\'amahimbano, bituma buri rwiyemezamirimo afata ibyemezo yizeye neza umufatanyabikorwa.'
      ],
      sw: [
        'Injini yetu ya kulinganisha hutathmini wauzaji wa Rwanda dhidi ya wanunuzi wa kikanda waliothibitishwa mjini Nairobi na Afrika Mashariki kwa kutumia vigezo sita vya biashara.',
        'Wauzaji hupokea orodha fupi ya washirika 5 hadi 10 inayotokana na uoanifu wa bidhaa, mahitaji ya kiwango, vibali vya forodha, na uwezo wa kulipa.',
        'Kila alama ya ulinganifu huja na ushahidi wa kina—hakuna nambari bandia, algoriti fiche, au kampuni za kubuni, kuhakikisha maamuzi ya kuaminika.'
      ],
      fr: [
        'Notre moteur de mise en relation explicable évalue les exportateurs rwandais face à des acheteurs régionaux vérifiés à Nairobi et en Afrique de l\'Est à l\'aide de six signaux déterministes.',
        'Les exportateurs reçoivent une liste transparente de 5 à 10 partenaires potentiels classés selon la compatibilité des produits, le volume demandé et l\'historique douanier.',
        'Chaque score s\'accompagne de preuves détaillées : aucun algorithme opaque, aucun chiffre aléatoire ni entreprise fictive pour des décisions responsables.'
      ]
    },
    buttonLabel: {
      en: 'Explore Match Signals',
      rw: 'Reba Ibipimo by\'Amanota',
      sw: 'Chunguza Vigezo vya Ulinganifu',
      fr: 'Explorer les Signaux'
    },
    targetPage: 'how-it-works',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    imageAlt: {
      en: 'Modern freight logistics and cross-border trade operations',
      rw: 'Ubwikorezi n\'ubucuruzi bwo kwambuka imipaka mu karere',
      sw: 'Usafirishaji wa kisasa wa mizigo na biashara ya mipakani',
      fr: 'Opérations logistiques et transport transfrontalier moderne'
    }
  },
  {
    category: {
      en: 'Highlights',
      rw: 'Iby\'ingenzi',
      sw: 'Vivutio Muhimu',
      fr: 'Points Clés'
    },
    title: {
      en: 'Facilitated Direct Connection & Trade Closing',
      rw: 'Guhuza Abacuruzi & Gufunga Amasezerano',
      sw: 'Muunganisho wa Moja kwa Moja & Kufunga Mkataba',
      fr: 'Mise en Relation Facilitée & Concrétisation Commerciale'
    },
    paragraphs: {
      en: [
        'Once matched, exporters can initiate commercial contact directly with counterparty principals or request an official institutional introduction facilitated by the MINICOM Trade Desk.',
        'The platform guides both trading partners through structured stages—from price quotation and sample inspection to verified consignment contracts and transport milestone tracking.',
        'Exporters benefit from streamlined EAC border facilitation at Gatuna and Malaba, supported by cross-border clearance assistance to ensure shipments clear customs rapidly.'
      ],
      rw: [
        'Iyo abafatanyabikorwa bamaze gutoranywa, uwohereza ashobora kuvugana na bo cyangwa agasaba guhuzwa n\'Ibiro bishinzwe Ubucuruzi bya MINICOM ku buryo bwemewe.',
        'Urubuga rufasha impande zombi mu ntambwe zose z\'ubucuruzi—uhereye ku biciro remezo no gusuzuma ingero kugeza ku masezerano yo kohereza ibicuruzwa n\'ubwikorezi.',
        'Ba rwiyemezamirimo bahabwa ubufasha bwo koroherezwa mu misoro ya gasutamo ku mupaka wa Gatuna na Malaba muri Koridori y\'Amajyaruguru nta gutinda.'
      ],
      sw: [
        'Baada ya kulinganishwa, wauzaji wanaweza kuwasiliana moja kwa moja na wahusika wakuu au kuomba utangulizi rasmi unaowezeshwa na Dawati la Biashara la MINICOM.',
        'Jukwaa huongoza washirika wote kupitia hatua zilizopangwa—kutoka nukuu ya bei na ukaguzi wa sampuli hadi mikataba ya usafirishaji na ufuatiliaji wa mizigo.',
        'Wauzaji hunufaika na taratibu zilizorahisishwa za forodha za EAC huko Gatuna na Malaba ili kuhakikisha mizigo inavuka mpaka kwa haraka.'
      ],
      fr: [
        'Une fois appariés, les exportateurs peuvent engager un contact direct avec les acheteurs ou demander une mise en relation institutionnelle officielle par le Trade Desk du MINICOM.',
        'La plateforme guide les deux partenaires à travers des étapes structurées : devis, inspection d\'échantillons, contrats de consignation et suivi des étapes de transport.',
        'Les exportateurs bénéficient de procédures douanières allégées aux frontières de Gatuna et Malaba, garantissant un dédouanement accéléré le long du Corridor Nord.'
      ]
    },
    buttonLabel: {
      en: 'View SME Guidance',
      rw: 'Ubuyobozi bwa ba Rwiyemezamirimo',
      sw: 'Mwongozo wa SMEs',
      fr: 'Guide pour les PME'
    },
    targetPage: 'for-smes',
    image: kigaliTradeCorridorImg,
    imageAlt: {
      en: 'Rwandan business leaders finalizing cross-border trade contracts',
      rw: 'Abacuruzi b\'u Rwanda basinya amasezerano y\'ubucuruzi mu karere',
      sw: 'Viongozi wa biashara wa Rwanda wakikamilisha mikataba ya biashara',
      fr: 'Dirigeants d\'entreprises rwandaises finalisant des contrats commerciaux'
    }
  },
  {
    category: {
      en: 'Highlights',
      rw: 'Iby\'ingenzi',
      sw: 'Vivutio Muhimu',
      fr: 'Points Clés'
    },
    title: {
      en: 'Sustainable Northern Corridor Impact',
      rw: 'Iterambere Rirambye rya Koridori',
      sw: 'Athari Endelevu ya Ukanda wa Kaskazini',
      fr: 'Impact Durable sur le Corridor Nord'
    },
    paragraphs: {
      en: [
        'About 30% of new Rwandan exporters drop out in their first year due to counterparty uncertainty. Trade Square remedies this by replacing informal directories with verified matching.',
        'Focusing on high-value pilot commodities—beans, maize flour, avocado, and honey—the platform builds structured trade corridors linking Kigali suppliers to verified Kenyan buyers.',
        'Backed by MINICOM, RDB, RSB, RRA, and the Private Sector Federation (PSF), our commitment is to foster resilient regional commerce that sustains jobs and empowers communities.'
      ],
      rw: [
        'Hafi 30% by\'abacuruzi bashya b\'i Rwanda bahagarika kohereza hanze mu mwaka wa mbere kubera kutizera abaguzi. Trade Square ikemura iki kibazo ikoresheje amakuru yizewe.',
        'Yibanda ku bicuruzwa by\'ibanze mu igerageza—ibishyimbo, ifu y\'ibigori, avoka, n\'ubuki—hagamijwe gushimangira ubucuruzi hagati ya Kigali na Nairobi.',
        'Ku bufatanye bwa MINICOM, RDB, RSB, RRA, na PSF, intego yacu ni ukubaka ubucuruzi burambye buteza imbere abahinzi b\'i Rwanda n\'abaturage b\'akarere kose.'
      ],
      sw: [
        'Takriban 30% ya wauzaji wapya wa Rwanda huacha biashara katika mwaka wa kwanza kutokana na kutokuwa na uhakika wa wanunuzi. Trade Square hutatua hili kupitia ulinganifu uliothibitishwa.',
        'Ikizingatia bidhaa muhimu za majaribio—maharagwe, unga wa mahindi, parachichi na asali—jukwaa hujenga njia thabiti inayounganisha Kigali na Nairobi.',
        'Ikiungwa mkono na MINICOM, RDB, RSB, RRA, na PSF, dhamira yetu ni kukuza biashara thabiti ya kikanda inayodumisha ajira na kuwezesha jamii.'
      ],
      fr: [
        'Environ 30 % des nouveaux exportateurs rwandais abandonnent dès la première année faute de contreparties fiables. Trade Square remédie à cela par une mise en relation vérifiée.',
        'Ciblant des produits pilotes à haute valeur ajoutée (haricots, farine de maïs, avocats, miel), la plateforme structure les flux commerciaux entre Kigali et Nairobi.',
        'Soutenue par le MINICOM, la RDB, le RSB, la RRA et la PSF, notre mission est de promouvoir un commerce régional résilient créateur d\'emplois durables.'
      ]
    },
    buttonLabel: {
      en: 'Explore Pilot Scope',
      rw: 'Reba Icyiciro cy\'Igerageza',
      sw: 'Chunguza Majaribio',
      fr: 'Explorer le Projet Pilote'
    },
    targetPage: 'pilot',
    image: exportReadinessFbImg,
    imageAlt: {
      en: 'Rwanda scenic rolling green hills and sustainable agricultural landscape',
      rw: 'Imisozi myiza y\'u Rwanda n\'ubuhinzi burambye butanga umusaruro',
      sw: 'Milima ya kijani kibichi ya Rwanda na mandhari ya kilimo endelevu',
      fr: 'Paysage vallonné verdoyant du Rwanda et agriculture durable'
    }
  }
];

export const HowItWorksHighlights: React.FC<HowItWorksHighlightsProps> = ({
  onNavigate,
  currentLang
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = SLIDES.length;

  const goToSlide = (targetIndex: number) => {
    if (targetIndex === currentSlideIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlideIndex(targetIndex);
      setIsTransitioning(false);
    }, 280);
  };

  const nextSlide = () => {
    goToSlide((currentSlideIndex + 1) % totalSlides);
  };

  // Auto-play interval: cycles every 7 seconds, pauses on hover
  useEffect(() => {
    if (isHovered) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [currentSlideIndex, isHovered]);

  const currentSlide = SLIDES[currentSlideIndex];
  const langKey = currentLang in currentSlide.category ? currentLang : 'en';

  const categoryText = currentSlide.category[langKey] || currentSlide.category.en;
  const titleText = currentSlide.title[langKey] || currentSlide.title.en;
  const paragraphsText = currentSlide.paragraphs[langKey] || currentSlide.paragraphs.en;
  const buttonLabelText = currentSlide.buttonLabel[langKey] || currentSlide.buttonLabel.en;
  const imageAltText = currentSlide.imageAlt[langKey] || currentSlide.imageAlt.en;

  return (
    <section
      className="w-full py-8 sm:py-12 lg:py-14 bg-white select-none"
      aria-label="How Trade Square Works Highlights"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* =========================================================================
              LEFT COLUMN: 16:9 Landscape High-Res Photography
              ========================================================================= */}
          <div className="w-full lg:col-span-7 relative overflow-hidden rounded-2xl bg-neutral-100 shadow-sm aspect-[16/9] group">
            <img
              key={currentSlide.image}
              src={currentSlide.image}
              alt={imageAltText}
              className={`w-full h-full object-cover object-center transition-all duration-700 ease-out transform group-hover:scale-[1.03] ${
                isTransitioning ? 'opacity-40 scale-[1.01]' : 'opacity-100 scale-100'
              }`}
              loading="lazy"
            />
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Minimal Centered Typography (100% Reference Image Clone)
              ========================================================================= */}
          <div
            className={`w-full lg:col-span-5 max-w-[420px] mx-auto flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out ${
              isTransitioning
                ? 'opacity-40 translate-y-1'
                : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Top Subtitle Label ("Highlights") */}
            <span className="text-xs sm:text-[13px] font-bold text-[#1A1A1A] tracking-normal mb-2 text-center block">
              {categoryText}
            </span>

            {/* Main Light, Elegant Headline */}
            <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-light text-[#1A1A1A] tracking-tight leading-[1.22] mb-4 sm:mb-5 text-center">
              {titleText}
            </h2>

            {/* Three Centered Spaced Paragraphs */}
            <div className="space-y-3 sm:space-y-3.5 text-[#555555] text-xs sm:text-[13px] leading-[1.68] text-center mb-6 sm:mb-7 font-normal">
              <p>{paragraphsText[0]}</p>
              <p>{paragraphsText[1]}</p>
              <p>{paragraphsText[2]}</p>
            </div>

            {/* Dark Rounded Call To Action Button with Right Arrow */}
            <button
              type="button"
              onClick={() => onNavigate(currentSlide.targetPage)}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[6px] text-xs sm:text-[13px] font-medium text-white bg-[#222222] hover:bg-[#000000] transition-all duration-200 shadow-2xs cursor-pointer group mb-6 sm:mb-7"
            >
              <span>{buttonLabelText}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            {/* Four Carousel Pagination Indicator Dots (○ ● ○ ○) */}
            <div
              className="flex items-center justify-center gap-2.5"
              role="tablist"
              aria-label="Highlight slides"
            >
              {SLIDES.map((_, index) => {
                const isActive = index === currentSlideIndex;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className="transition-all duration-200 rounded-full cursor-pointer p-1 focus:outline-none focus:ring-2 focus:ring-[#222222]/40"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Slide ${index + 1}`}
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-2 h-2 bg-[#222222] border border-[#222222]'
                          : 'w-2 h-2 bg-transparent border border-[#888888] hover:border-[#222222]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
