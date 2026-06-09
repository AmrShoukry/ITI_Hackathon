# Software Requirements Specification (SRS) — Item Rental System

This document outlines the complete Software Requirements Specification (SRS) for the Item Rental System, bridging the high-level business vision outlined in [VISION_DOCUMENT.md](file:///E:/UserFiles/Desktop/hackthon/VISION_DOCUMENT.md) and the technical foundation detailed in the [MASTER_ARCHITECTURE_BLUEPRINT.md](file:///E:/UserFiles/Desktop/hackthon/MASTER_ARCHITECTURE_BLUEPRINT.md).

All requirements are systematically numbered to ensure traceability and auditability.

---

## 1. Functional Requirements (FR)

Functional requirements specify the specific behavior, features, and capabilities that the Item Rental System must deliver.

### 1.1 Authentication & Profile Management
*   **FR-001: Renter and Owner Registration**  
    The system must allow guests to register as users. The registration form must collect full name, unique email address, phone number, password, and primary language preference (English/Arabic).
*   **FR-002: JWT-Based Authentication & Login**  
    The system must authenticate users via a secure login process. Upon verification of email and hashed password, the system must generate a JSON Web Token (JWT) that details the user's ID, role, and permission scope for subsequent requests.
*   **FR-003: User Profile Management**  
    The system must enable authenticated users (Renters and Owners) to view and edit their profile details, including contact info, default address (for cash pickup or delivery), and language preference.
*   **FR-004: Secure Session Logout**  
    The system must support explicit logout, which invalidates the client-side JWT token and clears active session storage.

### 1.2 Authorization & Role-Based Access Control (RBAC)
*   **FR-005: Guest Role Permissions**  
    The system must allow anonymous guests to browse listings, execute keyword and category searches, view item detail pages, and view the aggregated rating of listing owners.
*   **FR-006: Guest Action Restrictions**  
    The system must block guests from creating bookings, leaving reviews, uploading documents, or creating listings. The system must prompt guests to register or login when they attempt these restricted actions.
*   **FR-007: Renter Role Permissions**  
    The system must allow authenticated Renters to search, filter, select rental periods, submit booking requests, choose a payment method, track bookings, view rental history, and review owners.
*   **FR-008: Owner Role Permissions**  
    The system must allow authenticated Owners to manage their listings (create, edit, delete, set availability), upload verification documents (National ID), approve or reject booking requests, confirm item returns, and submit damage reports.
*   **FR-009: Admin Role Permissions**  
    The system must allow authenticated Admins to manage users and roles, verify owner accounts, moderate listings, configure categories, define pricing/deposit policies, and view platform-wide analytics and audit logs.

### 1.3 Owner Verification
*   **FR-010: National ID Upload**  
    The system must provide a secure portal for Owners to upload a clear image of their National ID card.
*   **FR-011: Submit Verification Request**  
    Upon National ID upload, the system must create an identity verification request and set the owner's verification status to `Pending`.
*   **FR-012: Admin Verification Decision**  
    The system must present pending verification requests to Admins. The Admin must be able to change the status to `Approved` or `Rejected` (the latter requiring the Admin to supply a decision reason).
*   **FR-013: Account Status Restriction**  
    The system must restrict Owners from making listings public or accepting bookings unless their verification status is `Approved`.

### 1.4 Listings Management
*   **FR-014: Listing Creation**  
    The system must allow verified Owners to create listings with a title, description, category selection, item condition, daily price, deposit amount, and photos.
*   **FR-015: Listing Editing**  
    The system must allow Owners to modify their listing details, including descriptions, daily prices, deposit requirements, and photos.
*   **FR-016: Listing Deletion**  
    The system must allow Owners to delete listings. If a listing has active or approved future bookings, the deletion must be deferred or converted to a soft-deleted "inactive" state to preserve historical bookings.
*   **FR-017: Multi-Photo Upload**  
    The system must support the upload of multiple high-resolution photos per listing, stored via Cloudinary and linked to the listing database record.
*   **FR-018: Listing Availability Control**  
    The system must allow Owners to manage available dates for each listing via a calendar interface, permitting them to block out specific dates for personal use.
*   **FR-019: Listing Moderation Queue**  
    The system must route newly created or edited listings to an Admin moderation queue. The listing status remains `Pending Approval` and is hidden from search until reviewed.
*   **FR-020: Admin Listing Review**  
    The system must allow Admins to approve (status becomes `Active` / search-visible) or reject listings (status becomes `Rejected` / hidden, with feedback sent to the owner).

### 1.5 Search & Filtering
*   **FR-021: Keyword Search**  
    The system must search titles and descriptions of active listings matching user-entered keywords.
*   **FR-022: Category-Based Filtering**  
    The system must filter search results by admin-configured categories (e.g., Tools, Electronics, Camping).
*   **FR-023: Condition-Based Filtering**  
    The system must filter search results by item condition: `New`, `Good`, or `Acceptable`.
*   **FR-024: Price Range Filtering**  
    The system must filter search results by a user-defined minimum and maximum daily price range.
*   **FR-025: Date-Range Availability Search**  
    The system must filter out listings that overlap with existing approved bookings or owner blockout dates for a requested date range.
*   **FR-026: Public Listing Detail View**  
    The system must render a listing page displaying all listing attributes, photo carousel, owner name, owner verification badge, and owner rating summary.

### 1.6 Booking Module
*   **FR-027: Date Range Selection**  
    The system must provide Renters with a calendar date-picker to select start and end dates for a booking request.
*   **FR-028: Real-Time Availability Validation**  
    The system must execute backend validation to detect if any portion of the selected date range conflicts with an already approved booking or blocked date.
*   **FR-029: Create Booking Request**  
    If dates are available, the system must allow Renters to submit a booking request. The system must create the booking with status `Pending` and notify the owner.
*   **FR-030: Owner Booking Decision**  
    The system must allow the Owner to review a pending booking request and either approve (status transitions to `Approved`) or reject it (status transitions to `Rejected`).
*   **FR-031: Renter Booking Cancellation**  
    The system must allow Renters to cancel booking requests, but only while the booking is in `Pending` status.
*   **FR-032: Booking Check-in & Activation**  
    On the booking start date, once the item is exchanged, the booking status must transition to `Active` (triggered either automatically or via manual check-in confirmation by the renter/owner).
*   **FR-033: Return Confirmation**  
    The system must allow the Owner to confirm receipt of the returned item. This action transitions the booking status to `Returned` and initiates deposit reconciliation.
*   **FR-034: Booking Tracking & Dashboards**  
    The system must provide a unified dashboard for Renters and Owners to track ongoing, historical, and requested bookings categorized by their statuses: `Pending`, `Approved`, `Active`, `Returned`, `Cancelled`, `Rejected`.

### 1.7 Payment Module
*   **FR-035: Payment Method Selection**  
    The system must allow Renters to choose a payment method during booking creation: `Online Payment` or `Cash On Pickup`.
*   **FR-036: Online Payment Processing**  
    For online payments, the system must interface with a secure gateway, capture card authorization, process the total rental fee, and record the status as `Paid` upon success.
*   **FR-037: Cash on Pickup Tracking**  
    For cash payments, the system must record the payment transaction as `Pending Cash Exchange`. The Owner must mark the payment as `Collected` during the pickup check-in.

### 1.8 Deposit Module
*   **FR-038: Deposit Calculation & Snapshotting**  
    The system must calculate and snapshot the deposit amount for each booking at the time of reservation, isolating it from subsequent price changes.
*   **FR-039: Deposit Ledger Logging**  
    The system must record deposit transactions in a dedicated `DepositLedger` separate from the rental base fees.
*   **FR-040: Automatic Deposit Release**  
    If the Owner confirms the return (FR-033) without reporting damage, the system must release the deposit back to the Renter (online refund or mark cash deposit resolved) within a policy-defined timeframe.
*   **FR-041: Deposit Damage Deduction**  
    If a damage report is confirmed, the system must deduct the approved deduction amount from the deposit, routing the remainder (if any) back to the Renter.

### 1.9 Damage Reports
*   **FR-042: Initiate Damage Report**  
    The system must allow Owners to file a damage report against an `Active` or recently `Returned` booking. The report must link to the Booking, Item, Owner, and Renter.
*   **FR-043: Damage Evidence Submission**  
    The Owner must be able to upload evidence photos (stored via Cloudinary) and enter a textual description of the incident.
*   **FR-044: Deduction Amount Specification**  
    The Owner must specify a requested monetary deduction amount up to the value of the snapshot deposit.
*   **FR-045: Damage Resolution Status**  
    The system must track the damage report through states: `Submitted`, `Under Review` (by Admin), `Approved` (deduction applied), or `Dismissed` (deposit released).

### 1.10 Reviews & Ratings
*   **FR-046: Renter-to-Owner Review Submission**  
    The system must allow Renters to rate (1–5 stars) and write comments about the Owner once the booking is `Returned`.
*   **FR-047: Owner-to-Renter Review Submission**  
    The system must allow Owners to rate (1–5 stars) and write comments about the Renter once the booking is `Returned`.
*   **FR-048: Duplicate Review Prevention**  
    The system must restrict each party to a maximum of one review per booking in each direction.
*   **FR-049: Profile Rating Compilation**  
    The system must calculate the average rating for Renters and Owners and display these metrics on their public profile views.

### 1.11 Admin Analytics & Configuration
*   **FR-050: Active Rentals Metric**  
    The Admin dashboard must calculate and display the total number of bookings currently in the `Active` status.
*   **FR-051: Revenue Summary Metric**  
    The Admin dashboard must display total platform earnings and aggregate transaction amounts, filterable by date range and payment type.
*   **FR-052: Top Rented Items Metric**  
    The Admin dashboard must generate a report showing the most frequently rented listings.
*   **FR-053: Pending Verification Metric**  
    The Admin dashboard must highlight the count of Owner verification requests awaiting review.
*   **FR-054: Policy Configuration Interface**  
    The system must allow Admins to configure global variables, including platform fee percentages, deposit retention rules, and listing categories.

### 1.12 Localization & Shared Requirements
*   **FR-055: English and Arabic Support**  
    The system must provide full support for English and Arabic. Users can toggle the display language at any time.
*   **FR-056: Bidirectional Layout Adjustment (RTL/LTR)**  
    The frontend UI must dynamically switch layouts to support Right-to-Left (RTL) rendering for Arabic and Left-to-Right (LTR) for English.
*   **FR-057: Translation of Statuses and Messages**  
    All dynamic system statuses (e.g., booking states, condition terms) and feedback messages must be rendered in the user's active locale.
*   **FR-058: Language Preference Persistence**  
    The system must store the user's selected language in their profile for authenticated sessions, and in local browser storage for guest sessions.
*   **FR-059: System Audit Logging**  
    The backend must generate an audit log entry for every critical transaction: logins, document uploads, listing changes, booking approvals, payment processing, damage filings, and review submissions.
*   **FR-060: Audit Trail Invariance**  
    The system must prevent the deletion or editing of audit logs by any user role, including Admins.

---

## 2. Non-Functional Requirements (NFR)

Non-functional requirements define quality attributes, system properties, and technical constraints.

### 2.1 Security & Data Protection
*   **NFR-001: Encryption in Transit**  
    All communication between the client (Next.js) and server (NestJS) must occur over secure channels using TLS 1.3/HTTPS.
*   **NFR-002: Hashing of Credentials**  
    User passwords must be securely hashed on the server using `bcrypt` or `Argon2` before database storage. Raw passwords must never be logged or stored.
*   **NFR-003: Restricted Access to ID Documents**  
    National ID images and damage evidence stored on Cloudinary must be protected. Access must require an authenticated session restricted to the owning User or an Admin.

### 2.2 Performance
*   **NFR-004: API Response Latency**  
    Under normal load, the NestJS REST API must respond to read queries (such as listing details or search queries) within 300 milliseconds (p95).
*   **NFR-005: Next.js Interactive Loading Time**  
    The Next.js web application must reach Time-to-Interactive (TTI) within 2.0 seconds on standard 4G networks and mid-tier mobile devices.

### 2.3 Usability & Layout
*   **NFR-006: Mobile-First Responsive Design**  
    The user interface must be fully responsive and support viewport widths ranging from 320px (mobile) to 1920px (desktop) without loss of functionality.
*   **NFR-007: Standard RTL Styling Alignment**  
    When rendering Arabic, text alignment must be right-aligned, and layout flow (sidebars, grids, icons) must mirror the LTR design without layout breakage or overlapping elements.

### 2.4 Scalability & Reliability
*   **NFR-008: Concurrent Session Support**  
    The system must support at least 1,000 concurrent active users browsing, searching, and submitting requests without performance degradation.
*   **NFR-009: Database Backup Integrity**  
    The PostgreSQL database must undergo automated daily snapshots, retained for 30 days, with recovery procedures validated quarterly.
*   **NFR-010: Media Upload Limits**  
    The system must limit listing image uploads to a maximum of 5MB per file and National ID uploads to 10MB to prevent storage bloat and performance degradation.

---

## 3. Business Rules (BR)

Business rules define the constraints, workflows, and policies governing the domain logic of the Item Rental System.

### 3.1 Owner Verification & Permissions
*   **BR-001: Verification Dependency**  
    An Owner account cannot transition any listing to `Active` or review/approve a booking unless the Owner's verification status is `Approved`.
*   **BR-002: Verification State Flow**  
    An Owner verification request must proceed only through: `Pending` -> `Approved` OR `Pending` -> `Rejected`.

### 3.2 Listing Constraints
*   **BR-003: Core Listing Metadata**  
    Every listing must contain: Title, Description, Category ID, Condition, Daily Price, Deposit Amount, Owner ID, and at least one Photo.
*   **BR-004: Condition Domain Values**  
    The condition attribute of a listing must be restricted to one of the following exact string values: `New`, `Good`, or `Acceptable`.
*   **BR-005: Moderator Governance**  
    All new listings and major modifications (price adjustments or description changes) must go through Admin approval before appearing in public searches.

### 3.3 Booking Rules & Conflict Resolution
*   **BR-006: Non-Overlapping Bookings**  
    No two bookings for the same listing can have overlapping date ranges if both bookings are in `Approved` or `Active` states.
*   **BR-007: Cancellation Restriction**  
    A Renter can cancel a booking request only if the booking status is `Pending`. Once the Owner approves the booking, cancellation is locked.
*   **BR-008: Approved Booking Reserve**  
    Transitioning a booking to `Approved` must immediately mark those dates as reserved in the availability calendar, blocking other pending requests.
*   **BR-009: Rental Lifecycle Closure**  
    A rental agreement is closed when the Owner confirms the return of the item, transitioning the status to `Returned`. This action triggers deposit release logic.

### 3.4 Payments & Deposit Policy
*   **BR-010: Deposit Isolation**  
    Rental deposits must be isolated, tracked, and stored separately from the booking transaction fees. They cannot be aggregated with the daily rental rate.
*   **BR-011: Deposit Release Timeline**  
    Upon return of the item, if no damage is reported by the owner within 48 hours, the deposit must be released back to the renter.
*   **BR-012: Deposit Deduction Cap**  
    The maximum amount an Owner can deduct from a deposit via a damage report must not exceed the snapshot deposit value of the booking.

### 3.5 Damage Claims
*   **BR-013: Damage Report Window**  
    An Owner can only submit a damage report for a booking if the current status is `Active` or has been marked `Returned` within the last 48 hours.
*   **BR-014: Damage Linkage**  
    Every damage report must hold direct foreign key relationships to the Booking, the Listing, the Owner, and the Renter.

### 3.6 Reviews & Ratings
*   **BR-015: Review Eligibility**  
    Reviews and ratings can only be submitted for bookings that have reached the `Returned` status.
*   **BR-016: Review Limit**  
    There is a strict limit of one review per user role per booking (maximum 1 renter-to-owner review and 1 owner-to-renter review).

### 3.7 Governance & Audits
*   **BR-017: Admin Exclusion**  
    Admins are prohibited from listing items or submitting rental requests using their Admin credentials; they must create standard renter/owner accounts.
*   **BR-018: Audit Trail Persistence**  
    Audit logs cannot be modified, deleted, or cleared under any circumstances. They must be stored in an append-only table.

---

## 4. Validation Rules (VR)

Validation rules specify input field constraints and format rules enforced by the frontend and backend.

*   **VR-001: Email Validity and Uniqueness**  
    Emails must follow the standard RFC 5322 format and must be checked against the database for uniqueness during registration.
*   **VR-002: Password Complexity**  
    Passwords must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.
*   **VR-003: Listing Title Length**  
    Listing titles must be between 5 and 100 characters in length and must not contain HTML tags.
*   **VR-004: Listing Description Length**  
    Listing descriptions must contain between 20 and 1000 characters.
*   **VR-005: Positive Monetary Values**  
    Daily prices and deposit amounts must be numeric values greater than or equal to 0.00.
*   **VR-006: Valid Listing Condition**  
    Item conditions must match one of the defined enums: `New`, `Good`, or `Acceptable`.
*   **VR-007: Future Booking Dates**  
    The start date of a booking request must be equal to or greater than the current local date.
*   **VR-008: Valid Booking Span**  
    The booking end date must be greater than or equal to the booking start date.
*   **VR-009: Upload File Formats**  
    Uploaded photos and documents must possess file extensions in the set `[.jpg, .jpeg, .png]`. PDF files are only permitted for Owner National IDs.
*   **VR-010: Review Rating Range**  
    Star ratings must be integers between 1 and 5 (inclusive).
*   **VR-011: Review Comment Max Length**  
    Review comments must not exceed 500 characters.
*   **VR-012: Damage Deduction Boundary**  
    The damage report deduction amount must be greater than 0 and less than or equal to the booking's deposit snapshot value.

---

## 5. Error Handling Rules (EHR)

Error handling rules detail how the system responds to validation, security, and transaction failures.

*   **EHR-001: Invalid Credentials Response**  
    If a login fails due to incorrect password or non-existent email, the server must return an HTTP 401 Unauthorized status with a localized error string:
    *   *English*: "Invalid email or password."
    *   *Arabic*: "البريد الإلكتروني أو كلمة المرور غير صالحة."
*   **EHR-002: Registration Conflict**  
    If registration is attempted with an existing email, the system must return an HTTP 409 Conflict status with a message indicating the email is already registered.
*   **EHR-003: Role Authorization Failure**  
    If an authenticated user attempts to access an endpoint outside their RBAC privileges, the system must return an HTTP 403 Forbidden status and write a warning entry to the audit log.
*   **EHR-004: Resource Access Lockout**  
    If an owner attempts to access or modify a listing or booking they do not own, the system must return an HTTP 403 Forbidden status.
*   **EHR-005: Booking Date Overlap Conflict**  
    If a booking request conflicts with another approved reservation, the system must return an HTTP 400 Bad Request status with a message details: "Requested dates are unavailable." / "التواريخ المطلوبة غير متوفرة."
*   **EHR-006: Cancel Approved Booking Failure**  
    If a renter attempts to cancel a booking that is already `Approved`, the system must block the request and return an HTTP 400 Bad Request with: "Approved bookings cannot be cancelled." / "لا يمكن إلغاء الحجوزات المقبولة."
*   **EHR-007: Double Review Submission**  
    If a user attempts to submit a second review for the same booking, the server must return an HTTP 400 Bad Request with a message stating a review has already been submitted.
*   **EHR-008: Review Prior to Return**  
    If a review is submitted before the booking status transitions to `Returned`, the server must reject the call with an HTTP 400 Bad Request: "Review can only be submitted after return." / "يمكن تقديم التقييم فقط بعد إرجاع السلعة."
*   **EHR-009: File Upload Limit Exceeded**  
    If a user attempts to upload files exceeding NFR-010 size constraints, the gateway must reject the request with HTTP 413 Payload Too Large.
*   **EHR-010: Database Transaction Rollback**  
    For booking, payment, and deposit processes, the backend must use database transactions. If any sub-operation fails, the entire transaction must roll back, leaving no partial state.
*   **EHR-011: Gateway Payment Failure**  
    If the online payment gateway transaction fails, the payment status must be updated to `Failed`, the booking must remain in `Pending`, and the renter must be prompted with a localized retry message.

---

## 6. Assumptions (AS)

Assumptions define the context, conditions, and user behaviors expected to hold true for the system.

*   **AS-001: Peer-to-Peer Model**  
    The system assumes a peer-to-peer marketplace context. Listing inventory is owned and managed directly by users rather than a single platform warehouse.
*   **AS-002: Dual Profile Accounts**  
    We assume that a single authenticated User account can hold both Renter and Owner roles concurrently, navigating between Renter and Owner dashboards within the client.
*   **AS-003: External Cloudinary Availability**  
    We assume that Cloudinary services will maintain high availability and have sufficient storage allocations to serve user uploads dynamically.
*   **AS-004: Network Infrastructure**  
    We assume that users have internet connectivity capable of fetching Next.js assets and executing API calls to NestJS over HTTPS.
*   **AS-005: Legal Age of Users**  
    The platform assumes all registered owners and renters are at least 18 years of age and legally competent to enter into binding rental contracts.
*   **AS-006: Visual/Manual Identity Verification**  
    We assume that Admins possess the necessary training to visually review National ID uploads and accurately approve or reject verification requests.
*   **AS-007: Cash-on-Pickup Trust**  
    We assume that for Cash-on-Pickup transactions, both parties exchange the agreed amount in person. The system acts as a ledger recording this assertion rather than enforcing escrow for physical cash.
*   **AS-008: Single Currency Default**  
    We assume a single currency operates within the deployment market. Multicurrency conversions are out of scope for the initial requirements.

---

## 7. Constraints (CO)

Constraints specify technical boundaries, languages, and architecture requirements.

*   **CO-001: Frontend Technology Stack**  
    The frontend client must be built using **Next.js**, **TypeScript**, and **TailwindCSS** as recommended in [PROJECT_CONTEXT.md](file:///E:/UserFiles/Desktop/hackthon/PROJECT_CONTEXT.md).
*   **CO-002: Backend Technology Stack**  
    The server-side API must be built using the **NestJS** framework.
*   **CO-003: Database Engine**  
    The relational database must be **PostgreSQL**.
*   **CO-004: Object-Relational Mapper (ORM)**  
    All database models, schema migrations, and queries must be configured and managed via **Prisma ORM**.
*   **CO-005: File Storage Host**  
    All dynamic binary assets (listing photos, ID verification cards, damage reports) must be hosted on **Cloudinary**.
*   **CO-006: Session State Mechanism**  
    The system must remain stateless on the backend, relying on **JSON Web Tokens (JWT)** for session validation.
*   **CO-007: Architectural Style**  
    The client-server integration must follow RESTful design standards, exposing resource routes using JSON payloads.
*   **CO-008: Supported Languages**  
    The system must support **English** and **Arabic** only. Other languages are excluded from the initial release scope.
*   **CO-009: Layout Direction Standards**  
    The application layout must toggle direction between LTR and RTL in response to the user's active locale.
*   **CO-010: Audit Log Isolation**  
    Audit log records must be stored within a distinct, append-only PostgreSQL table without edit or delete controllers.

---

## Requirement Mapping and Traceability

To verify complete coverage of the requirements from [PROJECT_CONTEXT.md](file:///E:/UserFiles/Desktop/hackthon/PROJECT_CONTEXT.md), here is a matrix mapping context modules to functional and business rules.

| Module | Context Document Requirements | Covered By |
| :--- | :--- | :--- |
| **Authentication & RBAC** | Guest permissions & Renter/Owner/Admin capabilities | FR-001 to FR-009, BR-001, NFR-001, NFR-002, CO-006 |
| **Owner Verification** | National ID upload, verification statuses | FR-010 to FR-013, BR-001, BR-002, VR-009 |
| **Listings Module** | Title, category, condition values, photos, moderation | FR-014 to FR-020, BR-003 to BR-005, VR-003 to VR-006 |
| **Search & Filter** | Keywords, condition filters, category navigation | FR-021 to FR-026 |
| **Booking Module** | Dates, availability, overlap checks, lifecycle statuses | FR-027 to FR-034, BR-006 to BR-009, VR-007, VR-008 |
| **Payment Module** | Online payment, Cash on pickup tracking | FR-035 to FR-037, BR-009, EHR-011 |
| **Deposits** | Separate ledger, release on return, damage deduction | FR-038 to FR-041, BR-010 to BR-012, VR-005 |
| **Damage Reports** | Photo upload, description, deduction capping | FR-042 to FR-045, BR-013, BR-014, VR-012 |
| **Reviews & Ratings** | Renter/Owner reviews, after return only, visible ratings | FR-046 to FR-049, BR-015, BR-016, VR-010, VR-011 |
| **Admin Analytics** | Active rentals, revenue summary, verifications, top items | FR-050 to FR-054 |
| **Localization** | Arabic, English, RTL responsive UI, language switches | FR-055 to FR-058, NFR-006, NFR-007, CO-008, CO-009 |
| **Audit Logging** | Security and critical operation records | FR-059, FR-060, BR-018, CO-010, NFR-011 |
