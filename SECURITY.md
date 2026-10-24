# Security Policy

## Reporting a Vulnerability

As a portfolio demonstration project showcasing application security, full-stack architecture, and real-time mobile engineering, security reports and responsible disclosures are welcome.

If you believe you have discovered a security vulnerability in Zenvy Delivery App, please disclose it responsibly:

1. **Email Contact**: Send an email to [ali.harti.pro@gmail.com](mailto:ali.harti.pro@gmail.com) with the subject line `[SECURITY REPORT] Zenvy - <Brief Summary>`.
2. **Details to Include**:
   - Description of the vulnerability and attack vector.
   - Proof of Concept (PoC) or step-by-step reproduction instructions.
   - Affected component(s) (`backend/`, `mobile/`, WebSocket layer, or database migration scripts).
   - Potential impact according to the STRIDE or CVSS models.
3. **Response Timeline**:
   - **Initial Acknowledgement**: Within 48 hours.
   - **Triage & Assessment**: Within 5 business days.
   - **Remediation Plan**: Communicated after confirmation.

Please **do not** open public GitHub issues or public discussions for unpatched security vulnerabilities.

---

## Scope & Testing Policy

### In-Scope
- `backend/src/` (API routes, controllers, middleware, data sanitization, Sequelize ORM models, state machine)
- `backend/src/socket/` (Socket.io authentication and channel authorization)
- `mobile/src/` (React Native Expo auth flow, storage patterns, API communication)
- Database concurrency handling and race condition mitigations (e.g., pessimistic locking)

### Out-of-Scope
- Denial of Service (DoS) attacks on local development machines.
- Vulnerabilities dependent on root/jailbreak access to the physical mobile testing device.
- Third-party packages (e.g., vulnerabilities inside Expo Go client itself or NPM packages with upstream CVEs; these should be reported upstream unless due to a misconfiguration in Zenvy).
- Social engineering attacks against maintainers.

---

## Security Model & Environment Disclaimer

Zenvy is developed as an advanced software engineering and application security portfolio project.
- **Runtime Environment**: Designed for local development and demonstration (`localhost` / LAN testing). It is **not publicly deployed** to a production cloud server.
- **Data Privacy**: All database seed data (users, emails, phone numbers, addresses, stores) are synthetic dummy data created solely for functional demonstration.
- **Cardholder Data**: Zenvy does not process or store raw payment card data (PAN, CVV, expiry); orders use cash-on-delivery or mock transaction references.
