---
layout: ../../../layouts/DocsLayout.astro
title: License Management API
currentPage: /docs/api/licenses
---

# License Management API

The License Management API provides endpoints for creating, managing, and validating license keys for your software products.

## Available Endpoints

### License Creation and Management

- [Create License Key](./licenses/create) - Generate new license keys
- [Get License Details](./licenses/get) - Retrieve information about existing licenses
- [Block License](./licenses/block) - Disable a license key
- [Unblock License](./licenses/unblock) - Re-enable a blocked license key

### Activation Management

- [Activate License](./licenses/activate) - Register a device with a license key
- [Deactivate License](./licenses/deactivate) - Remove a device registration

## Common Parameters

Most endpoints require the following parameters:

- `productId` - Your product's unique identifier
- `licenseKey` - The license key being managed
- `accessToken` - Your API authentication token

For detailed information about authentication and error handling, see:

- [Authentication Guide](/docs/api/authentication)
- [Error Codes Reference](/docs/api/error-codes)
- [Rate Limits](/docs/api/rate-limits)
