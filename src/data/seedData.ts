/**
 * Seed data for Trade Square (MINICOM Pilot)
 * Scope: Rwanda to Kenya Northern Corridor (Kigali to Nairobi via Gatuna and Malaba)
 * All entities are sample pilot entities. All company names end with "(sample)".
 */

import {
  HSProduct,
  RwandanSME,
  KenyanPartner,
  IntroductionRequest,
  PipelineItem,
  CorridorAssumptions,
  ScoringWeights
} from '../types';

export const HS_PRODUCTS: HSProduct[] = [
  {
    hsCode: '0713',
    name: 'Dried Beans',
    category: 'Leguminous Vegetables',
    unit: 'kg',
    defaultPriceRwfPerKg: 780,
    typicalMonthlyKg: 18000
  },
  {
    hsCode: '1102',
    name: 'Maize Flour',
    category: 'Milled Grain Products',
    unit: 'kg',
    defaultPriceRwfPerKg: 620,
    typicalMonthlyKg: 25000
  },
  {
    hsCode: '0804',
    name: 'Fresh Avocado (Hass & Fuerte)',
    category: 'Fresh Horticultural Produce',
    unit: 'kg',
    defaultPriceRwfPerKg: 950,
    typicalMonthlyKg: 12000
  },
  {
    hsCode: '0409',
    name: 'Natural Honey',
    category: 'Apiculture Products',
    unit: 'kg',
    defaultPriceRwfPerKg: 3400,
    typicalMonthlyKg: 2500
  },
  {
    hsCode: '1106',
    name: 'High Quality Cassava Flour',
    category: 'Root & Tuber Flours',
    unit: 'kg',
    defaultPriceRwfPerKg: 540,
    typicalMonthlyKg: 20000
  }
];

export const INITIAL_ASSUMPTIONS: CorridorAssumptions = {
  exchangeRateKesToRwf: 9.85, // 1 KES = 9.85 RWF (or 1 RWF = 0.1015 KES)
  corridorTransitCostRwfPerKg: 85, // Road freight Kigali -> Gatuna Border -> Malaba Border -> Nairobi Depot
  eacCetTariffPct: 0 // EAC Rules of Origin 0% Duty with AfCFTA / EAC Certificate
};

export const INITIAL_WEIGHTS: ScoringWeights = {
  productFit: 0.30,
  tradeEvidence: 0.25,
  certificationFit: 0.15,
  capacityFit: 0.10,
  landedPriceFit: 0.15,
  dataFreshness: 0.05
};

export const SEED_SMES: RwandanSME[] = [
  {
    id: 'sme-1',
    businessName: 'Virunga Valley Agro-Processors Ltd (sample)',
    rdbNumber: '109238472',
    tin: '102938475',
    district: 'Musanze',
    contactPerson: 'Jean-Claude Hakizimana',
    phone: '+250 788 341 902',
    email: 'j.hakizimana@virungavalley.rw (sample)',
    products: ['0713', '1102'],
    certifications: ['RSB S-Mark', 'HACCP'],
    monthlyCapacityKg: 22000,
    exWorksPriceRwf: 760,
    selectedHsCode: '0713'
  },
  {
    id: 'sme-2',
    businessName: 'Lake Kivu Fresh Agro-Exporters (sample)',
    rdbNumber: '108447291',
    tin: '104882739',
    district: 'Rubavu',
    contactPerson: 'Marie-Claire Uwera',
    phone: '+250 785 119 443',
    email: 'uwera.m@kivufresh.rw (sample)',
    products: ['0804', '0713'],
    certifications: ['RSB S-Mark', 'GlobalG.A.P.'],
    monthlyCapacityKg: 14000,
    exWorksPriceRwf: 920,
    selectedHsCode: '0804'
  },
  {
    id: 'sme-3',
    businessName: 'Eastern Sun Flour Mills Ltd (sample)',
    rdbNumber: '110992384',
    tin: '108339102',
    district: 'Rwamagana',
    contactPerson: 'Emmanuel Nshimiyimana',
    phone: '+250 783 992 018',
    email: 'mills@easternsun.rw (sample)',
    products: ['1102', '1106'],
    certifications: ['RSB S-Mark'],
    monthlyCapacityKg: 30000,
    exWorksPriceRwf: 600,
    selectedHsCode: '1102'
  },
  {
    id: 'sme-4',
    businessName: 'Huye Highlands Honey & Spices (sample)',
    rdbNumber: '107382910',
    tin: '101994827',
    district: 'Huye',
    contactPerson: 'Beatha Mukamana',
    phone: '+250 782 440 188',
    email: 'contact@huyehoney.rw (sample)',
    products: ['0409'],
    certifications: ['RSB S-Mark', 'Organic'],
    monthlyCapacityKg: 3200,
    exWorksPriceRwf: 3300,
    selectedHsCode: '0409'
  },
  {
    id: 'sme-5',
    businessName: 'Nyagatare Livestock & Grain Cooperative (sample)',
    rdbNumber: '112883901',
    tin: '109284711',
    district: 'Nyagatare',
    contactPerson: 'David Karekezi',
    phone: '+250 789 652 331',
    email: 'trade@nyagatarecoop.rw (sample)',
    products: ['0713', '1102'],
    certifications: ['RSB S-Mark'],
    monthlyCapacityKg: 35000,
    exWorksPriceRwf: 740,
    selectedHsCode: '0713'
  },
  {
    id: 'sme-6',
    businessName: 'Akagera Organic Roots Ltd (sample)',
    rdbNumber: '104772819',
    tin: '103829104',
    district: 'Kayonza',
    contactPerson: 'Aline Mugiraneza',
    phone: '+250 784 902 119',
    email: 'roots@akageraorganic.rw (sample)',
    products: ['1106', '0804'],
    certifications: ['RSB S-Mark', 'Organic', 'HACCP'],
    monthlyCapacityKg: 18000,
    exWorksPriceRwf: 530,
    selectedHsCode: '1106'
  },
  {
    id: 'sme-7',
    businessName: 'Gicumbi Highland Grain Collectors (sample)',
    rdbNumber: '106192840',
    tin: '105739201',
    district: 'Gicumbi',
    contactPerson: 'Patrick Bizimungu',
    phone: '+250 788 120 774',
    email: 'gicumbigrain@rwandatrade.rw (sample)',
    products: ['0713', '1102'],
    certifications: ['RSB S-Mark'],
    monthlyCapacityKg: 16000,
    exWorksPriceRwf: 770,
    selectedHsCode: '0713'
  },
  {
    id: 'sme-8',
    businessName: 'Rusizi Agro-Commodities Hub (sample)',
    rdbNumber: '111829471',
    tin: '107482910',
    district: 'Rusizi',
    contactPerson: 'Chantal Ingabire',
    phone: '+250 787 503 661',
    email: 'c.ingabire@rusizihub.rw (sample)',
    products: ['1106', '0409'],
    certifications: ['RSB S-Mark', 'HACCP'],
    monthlyCapacityKg: 12000,
    exWorksPriceRwf: 550,
    selectedHsCode: '1106'
  }
];

