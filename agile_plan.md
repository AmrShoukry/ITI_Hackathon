# Agile Sprint Plan — Item Rental System

This document outlines the 4-Sprint Agile Plan for the Item Rental System. The project spans 8 weeks (2 weeks per sprint), commencing on **June 9, 2026**, and concluding on **August 4, 2026**.

This plan is based on the [software_requirements_specification.md](file:///E:/UserFiles/Desktop/hackthon/software_requirements_specification.md), uses the [user_stories.md](file:///E:/UserFiles/Desktop/hackthon/user_stories.md) backlog, aligns with the [database_design.md](file:///E:/UserFiles/Desktop/hackthon/database_design.md), integrates with the [api_documentation.md](file:///E:/UserFiles/Desktop/hackthon/api_documentation.md), and implements the visual specs of [wireframes.md](file:///E:/UserFiles/Desktop/hackthon/wireframes.md).

---

## Project Timeline Overview

```
+---------------------------------------------------------------------------------------+
|  Sprint 1: Auth & Verification      |  Sprint 2: Listings & Search                     |
|  (June 9 - June 23, 2026)          |  (June 23 - July 7, 2026)                        |
+------------------------------------+--------------------------------------------------+
|  Sprint 3: Booking & Payments       |  Sprint 4: Reviews, Damage & Analytics           |
|  (July 7 - July 21, 2026)          |  (July 21 - August 4, 2026)                      |
+---------------------------------------------------------------------------------------+
```

---

## Definition of Done (DoD) — Applied to All Sprints
For any user story to be marked as "Done", it must satisfy:
1.  **Code Quality**: Peer reviewed, formatted, and linted without errors. Strictly typed using TypeScript.
2.  **Database**: Migrations are written via Prisma and successfully applied to PostgreSQL.
3.  **Testing**: Unit tests pass (minimum 80% coverage). Integration tests pass. E2E critical path flows pass.
4.  **Localization**: Translation keys exist in both English and Arabic JSON files; RTL rendering is validated.
5.  **Audit Logs**: Security-relevant actions are verified to trigger immutable database audit log rows.
6.  **Deployment**: Deployed and tested on the staging environment.

---

## Sprint 1: Authentication & Verification
*   **Timeline**: June 9 – June 23, 2026 (14 Days)
*   **Goal**: Establish a secure, localized user registration, login framework, and verification request pipeline for Owners.

### Mapped User Stories
*   `US-001`: Renter and Owner Registration (5 SP)
*   `US-002`: JWT-Based Login (3 SP)
*   `US-003`: User Profile & Language Preference Switcher (5 SP)
*   `US-004`: User Logout (1 SP)
*   `US-005`: Upload National ID & Submit Verification Request (5 SP)
*   `US-006`: Verification Governance & Restriction Enforcement (5 SP)
*   `US-024`: Admin Verification Review (5 SP)
*   **Total Story Points**: 29 SP

### Backlog Tasks
1.  **Database Setup**: Initialize PostgreSQL database, run initial Prisma migration creating `roles`, `permissions`, `role_permissions`, `users`, and `owner_verifications` tables. Seed roles (Guest, Renter, Owner, Admin) (3 days).
2.  **Backend Auth Service**: Implement JWT registration, login, logout, password hashing (bcrypt), and profile endpoints in NestJS (3 days).
3.  **Owner Verification API**: Implement National ID document file upload endpoint integrating Cloudinary storage (2 days).
4.  **Admin Verification Controls**: Build verification queues and resolution endpoint (`POST /api/admin/verifications/:id/resolve`) (2 days).
5.  **Frontend Auth & Profile Pages**: Build Register, Login, and Profile views in Next.js. Implement i18n translation catalogs and layout mirror direction toggling (RTL/LTR) (3 days).
6.  **Identity Guarding**: Configure backend NestJS Route Guards enforcing RBAC permissions based on verification status (1 day).

### Dependencies
*   Cloudinary credentials must be configured for image uploads.
*   Prisma schema must compile before starting backend service development.

### Deliverables
*   Fully functional registration, login, and profile pages.
*   Secure identity upload forms.
*   Admin dashboard showing verification queues.
*   Database seed file.

### Testing Plan
*   **Unit Testing**: Jest tests for auth controller, password checking, and verification status state machine.
*   **Integration Testing**: Verify image uploads map to Cloudinary and return valid secure URLs.
*   **E2E Testing**: Cypress tests confirming registration -> email format validation checks -> login session creation -> uploading National ID -> Admin approval -> lifting listing restrictions.

---

## Sprint 2: Listings & Search
*   **Timeline**: June 23 – July 7, 2026 (14 Days)
*   **Goal**: Enable verified Owners to manage item availability and allow Renters to search, filter, and inspect listings.

### Mapped User Stories
*   `US-007`: Listing Creation (8 SP)
*   `US-008`: Edit Listing and Re-moderation (5 SP)
*   `US-009`: Listing Deletion (3 SP)
*   `US-010`: Listing Availability & Personal Blockouts (5 SP)
*   `US-011`: Public Listing Search & Filtering (8 SP)
*   `US-012`: Listing Details Page (5 SP)
*   `US-013`: Guest Access Controls (3 SP)
*   `US-025`: Listing Moderation Queue (5 SP)
*   **Total Story Points**: 42 SP

### Backlog Tasks
1.  **Database Migration**: Apply Prisma migrations creating `categories`, `listings`, `listing_photos`, and `availability` tables (1 day).
2.  **Listing API**: Build NestJS CRUD endpoints for listings, listing photos, and calendar availability blocks (3 days).
3.  **Search Index & API**: Write SQL indexes for full-text search and implement `GET /api/search` with filters (2 days).
4.  **Admin Moderation API**: Build resolution endpoint (`POST /api/admin/listings/:id/resolve`) (1 day).
5.  **Frontend Listing Creator & Editor**: Build Create Listing and Edit Listing forms with file dropzones (3 days).
6.  **Frontend Marketplace Views**: Build Home page, Search results grid with filters sidebar, and Item Details page with photo carousel (3 days).
7.  **Auth Interceptor Integration**: Integrate frontend interceptor blocking Guests from listing creation or booking clicks (1 day).

### Dependencies
*   Sprint 1 user authentication and verification roles must be fully operational.

### Deliverables
*   Marketplace Home and Search pages.
*   Listing creation forms.
*   Calendar dates blockout controls for Owners.
*   Admin moderation dashboard.

### Testing Plan
*   **Unit Testing**: Mock category classifications and test string length boundaries on listings.
*   **Integration Testing**: Verify listing update APIs correctly change listing status to `Pending Approval` for moderation re-queuing.
*   **E2E Testing**: Verify search keyword queries return matching results; check that filtering by price bounds or condition enums narrows results; verify unverified owners receive HTTP 403 when trying to save listings.

---

## Sprint 3: Booking & Payments
*   **Timeline**: July 7 – July 21, 2026 (14 Days)
*   **Goal**: Implement rental reservation workflows, online card transactions, cash tracking, and separate security deposit ledger reconciliations.

### Mapped User Stories
*   `US-014`: Booking Request & Date Validation (8 SP)
*   `US-015`: Booking Decisions (Owner approval/rejection) (5 SP)
*   `US-016`: Booking Cancellation (3 SP)
*   `US-017`: Rental Handover and Return (5 SP)
*   `US-018`: Online Payment & Checkout (8 SP)
*   `US-019`: Cash on Pickup Payment Tracking (3 SP)
*   `US-020`: Deposit Isolation & Ledgers (8 SP)
*   `US-021`: Deposit Release & Deduction Execution (8 SP)
*   `US-026`: Admin Policy and Category Settings (5 SP)
*   **Total Story Points**: 56 SP

### Backlog Tasks
1.  **Database Migration**: Apply Prisma migrations creating `bookings`, `payments`, and `deposits` tables. Apply PostgreSQL **Exclusion Overlap Constraint** for booking double-locks (2 days).
2.  **Booking Service**: Build booking request creations using SQL transactions to prevent race conditions. Build approval, handover, return, and cancellation endpoints (3 days).
3.  **Payment Gateway Integration**: Integrate Stripe payment intent creation and callback webhooks. Build cash-on-pickup confirm API (3 days).
4.  **Deposit Ledger Service**: Implement automated 48-hour release cron job and isolated database ledger adjustments (2 days).
5.  **Frontend Checkout Wizard**: Build Booking flow calendar, invoice receipt displays, and credit card input components (3 days).
6.  **Dashboards**: Build Renter and Owner dashboards showcasing booking list feeds and statuses (1 day).

### Dependencies
*   Stripe Developer Account/sandbox keys.
*   Sprint 2 Listings Availability structures.

### Deliverables
*   Transactional Renter/Owner dashboards.
*   Credit card checkout widgets.
*   Exclusion constraint overlap locks in database.
*   Chron jobs for automatic deposit release.

### Testing Plan
*   **Unit Testing**: Test transaction rollback behavior when payment callbacks return failed status.
*   **Integration Testing**: Simulate concurrent bookings for identical listings and verify the PostgreSQL EXCLUDE constraint throws exceptions on duplicates.
*   **E2E Testing**: Perform Stripe sandbox transaction -> check that `DepositLedger` logs correct deposit amounts separately -> confirm pickup -> confirm return -> verify deposit is returned.

---

## Sprint 4: Reviews, Damage & Analytics
*   **Timeline**: July 21 – August 4, 2026 (14 Days)
*   **Goal**: Deliver review loops, dispute/damage filing forms, operational analytics graphs, and immutable logs.

### Mapped User Stories
*   `US-022`: Renter-Owner Feedback Loop (5 SP)
*   `US-023`: File Damage Report (8 SP)
*   `US-027`: Immutable Audit Log Review (5 SP)
*   `US-028`: Admin Operations Analytics Dashboard (8 SP)
*   **Total Story Points**: 26 SP

### Backlog Tasks
1.  **Database Migration**: Apply Prisma migrations creating `damage_reports`, `reviews`, `admin_settings`, and `audit_logs` tables. Enforce database rules blocking `UPDATE` or `DELETE` operations on audit logs (2 days).
2.  **Reviews API**: Build review submission endpoints enforcing the single review per role constraint (1 day).
3.  **Damage Report Service**: Build damage report filing, linking to booking and renter records, suspending deposit releases (2 days).
4.  **Analytics Service**: Implement SQL aggregations computing active rentals, revenue splits (online vs cash), verification queues, and top items (2 days).
5.  **Frontend Dashboard Widgets**: Build damage evidence upload forms, rating forms (1–5 stars), and the Admin Analytics KPI/Chart views (4 days).
6.  **Audit Log Logger**: Configure NestJS global interceptor logging logins, verifications, bookings, and damage filings to database (3 days).

### Dependencies
*   Sprint 3 booking completion and returned status transitions.

### Deliverables
*   Admin Analytics dashboard with graphical reports.
*   Damage reporting portals.
*   Immutable audit trail logs.
*   Public renter/owner review widgets.

### Testing Plan
*   **Unit Testing**: Verify review API returns HTTP 400 when attempting to submit prior to booking status transitioning to `Returned`.
*   **Integration Testing**: Verify SQL queries blocking update/delete commands on audit logs throw errors.
*   **E2E Testing**: File a damage report -> verify the deposit refund is halted -> review the report details on the Admin dashboard -> check that the action is recorded in the Audit log.
