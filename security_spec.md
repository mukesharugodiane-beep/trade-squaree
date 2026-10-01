# Trade Square — Zero-Trust Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Default-Deny Catch-All**: Every path in `/databases/{database}/documents/{document=**}` is denied by default (`allow read, write: if false;`).
2. **Strict PII & Profile Ownership (`/users/{userId}`)**:
   - A `UserProfile` document at `/users/{userId}` can ONLY be read (`get`), created, updated, or deleted by the authenticated user whose `request.auth.uid == userId`.
   - Blanket `list` queries on `/users` are strictly prohibited (`allow list` is omitted/denied) to prevent scraping of enterprise PII (`email`, `phone`, `tin`).
3. **Verified Email Requirement**: All write operations (`create`, `update`, `delete`) require `request.auth != null && request.auth.token.email_verified == true`.
4. **Path Variable Hardening**: `{userId}` must satisfy `isValidId(userId)` (`id is string && id.size() >= 1 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`).
5. **Schema & Key Integrity (`isValidUserProfile`)**:
   - Must enforce exact required and allowed keys via `data.keys().hasAll([...]) && data.keys().hasOnly([...])` to prevent shadow/ghost fields.
   - `data.uid` must equal `request.auth.uid` and remain immutable across updates (`incoming().uid == existing().uid`).
   - All string fields have explicit `.size()` lower and upper bounds matching `firebase-blueprint.json`.
   - All array fields (`products`, `certifications`, `savedPartnerIds`) are bounded to `size() >= 1 && size() <= 10` with element 0 validated as a bounded string.
6. **Temporal Integrity**:
   - On `create`: `incoming().createdAt == request.time && incoming().updatedAt == request.time`.
   - On `update`: `incoming().createdAt == existing().createdAt && incoming().updatedAt == request.time`.

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Payload 1 (Unauthenticated Read/Write)**: `auth = null` attempting `get` or `create` on `/users/user_123`.
2. **Payload 2 (Unverified Email Spoof)**: `auth = { uid: 'user_123', token: { email_verified: false } }` attempting `create` on `/users/user_123`.
3. **Payload 3 (Cross-User PII Read)**: `auth = { uid: 'attacker_999', token: { email_verified: true } }` attempting `get` on `/users/user_123`.
4. **Payload 4 (Collection Scraping / List Query)**: `auth = { uid: 'user_123', token: { email_verified: true } }` attempting `list` on `/users`.
5. **Payload 5 (Identity Spoofing on Create)**: `auth = { uid: 'user_123' }` creating `/users/user_123` with `uid: 'victim_456'`.
6. **Payload 6 (Shadow / Ghost Field Injection)**: Creating or updating `/users/user_123` with an undeclared field `"isAdmin": true`.
7. **Payload 7 (Immutable Field Mutation on Update)**: Updating `/users/user_123` with a modified `createdAt` or `uid`.
8. **Payload 8 (Client Timestamp Forgery)**: Creating `/users/user_123` with a past or future forged `createdAt` instead of `request.time`.
9. **Payload 9 (String Resource Exhaustion / Denial of Wallet)**: Updating `specificOfferings` with a 10,000-character string (exceeds `maxLength: 500`).
10. **Payload 10 (Unbounded Array Injection)**: Updating `products` with 50 items (exceeds `maxLength: 10`) or non-string first element `[12345]`.
11. **Payload 11 (Invalid Enum / Pattern Injection)**: Creating `/users/user_123` with `accountType: "superadmin"` or `tin: "DROP TABLE;--"`.
12. **Payload 12 (Value Poisoning on Whitelisted Update Key)**: Updating `monthlyCapacityKg` with a string `"10000"` or negative number `-500`.
