---
title: API Authentication
currentPage: /docs/api/authentication
layout: ../../layouts/DocsLayout.astro
---

# API Authentication

Authenticate your requests to the Keymint API effortlessly using Access Tokens.

---

## Access Tokens

Access Tokens are unique strings required for authentication. Include them as a Bearer token in the `Authorization` header of every API request.

---

### Obtaining an Access Token

Follow these steps to generate an Access Token:

1. **Log in** to your Keymint Dashboard.
2. Navigate to **Developer**.
3. Generate a token and setting its **scopes**.

---

### Using the Access Token

Include the token in the `Authorization` header of your API requests. Here's an example:

#### Example: Request with Authorization Header

```http
GET /activate-key HTTP/1.1
Host: api.keymint.dev
Authorization: Bearer at_your_token_here
```

---

### Scopes

Scopes help restrict token permissions for better security and organization:

- **Product Scopes:** Limit tokens to specific products.

---

### Security Best Practices

To ensure the security of your Access Tokens:

- **Keep tokens secret** and store them securely.
- **Use HTTPS** for all API requests.
- **Generate tokens with the minimal required scopes**.
- **Revoke compromised tokens immediately**.

---

## Token Management

Manage your tokens directly in the Keymint Dashboard:

- **Generate new tokens** as needed.
- **Revoke existing tokens** to maintain security.
