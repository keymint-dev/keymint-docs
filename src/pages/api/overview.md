---
layout: ../../layouts/DocsLayout.astro
title: API Overview
currentPage: /api/overview
---

# Overview

Welcome to the Keymint API documentation! This API helps you manage software licenses, track activations, and integrate licensing logic into your applications.

## Getting Started

1. **Obtain Credentials:** Get your `accessToken` from your Keymint account dashboard. <!-- Add link to account settings when available -->
2. **Identify your Product:** Use the `productId` for the product you want to manage.
3. **Make your First Call:** Start with a basic endpoint, such as creating a license key.

:::tip Authentication
Include your `accessToken` as a Bearer token in the `Authorization` header of your request.

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

See the [Authentication Guide](/api/authentication) for details.
:::

## Base URL

All API requests use the following base URL:

`https://api.keymint.dev`

## Authentication

Authenticate requests with your `accessToken`. Keep it secure and avoid exposing it in public repositories.

➡️ **Learn more:** [Authentication Guide](/api/authentication)

## Request & Response Format

- Use **JSON** for request bodies and responses.
- Include the `Content-Type: application/json` header for `POST` requests.
- Expect `2xx` status codes for success and `4xx`/`5xx` for errors.

## Key Concepts

- **Product (`productId`):** The software or service being licensed.
- **License (`licenseKey`):** A unique key granting usage rights.
- **Activation (`hostId`):** Tracks where a license is activated.
- **Access Token (`accessToken`):** Your secret credential for API requests.

## Error Handling

Failed requests return an HTTP status code and a JSON error response:

```json
{
  "code": 2,
  "message": "Activation limit reached"
}
```

➡️ **Learn more:** [Error Codes Reference](/api/error-codes)

## Rate Limiting

The API enforces rate limits. Exceeding the limit returns a `429 Too Many Requests` status.

## Next Steps

- Learn about authentication: [Authentication Guide](/api/authentication)
- Explore license management: [Licenses API](/api/licenses)
- Understand errors: [Error Codes Reference](/api/error-codes)
