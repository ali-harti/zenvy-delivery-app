# Zenvy — Full-Stack On-Demand Food Delivery Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000.svg?logo=express)](https://expressjs.com/)
[![React Native](https://img.shields.io/badge/React_Native-Expo_54-61DAFB.svg?logo=react)](https://reactnative.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1.svg?logo=postgresql)](https://postgresql.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101.svg?logo=socket.io)](https://socket.io/)
[![OWASP Aligned](https://img.shields.io/badge/Security-OWASP_Top_10_Aligned-brightgreen.svg)](https://owasp.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Zenvy is a multi-role, real-time food and local commerce delivery platform designed for high-concurrency order dispatching, role-based workflows, and live courier tracking. Built with a unified React Native (Expo) mobile frontend and an Express.js / PostgreSQL relational backend, the application orchestrates transactional workflows across three distinct actors: **Customers** (store browsing, cart management, checkout, live order tracking), **Couriers** (shift onboarding, geolocation zones, dispatch offer acceptance, turn-by-turn delivery status), and **Merchants** (kitchen order management, stock availability toggles, and live sales metrics).

> [!NOTE]
> **Portfolio Project Notice**: Zenvy is developed as a technical portfolio project demonstrating application security architecture, distributed concurrency controls, and real-time state synchronization. It is configured for local and network testing (`localhost` / LAN), and is **not publicly deployed**. All seed entities, customer phone numbers, and addresses represent synthetic test data.

---

## Mobile Application Screenshots

Demo video: *[Link to add later]*

| Role | Screen 1 | Screen 2 | Screen 3 |
| :--- | :--- | :--- | :--- |
| **Customer Experience** | ![Customer Home](docs/screenshots/customer-home.png)<br><sub>**Store Discovery & Categories**</sub> | ![Customer Cart](docs/screenshots/customer-cart.png)<br><sub>**Multi-Store Cart & Stepper**</sub> | ![Customer Tracking](docs/screenshots/customer-tracking.png)<br><sub>**Real-Time Order Tracking**</sub> |
| **Courier Experience** | ![Courier Shift Onboarding](docs/screenshots/courier-shift.png)<br><sub>**Zone & Permissions Check**</sub> | ![Courier Available Orders](docs/screenshots/courier-orders.png)<br><sub>**Dispatch Queue & Incoming Requests**</sub> | ![Courier Active Delivery](docs/screenshots/courier-active-delivery.png)<br><sub>**Active Delivery Progression**</sub> |
| **Merchant Experience** | ![Merchant Dashboard](docs/screenshots/merchant-dashboard.png)<br><sub>**Store Status & Daily Sales**</sub> | ![Merchant Orders](docs/screenshots/merchant-orders.png)<br><sub>**Kitchen Display & Order Actions**</sub> | ![Merchant Catalog](docs/screenshots/merchant-products.png)<br><sub>**Inventory & Availability Toggles**</sub> |

### LinkedIn Showcase Composites

High-resolution 1200×627 presentation composites suitable for professional portfolios and social showcases:
- **Customer Journey**: [docs/linkedin/linkedin-customer.png](docs/linkedin/linkedin-customer.png)
- **Courier Operations**: [docs/linkedin/linkedin-courier.png](docs/linkedin/linkedin-courier.png)
- **Merchant Management**: [docs/linkedin/linkedin-merchant.png](docs/linkedin/linkedin-merchant.png)

---

## Key Features by Actor

### Customer Experience
- **Store & Product Discovery**: Category filtering (Restaurants, Groceries, Pharmacy, Flowers), store search, ratings, and estimated delivery windows.
- **Product Configuration**: Quantity modifiers, special cooking instructions, and dynamic subtotal calculations.
- **Cart Management**: Server-synchronized cart storage with user isolation and quantity validation against real-time inventory.
- **Checkout & Address Selection**: Support for multiple delivery addresses, delivery scheduling options, cash-on-delivery (COD), and mock payment reference processing.
- **Live Order Tracking**: Stage-by-stage status indicator (Placed → Accepted → Preparing → Picked Up → On the Way → Delivered) with courier details and direct hotline/support contacts.

### Courier Experience
- **Shift & Readiness Onboarding**: System permissions verification (Location Services, Push Notifications), vehicle category selection (Bike, Scooter, Car), and operating zone confirmation (e.g., Casablanca Maarif).
- **Dispatch Queue**: Real-time incoming delivery requests with payout amounts (MAD), pickup store details, dropoff locations, and instant Accept/Decline action handlers.
- **Concurrency-Safe Assignment**: Optimistic accept handlers backed by pessimistic database row locks (`SELECT ... FOR UPDATE`) preventing multiple couriers from claiming the same order.
- **Turn-by-Turn Delivery Workflow**: Enforced state transitions (`Arrived at Store` → `Start Delivery` → `Confirm Delivery`).
- **Earnings & Analytics**: Daily, weekly, and monthly payout summaries, cash collected reconciliation, and historical delivery logs.

### Merchant Experience
- **Kitchen Display System (KDS)**: Real-time incoming order stream with itemized lists, special customer instructions, and current fulfillment status.
- **State Machine Actions**: Progress order state from `PENDING` to `PREPARING` and `READY` for courier pickup.
- **Store Operations**: Live toggle to switch store status between `Open` and `Closed`.
- **Menu & Stock Management**: Real-time product availability toggle (`Active` vs. `Hidden`/Sold Out).

### Real-Time Tracking & Event Bus
- **Socket.io WebSocket Layer**: Bi-directional event communication for instantaneous order state changes without HTTP polling.
- **Room Isolation**: Automatic segregation into user-specific (`user_<id>`), courier-specific (`courier_<id>`), and merchant-specific (`merchant_<id>`) channels.
- **Post-Commit Event Dispatching**: WebSocket events are triggered only via `transaction.afterCommit()` to prevent ghost notifications from uncommitted or aborted database transactions.

---

## ️ System Architecture & Trust Boundaries

The system is partitioned into explicit trust boundaries separating untrusted client runtimes, authenticated edge proxies, business execution services, and persistence layers.

```mermaid
flowchart TB
    subgraph Client_Trust_Boundary["Client Boundary (Untrusted Device Environment)"]
        CustomerApp[" Customer Mobile App (Expo)"]
        CourierApp[" Courier Mobile App (Expo)"]
        MerchantApp[" Merchant Mobile App (Expo)"]
    end

    subgraph Edge_Boundary["Edge & Network Boundary"]
        ReverseProxy["️ Reverse Proxy / Load Balancer\n(Nginx / Cloudflare - TRUST_PROXY_HOPS)"]
        CORS[" CORS Validation\n(Explicit Origin Whitelist)"]
        RateLimit["️ Rate Limiting\n(IP / User-ID Namespace)"]
    end

    subgraph App_Server_Boundary["Application Server Boundary (Node.js / Express)"]
        AuthMiddleware[" JWT Verification & Role Auth\n(src/middleware/auth.js)"]
        Router[" REST Routing\n(/api/v1/*)"]
        StateMachine["️ Order State Machine\n(src/services/stateMachine.js)"]
        OrderService[" Order & Stock Service\n(src/services/OrderService.js)"]
        DeliveryService[" Delivery Dispatch Service\n(src/services/DeliveryService.js)"]
        SocketServer[" Socket.io Gateway\n(src/socket/index.js)"]
    end

    subgraph Data_Boundary["Persistence & Isolation Boundary"]
        PessimisticLock[" Row-Level Locks\n(SELECT ... FOR UPDATE)"]
        PostgresDB[(" PostgreSQL Relational DB\n(Sequelize ORM - ACID Transactions)")]
    end

    %% Data flows
    CustomerApp -->|"HTTPS (REST + Bearer JWT)"| ReverseProxy
    CourierApp -->|"HTTPS (REST + Bearer JWT)"| ReverseProxy
    MerchantApp -->|"HTTPS (REST + Bearer JWT)"| ReverseProxy

    CustomerApp -.->|"WSS (Socket.io + JWT Handshake)"| SocketServer
    CourierApp -.->|"WSS (GPS Location & Status)"| SocketServer
    MerchantApp -.->|"WSS (Order Subscriptions)"| SocketServer

    ReverseProxy --> CORS
    CORS --> RateLimit
    RateLimit --> AuthMiddleware
    AuthMiddleware --> Router

    Router --> OrderService
    Router --> DeliveryService
    OrderService --> StateMachine

    OrderService --> PessimisticLock
    DeliveryService --> PessimisticLock
    PessimisticLock --> PostgresDB

    OrderService -.->|"t.afterCommit() Emit"| SocketServer
    DeliveryService -.->|"t.afterCommit() Emit"| SocketServer
```

### Data Flow Descriptions
1. **Client to API (HTTPS / REST)**: Mobile clients issue requests attaching an `Authorization: Bearer <JWT>` header and an auto-generated `X-Request-ID`. Traffic passes through reverse proxy trust evaluation (`app.set('trust proxy', hops)`), CORS origin inspection, and rate limiting before reaching controllers.
2. **State Transition & Concurrency Control**: When an order is placed or accepted, `OrderService` or `DeliveryService` initiates a managed Sequelize transaction with `READ COMMITTED` isolation and issues `SELECT ... FOR UPDATE` locks on target products and orders. This prevents stock overselling and duplicate courier assignments under heavy concurrent access.
3. **Real-Time Notification Flow**: Once the database transaction commits, `transaction.afterCommit()` triggers `EventDispatcher`, which emits Socket.io messages to target rooms (`order_<id>`, `courier_<id>`).
4. **Courier Telemetry Flow**: Couriers broadcast location updates over WebSockets (`update_location`), which relay coordinates to subscribers in the corresponding order room.

---

##  Security Architecture & Technical Controls

### A. Threat Model (STRIDE)

| Threat Category | Asset / Target | Potential Attack Vector | Zenvy Mitigation & Verification | Code Location | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Spoofing** | User Identity / Auth | Forged tokens, credential stuffing, brute-forcing passwords. | Signed HMAC-SHA256 JWT tokens; bcrypt password hashing (10 rounds); account `isActive` validation on every authenticated request. | [backend/src/middleware/auth.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/middleware/auth.js#L8-L39)<br>[backend/src/models/User.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/models/User.js#L98-L100) | [Implemented] |
| **Tampering** | Order Price / Stock | Modifying item pricing in transit; checkout race conditions. | Client price inputs are discarded; server recalculates subtotal from database price snapshots inside locked transactions. | [backend/src/services/OrderService.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/services/OrderService.js#L197-L245) | [Implemented] |
| **Repudiation** | Order Status & Delivery | Disputing who marked an order delivered or cancelled. | Dedicated `AuditLog` records and state machine actor validation recording actor ID, role, and prior state. | [backend/src/services/AuditService.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/services/AuditService.js)<br>[backend/src/services/stateMachine.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/services/stateMachine.js#L73-L115) | [Implemented] |
| **Information Disclosure** | PII / Order Data | IDOR attacks accessing other customers' orders or cart items. | Per-object ownership checks verifying `order.userId === req.user.id`, store ownership, or courier assignment. Cart items scoped via inner join on `userId`. | [backend/src/services/OrderService.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/services/OrderService.js#L400-L450)<br>[backend/src/controllers/CartController.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/controllers/CartController.js#L143-L156) | [Implemented] |
| **Information Disclosure** | Live Courier Telemetry | Eavesdropping on courier real-time GPS locations. | Socket handshake authentication via JWT. However, order room join authorization is unverified. | [backend/src/socket/index.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/socket/index.js#L10-L31) | [Partial] |
| **Denial of Service** | Express API Endpoints | Request flooding, auth brute force, rapid checkout spam. | Global IP/User rate limiter configured (100 req/15 min). Auth-specific and order-specific limiters implemented in middleware but not mounted to routes. | [backend/src/app.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/app.js#L67)<br>[backend/src/middleware/rateLimiter.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/middleware/rateLimiter.js#L15-L98) | [Partial] |
| **Elevation of Privilege** | Account Roles | Submitting unauthorized role parameter during registration. | RBAC middleware checks `req.user.role`. However, `AuthController.register` accepts `req.body.role` directly without restriction. | [backend/src/middleware/auth.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/middleware/auth.js#L44-L56)<br>[backend/src/controllers/AuthController.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/controllers/AuthController.js#L31) | [Partial] |

---

### B. Authentication & Session Management

- **Token Architecture**: Stateless JSON Web Tokens (JWT) using HMAC-SHA256 (`jsonwebtoken` v9.0.2).
- **Issuance**: Issued upon successful `POST /api/v1/auth/login` and `POST /api/v1/auth/register` in [backend/src/controllers/AuthController.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/controllers/AuthController.js#L38-L103).
- **Token Payload**: Contains minimal claims: `{ id: user.id, email: user.email, role: user.role, merchantId?: number }`.
- **Token Lifetime**: Configured via `config.jwt.expiration` (environment variable `JWT_EXPIRATION`, defaults to `24h`).
- **Password Security**: Passwords hashed using `bcryptjs` with configurable salt rounds (default: `10`) in [backend/src/models/User.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/models/User.js#L98-L100). Plaintext passwords are never persisted.
- **Client Storage**: Tokens are stored client-side via `@react-native-async-storage/async-storage` and injected into outgoing API requests via an Axios request interceptor (`Authorization: Bearer <token>`).

---

### C. Authorization & RBAC Matrix

Access control is enforced using two layers:
1. **Route-level RBAC**: `authorize(...roles)` middleware in [backend/src/middleware/auth.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/middleware/auth.js#L44-L56).
2. **Object-level Data Separation & State Validation**: Explicit ownership verification in services preventing Insecure Direct Object References (IDOR).

| Resource / Endpoint | HTTP Method | Customer | Courier | Merchant | Admin | Enforcement Mechanism & File Path |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `/api/v1/stores` | `GET` | Allowed (Read) | Allowed (Read) | Allowed (Read) | Allowed (Read) | Public route ([src/routes/store.routes.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/routes/store.routes.js#L6-L8)) |
| `/api/v1/cart/**` | `GET`, `POST`, `PATCH`, `DELETE` | Allowed (Own cart) | Denied | Denied | Denied | `authenticate` + `where: { userId }` ([src/controllers/CartController.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/controllers/CartController.js#L19-L200)) |
| `/api/v1/orders` | `POST` | Allowed (Create) | Denied | Denied | Denied | `authenticate` + stock check ([src/routes/order.routes.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/routes/order.routes.js#L8)) |
| `/api/v1/orders/:id` | `GET` | Allowed (Own order) | Allowed (Assigned) | Allowed (Own store) | Allowed (All) | Object-level IDOR check ([src/services/OrderService.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/services/OrderService.js#L427-L448)) |
| `/api/v1/orders/:id/cancel` | `PATCH` | Allowed (If PENDING) | Denied | Allowed (If not IN_DELIVERY) | Allowed (Any) | State machine role matrix ([src/services/stateMachine.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/services/stateMachine.js#L32-L70)) |
| `/api/v1/orders/:id/status` | `PATCH` | Denied | Denied | Allowed (Own store) | Allowed (Any) | `authorize('admin', 'merchant')` + state machine validation |
| `/api/v1/delivery/available` | `GET` | Denied | Allowed (Read queue) | Denied | Allowed (Read) | `authorize('courier', 'admin')` ([src/routes/delivery.routes.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/routes/delivery.routes.js#L8-L10)) |
| `/api/v1/delivery/orders/:id/accept` | `POST` | Denied | Allowed (Claim) | Denied | Allowed (Assign) | `authorize('courier', 'admin')` + row lock ([src/services/DeliveryService.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/services/DeliveryService.js)) |
| `/api/v1/merchant/store` | `POST`, `PATCH` | Denied | Denied | Allowed (Own store) | Allowed (All) | `authorize('merchant')` ([src/routes/merchant.routes.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/routes/merchant.routes.js#L23-L26)) |
| `/api/v1/admin/**` | `GET`, `PATCH` | Denied | Denied | Denied | Allowed (All) | `authorize('admin')` ([src/routes/admin.routes.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/routes/admin.routes.js#L7-L18)) |

---

### D. OWASP Top 10 Mapping & Verification Status

*Developed following OWASP Top 10 security guidelines for verified components; remaining defense-in-depth measures are tracked as planned hardening.*

| OWASP Top 10 Risk Category | How Zenvy Addresses It | Status | Verification Reference |
| :--- | :--- | :---: | :--- |
| **A01:2021 — Broken Access Control** | Route middleware checks role claims; services enforce strict object ownership checks verifying tenant separation on orders, carts, and merchant catalogs. | [Implemented] | [backend/src/services/OrderService.js#L427-L448](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/services/OrderService.js#L427-L448)<br>[backend/src/middleware/auth.js#L44-L56](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/middleware/auth.js#L44-L56) |
| **A02:2021 — Cryptographic Failures** | Passwords hashed using bcrypt; JWT tokens signed with HMAC-SHA256 secret. No plaintext sensitive payment details stored. | [Implemented] | [backend/src/models/User.js#L98](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/models/User.js#L98)<br>[backend/src/utils/jwt.js#L7-L31](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/utils/jwt.js#L7-L31) |
| **A03:2021 — Injection** | All database queries utilize Sequelize ORM with parameterized SQL queries, eliminating raw SQL concatenation vulnerabilities. | [Implemented] | [backend/src/models/index.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/models/index.js)<br>[backend/src/controllers/CartController.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/controllers/CartController.js) |
| **A04:2021 — Insecure Design** | Enforces a formal state machine with deterministic transitions for the entire order lifecycle; pessimistic locking for stock and courier assignment race conditions. | [Implemented] | [backend/src/services/stateMachine.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/services/stateMachine.js#L32-L70)<br>[backend/src/services/OrderService.js#L60-L75](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/services/OrderService.js#L60-L75) |
| **A05:2021 — Security Misconfiguration** | Helmet security headers enabled; Express CORS whitelist enforced; global error handler sanitizes stack traces in non-dev environments. | [Partial] | [backend/src/app.js#L24-L46](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/app.js#L24-L46)<br>*(Socket.io retains wildcard CORS `origin: '*'` in `src/server.js`)* |
| **A06:2021 — Vulnerable & Outdated Components** | Core runtime dependencies (`express`, `helmet`, `jsonwebtoken`, `sequelize`, `socket.io`) are pinned to modern releases. | [Implemented] | [backend/package.json](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/package.json#L15-L33) |
| **A07:2021 — Identification & Authentication Failures** | Strict credential verification and account activation checks. However, lack of refresh token rotation and session revocation allows persistent tokens until expiry. | [Partial] | [backend/src/middleware/auth.js#L8-L38](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/middleware/auth.js#L8-L38) |
| **A08:2021 — Software & Data Integrity Failures** | Price and total calculations executed exclusively on the server; client payloads cannot alter pricing or store associations. | [Implemented] | [backend/src/services/OrderService.js#L236-L258](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/services/OrderService.js#L236-L258) |
| **A09:2021 — Security Logging & Monitoring Failures** | Centralized `AuditLog` model tracks significant domain events (`order_created`, status shifts); Winston logger tracks exceptions with `requestId`. | [Partial] | [backend/src/services/AuditService.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/services/AuditService.js)<br>[backend/src/utils/logger.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/utils/logger.js) |
| **A10:2021 — Server-Side Request Forgery (SSRF)** | No user-supplied URLs or webhooks are fetched by the backend service. | [Implemented] | Verified across all route handlers in `backend/src/routes/` |

---

### E. Real-Time & Telemetry Security (Socket.io)

- **Handshake Authentication**: The WebSocket gateway requires a valid JWT in `socket.handshake.auth.token` or query string during connection negotiation. Unauthenticated handshakes are rejected with an error ([backend/src/socket/index.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/socket/index.js#L10-L31)).
- **User Channel Segregation**: Users join a personal room `user_<id>` upon connection to receive direct targeted events without broadcast leakage.
- **GPS Privacy Analysis**:
  - Telemetry is transferred over the `update_location` event payload containing `{ orderId, latitude, longitude, heading }`.
  - Current implementation relays exact floating-point coordinates to `order_<orderId>` subscribers.
  - *Identified Telemetry Weakness*: Coordinates are transmitted with full precision without coordinate truncation/fuzzing. Additionally, `join_order` does not currently verify whether the joining socket belongs to a party authorized for that order.

---

### F. Payment Processing & PCI DSS Scope

- **Zero Cardholder Data Retention**: The Zenvy database schema strictly excludes Primary Account Numbers (PAN), expiration dates, and Card Verification Values (CVV). Neither Sequelize models nor migrations contain cardholder storage columns ([backend/src/models/Order.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/models/Order.js), [backend/src/models/Transaction.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/models/Transaction.js)).
- **PCI DSS Scope Reduction**: Because no cardholder data is transmitted, processed, or stored on Zenvy servers, Zenvy operates completely outside the scope of PCI DSS SAQ D, relying on Cash on Delivery (`cash_on_delivery`) and mock external gateway references (`reference_id`).
- **PII Logging Controls**: Global socket event logging (`socket.onAny`) was removed in [mobile/src/realtime/socket.ts](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/mobile/src/realtime/socket.ts#L45-L46) to prevent accidental logging of client location or order payload PII to mobile device logs.

---

### G. API & Infrastructure Security

- **Input Validation**: Request bodies and parameters are validated using `express-validator` chains checking email formats, password lengths, and numeric IDs ([backend/src/middleware/validator.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/middleware/validator.js)).
- **HTTP Security Headers**: `helmet()` is initialized in [backend/src/app.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/app.js#L24-L26) to manage `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and strict referrer policies.
- **Cross-Origin Resource Sharing (CORS)**: Configured in `app.js` using an origin validator rejecting wildcards when credentials are true, matching against `CORS_ORIGIN`.
- **Rate Limiting**: `express-rate-limit` is configured with namespace keys (`user:<id>` for authenticated requests and `ip:<ip>` as fallback) in [backend/src/middleware/rateLimiter.js](file:///C:/Users/dell/OneDrive/Documents/zenvy-delivery-app/backend/src/middleware/rateLimiter.js).
- **Reverse Proxy Support**: Configurable proxy trust via `TRUST_PROXY_HOPS` environment variable to ensure rate limiting correctly parses client IPs behind reverse proxies.
- **Docker Isolation**: `docker-compose.yml` provides containerized PostgreSQL and backend service isolation.

---

### H. Prioritized Hardening Roadmap

- [ ] **P1: Restrict Registration Role Assignment**: Hardcode default role to `customer` in `AuthController.register`; merchant and courier roles must require administrative approval or separate onboarding endpoints.
- [ ] **P1: Authorize Socket.io Room Subscriptions**: Validate that `socket.user.id` matches `order.userId`, `order.deliveryPersonId`, or store owner before allowing `socket.join('order_' + orderId)`.
- [ ] **P1: Validate Courier Telemetry Emitter**: Verify sender is the assigned courier for `orderId` before broadcasting in `update_location`.
- [ ] **P2: Mount Specialized Rate Limiters**: Mount `authLimiter` to `/api/v1/auth/login` and `/register`, and `orderLimiter` to `POST /api/v1/orders`.
- [ ] **P2: Migrate Mobile Storage to SecureStore**: Replace `@react-native-async-storage/async-storage` with `expo-secure-store` to encrypt JWTs in iOS Keychain / Android Keystore.
- [ ] **P2: Socket.io CORS Hardening**: Replace `origin: '*'` in `src/server.js` with the explicit origin whitelist defined in `config.cors.origin`.
- [ ] **P3: Token Revocation & Refresh Rotation**: Implement Redis-backed token denylisting for logout and separate short-lived access tokens (15m) with rotating refresh tokens (7d).
- [ ] **P3: Telemetry Precision Fuzzing**: Truncate courier GPS coordinates to 3 decimal places (~110m accuracy) when broadcasting to customers until courier is within 500m of the delivery location.

---

### I. Known Limitations

1. **Role Mass Assignment in Registration**: `POST /api/v1/auth/register` assigns `role: req.body.role || 'customer'`. A client can submit `role: 'admin'` or `'merchant'` during signup and gain elevated privileges.
2. **Unchecked Socket Room Joining**: In `backend/src/socket/index.js`, the `join_order` listener allows any authenticated user to join any `order_<id>` room by guessing or iterating order IDs.
3. **Unvalidated Location Spoofing**: In `backend/src/socket/index.js`, `update_location` does not assert that `socket.user.id === order.deliveryPersonId`. Any connected user can emit fake location data for any order.
4. **Unencrypted Mobile Token Storage**: `mobile/src/shared/utils/storage.ts` stores the JWT token in unencrypted `AsyncStorage`, which is readable on rooted or compromised physical devices.
5. **Dormant Specialized Rate Limiters**: `authLimiter`, `orderLimiter`, and `courierAcceptLimiter` are declared in `rateLimiter.js` but were not mounted in route files. Only the global `apiLimiter` is active.
6. **Hardcoded Docker Dev Secrets**: `docker-compose.yml` includes default development secrets (`zenyy-super-secret-jwt-key-2026`) that must never be used in a shared or hosted environment.
7. **Orphaned Controller Files**: `backend/src/controllers/auth.controller.js` and `store.controller.js` are unused legacy files preserved alongside active capitalized controllers (`AuthController.js`, `StoreController.js`).

---

## Quick Start & Local Execution

Follow these steps to run the complete Zenvy platform locally.

### Prerequisites
- **Node.js**: v18.x or v20.x LTS installed
- **PostgreSQL**: v14+ running locally (or via Docker Compose)
- **Mobile Testing**: Expo Go installed on your physical mobile device (Android/iOS) or an emulator

### 1. Database & Backend Setup

```bash
# Clone the repository
git clone https://github.com/ali-harti/zenvy-delivery-app.git
cd zenvy-delivery-app/backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your local PostgreSQL credentials (DB_USER, DB_PASSWORD, DB_NAME)

# Initialize database schema and seeds
npm run db:reset

# Start the development server
npm run dev
```

*The backend server will start on `http://localhost:5000` (or the configured `PORT`).*

### 2. Mobile Client Setup (Expo)

```bash
# In a new terminal window, navigate to mobile/
cd zenvy-delivery-app/mobile

# Install dependencies
npm install

# Configure environment variables (if testing on physical device, use LAN IP)
# Example: EXPO_PUBLIC_API_URL=http://192.168.1.XX:5000/api/v1
#          EXPO_PUBLIC_SOCKET_URL=http://192.168.1.XX:5000

# Start Expo development server
npx expo start
```

*Scan the generated QR code using the Expo Go app on your phone, or press `a` for Android Emulator / `i` for iOS Simulator.*

### 3. Automated Backend Tests

```bash
cd zenvy-delivery-app/backend

# Run the comprehensive integration test suite
npm test
```

*The test runner (`tests/run-all-tests.js`) validates health checks, registration, authentication, catalog discovery, cart persistence, order creation, and courier delivery lifecycle.*

---

## Environment Variables Reference

| Variable Name | Component | Purpose | Recommended Placeholder |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | HTTP/WebSocket server listening port | `5000` |
| `NODE_ENV` | Backend | Runtime environment (`development`, `test`, `production`) | `development` |
| `API_VERSION` | Backend | URL version prefix for routes | `v1` |
| `TRUST_PROXY_HOPS` | Backend | Number of reverse proxy hops to trust for IP resolution | `1` |
| `DB_HOST` | Backend | PostgreSQL database server hostname | `localhost` |
| `DB_PORT` | Backend | PostgreSQL server port | `5432` |
| `DB_USER` | Backend | PostgreSQL database user | `postgres` |
| `DB_PASSWORD` | Backend | PostgreSQL user password | `your_secure_db_password` |
| `DB_NAME` | Backend | PostgreSQL database name | `zenvy_db` |
| `DB_DIALECT` | Backend | Sequelize database dialect | `postgres` |
| `DATABASE_URL` | Backend | Full database connection string | `postgresql://postgres:pwd@localhost:5432/zenvy_db` |
| `JWT_SECRET` | Backend | Secret key used to sign and verify HMAC-SHA256 JWTs | `min_32_character_random_hex_string` |
| `JWT_EXPIRATION` | Backend | Access token lifetime before expiry | `24h` |
| `JWT_REFRESH_EXPIRATION` | Backend | Refresh token lifetime | `7d` |
| `BCRYPT_ROUNDS` | Backend | Cost factor for bcrypt salt generation | `10` |
| `CORS_ORIGIN` | Backend | Comma-separated list of permitted web origins | `http://localhost:3000,http://localhost:19006` |
| `SOCKET_IO_CORS_ORIGIN` | Backend | CORS origin configuration for Socket.io | `http://localhost:3000` |
| `GOOGLE_MAPS_KEY` | Backend/Mobile | Google Maps SDK API key for reverse geocoding | `your_google_maps_api_key_here` |
| `EXPO_PUBLIC_API_URL` | Mobile | Base REST API URL for mobile client requests | `http://localhost:5000/api/v1` |
| `EXPO_PUBLIC_SOCKET_URL` | Mobile | Base WebSocket URL for real-time tracking | `http://localhost:5000` |

---

## Technology Stack

| Domain | Technology | Version | Purpose & Description |
| :--- | :--- | :--- | :--- |
| **Mobile Runtime** | React Native / Expo | `0.81.5` / `SDK 54` | Cross-platform mobile architecture with managed native modules |
| **Mobile UI & Styling** | React Native Paper | `^5.15.0` | Material Design UI component kit with standardized theming |
| **State & Querying** | TanStack React Query / Zustand | `^5.90.20` / `^5.0.11` | Server-state caching, invalidation, and client session stores |
| **Backend Runtime** | Node.js / Express | `v18+` / `^4.18.2` | RESTful API routing, middleware chaining, and controller handlers |
| **Database & ORM** | PostgreSQL / Sequelize | `15` / `^6.32.1` | Relational ACID database with row-level locks and migrations |
| **Real-Time Gateway** | Socket.io | `^4.8.3` | Low-latency bi-directional WebSocket messaging and room routing |
| **Security & Auth** | jsonwebtoken / bcryptjs / Helmet | `^9.0.2` / `^2.4.3` / `^7.0.0` | JWT validation, password hashing, and HTTP response header protection |
| **Validation & Limits** | express-validator / express-rate-limit | `^7.0.1` / `^8.2.1` | Request parameter sanitation and IP/User rate limiting |
| **Logging & Telemetry** | Winston / Morgan | `^3.19.0` / `^1.10.0` | Structured JSON application logging with request ID correlation |
| **Testing** | Node.js Axios Integration Runner | Custom / Axios | End-to-end multi-role HTTP flow verification |

---

## Project Directory Structure

```text
zenvy-delivery-app/
├── .env.example                     # Project-level environment template
├── .gitignore                       # Git ignore rules (includes media/videos)
├── docker-compose.yml               # PostgreSQL & Backend container setup
├── package.json                     # Root scripts & metadata
├── README.md                        # Portfolio documentation & security analysis
├── SECURITY.md                      # Vulnerability reporting policy & scope
├── docs/
│   ├── linkedin/                    # 1200x627 LinkedIn showcase composites
│   │   ├── linkedin-customer.png
│   │   ├── linkedin-courier.png
│   │   └── linkedin-merchant.png
│   └── screenshots/                 # Extracted high-res mobile screen captures
│       ├── courier-active-delivery.png
│       ├── courier-earnings.png
│       ├── courier-orders.png
│       ├── courier-shift.png
│       ├── customer-cart.png
│       ├── customer-checkout.png
│       ├── customer-home.png
│       ├── customer-menu.png
│       ├── customer-tracking.png
│       ├── merchant-dashboard.png
│       ├── merchant-orders.png
│       └── merchant-products.png
├── backend/
│   ├── .env.example                 # Backend environment variable template
│   ├── package.json                 # Backend dependencies & lifecycle scripts
│   ├── jest.config.json             # Jest test runner configuration
│   ├── migrations/                  # Sequelize database migration files
│   ├── seeds/                       # Database seed scripts (mock data)
│   ├── src/
│   │   ├── app.js                   # Express application setup, security middleware, CORS
│   │   ├── server.js                # HTTP & Socket.io server bootstrap
│   │   ├── config/                  # DB, JWT, and rate limit configuration
│   │   ├── controllers/             # AuthController, OrderController, CartController, etc.
│   │   ├── middleware/              # auth.js (JWT/RBAC), rateLimiter.js, validator.js
│   │   ├── models/                  # Sequelize ORM definitions (User, Order, Store, Cart)
│   │   ├── routes/                  # REST route declarations (/auth, /orders, /delivery)
│   │   ├── services/                # OrderService, DeliveryService, stateMachine.js
│   │   ├── socket/                  # Socket.io connection middleware & event handlers
│   │   └── utils/                   # JWT helpers, response formatters, Winston logger
│   └── tests/                       # Integration tests & run-all-tests.js test runner
└── mobile/
    ├── app.json                     # Expo configuration manifest
    ├── package.json                 # React Native & Expo dependencies
    ├── tsconfig.json                # TypeScript compiler configuration
    └── src/
        ├── api/                     # Axios client, interceptors, API endpoints
        ├── auth/                    # Login, Register, Welcome screens & store
        ├── customer/                # Customer HomeScreen, StoreDetail, Cart, Tracking
        ├── courier/                 # Courier Shift, ActiveDelivery, Orders, Earnings
        ├── merchant/                # Merchant Dashboard, Orders, Products/Menu
        ├── navigation/              # React Navigation stacks & bottom tabs
        ├── realtime/                # Socket.io client instance & event listeners
        ├── shared/                  # Common components, safe screens, storage
        └── theme/                   # Palette tokens, typography, and spacing
```

---

## License & Attribution

This project is open-source software licensed under the **[MIT License](LICENSE)**.

**Developed by Ali Harti** — *Software Engineer*
- GitHub: [@ali-harti](https://github.com/ali-harti)