export const SEED_KENYAN_PARTNERS: KenyanPartner[] = [
  {
    id: 'kp-1',
    name: 'Nairobi Grain Distributors Ltd (sample)',
    city: 'Nairobi',
    role: 'Distributor',
    evidenceLabel: 'Known trade activity',
    source: 'KRA Import Manifest & Malaba One-Stop Border Post Log',
    updatedDate: '18 Aug 2026',
    oneLineReason: 'Active importer of dry legumes and milled grain through Malaba OSBP with validated KEBS clearance records.',
    stillToVerify: [
      'Current KEBS PVoC compliance certificate for 2026/27 cycle',
      'Confirmed transit insurance covering Gatuna to Nairobi depot',
      'Payment terms guarantee (Letter of Credit vs 30-day invoice)'
    ],
    handledProducts: [
      {
        hsCode: '0713',
        productName: 'Dried Beans',
        minVolumeKgMonth: 10000,
        maxVolumeKgMonth: 35000,
        targetBuyPriceKesPerKg: 95
      },
      {
        hsCode: '1102',
        productName: 'Maize Flour',
        minVolumeKgMonth: 15000,
        maxVolumeKgMonth: 40000,
        targetBuyPriceKesPerKg: 78
      }
    ],
    acceptedCertifications: ['RSB S-Mark', 'HACCP'],
    contact: {
      person: 'Peter Ndwiga Kariuki',
      phone: '+254 722 401 883',
      email: 'p.kariuki@nairobigrain.co.ke (sample)',
      address: 'Plot 44, Industrial Area Off Enterprise Rd, Nairobi'
    },
    kraPin: 'P051284920M',
    corridorExperience: {
      gatunaMalabaCrossingsCount: 42,
      averageClearanceDays: 1.8,
      lastShipmentDate: '12 Aug 2026'
    },
    evidenceRecords: [
      {
        source: 'KRA Customs Simba/ICMS Manifest',
        date: '12 Aug 2026',
        status: 'Verified',
        documentRef: 'KRA-CUS-2026-NBO-09142',
        summary: 'Cleared 28 tonnes of dry leguminous vegetables from Rwanda via Gatuna/Malaba corridor.'
      },
      {
        source: 'KEBS Quality Compliance Register',
        date: '04 Jun 2026',
        status: 'Verified',
        documentRef: 'KEBS-QIS-EAC-8821',
        summary: 'Standardization mark mutual recognition accepted under EAC SQMT Act.'
      },
      {
        source: 'Northern Corridor Transit and Transport Coordination Authority (NCTTCA)',
        date: '22 May 2026',
        status: 'Recorded',
        documentRef: 'NCTTCA-PRF-KGL-NBO-441',
        summary: 'Average transit dwell time 38 hours between Kigali and Nairobi logistics park.'
      }
    ]
  },
  {
    id: 'kp-2',
    name: 'Apex Supermarkets Kenya Ltd (sample)',
    city: 'Nairobi',
    role: 'Buyer',
    evidenceLabel: 'Business identity verified',
    source: 'Business Registration Service (BRS Kenya) & KEBS Retail Audit',
    updatedDate: '11 Aug 2026',
    oneLineReason: 'Major retail chain operating 14 branches across Nairobi and Nakuru, seeking packaged agro-produce with RSB S-Mark.',
    stillToVerify: [
      'Shelf-ready barcode labelling compliance under KEBS retail rules',
      'Supplier listing fee terms and 45-day payment turnaround verification',
      'Product liability insurance coverage'
    ],
    handledProducts: [
      {
        hsCode: '0409',
        productName: 'Natural Honey',
        minVolumeKgMonth: 1500,
        maxVolumeKgMonth: 4000,
        targetBuyPriceKesPerKg: 390
      },
      {
        hsCode: '1106',
        productName: 'High Quality Cassava Flour',
        minVolumeKgMonth: 5000,
        maxVolumeKgMonth: 15000,
        targetBuyPriceKesPerKg: 72
      }
    ],
    acceptedCertifications: ['RSB S-Mark', 'HACCP', 'Organic'],
    contact: {
      person: 'Grace Wanjiku Mwangi',
      phone: '+254 711 902 334',
      email: 'procurement@apexsupermarkets.co.ke (sample)',
      address: 'Apex Towers, Westlands Commercial District, Nairobi'
    },
    kraPin: 'P051009481X',
    corridorExperience: {
      gatunaMalabaCrossingsCount: 16,
      averageClearanceDays: 2.2,
      lastShipmentDate: '29 Jul 2026'
    },
    evidenceRecords: [
      {
        source: 'Kenya Business Registration Service (BRS)',
        date: '15 Jan 2026',
        status: 'Verified',
        documentRef: 'BRS-PVT-2015-88390',
        summary: 'Active corporate status, tax compliant with Kenya Revenue Authority.'
      },
      {
        source: 'Rwanda Trade Portal Directory Interlink',
        date: '11 Aug 2026',
        status: 'Verified',
        documentRef: 'RTP-INT-KY-029',
        summary: 'Commercial entity identified through EAC Regional Integration Trade Network.'
      }
    ]
  },
  {
    id: 'kp-3',
    name: 'Rift Valley Milling & Commodities Hub (sample)',
    city: 'Nakuru',
    role: 'Wholesaler',
    evidenceLabel: 'Trade Square registered',
    source: 'Trade Square Direct Partner Onboarding & Verified PSF Liaison',
    updatedDate: '24 Aug 2026',
    oneLineReason: 'Direct registered processor sourcing raw dry beans and cassava flour for secondary formulation across western Kenya.',
    stillToVerify: [
      'Moisture content threshold specifications (max 13.5% for beans)',
      'Direct offloading capacity at Nakuru rail-road dry depot',
      'Seasonal price escalation index agreements'
    ],
    handledProducts: [
      {
        hsCode: '0713',
        productName: 'Dried Beans',
        minVolumeKgMonth: 12000,
        maxVolumeKgMonth: 45000,
        targetBuyPriceKesPerKg: 92
      },
      {
        hsCode: '1106',
        productName: 'High Quality Cassava Flour',
        minVolumeKgMonth: 8000,
        maxVolumeKgMonth: 25000,
        targetBuyPriceKesPerKg: 69
      }
    ],
    acceptedCertifications: ['RSB S-Mark'],
    contact: {
      person: 'Duncan Kipchumba Rono',
      phone: '+254 720 338 190',
      email: 'duncan.rono@riftvalleymill.co.ke (sample)',
      address: 'Nakuru Industrial Belt, George Morara Highway, Nakuru'
    },
    kraPin: 'P051493012L',
    corridorExperience: {
      gatunaMalabaCrossingsCount: 29,
      averageClearanceDays: 1.5,
      lastShipmentDate: '19 Aug 2026'
    },
    evidenceRecords: [
      {
        source: 'Trade Square MINICOM Partner Portal',
        date: '24 Aug 2026',
        status: 'Verified',
        documentRef: 'TSQ-KY-REG-0012',
        summary: 'Verified onboarding submission signed by Nakuru Chamber of Commerce representative.'
      },
      {
        source: 'KRA Malaba OSBP Electronic Cargo Tracking System (RECTS)',
        date: '14 Jul 2026',
        status: 'Verified',
        documentRef: 'ECTS-MLB-2026-4402',
        summary: 'Successful convoy clearance without seal violation.'
      }
    ]
  },
  {
    id: 'kp-4',
    name: 'Equator Fresh Horticultural Exporters (sample)',
    city: 'Nairobi',
    role: 'Buyer',
    evidenceLabel: 'Known trade activity',
    source: 'Kenya Plant Health Inspectorate Service (KEPHIS) & HCDA Manifest',
    updatedDate: '02 Sep 2026',
    oneLineReason: 'High-volume avocado packhouse supplying European and Middle Eastern air freight from JKIA Nairobi.',
    stillToVerify: [
      'GlobalG.A.P. chain of custody audit for cross-border consignment',
      'Cold-chain reefer truck handover protocol at Gatuna/Malaba',
      'MRL (Maximum Residue Limits) lab testing certificate before dispatch'
    ],
    handledProducts: [
      {
        hsCode: '0804',
        productName: 'Fresh Avocado (Hass & Fuerte)',
        minVolumeKgMonth: 8000,
        maxVolumeKgMonth: 30000,
        targetBuyPriceKesPerKg: 118
      }
    ],
    acceptedCertifications: ['GlobalG.A.P.', 'HACCP'],
    contact: {
      person: 'Brenda Chebet Cherono',
      phone: '+254 733 812 770',
      email: 'sourcing@equatorfresh.co.ke (sample)',
      address: 'JKIA Freight Terminal Sector B, Cargo Village, Nairobi'
    },
    kraPin: 'P051908221K',
    corridorExperience: {
      gatunaMalabaCrossingsCount: 34,
      averageClearanceDays: 1.2,
      lastShipmentDate: '28 Aug 2026'
    },
    evidenceRecords: [
      {
        source: 'KEPHIS Phytosanitary Database',
        date: '28 Aug 2026',
        status: 'Verified',
        documentRef: 'KEPHIS-EXP-2026-904',
        summary: 'Active export phyto certification, zero interception record for 2025/2026.'
      },
      {
        source: 'NAEB - HCDA Bilateral Corridor Working Group',
        date: '10 Aug 2026',
        status: 'Verified',
        documentRef: 'NAEB-HCDA-B2B-108',
        summary: 'Endorsed for regional consolidation of Rwandan Hass avocados.'
      }
    ]
  },
  {
    id: 'kp-5',
    name: 'Coast Bulk Importers & Logistics (sample)',
    city: 'Mombasa',
    role: 'Distributor',
    evidenceLabel: 'Business identity verified',
    source: 'Kenya Ports Authority Register & KRA Customs Agent License',
    updatedDate: '29 Jul 2026',
    oneLineReason: 'Coastal logistics firm managing dry food distribution across Mombasa, Kilifi, and Kwale wholesale depots.',
    stillToVerify: [
      'Extended road haulage rates from Nairobi down to Mombasa port corridor',
      'Port warehouse storage capacity for dry grain during monsoon periods',
      'Escrow payment arrangements for cross-corridor transit'
    ],
    handledProducts: [
      {
        hsCode: '0713',
        productName: 'Dried Beans',
        minVolumeKgMonth: 15000,
        maxVolumeKgMonth: 50000,
        targetBuyPriceKesPerKg: 91
      },
      {
        hsCode: '1102',
        productName: 'Maize Flour',
        minVolumeKgMonth: 20000,
        maxVolumeKgMonth: 60000,
        targetBuyPriceKesPerKg: 75
      }
    ],
    acceptedCertifications: ['RSB S-Mark'],
    contact: {
      person: 'Hassan Omar Mwidau',
      phone: '+254 721 550 491',
      email: 'h.mwidau@coastbulk.co.ke (sample)',
      address: 'Shimanzi High Level, Industrial Area, Mombasa'
    },
    kraPin: 'P051672901B',
    corridorExperience: {
      gatunaMalabaCrossingsCount: 18,
      averageClearanceDays: 2.8,
      lastShipmentDate: '15 Jul 2026'
    },
    evidenceRecords: [
      {
        source: 'Kenya Revenue Authority (KRA)',
        date: '20 Jul 2026',
        status: 'Verified',
        documentRef: 'KRA-PIN-TAXCOMP-2026-09',
        summary: 'Valid Tax Compliance Certificate through July 2027.'
      },
      {
        source: 'KPA Port Clearing Agents Registry',
        date: '10 Jan 2026',
        status: 'Recorded',
        documentRef: 'KPA-AGT-1092',
        summary: 'Registered customs transit agent for Northern Corridor transport.'
      }
    ]
  },
  {
    id: 'kp-6',
    name: 'Victoria Agro-Trade Lake Region (sample)',
    city: 'Kisumu',
    role: 'Wholesaler',
    evidenceLabel: 'Potential partner',
    source: 'Lake Region Economic Bloc (LREB) Agribusiness Directory',
    updatedDate: '05 Jul 2026',
    oneLineReason: 'Wholesale aggregator serving urban and peri-urban open-air markets along the Kisumu-Busia-Malaba corridor.',
    stillToVerify: [
      'Official business premises inspection report by local county revenue board',
      'Confirmation of bank guarantee facility or cash on delivery capacity',
      'Proof of past EAC Simplified Trade Regime (STR) declarations'
    ],
    handledProducts: [
      {
        hsCode: '0713',
        productName: 'Dried Beans',
        minVolumeKgMonth: 8000,
        maxVolumeKgMonth: 22000,
        targetBuyPriceKesPerKg: 90
      },
      {
        hsCode: '1106',
        productName: 'High Quality Cassava Flour',
        minVolumeKgMonth: 10000,
        maxVolumeKgMonth: 28000,
        targetBuyPriceKesPerKg: 68
      }
    ],
    acceptedCertifications: ['RSB S-Mark'],
    contact: {
      person: 'Caleb Ochieng Otieno',
      phone: '+254 734 220 918',
      email: 'otieno.c@victoriatrade.co.ke (sample)',
      address: 'Oginga Odinga St, Jubilee Market Enclave, Kisumu'
    },
    kraPin: 'P051390288E',
    corridorExperience: {
      gatunaMalabaCrossingsCount: 9,
      averageClearanceDays: 1.6,
      lastShipmentDate: '01 Jun 2026'
    },
    evidenceRecords: [
      {
        source: 'Lake Region Economic Bloc Agribusiness Register',
        date: '05 Jul 2026',
        status: 'Pending audit',
        documentRef: 'LREB-AGR-2026-771',
        summary: 'Commercial listing submitted; pending physical verification by Trade Square regional field team.'
      }
    ]
  },
  {
    id: 'kp-7',
    name: 'Kilimani Gourmet Organics (sample)',
    city: 'Nairobi',
    role: 'Retailer',
    evidenceLabel: 'Trade Square registered',
    source: 'Trade Square Platform Pilot & Certified Organic Foods Network Kenya',
    updatedDate: '26 Aug 2026',
    oneLineReason: 'Specialty organic food retailer and e-grocer catering to premium residential zones in Nairobi with certified origin tracking.',
    stillToVerify: [
      'Retail packaging conformity for glass jar retail honey (500g and 1kg)',
      'Organic certificate mutual validation with KOAN (Kenya Organic Agriculture Network)',
      'Standard restocking cycle timeline and returned goods policy'
    ],
    handledProducts: [
      {
        hsCode: '0409',
        productName: 'Natural Honey',
        minVolumeKgMonth: 1000,
        maxVolumeKgMonth: 3000,
        targetBuyPriceKesPerKg: 410
      },
      {
        hsCode: '0804',
        productName: 'Fresh Avocado (Hass & Fuerte)',
        minVolumeKgMonth: 2000,
        maxVolumeKgMonth: 6000,
        targetBuyPriceKesPerKg: 125
      }
    ],
    acceptedCertifications: ['RSB S-Mark', 'Organic', 'HACCP'],
    contact: {
      person: 'Susan Muthoni Gakuo',
      phone: '+254 722 884 102',
      email: 'susan@kilimanigourmet.co.ke (sample)',
      address: 'Argwings Kodhek Rd, Kilimani Shopping Centre, Nairobi'
    },
    kraPin: 'P051839201C',
    corridorExperience: {
      gatunaMalabaCrossingsCount: 14,
      averageClearanceDays: 1.4,
      lastShipmentDate: '20 Aug 2026'
    },
    evidenceRecords: [
      {
        source: 'Trade Square SME Platform Register',
        date: '26 Aug 2026',
        status: 'Verified',
        documentRef: 'TSQ-REG-NBO-0089',
        summary: 'Completed MINICOM-verified onboarding with verified bank reference.'
      },
      {
        source: 'Kenya Organic Agriculture Network (KOAN)',
        date: '12 May 2026',
        status: 'Verified',
        documentRef: 'KOAN-RET-2026-11',
        summary: 'Certified distributor of organic natural honey and fresh produce.'
      }
    ]
  },
  {
    id: 'kp-8',
    name: 'Ushirika Grain Millers Cooperative Union (sample)',
    city: 'Nairobi',
    role: 'Buyer',
    evidenceLabel: 'Known trade activity',
    source: 'Ministry of Agriculture Kenya & Cereal Millers Association',
    updatedDate: '15 Aug 2026',
    oneLineReason: 'Large miller union procuring commercial grains and tubers with direct rail siding access at Nairobi Inland Container Depot.',
    stillToVerify: [
      'Bulk discharge hopper compatibility with Rwandan 50kg polypropylene bags',
      'Aflatoxin testing protocol at ICD Nairobi laboratory prior to payment release',
      'Contractual penalty clauses for transit moisture variance'
    ],
    handledProducts: [
      {
        hsCode: '1102',
        productName: 'Maize Flour',
        minVolumeKgMonth: 20000,
        maxVolumeKgMonth: 70000,
        targetBuyPriceKesPerKg: 79
      },
      {
        hsCode: '1106',
        productName: 'High Quality Cassava Flour',
        minVolumeKgMonth: 15000,
        maxVolumeKgMonth: 40000,
        targetBuyPriceKesPerKg: 71
      },
      {
        hsCode: '0713',
        productName: 'Dried Beans',
        minVolumeKgMonth: 15000,
        maxVolumeKgMonth: 35000,
        targetBuyPriceKesPerKg: 94
      }
    ],
    acceptedCertifications: ['RSB S-Mark', 'HACCP'],
    contact: {
      person: 'David Maina Kiarie',
      phone: '+254 722 610 395',
      email: 'kiarie.m@ushirikamillers.co.ke (sample)',
      address: 'ICD Road, Off Mombasa Highway, Embakasi, Nairobi'
    },
    kraPin: 'P051029482Z',
    corridorExperience: {
      gatunaMalabaCrossingsCount: 55,
      averageClearanceDays: 1.7,
      lastShipmentDate: '10 Aug 2026'
    },
    evidenceRecords: [
      {
        source: 'Cereal Millers Association Directory',
        date: '15 Aug 2026',
        status: 'Verified',
        documentRef: 'CMA-MBR-2026-04',
        summary: 'Tier 1 member in good standing with annual milling capacity exceeding 50,000 MT.'
      },
      {
        source: 'KRA Customs Single Window Log',
        date: '28 Jun 2026',
        status: 'Verified',
        documentRef: 'KRA-SW-MLB-19284',
        summary: 'Single Administrative Document (SAD) processed for regional flour supplies under EAC tariff exemption.'
      }
    ]
  },
  {
    id: 'kp-9',
    name: 'Great Lakes Wholesale Superstore (sample)',
    city: 'Kisumu',
    role: 'Wholesaler',
    evidenceLabel: 'Business identity verified',
    source: 'Kenya National Chamber of Commerce & Industry (KNCCI Kisumu)',
    updatedDate: '08 Aug 2026',
    oneLineReason: 'Wholesale FMCG distributor supplying retail traders across Kisumu, Kakamega, and Kericho counties.',
    stillToVerify: [
      'Credit insurance policy coverage for newly added cross-border Rwandan suppliers',
      'Batch traceability protocols at Kisumu central distribution warehouse',
      'Corridor freight cost sharing agreement'
    ],
    handledProducts: [
      {
        hsCode: '1102',
        productName: 'Maize Flour',
        minVolumeKgMonth: 12000,
        maxVolumeKgMonth: 30000,
        targetBuyPriceKesPerKg: 76
      },
      {
        hsCode: '0713',
        productName: 'Dried Beans',
        minVolumeKgMonth: 10000,
        maxVolumeKgMonth: 25000,
        targetBuyPriceKesPerKg: 93
      }
    ],
    acceptedCertifications: ['RSB S-Mark'],
    contact: {
      person: 'Florence Akinyi Oloo',
      phone: '+254 733 410 882',
      email: 'trade@greatlakeswholesalers.co.ke (sample)',
      address: 'Kondele Bypass Logistics Yard, Kisumu'
    },
    kraPin: 'P051772910J',
    corridorExperience: {
      gatunaMalabaCrossingsCount: 19,
      averageClearanceDays: 1.9,
      lastShipmentDate: '25 Jul 2026'
    },
    evidenceRecords: [
      {
        source: 'KNCCI Kisumu County Chapter',
        date: '08 Aug 2026',
        status: 'Verified',
        documentRef: 'KNCCI-KSM-2026-118',
        summary: 'Certified registered merchant in regional commerce.'
      },
      {
        source: 'Rwanda-Kenya Joint Permanent Commission Trade Log',
        date: '14 May 2026',
        status: 'Recorded',
        documentRef: 'JPC-RW-KE-2026-03',
        summary: 'Participated in B2B matchmaking session facilitated by MINICOM and Ministry of East African Community (Kenya).'
      }
    ]
  },
  {
    id: 'kp-10',
    name: 'Savannah Food Distributors Kenya (sample)',
    city: 'Nakuru',
    role: 'Distributor',
    evidenceLabel: 'Potential partner',
    source: 'East African Grain Council (EAGC) Regional Directory',
    updatedDate: '19 Jun 2026',
    oneLineReason: 'Regional distributor with 8 heavy fleet trucks servicing secondary distribution hubs between Nakuru and Eldoret.',
    stillToVerify: [
      'Inspection of truck fleet cold/dry transit hygiene compliance',
      'Formal banking credentials and credit agency rating verification',
      'Clearance times recorded at Malaba customs post over past 6 months'
    ],
    handledProducts: [
      {
        hsCode: '0713',
        productName: 'Dried Beans',
        minVolumeKgMonth: 10000,
        maxVolumeKgMonth: 30000,
        targetBuyPriceKesPerKg: 91
      },
      {
        hsCode: '1102',
        productName: 'Maize Flour',
        minVolumeKgMonth: 15000,
        maxVolumeKgMonth: 35000,
        targetBuyPriceKesPerKg: 77
      }
    ],
    acceptedCertifications: ['RSB S-Mark'],
    contact: {
      person: 'Joseph Kiptanui Lagat',
      phone: '+254 721 902 441',
      email: 'j.lagat@savannahdistributors.co.ke (sample)',
      address: 'Nakuru-Eldoret Highway Km 12, Nakuru'
    },
    kraPin: 'P051559281W',
    corridorExperience: {
      gatunaMalabaCrossingsCount: 11,
      averageClearanceDays: 2.1,
      lastShipmentDate: '10 Jun 2026'
    },
    evidenceRecords: [
      {
        source: 'East African Grain Council (EAGC)',
        date: '19 Jun 2026',
        status: 'Recorded',
        documentRef: 'EAGC-DIR-2026-402',
        summary: 'Registered regional grain handler.'
      }
    ]
  },
  {
    id: 'kp-11',
    name: 'Kikuyu Horticultural Aggregators Ltd (sample)',
    city: 'Nairobi',
    role: 'Buyer',
    evidenceLabel: 'Known trade activity',
    source: 'National Horticultural Taskforce & KEBS Fresh Produce Audit',
    updatedDate: '30 Aug 2026',
    oneLineReason: 'Consolidator for commercial institutional kitchens, hotels, and airline catering services with strict grade standards.',
    stillToVerify: [
      'Fruit calibration and sizing requirement specification (count 12-18)',
      'Payment guarantee against certified inspection at Nairobi depot',
      'Phytosanitary clearance documentation handover protocols'
    ],
    handledProducts: [
      {
        hsCode: '0804',
        productName: 'Fresh Avocado (Hass & Fuerte)',
        minVolumeKgMonth: 6000,
        maxVolumeKgMonth: 20000,
        targetBuyPriceKesPerKg: 115
      },
      {
        hsCode: '0409',
        productName: 'Natural Honey',
        minVolumeKgMonth: 800,
        maxVolumeKgMonth: 2500,
        targetBuyPriceKesPerKg: 385
      }
    ],
    acceptedCertifications: ['GlobalG.A.P.', 'RSB S-Mark', 'HACCP'],
    contact: {
      person: 'Lydia Njeri Wachira',
      phone: '+254 722 710 449',
      email: 'procurement@kikuyuhort.co.ke (sample)',
      address: 'Waiyaki Way Agro-Hub Complex, Nairobi'
    },
    kraPin: 'P051184920T',
    corridorExperience: {
      gatunaMalabaCrossingsCount: 22,
      averageClearanceDays: 1.4,
      lastShipmentDate: '24 Aug 2026'
    },
    evidenceRecords: [
      {
        source: 'KEBS Standardization Mark Inspection',
        date: '30 Aug 2026',
        status: 'Verified',
        documentRef: 'KEBS-INSP-2026-788',
        summary: 'Compliant food grading and distribution facilities.'
      },
      {
        source: 'KRA Import System Log',
        date: '18 Jul 2026',
        status: 'Verified',
        documentRef: 'KRA-IMP-2026-8812',
        summary: 'Customs cleared 14 tonnes of fresh fruit originating from Rwanda.'
      }
    ]
  },
  {
    id: 'kp-12',
    name: 'Crown Retail Supermarkets Mombasa (sample)',
    city: 'Mombasa',
    role: 'Retailer',
    evidenceLabel: 'Business identity verified',
    source: 'Registrar of Companies Kenya & Mombasa County Trade Board',
    updatedDate: '12 Jul 2026',
    oneLineReason: 'Coast-based supermarket chain with 6 outlets catering to local residents and tourist hospitality sector.',
    stillToVerify: [
      'Shelf life guarantee (minimum 18 months for packaged honey and flours)',
      'Direct warehouse receipting process at Nyali distribution center',
      'Reconciliation cycle for initial trial consignments'
    ],
    handledProducts: [
      {
        hsCode: '0409',
        productName: 'Natural Honey',
        minVolumeKgMonth: 800,
        maxVolumeKgMonth: 2000,
        targetBuyPriceKesPerKg: 395
      },
      {
        hsCode: '1106',
        productName: 'High Quality Cassava Flour',
        minVolumeKgMonth: 4000,
        maxVolumeKgMonth: 12000,
        targetBuyPriceKesPerKg: 74
      }
    ],
    acceptedCertifications: ['RSB S-Mark', 'HACCP'],
    contact: {
      person: 'Salim Athman Bakari',
      phone: '+254 710 882 109',
      email: 's.bakari@crownsupermarkets.co.ke (sample)',
      address: 'Links Rd, Nyali Commercial Center, Mombasa'
    },
    kraPin: 'P051662900P',
    corridorExperience: {
      gatunaMalabaCrossingsCount: 13,
      averageClearanceDays: 2.5,
      lastShipmentDate: '02 Jul 2026'
    },
    evidenceRecords: [
      {
        source: 'Mombasa County Trade Licensing Directorate',
        date: '12 Jul 2026',
        status: 'Verified',
        documentRef: 'MSA-LIC-2026-993',
        summary: 'Valid commercial operation license.'
      },
      {
        source: 'Business Registration Service Kenya',
        date: '14 Feb 2026',
        status: 'Verified',
        documentRef: 'BRS-REG-2018-40192',
        summary: 'Good standing certificate issued.'
      }
    ]
  }
];

