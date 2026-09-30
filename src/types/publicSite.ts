/**
 * Types for the Trade Square Public Website (MINICOM Pilot)
 */

export type PageId =
  | 'home'
  | 'how-it-works'
  | 'for-smes'
  | 'for-regional-partners'
  | 'trust-and-data'
  | 'pilot'
  | 'faq'
  | 'contact';

export type PublicLanguage = 'en' | 'rw' | 'sw' | 'fr';

export interface PageMeta {
  id: PageId;
  title: string;
  description: string;
  navLabelEn: string;
  navLabelRw: string;
  navLabelSw?: string;
  navLabelFr?: string;
}

export interface AccessRequestForm {
  businessName: string;
  rdbNumber: string;
  tin: string;
  district: string;
  productHs: string;
  phone: string;
  email: string;
  consent: boolean;
}

export interface ClaimProfileForm {
  companyName: string;
  kraPin: string;
  city: string;
  contactPerson: string;
  businessEmail: string;
  phone: string;
  procurementInterests: string[];
  consent: boolean;
}
