---
title: Keymint Topics
description: Comprehensive security overview for Keymint's software licensing platform
layout: ../../layouts/DocsLayout.astro
---

# Offline License Distribution & Verification

Enable your customers to run Keymint-protected software completely offline—ideal for air-gapped or internally isolated environments. This guide covers:

1. **Generating** an offline license in the Dashboard
2. **Modal workflow** for signing and download
3. **File structure** of the `.lic` file
4. **Distribution methods**
5. **Client-side verification**
6. **Best practices**

---

## 1. Generate an Offline License (Dashboard)

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

## 3. `.lic` File Format

When you click **Generate**, the browser downloads a file named:

```
license-<KEY>-<machineCode?>-<YYYY-MM-DD>.lic
```

**Contents** (JSON):

```json
{
  "signedDate": "2025-06-23T14:12:00.000Z",
  "signedKey": "eyJhbGciOiJFZERTQSJ9…",
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMCowBQY…\n-----END PUBLIC KEY-----"
}
```

- `signedDate`: ISO timestamp of issuance
- `signedKey`: Compact Ed25519-signed JWT with payload
- `publicKey`: PEM-encoded Ed25519 public key for offline verification

---

## 4. Distribution Methods

- **Web Download:** Share the `.lic` file link.
- **Email Attachment:** Send to your customer’s IT or support team.
- **Physical Media:** Copy to USB, DVD, or SD card for air-gapped sites.
- **Embed in Installer:** Package with your application installer.

---

## 5. Client-Side Verification

Use any Ed25519-capable JWT library. Example using `jose`:

```ts
import { jwtVerify, importSPKI } from "jose";
import fs from "fs";

// 1. Load the .lic file
const { signedKey, publicKey } = JSON.parse(
  fs.readFileSync("license.lic", "utf8")
);

// 2. Import public key
const edKey = await importSPKI(publicKey, "EdDSA");

// 3. Verify signature & decode
const { payload } = await jwtVerify(signedKey, edKey);

// 4. Enforce expiry
const now = Math.floor(Date.now() / 1000);
if (payload.exp < now) {
  throw new Error("License expired");
}

// 5. Optional: enforce node-lock
if (payload.machineCode && payload.machineCode !== getLocalMachineCode()) {
  throw new Error("License not valid on this machine");
}

// 6. License is valid! Use `payload` to enable features
console.log("Licensed to:", payload.sub);
```

**JWT Payload Fields:**

| Field         | Type   | Meaning                               |
| ------------- | ------ | ------------------------------------- |
| `sub` / `key` | string | License key identifier                |
| `productId`   | string | Product reference                     |
| `machineCode` | string | (Optional) bound hardware fingerprint |
| `type`        | string | "offline"                             |
| `iat`         | number | Issued-at timestamp (Unix seconds)    |
| `exp`         | number | Expiry timestamp (Unix seconds)       |

---

## 6. Best Practices

- **Self-contained:** Embedding `publicKey` means one file has everything.
- **Filename convention:**  
  `license-<KEY>-<machineCode?>-YYYYMMDD.lic`
- **Short TTLs:** Use shorter TTLs (e.g. 7 days) for revocable offline licenses.
- **Key rotation:** Support multiple public keys in your client to handle rotations.
- **Secure storage:** Instruct customers to store `.lic` files with appropriate permissions.
- **Caching strategy:** Apps can cache the `.lic` file and only re-fetch when nearing expiry.

With this workflow, Keymint delivers fully offline, cryptographically secure licenses—no runtime internet access needed.
