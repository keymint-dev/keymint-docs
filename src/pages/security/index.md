---
title: Keymint Security
description: Comprehensive security overview for Keymint's software licensing platform
layout: ../../layouts/DocsLayout.astro
---

# Keymint Security

At Keymint, we prioritize the security and privacy of your data. We understand that managing software licenses requires trust, and we are committed to implementing robust security measures to protect our platform and your information.

## Core Security Principles

Our approach to security is built on these fundamental principles:

1.  **Data Protection:** Safeguarding the personal and licensing data you entrust to us.
2.  **Secure Infrastructure:** Utilizing reliable technologies and partners to maintain a secure operational environment.
3.  **Transparency:** Clearly communicating how we handle and protect your data.
4.  **Compliance:** Adhering to relevant data protection regulations and best practices.

## Key Security Measures

We implement multiple layers of security to protect the Keymint platform and your data:

### 🔐 Data Encryption & Handling

- **Encryption in Transit:** All communication between your browser/client and the Keymint platform is encrypted using industry-standard HTTPS (SSL/TLS).
- **Password Security:** User account passwords are securely stored using strong hashing algorithms (as mentioned in our Privacy Policy). We never store plaintext passwords.
- **Payment Security:** We utilize trusted third-party payment processors (Stripe for card payments, CoinPayments for cryptocurrency). We **do not store** your full credit card details or private crypto wallet information on our servers. Payment data is handled directly by these processors according to their high security standards.
- **Database Security:** We use secure database hosting solutions (like Neon.tech) designed with data protection in mind.

### 👤 Access Control

- **Enhanced Authentication:** We employ multiple factors to secure your account access. In addition to secure password hashing for your primary login, access attempts may involve verification via a code sent to your registered email address. We also utilize security checks based on factors like device information and IP address analysis to help detect and prevent potentially unauthorized activity.
- **Role-Based Access Control (RBAC):** Internal access to systems and data is restricted based on employee roles and responsibilities, following the principle of least privilege.
- **API Key Security:** Users are responsible for keeping their API keys secure. We recommend following best practices for API key management.

### 🛡️ Platform & Operational Security

- **Secure Hosting Infrastructure:** Keymint leverages modern cloud infrastructure for hosting. Our primary application is hosted on Vercel, which provides benefits like a global CDN and infrastructure resilience. Our database is securely managed by Neon.tech.
- **Secure Development:** We incorporate security considerations throughout our development lifecycle.
- **Third-Party Vetting:** We select third-party service providers (like Neon.tech for database hosting and PostHog for analytics) based on their security practices and require them contractually to handle data securely.
- **Internal Security Assessments:** We conduct regular internal security reviews of our codebase and infrastructure to identify and address potential vulnerabilities. This is complemented by continuous monitoring for platform abuse and violations of our terms.
- **Data Backups:** We perform regular backups of critical platform data to ensure availability and support recovery processes.

### 🌍 International Data Transfers

- As outlined in our Privacy Policy, when data is transferred internationally (e.g., to servers or service providers in the US or EEA), we ensure appropriate safeguards like Standard Contractual Clauses (SCCs) are in place.

## Your Role in Security

Security is a shared responsibility. You can help keep your account secure by:

- Using a strong, unique password.
- Keeping your login credentials and API keys confidential.
- Promptly notifying us if you suspect unauthorized access to your account.
- Using the Service responsibly and in accordance with our Acceptable Use policy (see Terms of Service).

## Third-Party Services

We leverage specialized third-party services for specific functions. Key providers related to security and infrastructure include:

- **Stripe:** Secure processing of credit card payments. ([Stripe Privacy Policy](link-to-stripe-policy))
- **CoinPayments:** Secure processing of cryptocurrency payments. ([CoinPayments Privacy Policy](link-to-coinpayments-policy))
- **Neon.tech:** Secure database hosting and storage.
- **Vercel:** Application hosting and infrastructure.
- **PostHog:** Product analytics (data handled according to their security practices).

These providers are responsible for the security of the services they provide.

## Reporting Security Concerns

If you believe you have discovered a security vulnerability in the Keymint platform, please contact us immediately so we can investigate and take appropriate action.

**Security Contact Email:** [security@keymint.dev](mailto:security@keymint.dev)

## Updates and Transparency

We are committed to maintaining transparency about our security practices. We may update this document as our platform and security measures evolve. Please refer to the "Last Updated" date below.

_Last Updated: May 2025_
