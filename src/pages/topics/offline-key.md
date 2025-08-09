---
title: Offline License Verification (Trust Model v2)
description: Comprehensive guide for secure offline license verification with trust store architecture
layout: ../../layouts/DocsLayout.astro
---

# Offline License (Trust Model v2)

Enable your customers to run Keymint-protected software completely offline with enhanced security through a trust store model—ideal for air-gapped or internally isolated environments.

## Key Changes in v2

<aside class="warning">
**Security Enhancement**: Offline verification no longer trusts embedded public keys in `.lic` files. Instead, applications maintain a local trust store that maps key IDs to trusted public keys, preventing attackers from crafting malicious licenses with their own keys.
</aside>

This guide covers:

1. **Trust Store Architecture** and security model
2. **Generating** offline licenses in the Dashboard  
3. **Enhanced `.lic` file structure** (no embedded keys)
4. **Client-side verification** with granular error handling
5. **Key ID computation** and fingerprinting
6. **Key rotation** strategies
7. **Migration** from legacy approach
8. **Best practices** for secure deployment

---

## 1. Trust Store Architecture

The trust store is a client-side concept that maps **Key IDs** (`kid`) to trusted public keys. This prevents malicious actors from crafting `.lic` files with their own public keys.

### Key ID Definition

The Key ID (`kid`) is a stable fingerprint of the public key:

```
kid = base64url(SHA-256(SPKI DER))
```

### Computing Key ID

**From PEM (Browser/Node.js):**

```javascript
async function computeKidFromPem(pem) {
  const b64 = pem.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s+/g, '');
  const der = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const hash = await crypto.subtle.digest('SHA-256', der);
  const b = String.fromCharCode(...new Uint8Array(hash));
  return btoa(b).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
```

### Trust Store Implementation

```typescript
import { importSPKI } from 'jose';

// Build trust store during application initialization
const trustStore = new Map();

// Add trusted keys (ship with your application)
const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAr7Z8s2Z...
-----END PUBLIC KEY-----`;

const kid = 'AbC123XyZ'; // Computed fingerprint
trustStore.set(kid, await importSPKI(publicKeyPem, 'EdDSA'));
```

---

## 2. Generate an Offline License (Dashboard)

1. **Log in** to Keymint and go to **Products → [Your Product] → Licenses**.
2. Locate the license row you wish to issue offline.
3. In the **Activations** column, click the **Eye icon** ( 👁️ ):  
   This opens the **Offline License** modal.

---

## 2. Offline License Modal

The modal has two panels:

### A. Offline License Generator

- **Machine Code (optional)**  
  A hardware fingerprint (e.g. `host-ABC123`) locks this file to one device.
- **Custom TTL (seconds)**  
  Required if the license has _no_ built-in expiration.  
  Example: `2592000` for 30 days.
- **Generate Signed License** button  
  Signs a fresh JWT and immediately triggers download.

<aside class="warning">
If your license record has **no expirationDate**, you **must** supply a TTL here or the generation will fail.
</aside>

### B. Device Activations

Below the generator, a table lists all machines that have activated this key. Useful for auditing.

---

## 3. Enhanced `.lic` File Format (v2)

When you click **Generate**, the browser downloads a file named:

```
license-<KEY>-<machineCode?>-<YYYY-MM-DD>.lic
```

**Contents** (JSON) - **No embedded public key**:

```json
{
  "licenseToken": "eyJhbGciOiJFZERTQSIsImtpZCI6IkFiQzEyM1h5WiJ9...",
  "signedKey": "ABCD-EFGH-1234-5678",
  "signedDate": "2025-08-09T14:12:00.000Z",
  "keyId": "AbC123XyZ"
}
```

**Field Descriptions:**

| Field           | Type   | Description                                    |
|-----------------|--------|------------------------------------------------|
| `licenseToken`  | string | Ed25519-signed JWT (header.alg=EdDSA, header.kid=fingerprint) |
| `signedKey`     | string | License key identifier shown to users         |
| `signedDate`    | string | ISO 8601 timestamp of issuance               |
| `keyId`         | string | Same value as JWT header.kid (fingerprint)    |

<aside class="info">
**Security Note**: The public key is no longer embedded in the `.lic` file. Verification keys must be distributed through your application's trust store.
</aside>

---

## 4. JWT Structure

**Protected Header:**
```json
{
  "alg": "EdDSA",
  "kid": "AbC123XyZ"
}
```

**Payload Claims:**

| Field         | Type   | Description                               |
| ------------- | ------ | ----------------------------------------- |
| `sub` / `key` | string | License key identifier                    |
| `productId`   | string | Product reference                         |
| `machine`     | string | (Optional) bound hardware fingerprint     |
| `type`        | string | "offline"                                 |
| `iat`         | number | Issued-at timestamp (Unix seconds)       |
| `exp`         | number | Expiry timestamp (Unix seconds)           |
| `nbf`         | number | Not-before timestamp (Unix seconds)       |

---

## 5. Distribution Methods

- **Web Download:** Share the `.lic` file link.
- **Email Attachment:** Send to your customer’s IT or support team.
- **Physical Media:** Copy to USB, DVD, or SD card for air-gapped sites.
- **Embed in Installer:** Package with your application installer.

---

## 6. Client-Side Verification with Trust Store

### Complete Verification Implementation

```typescript
import { importSPKI, jwtVerify, decodeProtectedHeader } from "jose";
import fs from "fs";