export const INITIAL_PIPELINE_ITEMS: PipelineItem[] = [
  {
    id: 'pipe-1',
    partnerId: 'kp-1',
    smeId: 'sme-1',
    stage: 'Quotation or sample',
    addedDate: '14 Aug 2026',
    lastActivityDate: '26 Aug 2026',
    notes: [
      '14 Aug 2026: Matched via Trade Square with 94/100 relevance score.',
      '19 Aug 2026: MINICOM facilitated introduction letter issued.',
      '26 Aug 2026: Sent 5kg test sample of dry red beans via DHL Express Kigali to Nairobi.'
    ],
    sampleSentDate: '26 Aug 2026',
    negotiatedPriceKesPerKg: 94.5,
    estimatedVolumeKg: 15000
  },
  {
    id: 'pipe-2',
    partnerId: 'kp-8',
    smeId: 'sme-1',
    stage: 'Requirements exchanged',
    addedDate: '18 Aug 2026',
    lastActivityDate: '28 Aug 2026',
    notes: [
      '18 Aug 2026: SME saved partner to shortlist.',
      '28 Aug 2026: Received Ushirika technical grain specification sheet (max 13% moisture).'
    ],
    estimatedVolumeKg: 20000
  },
  {
    id: 'pipe-3',
    partnerId: 'kp-4',
    smeId: 'sme-2',
    stage: 'Negotiation',
    addedDate: '08 Aug 2026',
    lastActivityDate: '01 Sep 2026',
    notes: [
      '08 Aug 2026: Initial introduction facilitated by MINICOM & NAEB.',
      '22 Aug 2026: Cold chain reefer logistics audit passed at Gatuna border.',
      '01 Sep 2026: Drafting tri-party agreement with Freight forwarder.'
    ],
    negotiatedPriceKesPerKg: 118,
    estimatedVolumeKg: 10000
  },
  {
    id: 'pipe-4',
    partnerId: 'kp-3',
    smeId: 'sme-3',
    stage: 'Contacted',
    addedDate: '22 Aug 2026',
    lastActivityDate: '24 Aug 2026',
    notes: [
      '22 Aug 2026: SME initiated direct contact inquiry regarding wholesale maize flour.'
    ]
  },
  {
    id: 'pipe-5',
    partnerId: 'kp-2',
    smeId: 'sme-4',
    stage: 'Deal',
    addedDate: '10 Jul 2026',
    lastActivityDate: '15 Aug 2026',
    notes: [
      '10 Jul 2026: Initial match on organic natural honey.',
      '25 Jul 2026: Packaging approved with RSB S-Mark label.',
      '15 Aug 2026: Trial contract signed for 1,500 kg monthly delivery to Westlands Nairobi.'
    ],
    negotiatedPriceKesPerKg: 395,
    estimatedVolumeKg: 1500
  }
];

