# Final Implementation Blueprint — Item Rental System

This document serves as the final, complete MVP implementation guide for the Item Rental System. It compiles structural designs, directory trees, system architectures, data flows, deployment targets, CI/CD pipeline code, testing strategies, and a production readiness checklist.

This guide maps directly back to the [software_requirements_specification.md](file:///E:/UserFiles/Desktop/hackthon/software_requirements_specification.md), uses the [user_stories.md](file:///E:/UserFiles/Desktop/hackthon/user_stories.md) backlogs, implements the [database_design.md](file:///E:/UserFiles/Desktop/hackthon/database_design.md) schema, aligns with the [api_documentation.md](file:///E:/UserFiles/Desktop/hackthon/api_documentation.md) endpoints, references the [use_cases.md](file:///E:/UserFiles/Desktop/hackthon/use_cases.md) specifications, and respects the [wireframes.md](file:///E:/UserFiles/Desktop/hackthon/wireframes.md) design system.

---

## 1. System Folder Structure

The application is organized as a monorepo containing the frontend client (`apps/frontend`) and the backend REST API (`apps/backend`), facilitating simple dockerization and dependency sharing.

```
item-rental-system/
├── apps/
│   ├── frontend/                 # Next.js (App Router, TypeScript)
│   │   ├── public/               # Static assets (logos, icons)
│   │   └── src/
│   │       ├── app/              # Next.js page routing
│   │       │   ├── [locale]/     # i18n locale routing folder (en/ar)
│   │       │   │   ├── auth/     # Login and register views
│   │       │   │   ├── listings/ # Detail page and listing creation
│   │       │   │   ├── search/   # Filtering results views
│   │       │   │   ├── dashboard/# Dashboards for renters, owners, admins
│   │       │   │   └── page.tsx  # Landing page
│   │       │   └── layout.tsx    # Root layout with lang HTML toggles
│   │       ├── components/       # Reusable layout and form widgets
│   │       │   ├── ui/           # Buttons, inputs, modals (Tailwind styled)
│   │       │   └── i18n/         # Language toggles and RTL helpers
│   │       ├── context/          # Auth context and theme providers
│   │       ├── hooks/            # Search hooks and Stripe client wrappers
│   │       ├── services/         # Axios wrapper connecting to backend API
│   │       └── i18n/             # Translations: en.json, ar.json
│   │
│   └── backend/                  # NestJS Modular REST API
│       ├── prisma/
│       │   ├── schema.prisma     # Prisma database schema definition
│       │   └── seed.ts           # Roles and category seed data
│       └── src/
│           ├── common/           # NestJS guards, interceptors, filters
│           │   ├── guards/       # JwtAuthGuard, VerificationGuard, RolesGuard
│           │   ├── interceptors/ # AuditLogInterceptor, LocalizedResponse
│           │   └── filters/      # GlobalExceptionFilter (custom EHR handler)
│           ├── modules/          # Business module definitions
│           │   ├── auth/         # Register, Login (JWT generation)
│           │   ├── verifications/# Owner ID upload review endpoints
│           │   ├── listings/     # CRUD listing actions, blockout calendars
│           │   ├── bookings/     # Booking requests, approval flow, overlap checks
│           │   ├── payments/     # Stripe gateways, cash-on-pickup logs
│           │   ├── deposits/     # Separate ledgers, release scheduler
│           │   ├── reviews/      # Renter/Owner feedback submission
│           │   ├── damage/       # Incident filings and deduction approvals
│           │   ├── analytics/    # Admin operational metrics queries
│           │   └── audit/        # Immutable audit logging services
│           └── main.ts           # Bootloader entrypoint (CORS, validation pipes)
│
├── docker/                       # Deploy scripts
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
└── README.md
```

---

## 2. Core Architectural Structures

### Frontend Architecture
*   **Framework**: Next.js App Router (14+) utilizing Server Components for performance and Client Components for form wizard states.
*   **Styling**: Vanilla TailwindCSS using variables mapped to standard LTR and RTL styling grids (e.g. `rtl:flex-row-reverse`, `rtl:space-x-reverse`).
*   **State Management**: React Context API for global `AuthContext` (JWT session management) and user language selectors.
*   **Localization**: `next-intl` or equivalent context middleware routing requests based on url segments (e.g. `/ar/search` or `/en/search`), modifying the root HTML `dir` attribute to `rtl` or `ltr`.

### Backend Architecture
*   **Framework**: NestJS enforcing strict domain modular isolation.
*   **Data Access**: Prisma ORM maps database schemas to TypeScript models.
*   **Security & Guarding**: NestJS AuthGuards intercept request packets to extract and evaluate JWT headers:
    1.  `JwtAuthGuard`: Confirms token validity.
    2.  `RolesGuard`: Verifies role permission mappings.
    3.  `VerificationGuard`: Restricts active listing capabilities unless Owner verification status is `Approved`.
*   **Audit Interceptor**: A global NestJS interceptor intercepts target controller operations (e.g., listing status resolve, payment callbacks, damage filing) and logs details to the `audit_logs` table asynchronously.

---

## 3. Workflow Implementation Sequences

### 3.1 Authentication Flow
```
Client (Guest)              NestJS Server (Auth)            PostgreSQL DB
      |                             |                             |
      |--- 1. POST /auth/register ->|                             |
      |    (validates inputs)       |--- 2. Hash Password ------->|
      |                             |<-- 3. Save User Record -----|
      |<-- 4. HTTP 201 Created -----|                             |
      |                             |                             |
      |--- 5. POST /auth/login ---->|                             |
      |    (raw credentials)        |--- 6. Query email --------->|
      |                             |<-- 7. Returns hash ---------|
      |                             |    (verify match)           |
      |<-- 8. Return JWT token -----|                             |
```

### 3.2 Owner Verification Flow
```
Client (Owner)              NestJS Controller           Cloudinary           Admin Portal
      |                             |                        |                    |
      |--- 1. POST /verification -->|                        |                    |
      |    (uploads ID image)       |--- 2. Save ID image -->|                    |
      |                             |<-- 3. Secure URL ------|                    |
      |                             |--- 4. Create request ---------------------->|
      |<-- 5. HTTP 202 Accepted ----|    (status: Pending)   |                    |
      |                             |                        |                    |
      |                             |    (Admin Resolution)  |                    |
      |                             |<-- 6. POST /resolve ------------------------|
      |                             |    (Approve / Reject)  |                    |
      |                             |--- 7. Update status ----------------------->|
      |                             |    (saves to DB)       |                    |
```

### 3.3 Listings Flow
```
Client (Owner)              NestJS Controller           Prisma ORM            PostgreSQL DB
      |                             |                        |                      |
      |--- 1. POST /listings ------>|                        |                      |
      |    (validates input formats)|--- 2. Check verify --->|                      |
      |                             |<-- 3. Approved status -|                      |
      |                             |--- 4. Save listing (Pending Approval) ------->|
      |<-- 5. HTTP 201 Created -----|                        |                      |
```

### 3.4 Booking Flow
```
Client (Renter)             NestJS Controller           Prisma ORM            PostgreSQL DB
      |                             |                        |                      |
      |--- 1. POST /bookings ------>|                        |                      |
      |    (Date range request)     |--- 2. Start Transaction|                      |
      |                             |--- 3. Check overlaps ------------------------>|
      |                             |<-- 4. No overlap found |                      |
      |                             |--- 5. Create Booking (Pending) -------------->|
      |                             |--- 6. Block calendar range ------------------>|
      |                             |--- 7. Commit Transaction                      |
      |<-- 8. HTTP 201 Created -----|                        |                      |
```
*Note: The booking transaction uses PostgreSQL exclusion constraints (`exclude_booking_overlaps`) to prevent concurrent race conditions at the database layer.*

### 3.5 Payment Flow
```
Client (Renter)             NestJS Controller           Stripe Gateway        PostgreSQL DB
      |                             |                        |                      |
      |--- 1. POST /pay ------------|                        |                      |
      |    (paymentMethod)          |--- 2. Create Intent -->|                      |
      |                             |<-- 3. Client Secret ---|                      |
      |<-- 4. Return Client Secret -|                        |                      |
      |                             |                        |                      |
      |    (Stripe webhook callback)|                        |                      |
      |    (payment_intent.succeeded)----------------------->|                      |
      |                             |--- 5. Save payment -------------------------->|
      |                             |    (Status: Paid)      |                      |
      |                             |--- 6. Ledger deposit ------------------------>|
      |                             |    (Status: Authorized)|                      |
```

### 3.6 Damage Flow
```
Client (Owner)              NestJS Controller           PostgreSQL DB         Deposit Service
      |                             |                        |                      |
      |--- 1. POST /damage-reports->|                        |                      |
      |    (photo evidence, sum)    |--- 2. Validate booking |                      |
      |                             |    (returned < 48h)    |                      |
      |                             |--- 3. Save report (Submitted) -------------->|
      |                             |--- 4. Halt release ----|-------------------->|
      |<-- 5. HTTP 201 Created -----|                        |                      |
```

### 3.7 Review Flow
```
Client (Renter)             NestJS Controller           PostgreSQL DB
      |                             |                        |
      |--- 1. POST /reviews ------->|                        |
      |    (stars, comments)        |--- 2. Check bookings --|
      |                             |    (status: Returned)  |
      |                             |--- 3. Check duplicates |
      |                             |    (unique constraint) |
      |                             |--- 4. Save review ---->|
      |<-- 5. HTTP 201 Created -----|                        |
```

---

## 4. Deployment Plan

The MVP is deployed using a multi-node architecture utilizing managed cloud services to minimize configuration overhead.

```
                  [ Client Web App (Next.js) ] (Vercel)
                                |
                                v
             [ Backend Api Gateway (NestJS Monolith) ] (Render / ECS)
                 /              |              \
                v               v               v
    [ Managed PostgreSQL ]  [ Cloudinary ]  [ Stripe Gateway ]
     (Supabase / RDS)       (Asset Storage)  (Credit Cards)
```

*   **Frontend**: Hosted on Vercel. Next.js App Router utilizes edge network caches.
*   **Backend REST API**: Hosted on Render or AWS ECS Fargate, scaling horizontally based on request throughput (NFR-008).
*   **Database**: Managed PostgreSQL hosted on AWS RDS or Supabase, configured with automated daily backups (NFR-009).
*   **Storage**: Cloudinary handles secure upload streams.
*   **Secrets**: Deployed containers receive encrypted environment variables injected at runtime; secrets must not be committed to code repositories.

---

## 5. Testing Plan

The testing matrix verifies that all functionality operates predictably in staging before deployment.

### 5.1 Test Levels
*   **Unit Tests**: Validate isolated services (e.g. pricing calculations, validation regexes).
*   **Integration Tests**: Target database interactions via Prisma and controller-to-service routing using Jest and Supertest.
*   **E2E Tests**: Test critical flows (e.g. double-booking locks, Stripe webhook integrations, language swaps) using Cypress.

### 5.2 Critical E2E Test Cases (DoD Validation)
1.  **Booking Race Condition Test**: Spawn 10 simultaneous threads attempting to book the same item on identical overlapping dates. Assert that exactly 1 request completes with status `HTTP 201 Created` and `Pending` status, while the remaining 9 return `HTTP 400 Bad Request` with date conflict errors (EHR-005).
2.  **Unverified Owner Action Block Test**: Attempt listing creation using an Owner account whose verification status is `Pending`. Assert that the NestJS router intercepts the call and returns `HTTP 403 Forbidden` (BR-001).

---

## 6. CI/CD Pipeline Configuration

Create a GitHub Actions workflow configuration saved under `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, staging ]
  pull_request:
    branches: [ main, staging ]

jobs:
  validate-and-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: item_rental_test
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-node: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run ESLint & Code Formatting Checks
        run: |
          npm run lint --workspace=apps/frontend
          npm run lint --workspace=apps/backend

      - name: Run Prisma Migrations
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/item_rental_test
        run: npx prisma migrate deploy --schema=apps/backend/prisma/schema.prisma

      - name: Run Backend Unit & Integration Tests
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/item_rental_test
          JWT_SECRET: test_jwt_secret_key_12345
        run: npm run test --workspace=apps/backend

      - name: Build Code Artifacts
        run: |
          npm run build --workspace=apps/frontend
          npm run build --workspace=apps/backend

  deploy-staging:
    needs: validate-and-test
    if: github.ref == 'refs/heads/staging' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Staging Deploy
        run: curl -X POST -d {} ${{ secrets.RENDER_DEPLOY_HOOK_STAGING }}
```

---

## 7. Production Readiness Checklist

Before moving code to production, the operations team must verify:

- [ ] **SSL/TLS Enforced**: SSL configuration validates TLS 1.3 only; HTTP redirects to HTTPS on all API gateways.
- [ ] **Environment Variables Loaded**: Verify that database credentials, JWT secrets, Stripe secrets, Cloudinary tokens, and webhook secrets are loaded securely from platform environment variables.
- [ ] **Prisma Database Index Check**: Run query planner verification checking that indices exist for `listings(owner_id, category_id, status)` and `bookings(renter_id, listing_id, status)`.
- [ ] **Exclusion Constraint Active**: Verify the `exclude_booking_overlaps` constraint compiles on PostgreSQL.
- [ ] **Audit Log Immutability**: Verify that database rules intercepting and blocking updates/deletes on `audit_logs` are active and throw database errors.
- [ ] **Rate Limiting Implemented**: Verify backend rate-limiting middleware is enabled (e.g. max 100 API calls per minute per IP, max 5 login requests per minute).
- [ ] **i18n Coverage**: Validate RTL/LTR layout changes on viewports down to 320px width.
- [ ] **File Size Validation**: Verify client-side and server-side interceptors block files over 5MB (photos) or 10MB (IDs).
