/**
 * Type definitions for Trade Square (MINICOM Rwanda-Kenya SME Trade Facilitation Pilot)
 */

export type District =
  | 'Musanze'
  | 'Rubavu'
  | 'Rwamagana'
  | 'Huye'
  | 'Nyagatare'
  | 'Kayonza'
  | 'Gicumbi'
  | 'Rusizi';

export type KenyanCity = 'Nairobi' | 'Mombasa' | 'Nakuru' | 'Kisumu';

export type Certification =
  | 'RSB S-Mark'
  | 'HACCP'
  | 'GlobalG.A.P.'
  | 'Organic';

export type EvidenceLabel =
  | 'Known trade activity'
  | 'Business identity verified'
  | 'Trade Square registered'
  | 'Potential partner';

export type PartnerRole = 'Buyer' | 'Distributor' | 'Wholesaler' | 'Retailer';

export interface HSProduct {
  hsCode: string;
  name: string;
  category: string;
  unit: string;
  defaultPriceRwfPerKg: number;
  typicalMonthlyKg: number;
}

export interface RwandanSME {
  id: string;
  businessName: string;
  rdbNumber: string;
  tin: string;
  district: District;
  contactPerson: string;
  phone: string;
  email: string;
  products: string[]; // hsCodes
  certifications: Certification[];
  monthlyCapacityKg: number;
  exWorksPriceRwf: number;
  selectedHsCode: string;
}

export interface HandledProduct {
  hsCode: string;
  productName: string;
  minVolumeKgMonth: number;
  maxVolumeKgMonth: number;
  targetBuyPriceKesPerKg: number;
}

export interface EvidenceRecord {
  source: string;
  date: string;
  status: 'Verified' | 'Recorded' | 'Pending audit';
  documentRef: string;
  summary: string;
}

export interface KenyanPartner {
  id: string;
  name: string; // must end with "(sample)"
  city: KenyanCity;
  role: PartnerRole;
  evidenceLabel: EvidenceLabel;
  source: string;
  updatedDate: string;
  oneLineReason: string;
  stillToVerify: string[];
  handledProducts: HandledProduct[];
  acceptedCertifications: Certification[];
  contact: {
    person: string;
    phone: string;
    email: string;
    address: string;
  };
  kraPin: string;
  corridorExperience: {
    gatunaMalabaCrossingsCount: number;
    averageClearanceDays: number;
    lastShipmentDate: string;
  };
  evidenceRecords: EvidenceRecord[];
}

export interface ExportOpportunity {
  productHs: string;
  capacityKgMonth: number;
  exWorksPriceRwf: number;
  targetCountry: 'Kenya';
  partnerType: PartnerRole | 'All';
  requiredCertifications: Certification[];
}

export interface ScoringWeights {
  productFit: number;
  tradeEvidence: number;
  certificationFit: number;
  capacityFit: number;
  landedPriceFit: number;
  dataFreshness: number;
}

export interface MatchSignalBreakdown {
  productFitScore: number;
  tradeEvidenceScore: number;
  certificationFitScore: number;
  capacityFitScore: number;
  landedPriceFitScore: number;
  dataFreshnessScore: number;
  totalScore: number;
  whyThisMatchText: string;
  landedCostKesPerKg: number;
  freightCostRwfPerKg: number;
  tariffRegime: string;
}

export type PipelineStage =
  | 'New'
  | 'Contacted'
  | 'Interested'
  | 'Requirements exchanged'
  | 'Quotation or sample'
  | 'Negotiation'
  | 'Deal'
  | 'No response'
  | 'Not interested';

export interface PipelineItem {
  id: string;
  partnerId: string;
  smeId: string;
  stage: PipelineStage;
  addedDate: string;
  lastActivityDate: string;
  notes: string[];
  sampleSentDate?: string;
  negotiatedPriceKesPerKg?: number;
  estimatedVolumeKg?: number;
}

export interface IntroductionRequest {
  id: string;
  smeId: string;
  smeName: string;
  partnerId: string;
  partnerName: string;
  productHs: string;
  productName: string;
  requestedDate: string;
  status: 'Pending review' | 'Facilitation approved' | 'More information requested' | 'Declined';
  officerNotes?: string;
  facilitationLetterRef?: string;
}

export interface CorridorAssumptions {
  exchangeRateKesToRwf: number; // e.g. 9.85 (1 KES = 9.85 RWF)
  corridorTransitCostRwfPerKg: number; // e.g. 85 RWF per kg via Gatuna & Malaba
  eacCetTariffPct: number; // 0% under EAC Customs Union / AfCFTA rules of origin
}

export type ActiveScreen =
  | 'dashboard-home'
  | 'profile'
  | 'export-form'
  | 'shortlist'
  | 'match-detail'
  | 'pipeline'
  | 'officer-view';

export type Language = 'en' | 'rw';
