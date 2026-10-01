/**
 * Comprehensive multilingual translations for Trade Square:
 * - English (en)
 * - Ikinyarwanda / Kinyarwanda (rw)
 * - Kiswahili / Swahili (sw)
 * - Français / French (fr)
 * 
 * Powered by Google Cloud Translation REST API standards
 * (https://docs.cloud.google.com/translate/docs/reference/rest)
 */

export interface TranslationDictionary {
  // Navigation & Header
  brandTitle: string;
  ministryBadge: string;
  ministryName: string;
  navHome: string;
  navHowItWorks: string;
  navForSmes: string;
  navForPartners: string;
  navTrustData: string;
  navPilot: string;
  navFaq: string;
  navContact: string;
  navMore: string;
  btnSignIn: string;
  btnRequestAccess: string;
  mobileMenu: string;

  // Hero Section
  republicHeader: string;
  pilotBadge: string;
  corridorName: string;
  liveBadge: string;
  heroMainTitle: string;
  dynamicHeadlines: string[];
  heroSentence: string;
  pilotCommoditiesLabel: string;
  commodities: {
    beans: string;
    maize: string;
    avocado: string;
    honey: string;
  };

  // Floating Glass Cards in Hero
  sampleCardTag: string;
  sampleScoreLabel: string;
  sampleStrongMatch: string;
  sampleCompanyName: string;
  sampleLocation: string;
  samplePartnerType: string;
  sampleKraPin: string;
  sampleEvidenceBadge: string;
  sampleEvidenceDesc: string;
  sampleDisclaimer: string;
  samplePreviewBtn: string;

  // Three Steps Summary
  howItWorksTitle: string;
  howItWorksBadge: string;
  step1Title: string;
  step1Desc: string;
  step1Footer: string;
  step2Title: string;
  step2Desc: string;
  step2Footer: string;
  step3Title: string;
  step3Desc: string;
  step3Footer: string;
  btnExploreSignals: string;
  btnReadMethodology: string;

  // Single Evidence Fact
  evidenceFactTitle: string;
  evidenceFactStat: string;
  evidenceFactSource: string;
  evidenceFactDesc: string;
  corridorScopeBtn: string;

  // Video Bar & Ticker
  summitQuoteTitle: string;
  summitQuoteText: string;
  summitQuoteLocation: string;
  sceneStage: string;
  sceneCorridor: string;

  // Target Audiences
  audiencesTitle: string;
  aud1Title: string;
  aud1Desc: string;
  aud1Btn: string;
  aud2Title: string;
  aud2Desc: string;
  aud2Btn: string;
  aud3Title: string;
  aud3Desc: string;
  aud3Btn: string;

  // Footer & Notices
  regulatoryNoticeTitle: string;
  regulatoryNoticeText: string;
  footerDesc: string;
  footerAddress: string;
  footerEmail: string;
  footerPortalsTitle: string;
  footerPilotInfoTitle: string;
  copyrightLine: string;
  dueDiligenceNotice: string;
}

