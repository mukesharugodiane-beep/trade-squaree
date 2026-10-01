/**
 * Phase 0: Security TDD Test Specification for firestore.rules
 * Verifies that all "Dirty Dozen" adversarial payloads return PERMISSION_DENIED.
 */

export interface SecurityTestPayload {
  id: string;
  description: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: { uid: string; email_verified: boolean } | null;
  data?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

const VALID_BASE_PROFILE = {
  uid: 'user_123',
  accountType: 'business',
  tin: '102938475',
  rdbNumber: 'RDB-109238472',
  businessName: 'Virunga Valley Agro-Processors Ltd',
  contactPerson: 'Jean-Paul Habimana',
  email: 'exports@virungavalley.rw',
  phone: '+250 788 304 192',
  district: 'Musanze',
  province: 'Northern Province',
  commercialHub: 'Musanze Agro-Processing & Logistics Hub',
  offeringType: 'Goods',
  sectorCategory: 'Agriculture & Agro-Processing',
  specificOfferings: 'Export-grade dry beans and Hass avocado.',
  selectedHsCode: '0713',
  products: ['0713', '0804'],
  certifications: ['RSB S-Mark', 'HACCP'],
  monthlyCapacityKg: 25000,
  exWorksPriceRwf: 920,
  savedPartnerIds: ['kp-1', 'kp-8'],
  createdAt: '__SERVER_TIMESTAMP__',
  updatedAt: '__SERVER_TIMESTAMP__'
};

export const DIRTY_DOZEN_TESTS: SecurityTestPayload[] = [
  {
    id: 'DD-01',
    description: 'Unauthenticated user attempting to read profile',
    operation: 'get',
    path: '/users/user_123',
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-02',
    description: 'Unverified email user attempting to create profile',
    operation: 'create',
    path: '/users/user_123',
    auth: { uid: 'user_123', email_verified: false },
    data: VALID_BASE_PROFILE,
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-03',
    description: 'Authenticated user attempting to read another user PII profile',
    operation: 'get',
    path: '/users/user_123',
    auth: { uid: 'attacker_999', email_verified: true },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-04',
    description: 'Authenticated user attempting to list all users',
    operation: 'list',
    path: '/users',
    auth: { uid: 'user_123', email_verified: true },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-05',
    description: 'Identity spoofing: setting uid field to another user',
    operation: 'create',
    path: '/users/user_123',
    auth: { uid: 'user_123', email_verified: true },
    data: { ...VALID_BASE_PROFILE, uid: 'victim_456' },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-06',
    description: 'Shadow update: injecting undeclared ghost field isAdmin',
    operation: 'update',
    path: '/users/user_123',
    auth: { uid: 'user_123', email_verified: true },
    data: { ...VALID_BASE_PROFILE, isAdmin: true },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-07',
    description: 'Immutable field mutation: changing createdAt during update',
    operation: 'update',
    path: '/users/user_123',
    auth: { uid: 'user_123', email_verified: true },
    data: { ...VALID_BASE_PROFILE, createdAt: '2020-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-08',
    description: 'Client timestamp forgery on create',
    operation: 'create',
    path: '/users/user_123',
    auth: { uid: 'user_123', email_verified: true },
    data: { ...VALID_BASE_PROFILE, createdAt: '2099-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-09',
    description: 'String resource exhaustion exceeding maxLength 500 on specificOfferings',
    operation: 'update',
    path: '/users/user_123',
    auth: { uid: 'user_123', email_verified: true },
    data: { ...VALID_BASE_PROFILE, specificOfferings: 'A'.repeat(1024) },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-10',
    description: 'Array poisoning with >10 elements in products',
    operation: 'update',
    path: '/users/user_123',
    auth: { uid: 'user_123', email_verified: true },
    data: {
      ...VALID_BASE_PROFILE,
      products: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-11',
    description: 'Invalid enum/pattern injection in accountType and tin',
    operation: 'create',
    path: '/users/user_123',
    auth: { uid: 'user_123', email_verified: true },
    data: { ...VALID_BASE_PROFILE, accountType: 'root', tin: 'DROP TABLE;--' },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-12',
    description: 'Value poisoning on whitelisted key monthlyCapacityKg with negative number',
    operation: 'update',
    path: '/users/user_123',
    auth: { uid: 'user_123', email_verified: true },
    data: { ...VALID_BASE_PROFILE, monthlyCapacityKg: -500 },
    expectedResult: 'PERMISSION_DENIED'
  }
];