export const INITIAL_INTRO_REQUESTS: IntroductionRequest[] = [
  {
    id: 'req-101',
    smeId: 'sme-1',
    smeName: 'Virunga Valley Agro-Processors Ltd (sample)',
    partnerId: 'kp-1',
    partnerName: 'Nairobi Grain Distributors Ltd (sample)',
    productHs: '0713',
    productName: 'Dried Beans (HS 0713)',
    requestedDate: '28 Aug 2026',
    status: 'Facilitation approved',
    officerNotes: 'Verified RSB S-Mark and RDB business registration. Corridor clearance through Gatuna supported.',
    facilitationLetterRef: 'MINICOM-DGT-2026-F089'
  },
  {
    id: 'req-102',
    smeId: 'sme-2',
    smeName: 'Lake Kivu Fresh Agro-Exporters (sample)',
    partnerId: 'kp-4',
    partnerName: 'Equator Fresh Horticultural Exporters (sample)',
    productHs: '0804',
    productName: 'Fresh Avocado (HS 0804)',
    requestedDate: '30 Aug 2026',
    status: 'Pending review',
    officerNotes: 'Awaiting NAEB phytosanitary certificate copy before dispatching facilitation letter to Kenya commercial attaché.'
  },
  {
    id: 'req-103',
    smeId: 'sme-3',
    smeName: 'Eastern Sun Flour Mills Ltd (sample)',
    partnerId: 'kp-8',
    partnerName: 'Ushirika Grain Millers Cooperative Union (sample)',
    productHs: '1102',
    productName: 'Maize Flour (HS 1102)',
    requestedDate: '01 Sep 2026',
    status: 'Pending review',
    officerNotes: 'High volume request (25 MT/month). Verifying current EAC Simplified Trade certificate status.'
  },
  {
    id: 'req-104',
    smeId: 'sme-6',
    smeName: 'Akagera Organic Roots Ltd (sample)',
    partnerId: 'kp-2',
    partnerName: 'Apex Supermarkets Kenya Ltd (sample)',
    productHs: '1106',
    productName: 'High Quality Cassava Flour (HS 1106)',
    requestedDate: '22 Aug 2026',
    status: 'More information requested',
    officerNotes: 'Requested updated HACCP lab report from RSB prior to institutional introduction.'
  }
];