// Error codes for granular failure handling
type VerificationResult = 
  | { ok: true; code: 'ok'; payload: any }
  | { ok: false; code: 'unknown_kid' | 'token_malformed' | 'signature_invalid' 
                      | 'token_expired' | 'not_yet_valid' | 'machine_mismatch' 
                      | 'product_mismatch' };

// Initialize trust store (ship with your application)
const trustStore = new Map<string, any>();

// Add your trusted public keys
const trustedKeys = [
  {
    kid: 'AbC123XyZ', // Fingerprint from Keymint dashboard
    pem: `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAr7Z8s2Z...
-----END PUBLIC KEY-----`
  },
  // Add more keys for rotation
];

// Build trust store
for (const { kid, pem } of trustedKeys) {
  trustStore.set(kid, await importSPKI(pem, 'EdDSA'));
}

export async function verifyLicense(
  licenseFilePath: string, 
  options: {
    product?: string;
    machine?: string;
    now?: number;
  } = {}
): Promise<VerificationResult> {
  try {
    // 1. Load the .lic file
    const licenseData = JSON.parse(fs.readFileSync(licenseFilePath, "utf8"));
    const { licenseToken } = licenseData;
    
    if (!licenseToken) {
      return { ok: false, code: 'token_malformed' };
    }

    // 2. Decode JWT header (don't trust payload until signature verified)
    const header = decodeProtectedHeader(licenseToken);
    
    // 3. Resolve verification key
    let verificationKey;
    
    if (header.kid) {
      // Use kid-based lookup
      verificationKey = trustStore.get(header.kid);
      if (!verificationKey) {
        return { ok: false, code: 'unknown_kid' };
      }
      
      try {
        const { payload } = await jwtVerify(licenseToken, verificationKey, { 
          algorithms: ['EdDSA'] 
        });
        return validateClaims(payload, options);
      } catch {
        return { ok: false, code: 'signature_invalid' };
      }
    } else {
      // Legacy fallback: try all trusted keys
      for (const key of trustStore.values()) {
        try {
          const { payload } = await jwtVerify(licenseToken, key, { 
            algorithms: ['EdDSA'] 
          });
          return validateClaims(payload, options);
        } catch {
          // Continue to next key
        }
      }
      return { ok: false, code: 'signature_invalid' };
    }
  } catch {
    return { ok: false, code: 'token_malformed' };
  }
}

function validateClaims(
  payload: any, 
  { now = Math.floor(Date.now() / 1000), product, machine }: any
): VerificationResult {
  // Basic payload structure check
  if (typeof payload !== 'object' || !payload) {
    return { ok: false, code: 'token_malformed' };
  }

  // Check expiration (with small clock skew tolerance)
  const clockSkew = 300; // 5 minutes
  if (payload.exp && now > (payload.exp + clockSkew)) {
    return { ok: false, code: 'token_expired' };
  }

  // Check not-before
  if (payload.nbf && now < (payload.nbf - clockSkew)) {
    return { ok: false, code: 'not_yet_valid' };
  }

  // Check product match
  if (product && payload.productId !== product) {
    return { ok: false, code: 'product_mismatch' };
  }

  // Check machine binding
  if (machine && payload.machine && payload.machine !== machine) {
    return { ok: false, code: 'machine_mismatch' };
  }

  return { ok: true, code: 'ok', payload };
}

