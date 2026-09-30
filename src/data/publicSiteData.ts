/**
 * Public website data, navigation configurations, and verified evidence statements.
 * Strict compliance with MINICOM pilot specifications:
 * - Exactly one evidence fact allowed: "About 30% of new Rwandan exporters are still exporting a year later."
 *   Source line: International Growth Centre, 2022, citing World Bank 2017.
 * - No other statistics permitted anywhere on the site.
 * - Sample companies end with "(sample)" and carry "Sample data" tags.
 */

import { PageMeta, PageId } from '../types/publicSite';

export const PAGES_META: Record<PageId, PageMeta> = {
  home: {
    id: 'home',
    title: 'Trade Square — SME Regional Trade Facilitation | MINICOM Rwanda',
    description: 'A Ministry of Trade and Industry pilot helping Rwandan SMEs discover verified regional trading partners along the Kigali to Nairobi Northern Corridor.',
    navLabelEn: 'Home',
    navLabelRw: 'Ahabanza'
  },
  'how-it-works': {
    id: 'how-it-works',
    title: 'How It Works — Decision Signals & Matching | Trade Square',
    description: 'Learn how Trade Square evaluates six empirical signals to generate an explainable shortlist of verified regional trading partners for Rwandan exporters.',
    navLabelEn: 'How it works',
    navLabelRw: 'Uko ikora'
  },
  'for-smes': {
    id: 'for-smes',
    title: 'For Rwandan SMEs — Eligibility & Pipeline | Trade Square',
    description: 'Guidance for Rwandan enterprises registered with RDB and RRA seeking regional buyers along the Northern Corridor.',
    navLabelEn: 'For SMEs',
    navLabelRw: "Ku bucuruzi buto n'ubuciriritse"
  },
  'for-regional-partners': {
    id: 'for-regional-partners',
    title: 'For Regional Partners — Sourcing & Claim Profile | Trade Square',
    description: 'How Kenyan buyers and distributors can claim their commercial profile, specify buying requirements, and connect with compliant Rwandan SMEs.',
    navLabelEn: 'For regional partners',
    navLabelRw: 'Ku bafatanyabikorwa bo mu karere'
  },
  'trust-and-data': {
    id: 'trust-and-data',
    title: 'Trust, Evidence Labels & Data Protection | Trade Square',
    description: 'Transparent explanation of our four distinct evidence labels, public data sources, and strict compliance with Rwandan data protection law.',
    navLabelEn: 'Trust and data',
    navLabelRw: "Icyizere n'amakuru"
  },
  pilot: {
    id: 'pilot',
    title: 'Pilot Scope, Corridor & Roadmap | Trade Square MINICOM',
    description: 'Scope of the Rwanda to Kenya Northern Corridor pilot covering Beans, Maize Flour, Avocado, and Honey, with future expansion roadmaps.',
    navLabelEn: 'Pilot',
    navLabelRw: "Umushinga w'igerageza"
  },
  faq: {
    id: 'faq',
    title: 'Frequently Asked Questions (FAQ) | Trade Square MINICOM',
    description: 'Answers to common questions regarding pilot participation, data privacy, official introduction letters, and verification standards.',
    navLabelEn: 'FAQ',
    navLabelRw: 'Ibibazo bikunze kubazwa'
  },
  contact: {
    id: 'contact',
    title: 'Contact & Request Pilot Access | Trade Square MINICOM',
    description: 'Submit your statutory RDB and TIN credentials to request pilot onboarding from the MINICOM Trade Desk.',
    navLabelEn: 'Contact',
    navLabelRw: 'Twandikire'
  }
};

export const RWANDAN_DISTRICTS = [
  'Musanze',
  'Rubavu',
  'Rwamagana',
  'Huye',
  'Nyagatare',
  'Kayonza',
  'Gicumbi',
  'Rusizi'
] as const;

export const PILOT_PRODUCTS = [
  { hsCode: '0713', name: 'Beans (HS 0713)', category: 'Legumes' },
  { hsCode: '1102', name: 'Maize flour (HS 1102)', category: 'Milled Grain' },
  { hsCode: '0804', name: 'Avocado (HS 0804)', category: 'Fresh Produce' },
  { hsCode: '0409', name: 'Honey (HS 0409)', category: 'Apiculture' }
] as const;

export const EVIDENCE_LABELS_DETAILS = [
  {
    name: 'Known trade activity',
    statusCategory: 'Verified Record',
    description: 'Assigned when empirical cross-border shipping documents or customs declarations are logged in official databases (such as Malaba or Gatuna One-Stop Border Post logs). Confirms that the entity actively conducts regional commercial trade.'
  },
  {
    name: 'Business identity verified',
    statusCategory: 'Verified Statutory Status',
    description: 'Assigned when statutory enterprise incorporation is verified through primary government registrar data (such as the Business Registration Service or revenue authority tax registers). Confirms legal existence and tax registration.'
  },
  {
    name: 'Trade Square registered',
    statusCategory: 'Authenticated Pilot Participant',
    description: 'Assigned when an enterprise representative has directly authenticated their commercial profile with Trade Square, verified corporate banking credentials, and confirmed active buying or selling intentions.'
  },
  {
    name: 'Potential partner',
    statusCategory: 'Directory Listing Pending Audit',
    description: 'Assigned to enterprises identified through verified trade association directories or bilateral regional trade publications that have not yet completed direct field verification or cross-border shipment logging under the pilot.'
  }
] as const;

export const FAQ_ITEMS = [
  {
    question: 'What is the cost to use Trade Square during the pilot?',
    answer: 'To be confirmed. During the active pilot phase, participation is fully subsidized by the Government of Rwanda and free of charge for approved Rwandan SMEs and regional commercial partners.'
  },
  {
    question: 'Who sees my data?',
    answer: 'Only authorized MINICOM trade officers and verified prospective trading partners when an introduction or quotation is formally requested. Only business contact coordinates and commodity specifications are visible; private banking and internal financials are never published.'
  },
  {
    question: 'Is a trading partner guaranteed by MINICOM?',
    answer: 'No. The relevance score supports decisions. It is not a guarantee. MINICOM does not guarantee any private company, nor does Trade Square replace independent due diligence, commercial negotiation, pre-shipment quality inspection, logistics coordination, or customs clearance.'
  },
  {
    question: 'What happens after I request an introduction?',
    answer: 'A MINICOM trade officer reviews your RSB standardization marks and statutory RDB registration. If compliant, an official facilitation letter is dispatched to the bilateral commercial attaché or directly to the verified regional partner representative.'
  },
  {
    question: 'What languages is Trade Square available in?',
    answer: 'Trade Square is available in English and Kinyarwanda. Navigation labels in Kinyarwanda are currently marked to be reviewed by a native speaker.'
  },
  {
    question: 'Are there offline options for SMEs without reliable internet?',
    answer: 'Yes. Rwandan SMEs can access Trade Square facilitation through District Business Development Fund (BDF) centers, Private Sector Federation (PSF) provincial secretariats, and MINICOM border trade facilitation desks.'
  },
  {
    question: 'How is AI used on the platform, and does it ever invent companies?',
    answer: 'Artificial intelligence assists in standardizing messy agricultural commodity specifications and drafting plain-language match explanations for busy SME managers. It operates strictly over verified government databases and never invents or hallucinates trading partners or trade history.'
  },
  {
    question: 'How do I report a problem or incorrect company information?',
    answer: 'You can report data inaccuracies or trade issues through the Contact and Request Access form on this portal or by notifying the MINICOM Trade Desk at the contact address (to be confirmed).'
  }
] as const;