export const TRANSLATIONS: Record<'en' | 'rw' | 'sw' | 'fr', TranslationDictionary> = {
  en: {
    // Navigation & Header
    brandTitle: 'TRADE SQUARE',
    ministryBadge: 'MINICOM',
    ministryName: 'Ministry of Trade and Industry · Rwanda',
    navHome: 'Home',
    navHowItWorks: 'How it works',
    navForSmes: 'For SMEs',
    navForPartners: 'For regional partners',
    navTrustData: 'Trust & data',
    navPilot: 'Pilot',
    navFaq: 'FAQ',
    navContact: 'Contact',
    navMore: 'More',
    btnSignIn: 'Login',
    btnRequestAccess: 'Create account',
    mobileMenu: 'Navigation Menu',

    // Hero Section
    republicHeader: 'MINISTRY OF TRADE AND INDUSTRY · REPUBLIC OF RWANDA',
    pilotBadge: 'MINICOM PILOT',
    corridorName: 'Kigali to Nairobi Northern Corridor',
    liveBadge: 'Live',
    heroMainTitle: 'Trade Square Rwanda',
    dynamicHeadlines: [
      'Connecting Rwandan SMEs to Regional Buyers',
      'Evidence-Backed Trade Partner Shortlists',
      'Northern Corridor Pilot · Kigali to Nairobi'
    ],
    heroSentence:
      'Trade Square helps Rwandan small and medium enterprises identify verified regional buyers and distributors along the Northern Corridor through an explainable, evidence-backed shortlist.',
    pilotCommoditiesLabel: 'Pilot Commodities:',
    commodities: {
      beans: 'Beans (HS 0713)',
      maize: 'Maize flour (HS 1102)',
      avocado: 'Avocado (HS 0804)',
      honey: 'Honey (HS 0409)'
    },

    // Floating Glass Cards in Hero
    sampleCardTag: 'Sample data',
    sampleScoreLabel: '/100 match score',
    sampleStrongMatch: 'Strong match',
    sampleCompanyName: 'Nairobi Grain Distributors Ltd (sample)',
    sampleLocation: 'Nairobi, Kenya',
    samplePartnerType: 'Distributor',
    sampleKraPin: 'KRA: P051284920M',
    sampleEvidenceBadge: 'Known trade activity (Malaba OSBP)',
    sampleEvidenceDesc:
      'Active importer of dry legumes and milled grain with verified KEBS clearance logs.',
    sampleDisclaimer: 'Supports decisions · Not a guarantee',
    samplePreviewBtn: 'Preview card',

    // Three Steps Summary
    howItWorksTitle: 'How Trade Square Works',
    howItWorksBadge: '3 Steps',
    step1Title: 'Describe your export opportunity',
    step1Desc:
      'Commodity HS code (0713, 1102, 0804, 0409), monthly volume (kg), and ex-works price (RWF).',
    step1Footer: 'Active pilot: Beans (0713), Maize flour (1102), Avocado (0804), Honey (0409).',
    step2Title: 'Get a shortlist with evidence',
    step2Desc:
      '5 to 10 explainable regional partners ranked by 6 weighted signals. No invented companies.',
    step2Footer: 'Deterministic calculations; no random numbers or invented businesses.',
    step3Title: 'Contact or request introduction',
    step3Desc:
      'Commercial outreach or official facilitated introduction from the MINICOM Trade Desk.',
    step3Footer: 'Manage transactions through structured stages from quotation to signed contract.',
    btnExploreSignals: 'Explore ranking signals',
    btnReadMethodology: 'Read signal methodology',

    // Single Evidence Fact
    evidenceFactTitle: 'Corridor Trade Evidence',
    evidenceFactStat:
      '“About 30% of new Rwandan exporters are still exporting a year later.”',
    evidenceFactSource:
      'Source line: International Growth Centre, 2022, citing World Bank 2017.',
    evidenceFactDesc:
      'Sustaining cross-border trade requires reliable, verified counterparties. Trade Square addresses this drop-off by replacing unstructured directories with explainable matches.',
    corridorScopeBtn: 'Corridor scope',

    // Video Bar & Ticker
    summitQuoteTitle: 'Kigali Summit Quote',
    summitQuoteText:
      '“... the country is a hub for regional trade, innovation, and cross-border enterprise.”',
    summitQuoteLocation: 'Hanga Pitchfest · Kigali Business Forum',
    sceneStage: 'Summit Stage',
    sceneCorridor: 'Kigali Corridor',

    // Target Audiences
    audiencesTitle: 'Who Trade Square Is For',
    aud1Title: '1. Rwandan SME Owners',
    aud1Desc:
      'Designed mobile-first for Rwandan entrepreneurs to define export capacity from their phone and obtain an explainable list of verified regional buyers without costly broker fees.',
    aud1Btn: 'SME eligibility guidance',
    aud2Title: '2. Kenyan Buyers & Distributors',
    aud2Desc:
      'Regional enterprises seeking stable supplies of Rwandan beans, maize flour, avocado, and honey. Partners can claim their profile to receive verified consignment offers.',
    aud2Btn: 'Claim or register profile',
    aud3Title: '3. Trade Support Bodies & Facilitators',
    aud3Desc:
      'Public pilot transparency on bilateral Northern Corridor commerce between Kigali and Nairobi, supported by MINICOM, RDB, RSB, RRA, and PSF.',
    aud3Btn: 'Pilot corridor details',

    // Footer & Notices
    regulatoryNoticeTitle: 'Official Regulatory Notice:',
    regulatoryNoticeText:
      'Relevance score supports decisions. It is not a guarantee. Do your own due diligence. MINICOM provides verification evidence and institutional facilitation records but does not guarantee performance, creditworthiness, or private commercial transactions of any entity.',
    footerDesc:
      'Trade Square is an official pilot of the Ministry of Trade and Industry (MINICOM) designed to help Rwandan SMEs identify explainable regional trading partners along the Northern Corridor (Kigali to Nairobi via Gatuna and Malaba).',
    footerAddress: 'Government of Rwanda · KN 3 Ave, Kigali · P.O. Box 73 Kigali',
    footerEmail: 'Contact email: to be confirmed',
    footerPortalsTitle: 'Official Trade Portals',
    footerPilotInfoTitle: 'Pilot Information',
    copyrightLine: '© 2026 Government of the Republic of Rwanda',
    dueDiligenceNotice:
      'Relevance score supports decisions. It is not a guarantee. Do your own due diligence.'
  },

  rw: {
    // Navigation & Header
    brandTitle: 'TRADE SQUARE',
    ministryBadge: 'MINICOM',
    ministryName: 'Minisiteri y\'Ubucuruzi n\'Inganda · u Rwanda',
    navHome: 'Ahabanza',
    navHowItWorks: 'Uko bikora',
    navForSmes: 'Kuri ba Rwiyemezamirimo (SMEs)',
    navForPartners: 'Abafatanyabikorwa bo mu Karere',
    navTrustData: 'Ubwiringiro & Amakuru',
    navPilot: 'Icyiciro cy\'Igerageza',
    navFaq: 'Ibibazo bikunze kubazwa',
    navContact: 'Twandikire',
    navMore: 'Ibindi',
    btnSignIn: 'Injira',
    btnRequestAccess: 'Fungura Konti',
    mobileMenu: 'Ibikubiyemo',

    // Hero Section
    republicHeader: 'MINISITERI Y\'UBUCURUZI N\'INGANDA · REPUBULIKA Y\'U RWANDA',
    pilotBadge: 'IGERAGEZA RYA MINICOM',
    corridorName: 'Umuhora wo Ruguru: Kigali kugera Nairobi',
    liveBadge: 'Kuri Murandasi',
    heroMainTitle: 'Trade Square Rwanda',
    dynamicHeadlines: [
      'Guhuza Ba Rwiyemezamirimo b\'u Rwanda n\'Abaguzi bo mu Karere',
      'Urutonde Nteganyamugambi Rufite Ibimenyetso By\'Ubucuruzi',
      'Icyiciro cy\'Igerageza ry\'Umuhora wo Ruguru · Kigali kugera Nairobi'
    ],
    heroSentence:
      'Trade Square ifasha ba rwiyemezamirimo bato n\'abaciriritse bo mu Rwanda kubona abaguzi n\'abakwirakwiza ibicuruzwa bo mu karere ku muhora wa Kigali kugera Nairobi, binyuze ku rutonde rusobanutse rurimo ibimenyetso simusiga by\'ubucuruzi aho kuba amalisiti atizewe.',
    pilotCommoditiesLabel: 'Ibicuruzwa biri mu Igerageza:',
    commodities: {
      beans: 'Ibihyimbo (HS 0713)',
      maize: 'Ifu y\'Ibigori (HS 1102)',
      avocado: 'Avoka (HS 0804)',
      honey: 'Ubuki (HS 0409)'
    },

    // Floating Glass Cards in Hero
    sampleCardTag: 'Amakuru y\'Icyitegererezo',
    sampleScoreLabel: '/100 amanota y\'ihuriro',
    sampleStrongMatch: 'Bihuye cyane',
    sampleCompanyName: 'Nairobi Grain Distributors Ltd (sample)',
    sampleLocation: 'Nairobi, Kenya',
    samplePartnerType: 'Umukwirakwiza',
    sampleKraPin: 'KRA: P051284920M',
    sampleEvidenceBadge: 'Igikorwa cy\'Ubucuruzi Kizwi (Malaba OSBP)',
    sampleEvidenceDesc:
      'Yinjiza ibinyamisogorere n\'ifu y\'ibigori ikoresheje gasutamo ya Malaba ifite ibyemezo bya KEBS.',
    sampleDisclaimer: 'Bifasha gufata imyanzuro · Si garanti',
    samplePreviewBtn: 'Reba ikarita',

    // Three Steps Summary
    howItWorksTitle: 'Intambwe 3 z\'Uko Trade Square Ikora',
    howItWorksBadge: 'Intambwe 3',
    step1Title: 'Sobanura amahirwe yawe yo kohereza ibicuruzwa',
    step1Desc:
      'Kode y\'igicuruzwa ya HS (0713, 1102, 0804, 0409), ingano ifatika ku kwezi mu biro (kg), n\'igiciro cyo ku ruganda mu mafaranga y\'u Rwanda (RWF).',
    step1Footer: 'Ibirimo mu igerageza: Ibihyimbo (0713), Ifu y\'ibigori (1102), Avoka (0804), Ubuki (0409).',
    step2Title: 'Bona urutonde rugufi ruriho ibimenyetso',
    step2Desc:
      'Bona abafatanyabikorwa 5 kugeza ku 10 bo mu karere bakurikije ibipimo 6 bishingiye ku makuru y\'ubucuruzi. Nta sosiyete zihimbano zibaho.',
    step2Footer: 'Ibarurishamibare ryizewe; nta mibare ipfuye cyangwa ubucuruzi bw\'amahimbano.',
    step3Title: 'Vugana nabo cyangwa usabe ubuvugizi',
    step3Desc:
      'Tegura ibiganiro by\'ubucuruzi cyangwa usabe inyandiko y\'ubuvugizi yemewe iturutse muri MINICOM Trade Desk ijya ku bashinzwe ubucuruzi.',
    step3Footer: 'Genzura ibyiciro by\'ubucuruzi guhera ku gusaba ibiciro kugeza hasinywe amasezerano.',
    btnExploreSignals: 'Suzuma ibipimo 6 by\'ihuriro',
    btnReadMethodology: 'Uko ibipimo bikora',

    // Single Evidence Fact
    evidenceFactTitle: 'Ibimenyetso by\'Ubucuruzi bwo mu Karere',
    evidenceFactStat:
      '“Hafi 30% by\'abacuruzi bashya bo mu Rwanda bohereza ibicuruzwa hanze baracyabikora nyuma y\'umwaka umwe.”',
    evidenceFactSource:
      'Inkomoko: International Growth Centre, 2022, bishingiye kuri Banki y\'Isi 2017.',
    evidenceFactDesc:
      'Gukomeza ubucuruzi bwambukiranya imipaka bisaba abafatanyabikorwa bizerwa kandi bafite ibimenyetso. Trade Square ikemura iki kibazo binyuze mu guhuza abacuruzi hifashishijwe amakuru nyayo.',
    corridorScopeBtn: 'Imbibi z\'umuhora',

    // Video Bar & Ticker
    summitQuoteTitle: 'Amagambo yo mu nama ya Kigali',
    summitQuoteText:
      '“... igihugu ni ihuriro ry\'ubucuruzi bwo mu karere, guhanga udushya, n\'ubufatanye bwambukiranya imipaka.”',
    summitQuoteLocation: 'Hanga Pitchfest · Kigali Business Forum',
    sceneStage: 'Icyiciro cy\'Inama',
    sceneCorridor: 'Umuhora wa Kigali',

    // Target Audiences
    audiencesTitle: 'Abo Trade Square Igenewe',
    aud1Title: '1. Ba Rwiyemezamirimo b\'u Rwanda (SMEs)',
    aud1Desc:
      'Yubatswe ku buryo bworoshye gukoreshwa kuri telefone, ifasha ba rwiyemezamirimo kugaragaza ubushobozi bwabo no kubona abaguzi bizerwa bo mu karere nta kiguzi cy\'abahuza.',
    aud1Btn: 'Amabwiriza y\'uburenganzira',
    aud2Title: '2. Abaguzi n\'Abakwirakwiza bo muri Kenya',
    aud2Desc:
      'Sosiyete zo mu karere zishaka ibicuruzwa bihoraho by\'u Rwanda nk\'ibihyimbo, ifu y\'ibigori, avoka, n\'ubuki. Bashobora kwemeza konti yabo bakakira ubutumire bw\'ubucuruzi.',
    aud2Btn: 'Emeza cyangwa iyandikishe',
    aud3Title: '3. Inzego zishyigikira Ubucuruzi n\'Abanyamakuru',
    aud3Desc:
      'Kugaragaza mu mucyo ibikorwa by\'ubucuruzi ku muhora wo ruguru hagati ya Kigali na Nairobi, bishyigikiwe na MINICOM, RDB, RSB, RRA, na PSF.',
    aud3Btn: 'Amakuru y\'umuhora',

    // Footer & Notices
    regulatoryNoticeTitle: 'Imenyekanisha Ryemewe n\'Amategeko:',
    regulatoryNoticeText:
      'Amanota y\'ihuriro afasha mu gufata imyanzuro gusa. Si garanti. Buri wese akora ubushishozi bwe. MINICOM itanga ibimenyetso by\'ubugenzuzi n\'inyandiko z\'ubuvugizi ariko ntishingira ubwishyu, ubunyangamugayo bw\'imari, cyangwa amasezerano y\'ubucuruzi bwite.',
    footerDesc:
      'Trade Square ni gahunda y\'igerageza ya Minisiteri y\'Ubucuruzi n\'Inganda (MINICOM) igamije gufasha ba rwiyemezamirimo b\'u Rwanda kubona abafatanyabikorwa bizerwa ku muhora wo ruguru (Kigali kugera Nairobi unyuze Gatuna na Malaba).',
    footerAddress: 'Guverinoma y\'u Rwanda · KN 3 Ave, Kigali · P.O. Box 73 Kigali',
    footerEmail: 'Imeri ya serivisi: Izemezwa vuba',
    footerPortalsTitle: 'Imbuga z\'Ubucuruzi za Leta',
    footerPilotInfoTitle: 'Amakuru y\'Igerageza',
    copyrightLine: '© 2026 Guverinoma ya Repubulika y\'u Rwanda',
    dueDiligenceNotice:
      'Amanota y\'ihuriro afasha mu gufata imyanzuro gusa. Si garanti. Buri wese akora ubushishozi bwe.'
  },

  sw: {
    // Navigation & Header
    brandTitle: 'TRADE SQUARE',
    ministryBadge: 'MINICOM',
    ministryName: 'Wizara ya Biashara na Viwanda · Rwanda',
    navHome: 'Nyumbani',
    navHowItWorks: 'Jinsi inavyofanya kazi',
    navForSmes: 'Kwa Wajasiriamali (SMEs)',
    navForPartners: 'Washirika wa Kikanda',
    navTrustData: 'Uaminifu & Data',
    navPilot: 'Mradi wa Majaribio',
    navFaq: 'Maswali Yanayoulizwa',
    navContact: 'Wasiliana Nasi',
    navMore: 'Zaidi',
    btnSignIn: 'Ingia',
    btnRequestAccess: 'Fungua Akaunti',
    mobileMenu: 'Menyu ya Urambazaji',

    // Hero Section
    republicHeader: 'WIZARA YA BIASHARA NA VIWANDA · JAMHURI YA RWANDA',
    pilotBadge: 'MAJARIBIO YA MINICOM',
    corridorName: 'Ukanda wa Kaskazini: Kigali hadi Nairobi',
    liveBadge: 'Moja kwa Moja',
    heroMainTitle: 'Trade Square Rwanda',
    dynamicHeadlines: [
      'Kuunganisha SMEs za Rwanda na Wanunuzi wa Kikanda',
      'Orodha ya Washirika wa Biashara Yenye Ushahidi Thabiti',
      'Majaribio ya Ukanda wa Kaskazini · Kigali hadi Nairobi'
    ],
    heroSentence:
      'Trade Square husaidia biashara ndogo na za kati za Rwanda kutambua wanunuzi na wasambazaji waliothibitishwa wa kikanda kwenye Ukanda wa Kaskazini kupitia orodha iliyothibitishwa na yenye ushahidi.',
    pilotCommoditiesLabel: 'Bidhaa za Majaribio:',
    commodities: {
      beans: 'Maharagwe (HS 0713)',
      maize: 'Unga wa mahindi (HS 1102)',
      avocado: 'Parachichi (HS 0804)',
      honey: 'Asali (HS 0409)'
    },

    // Floating Glass Cards in Hero
    sampleCardTag: 'Data ya Sampuli',
    sampleScoreLabel: '/100 alama ya ulinganifu',
    sampleStrongMatch: 'Ulinganifu mzuri',
    sampleCompanyName: 'Nairobi Grain Distributors Ltd (sampuli)',
    sampleLocation: 'Nairobi, Kenya',
    samplePartnerType: 'Msambazaji',
    sampleKraPin: 'KRA: P051284920M',
    sampleEvidenceBadge: 'Shughuli ya Biashara Inayojulikana (Malaba OSBP)',
    sampleEvidenceDesc:
      'Muagizaji hai wa nafaka na jamii ya kunde mwenye vibali vilivyothibitishwa vya KEBS.',
    sampleDisclaimer: 'Inasaidia maamuzi · Si dhamana',
    samplePreviewBtn: 'Angalia kadi',

    // Three Steps Summary
    howItWorksTitle: 'Hatua 3 Jinsi Trade Square Inavyofanya Kazi',
    howItWorksBadge: 'Hatua 3',
    step1Title: 'Eleza fursa yako ya kusafirisha nje',
    step1Desc:
      'Nambari ya HS ya bidhaa (0713, 1102, 0804, 0409), kiasi cha kila mwezi (kg), na bei ya kiwandani (RWF).',
    step1Footer: 'Majaribio yanayotumika: Maharagwe (0713), Unga wa mahindi (1102), Parachichi (0804), Asali (0409).',
    step2Title: 'Pata orodha fupi yenye ushahidi',
    step2Desc:
      'Washirika 5 hadi 10 wa kikanda waliopangwa kwa vigezo 6 vya takwimu za biashara. Hakuna kampuni za kubuni.',
    step2Footer: 'Hesabu za uhakika; hakuna nambari bandia au biashara za kufikirika.',
    step3Title: 'Wasiliana nao au omba utangulizi rasmi',
    step3Desc:
      'Mawasiliano ya kibiashara au utangulizi rasmi unaowezeshwa na Dawati la Biashara la MINICOM.',
    step3Footer: 'Simamia miamala kupitia hatua zilizopangwa kutoka nukuu ya bei hadi mkataba uliosainiwa.',
    btnExploreSignals: 'Chunguza vigezo vya ulinganifu',
    btnReadMethodology: 'Soma mbinu ya vigezo',

    // Single Evidence Fact
    evidenceFactTitle: 'Ushahidi wa Biashara ya Ukanda',
    evidenceFactStat:
      '“Takriban 30% ya wauzaji wapya wa nje wa Rwanda bado wanasafirisha bidhaa mwaka mmoja baadaye.”',
    evidenceFactSource:
      'Chanzo: International Growth Centre, 2022, ikinukuu Benki ya Dunia 2017.',
    evidenceFactDesc:
      'Kudumisha biashara ya mipakani kunahitaji washirika wa kuaminika na waliothibitishwa. Trade Square huondoa changamoto hii kwa kuunganisha wafanyabiashara kwa ushahidi halisi.',
    corridorScopeBtn: 'Upeo wa ukanda',

    // Video Bar & Ticker
    summitQuoteTitle: 'Nukuu ya Mkutano wa Kigali',
    summitQuoteText:
      '“... nchi hii ni kitovu cha biashara ya kikanda, uvumbuzi, na ujasiriamali wa mipakani.”',
    summitQuoteLocation: 'Hanga Pitchfest · Kongamano la Biashara la Kigali',
    sceneStage: 'Jukwaa la Mkutano',
    sceneCorridor: 'Ukanda wa Kigali',

    // Target Audiences
    audiencesTitle: 'Nani Trade Square Imekusudiwa',
    aud1Title: '1. Wamiliki wa SMEs za Rwanda',
    aud1Desc:
      'Imeundwa kwanza kwa simu za mkononi ili kuwasaidia wajasiriamali wa Rwanda kueleza uwezo wao na kupata wanunuzi wa kikanda bila gharama za madalali.',
    aud1Btn: 'Mwongozo wa ustahiki wa SME',
    aud2Title: '2. Wanunuzi na Wasambazaji wa Kenya',
    aud2Desc:
      'Biashara za kikanda zinazotafuta usambazaji thabiti wa maharagwe, unga wa mahindi, parachichi na asali kutoka Rwanda. Washirika wanaweza kudai wasifu wao.',
    aud2Btn: 'Dai au sajili wasifu',
    aud3Title: '3. Taasisi za Biashara na Waandishi wa Habari',
    aud3Desc:
      'Uwazi kamili wa mradi wa majaribio wa kibiashara kwenye Ukanda wa Kaskazini kati ya Kigali na Nairobi, ukisaidiwa na MINICOM, RDB, RSB, RRA na PSF.',
    aud3Btn: 'Maelezo ya ukanda wa majaribio',

    // Footer & Notices
    regulatoryNoticeTitle: 'Ilani Rasmi ya Kisheria:',
    regulatoryNoticeText:
      'Alama ya ulinganifu inasaidia kufanya maamuzi pekee. Si dhamana. Kila mfanyabiashara anapaswa kufanya uchunguzi wake binafsi. MINICOM inatoa ushahidi wa uthibitisho lakini haihakikishi miamala ya kibiashara ya kibinafsi.',
    footerDesc:
      'Trade Square ni mradi rasmi wa majaribio wa Wizara ya Biashara na Viwanda (MINICOM) ulioundwa kusaidia SMEs za Rwanda kutambua washirika wa kikanda kwenye Ukanda wa Kaskazini (Kigali hadi Nairobi kupitia Gatuna na Malaba).',
    footerAddress: 'Serikali ya Rwanda · KN 3 Ave, Kigali · S.L.P 73 Kigali',
    footerEmail: 'Barua pepe ya mawasiliano: Itathibitishwa hivi karibuni',
    footerPortalsTitle: 'Milango Rasmi ya Biashara',
    footerPilotInfoTitle: 'Taarifa za Majaribio',
    copyrightLine: '© 2026 Serikali ya Jamhuri ya Rwanda',
    dueDiligenceNotice:
      'Alama ya ulinganifu inasaidia kufanya maamuzi pekee. Si dhamana. Kila mfanyabiashara anapaswa kufanya uchunguzi wake.'
  },

  fr: {
    // Navigation & Header
    brandTitle: 'TRADE SQUARE',
    ministryBadge: 'MINICOM',
    ministryName: 'Ministère du Commerce et de l\'Industrie · Rwanda',
    navHome: 'Accueil',
    navHowItWorks: 'Comment ça marche',
    navForSmes: 'Pour les PME',
    navForPartners: 'Partenaires régionaux',
    navTrustData: 'Confiance & Données',
    navPilot: 'Projet Pilote',
    navFaq: 'FAQ',
    navContact: 'Contact',
    navMore: 'Plus',
    btnSignIn: 'Connexion',
    btnRequestAccess: 'Créer un compte',
    mobileMenu: 'Menu de Navigation',

    // Hero Section
    republicHeader: 'MINISTÈRE DU COMMERCE ET DE L\'INDUSTRIE · RÉPUBLIQUE DU RWANDA',
    pilotBadge: 'PILOTE MINICOM',
    corridorName: 'Corridor Nord : Kigali à Nairobi',
    liveBadge: 'En Direct',
    heroMainTitle: 'Trade Square Rwanda',
    dynamicHeadlines: [
      'Connecter les PME rwandaises aux acheteurs régionaux',
      'Sélection de partenaires commerciaux basée sur des preuves',
      'Pilote du Corridor Nord · Kigali à Nairobi'
    ],
    heroSentence:
      'Trade Square aide les petites et moyennes entreprises rwandaises à identifier des acheteurs et distributeurs régionaux vérifiés le long du Corridor Nord grâce à une sélection explicable et fondée sur des données concrètes.',
    pilotCommoditiesLabel: 'Produits Pilotes :',
    commodities: {
      beans: 'Haricots (HS 0713)',
      maize: 'Farine de maïs (HS 1102)',
      avocado: 'Avocats (HS 0804)',
      honey: 'Miel (HS 0409)'
    },

    // Floating Glass Cards in Hero
    sampleCardTag: 'Données d\'exemple',
    sampleScoreLabel: '/100 score de correspondance',
    sampleStrongMatch: 'Forte correspondance',
    sampleCompanyName: 'Nairobi Grain Distributors Ltd (exemple)',
    sampleLocation: 'Nairobi, Kenya',
    samplePartnerType: 'Distributeur',
    sampleKraPin: 'KRA: P051284920M',
    sampleEvidenceBadge: 'Activité commerciale vérifiée (Malaba OSBP)',
    sampleEvidenceDesc:
      'Importateur actif de légumineuses et céréales avec registres de dédouanement KEBS vérifiés.',
    sampleDisclaimer: 'Aide à la décision · Pas une garantie',
    samplePreviewBtn: 'Aperçu de la fiche',

    // Three Steps Summary
    howItWorksTitle: 'Comment fonctionne Trade Square',
    howItWorksBadge: '3 Étapes',
    step1Title: 'Décrivez votre offre d\'exportation',
    step1Desc:
      'Code SH du produit (0713, 1102, 0804, 0409), volume mensuel (kg) et prix départ usine (RWF).',
    step1Footer: 'Pilote actif : Haricots (0713), Farine de maïs (1102), Avocats (0804), Miel (0409).',
    step2Title: 'Obtenez une sélection étayée de preuves',
    step2Desc:
      '5 à 10 partenaires régionaux classés selon 6 signaux pondérés. Aucune entreprise fictive.',
    step2Footer: 'Calculs déterministes ; pas de chiffres aléatoires ni d\'entreprises inventées.',
    step3Title: 'Contactez ou sollicitez une mise en relation',
    step3Desc:
      'Démarche commerciale directe ou mise en relation officielle facilitée par le Trade Desk du MINICOM.',
    step3Footer: 'Gérez les transactions par étapes structurées, du devis au contrat signé.',
    btnExploreSignals: 'Explorer les signaux de classement',
    btnReadMethodology: 'Lire la méthodologie',

    // Single Evidence Fact
    evidenceFactTitle: 'Preuves du Commerce sur le Corridor',
    evidenceFactStat:
      '« Environ 30 % des nouveaux exportateurs rwandais exportent toujours un an plus tard. »',
    evidenceFactSource:
      'Source : International Growth Centre, 2022, citant la Banque mondiale 2017.',
    evidenceFactDesc:
      'Pérenniser le commerce transfrontalier exige des contreparties fiables et vérifiées. Trade Square résout cette rupture en remplaçant les annuaires non structurés par des correspondances justifiées.',
    corridorScopeBtn: 'Périmètre du corridor',

    // Video Bar & Ticker
    summitQuoteTitle: 'Citation du Sommet de Kigali',
    summitQuoteText:
      '« ... le pays est un carrefour régional pour le commerce, l\'innovation et l\'entrepreneuriat transfrontalier. »',
    summitQuoteLocation: 'Hanga Pitchfest · Forum d\'Affaires de Kigali',
    sceneStage: 'Tribune Officielle',
    sceneCorridor: 'Corridor de Kigali',

    // Target Audiences
    audiencesTitle: 'À qui s\'adresse Trade Square',
    aud1Title: '1. Propriétaires de PME Rwandaises',
    aud1Desc:
      'Conçu en priorité pour mobile afin d\'aider les entrepreneurs rwandais à déclarer leurs capacités d\'exportation et à obtenir une liste explicable d\'acheteurs régionaux vérifiés, sans frais d\'intermédiaires.',
    aud1Btn: 'Guide d\'éligibilité PME',
    aud2Title: '2. Acheteurs et Distributeurs Kényans',
    aud2Desc:
      'Entreprises régionales recherchant des approvisionnements réguliers en haricots, farine de maïs, avocats et miel du Rwanda. Les partenaires peuvent revendiquer leur profil pour recevoir des offres de consignation vérifiées.',
    aud2Btn: 'Revendiquer ou enregistrer un profil',
    aud3Title: '3. Organismes d\'Appui au Commerce & Journalistes',
    aud3Desc:
      'Transparence publique sur le commerce bilatéral du Corridor Nord entre Kigali et Nairobi, soutenu par le MINICOM, RDB, RSB, RRA et PSF.',
    aud3Btn: 'Détails du corridor pilote',

    // Footer & Notices
    regulatoryNoticeTitle: 'Avis Réglementaire Officiel :',
    regulatoryNoticeText:
      'Le score de pertinence soutient la prise de décision. Il ne constitue pas une garantie. Effectuez vos propres vérifications préalables. Le MINICOM fournit des éléments de preuve et des dossiers de facilitation mais ne garantit pas la solvabilité ou les transactions privées.',
    footerDesc:
      'Trade Square est un projet pilote officiel du Ministère du Commerce et de l\'Industrie (MINICOM) conçu pour aider les PME rwandaises à identifier des partenaires régionaux fiables le long du Corridor Nord (Kigali à Nairobi via Gatuna et Malaba).',
    footerAddress: 'Gouvernement du Rwanda · KN 3 Ave, Kigali · B.P. 73 Kigali',
    footerEmail: 'Email de contact : confirmation imminente',
    footerPortalsTitle: 'Portails Commerciaux Officiels',
    footerPilotInfoTitle: 'Informations Pilote',
    copyrightLine: '© 2026 Gouvernement de la République du Rwanda',
    dueDiligenceNotice:
      'Le score de pertinence soutient la prise de décision. Il ne constitue pas une garantie. Effectuez vos propres vérifications préalables.'
  }
};