// Usage example
async function checkLicense() {
  const result = await verifyLicense('./license.lic', {
    product: 'my-app',
    machine: getLocalMachineCode()
  });

  if (result.ok) {
    console.log('License valid for:', result.payload.sub);
    // Enable application features
  } else {
    console.error('License verification failed:', result.code);
    // Handle specific error cases
    switch (result.code) {
      case 'token_expired':
        showRenewalDialog();
        break;
      case 'machine_mismatch':
        showMachineBindingError();
        break;
      case 'unknown_kid':
        showTrustStoreError();
        break;
      default:
        showGenericLicenseError();
    }
  }
}
```

### Quick Implementation

**Short version:** Ship a trust store in your app mapping `kid` → vendor public key (PEM) from Keymint "Manage public keys". Read `.lic` JSON, verify JWT with Ed25519 only.

```typescript
import { importSPKI, jwtVerify, decodeProtectedHeader } from 'jose';
import fs from 'fs';

// Trust store helper - ship with your app
async function buildTrustStore() {
  const trustedKeys = [
    // Copy from Keymint "Manage Public Keys"
    { kid: 'AbC123XyZ', pem: `-----BEGIN PUBLIC KEY-----\nMCowBQ...\n-----END PUBLIC KEY-----` },
    { kid: 'DeF456UvW', pem: `-----BEGIN PUBLIC KEY-----\nMCowBQ...\n-----END PUBLIC KEY-----` }, // Next key for rotation
  ];
  
  const store = new Map();
  for (const { kid, pem } of trustedKeys) {
    store.set(kid, await importSPKI(pem, 'EdDSA'));
  }
  return store;
}

// Verify license
async function verifyOfflineLicense(licFilePath: string, options: { productId?: string, machineCode?: string } = {}) {
  const trustStore = await buildTrustStore();
  
  // 1. Read .lic file
  const { licenseToken } = JSON.parse(fs.readFileSync(licFilePath, 'utf8'));
  
  // 2. Decode header, get kid
  const header = decodeProtectedHeader(licenseToken);
  
  // 3. Resolve key from trust store
  let key = header.kid ? trustStore.get(header.kid) : null;
  if (!key) {
    // Fallback: try all trusted keys
    for (const k of trustStore.values()) {
      try {
        await jwtVerify(licenseToken, k, { algorithms: ['EdDSA'] });
        key = k;
        break;
      } catch { /* continue */ }
    }
  }
  
  if (!key) throw new Error('Unknown key ID or invalid signature');
  
  // 4. Verify JWT with Ed25519 only
  const { payload } = await jwtVerify(licenseToken, key, { algorithms: ['EdDSA'] });
  
  // 5. Validate claims
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now > payload.exp) throw new Error('License expired');
  if (payload.nbf && now < payload.nbf) throw new Error('License not yet valid');
  if (payload.type && payload.type !== 'offline') throw new Error('Invalid license type');
  if (options.productId && payload.productId !== options.productId) throw new Error('Product mismatch');
  if (options.machineCode && payload.machineCode && payload.machineCode !== options.machineCode) throw new Error('Machine mismatch');
  
  return payload; // License valid!
}

