/**
 * Firebase Authentication & Firestore Integration Service
 * - Connects to provisioned Firestore database (`firebaseConfig.firestoreDatabaseId`)
 * - Validates Firestore connectivity on boot via `getDocFromServer`
 * - Enforces structured `handleFirestoreError` error reporting
 * - Enforces defensive payload sanitization synchronized with `firebase-blueprint.json` and `firestore.rules`
 * - Provides real Google Sign-In (`signInWithPopup`) + real-time Firestore profile sync (`onSnapshot`)
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Certification, District, RwandanSME } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ============================================================================
// 1. VALIDATE CONNECTION TO FIRESTORE ON BOOT
// ============================================================================
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// ============================================================================
// 2. STRUCTURED FIRESTORE ERROR HANDLER (MANDATORY)
// ============================================================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ============================================================================
// 3. DATA MODEL & DEFENSIVE PAYLOAD SANITIZATION (SYNCED WITH BLUEPRINT)
// ============================================================================
export interface FirestoreUserProfile {
  uid: string;
  accountType: 'business' | 'partner';
  tin: string;
  rdbNumber: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  district: string;
  province: string;
  commercialHub: string;
  offeringType: 'Goods' | 'Services' | 'Goods & Services';
  sectorCategory: string;
  specificOfferings: string;
  selectedHsCode: string;
  products: string[];
  certifications: string[];
  monthlyCapacityKg: number;
  exWorksPriceRwf: number;
  savedPartnerIds: string[];
  createdAt?: Timestamp | unknown;
  updatedAt?: Timestamp | unknown;
}

export type UserProfileInput = Partial<
  Omit<FirestoreUserProfile, 'uid' | 'createdAt' | 'updatedAt'>
>;

function clampString(val: string | undefined | null, fallback: string, min: number, max: number): string {
  const raw = (val ?? '').trim();
  const base = raw.length >= min ? raw : fallback;
  return base.slice(0, max);
}

function sanitizeTin(val: string | undefined | null, fallback = '102938475'): string {
  const cleaned = (val ?? '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 30);
  return cleaned.length >= 3 ? cleaned : fallback;
}

function sanitizeStringArray(
  arr: string[] | undefined | null,
  fallback: string[],
  maxItems: number,
  maxItemLen: number
): string[] {
  const valid = (arr || [])
    .filter((item) => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim().slice(0, maxItemLen))
    .slice(0, maxItems);
  return valid.length >= 1 ? valid : fallback;
}

export function buildSanitizedUserProfile(
  user: User,
  overrides?: UserProfileInput,
  existing?: FirestoreUserProfile | null
): Omit<FirestoreUserProfile, 'createdAt' | 'updatedAt'> {
  const accountType: 'business' | 'partner' =
    overrides?.accountType === 'partner' ||
    (overrides?.accountType === undefined && existing?.accountType === 'partner')
      ? 'partner'
      : 'business';

  const offeringType: 'Goods' | 'Services' | 'Goods & Services' =
    overrides?.offeringType === 'Services' || overrides?.offeringType === 'Goods & Services'
      ? overrides.offeringType
      : existing?.offeringType === 'Services' || existing?.offeringType === 'Goods & Services'
        ? existing.offeringType
        : 'Goods';

  const tin = sanitizeTin(overrides?.tin ?? existing?.tin, '102938475');
  const rdbNumber = clampString(
    overrides?.rdbNumber ?? existing?.rdbNumber,
    `RDB-${tin.slice(0, 6) || '109238'}`,
    2,
    40
  );

  const defaultCompanyName =
    user.displayName
      ? `${user.displayName} Trade Enterprise Ltd`
      : 'Virunga Valley Agro-Processors Ltd';

  const businessName = clampString(
    overrides?.businessName ?? existing?.businessName,
    defaultCompanyName,
    2,
    160
  );

  const contactPerson = clampString(
    overrides?.contactPerson ?? existing?.contactPerson ?? user.displayName,
    'Authorized Trade Representative',
    2,
    120
  );

  const email = clampString(
    overrides?.email ?? existing?.email ?? user.email,
    'exports@virungavalley.rw',
    5,
    160
  );

  const phone = clampString(
    overrides?.phone ?? existing?.phone,
    '+250 788 304 192',
    5,
    40
  );

  const district = clampString(
    overrides?.district ?? existing?.district,
    'Musanze',
    2,
    60
  );

  const province = clampString(
    overrides?.province ?? existing?.province,
    'Northern Province',
    2,
    80
  );

  const commercialHub = clampString(
    overrides?.commercialHub ?? existing?.commercialHub,
    'Kigali Special Economic Zone (Masoro)',
    2,
    160
  );

  const sectorCategory = clampString(
    overrides?.sectorCategory ?? existing?.sectorCategory,
    'Agriculture & Agro-Processing (Grains, Pulses, Avocados, Honey, Coffee, Tea)',
    2,
    160
  );

  const specificOfferings = clampString(
    overrides?.specificOfferings ?? existing?.specificOfferings,
    'Export-grade Rwandan commodities and cross-border trade services.',
    2,
    500
  );

  const selectedHsCode = clampString(
    overrides?.selectedHsCode ?? existing?.selectedHsCode,
    '0713',
    2,
    20
  );

  const products = sanitizeStringArray(
    overrides?.products ?? existing?.products,
    [selectedHsCode, '0804'],
    10,
    20
  );

  const certifications = sanitizeStringArray(
    overrides?.certifications ?? existing?.certifications,
    ['RSB S-Mark', 'HACCP'],
    10,
    40
  );

  const savedPartnerIds = sanitizeStringArray(
    overrides?.savedPartnerIds ?? existing?.savedPartnerIds,
    ['kp-1', 'kp-8'],
    10,
    40
  );

  const rawCap = Math.round(
    Number(overrides?.monthlyCapacityKg ?? existing?.monthlyCapacityKg ?? 25000)
  );
  const monthlyCapacityKg =
    Number.isFinite(rawCap) && rawCap >= 0 && rawCap <= 100000000 ? rawCap : 25000;

  const rawPrice = Math.round(
    Number(overrides?.exWorksPriceRwf ?? existing?.exWorksPriceRwf ?? 920)
  );
  const exWorksPriceRwf =
    Number.isFinite(rawPrice) && rawPrice >= 0 && rawPrice <= 100000000 ? rawPrice : 920;

  return {
    uid: user.uid,
    accountType,
    tin,
    rdbNumber,
    businessName,
    contactPerson,
    email,
    phone,
    district,
    province,
    commercialHub,
    offeringType,
    sectorCategory,
    specificOfferings,
    selectedHsCode,
    products,
    certifications,
    monthlyCapacityKg,
    exWorksPriceRwf,
    savedPartnerIds
  };
}

// ============================================================================
// 4. FIRESTORE CRUD & REAL-TIME LISTENERS
// ============================================================================

export async function getUserProfileFromFirestore(
  uid: string
): Promise<FirestoreUserProfile | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return snap.data() as FirestoreUserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveUserProfileToFirestore(
  user: User,
  overrides?: UserProfileInput,
  existingProfile?: FirestoreUserProfile | null
): Promise<FirestoreUserProfile> {
  const path = `users/${user.uid}`;
  const current =
    existingProfile !== undefined
      ? existingProfile
      : await getUserProfileFromFirestore(user.uid);

  const sanitized = buildSanitizedUserProfile(user, overrides, current);

  if (!current) {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...sanitized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  } else {
    try {
      const { uid: _uid, ...updatableFields } = sanitized;
      await updateDoc(doc(db, 'users', user.uid), {
        ...updatableFields,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  const latest = await getUserProfileFromFirestore(user.uid);
  return latest || (sanitized as FirestoreUserProfile);
}

export async function updateSavedPartnersInFirestore(
  uid: string,
  savedPartnerIds: string[]
): Promise<void> {
  const path = `users/${uid}`;
  const safeIds = sanitizeStringArray(savedPartnerIds, ['kp-1'], 10, 40);
  try {
    await updateDoc(doc(db, 'users', uid), {
      savedPartnerIds: safeIds,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeToUserProfile(
  uid: string,
  onProfile: (profile: FirestoreUserProfile | null) => void
): () => void {
  const path = `users/${uid}`;
  return onSnapshot(
    doc(db, 'users', uid),
    (snapshot) => {
      if (snapshot.exists()) {
        onProfile(snapshot.data() as FirestoreUserProfile);
      } else {
        onProfile(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// ============================================================================
// 5. GOOGLE AUTHENTICATION + FIRESTORE PROFILE PROVISIONING
// ============================================================================

export async function signInWithGoogleAndSyncProfile(
  overrides?: UserProfileInput
): Promise<{ user: User; profile: FirestoreUserProfile }> {
  const credential = await signInWithPopup(auth, googleProvider);
  const user = credential.user;

  const existing = await getUserProfileFromFirestore(user.uid);
  if (!existing || overrides) {
    const profile = await saveUserProfileToFirestore(user, overrides, existing);
    return { user, profile };
  }

  return { user, profile: existing };
}

export async function signOutFirebaseUser(): Promise<void> {
  await signOut(auth);
}

export { onAuthStateChanged };
export type { User };

// ============================================================================
// 6. MAP FIRESTORE USER PROFILE TO RWANDAN SME PORTAL MODEL
// ============================================================================
const VALID_DISTRICTS: District[] = [
  'Musanze',
  'Rubavu',
  'Rwamagana',
  'Huye',
  'Nyagatare',
  'Kayonza',
  'Gicumbi',
  'Rusizi'
];

const VALID_CERTIFICATIONS: Certification[] = [
  'RSB S-Mark',
  'HACCP',
  'GlobalG.A.P.',
  'Organic'
];

export function firestoreProfileToRwandanSME(
  profile: FirestoreUserProfile,
  photoURL?: string | null
): RwandanSME {
  const matchedDistrict: District = VALID_DISTRICTS.includes(profile.district as District)
    ? (profile.district as District)
    : 'Musanze';

  const matchedCerts: Certification[] = (profile.certifications || []).filter((c): c is Certification =>
    VALID_CERTIFICATIONS.includes(c as Certification)
  );

  return {
    id: `firebase-${profile.uid}`,
    businessName: profile.businessName,
    rdbNumber: profile.rdbNumber,
    tin: profile.tin,
    district: matchedDistrict,
    contactPerson: profile.contactPerson,
    phone: profile.phone,
    email: profile.email,
    products: profile.products?.length ? profile.products : ['0713'],
    certifications: matchedCerts.length ? matchedCerts : ['RSB S-Mark'],
    monthlyCapacityKg: profile.monthlyCapacityKg || 25000,
    exWorksPriceRwf: profile.exWorksPriceRwf || 920,
    selectedHsCode: profile.selectedHsCode || '0713',
    avatarUrl: photoURL || undefined
  };
}