// Usage
try {
  const license = await verifyOfflineLicense('./license.lic', { 
    productId: 'my-app',
    machineCode: getLocalMachineCode() 
  });
  console.log('Licensed to:', license.sub);
} catch (err) {
  console.error('License invalid:', err.message);
}
```

**Key points:**
- **No embedded public keys**: Trust store only, never from `.lic` file
- **Algorithm pinning**: Always use `algorithms: ['EdDSA']`
- **Multiple keys**: Ship current + next key for smooth rotation
- **Kid fallback**: Try all keys if `kid` missing (legacy support)

---

## 7. Key Rotation Strategy

### Adding New Keys

1. **Generate new key pair** in Keymint dashboard
2. **Copy the Key ID** (fingerprint) displayed in the UI
3. **Update trust store** in your application:

```typescript
// Add new key while keeping old ones
const newTrustedKeys = [
  // Existing keys
  { kid: 'AbC123XyZ', pem: '...' },
  // New key
  { kid: 'DeF456UvW', pem: '...' }, 
];
```

4. **Deploy updated application** with expanded trust store
5. **Start signing new licenses** with the new key
6. **Remove old key** from trust store after sufficient adoption

### Best Practices for Rotation

- **Ship at least two keys** (current + next) to simplify rotations
- **Publish Key IDs** in release notes for transparency
- **Monitor usage** of old keys before removal
- **Plan rotation cycles** (e.g., annually)

---

## 8. Migration from Legacy

### Backward Compatibility

The verifier supports both trust store (v2) and legacy embedded key approaches:

```typescript
// Legacy support: if no kid, try embedded key (if present)
if (!header.kid && licenseData.publicKey) {
  try {
    const legacyKey = await importSPKI(licenseData.publicKey, 'EdDSA');
    const { payload } = await jwtVerify(licenseToken, legacyKey);
    return validateClaims(payload, options);
  } catch {
    // Fall through to trust store fallback
  }
}
```

### Migration Steps

1. **Update signer** to add `kid` to JWT header and exclude `publicKey` from `.lic`
2. **Deploy trust store** in client applications
3. **Support both formats** during transition period
4. **Phase out legacy format** once adoption is complete

---

## 9. Security Rationale

### Why Trust Store?

- **Prevents key substitution attacks**: Attackers cannot craft `.lic` files with their own keys
- **Centralized key management**: Operators control which keys are trusted
- **Improved auditability**: Clear separation between license data and trust decisions
- **Key rotation support**: Graceful handling of key lifecycle management

### Additional Security Measures

- **Protect trust store** from user modification (code signing, checksums)
- **Pin product and machine** in payload; never infer from filename
- **Allow small clock skew** (±5 minutes) for realistic deployment scenarios
- **Use structured error codes** to prevent information leakage

---

## 10. UI Integration Notes

### Dashboard Features

- **Key fingerprint display**: Copy button for easy trust store configuration
- **Key rotation indicators**: Visual cues for key lifecycle status
- **License debugging tools**: Decode JWT headers and payloads for troubleshooting

### Client Application

- **Graceful error handling**: User-friendly messages for each error type
- **Offline capability**: No internet required for license verification
- **Performance optimization**: Cache verification results appropriately

---

## 11. Best Practices

### Security

- **Trust store protection**: Use code signing and checksums to prevent tampering
- **Key ID validation**: Always verify Key ID matches between JWT header and `.lic` metadata
- **Clock skew tolerance**: Allow ±5 minutes for realistic deployment environments
- **Granular error handling**: Use specific error codes to improve UX and prevent bypasses

### Distribution

- **Embed trust store**: Ship public keys with your application installer
- **Secure channels**: Use HTTPS, signed emails, or physical media for `.lic` distribution
- **Filename conventions**: `license-<KEY>-<machineCode?>-YYYYMMDD.lic`
- **Version tracking**: Include trust store version in application metadata

### Performance

- **Cache verification results**: Avoid redundant cryptographic operations
- **Lazy loading**: Initialize trust store only when needed
- **Background validation**: Check license validity periodically, not on every operation
- **Efficient storage**: Store pre-imported keys to avoid repeated SPKI parsing

### Operational

- **Key rotation schedule**: Plan annual or bi-annual key rotations
- **Monitoring**: Track which Key IDs are in use across your customer base
- **Documentation**: Maintain clear records of key lifecycles and fingerprints
- **Support procedures**: Prepare troubleshooting guides for each error code

---

## Summary

The Trust Model v2 significantly enhances the security of Keymint's offline licensing by:

1. **Eliminating embedded public keys** to prevent key substitution attacks
2. **Introducing Key ID-based verification** with stable fingerprints
3. **Providing granular error codes** for better user experience
4. **Supporting key rotation** with backward compatibility
5. **Maintaining full offline capability** with no runtime internet requirements

This architecture delivers cryptographically secure, fully offline licenses while giving operators complete control over their trust relationships.

<aside class="info">
**Migration Timeline**: Existing applications can gradually adopt Trust Model v2 through the legacy fallback mechanism. Plan to complete migration within your next major release cycle.
</aside>
