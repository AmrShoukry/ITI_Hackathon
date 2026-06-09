# Item Rental System — Master Architecture Blueprint

This document is the canonical architecture reference for the Item Rental System. It translates `PROJECT_CONTEXT.md` into a stable design blueprint for future implementation, review, and extension.

## 1. Domain Model

### Core Actors
- **Guest**: anonymous visitor who can browse, search, and inspect listings.
- **Renter**: registered user who rents items.
- **Owner**: registered user who lists items for rent and manages bookings.
- **Admin**: privileged operator who governs users, approvals, policies, and analytics.

### Core Entities
- **User**
  - Shared profile for all authenticated actors.
  - Attributes: `id`, `name`, `email`, `phone`, `passwordHash`, `role`, `status`, `preferredLanguage`, `createdAt`, `updatedAt`.
- **RenterProfile**
  - Optional role-specific profile data for renters.
  - Attributes: delivery preferences, address book, rating summary.
- **OwnerProfile**
  - Owner-specific profile and verification state.
  - Attributes: verification status, national ID reference, trust score, rating summary.
- **Listing**
  - Item available for rental.
  - Attributes: `title`, `description`, `categoryId`, `condition`, `dailyPrice`, `depositAmount`, `photos`, `ownerId`, `status`, `availabilityRules`.
- **Category**
  - Admin-managed taxonomy for listings.
- **Booking**
  - Reservation for a listing across a date range.
  - Attributes: `listingId`, `renterId`, `ownerId`, `startDate`, `endDate`, `status`, `pricingSnapshot`, `depositSnapshot`.
- **Payment**
  - Records a monetary transaction tied to a booking.
  - Attributes: `bookingId`, `method`, `amount`, `currency`, `status`, `providerReference`.
- **DepositLedger**
  - Separate accounting record for deposit tracking and release/deduction.
- **DamageReport**
  - Owner-submitted incident record.
  - Attributes: `bookingId`, `listingId`, `ownerId`, `renterId`, `description`, `deductionAmount`, `evidencePhotos`, `status`.
- **Review**
  - Rating and textual feedback from one party to another.
  - Attributes: `bookingId`, `reviewerId`, `revieweeId`, `rating`, `comment`, `createdAt`.
- **VerificationRequest**
  - Owner identity verification workflow.
  - Attributes: `ownerId`, `nationalIdImage`, `status`, `reviewedBy`, `reviewedAt`, `decisionReason`.
- **AuditLog**
  - Immutable record of significant actions and admin events.
  - Attributes: `actorId`, `action`, `entityType`, `entityId`, `metadata`, `ipAddress`, `createdAt`.
- **Notification**
  - In-app and optional email/SMS notification envelope.
- **Policy**
  - Admin-managed configuration for pricing and deposit policies.

### Key Relationships
- A **User** has one role at a time: Guest, Renter, Owner, or Admin.
- A **User** may have one renter profile and/or one owner profile depending on role usage.
- An **Owner** owns many **Listings**.
- A **Listing** belongs to one **Category** and one **Owner**.
- A **Listing** has many **Bookings** over time, but no overlapping approved bookings.
- A **Booking** may have one or more **Payments** and one **DepositLedger** record.
- A **Booking** may have zero or one **DamageReport** records, or multiple if the implementation allows multiple incidents.
- A **Booking** may have at most two **Reviews**: renter-to-owner and owner-to-renter.
- A **VerificationRequest** belongs to one **Owner**.
- An **AuditLog** can reference any security-sensitive or business-critical entity.

## 2. System Modules

### Public Access Module
- Landing pages, featured listings, category navigation, and item browsing for guests.
- Listing search, filtering, detail pages, and owner rating visibility.

### Authentication Module
- Registration, login, logout, token refresh, password reset, and session validation.
- JWT-based authentication.

### Authorization Module
- RBAC enforcement for Guest, Renter, Owner, and Admin.
- Route-level, service-level, and data-level authorization checks.

### Profile Module
- User profile management.
- Owner and renter profile views and updates.

### Listing Module
- Create, edit, delete, view, and approve listings.
- Photo upload, availability management, and listing lifecycle management.

### Category Module
- Admin configuration for categories.
- Category availability for listing classification and search.

### Availability Module
- Date availability rules, calendar state, and conflict detection.
- Reservation blocking once booking is approved.

### Booking Module
- Booking request creation, approval workflow, cancellation, return confirmation, booking tracking, rental history, and lifecycle tracking.

### Payment Module
- Online payment and cash-on-pickup flow handling.
- Payment status tracking and provider integration.

### Deposit Module
- Deposit calculation, storage, release, and deduction.
- Separate ledger from booking payment amount.

### Damage Reporting Module
- Damage capture, evidence upload, deduction proposal, and resolution workflow.

### Review & Rating Module
- Owner and renter reviews.
- Rating summaries for profiles and listing trust signals.

### Owner Verification Module
- National ID upload, verification request submission, and admin approval workflow.

### Admin Governance Module
- User management, role management, verification review, listing review, policy configuration, reporting, and report viewing.

### Analytics Module
- Active rentals, revenue summary, top rented items, and pending verification metrics.

### Audit Logging Module
- System-wide logging of security-relevant and business-critical actions.

### Localization Module
- Arabic and English language support, including RTL-aware UI and localized content.

### Media/Storage Module
- Cloudinary-backed storage for listing photos, ID images, and damage evidence.

## 3. Business Rules

### Access Rules
- Guests can browse and search but cannot book, review, or submit owner actions.
- Renters must register and authenticate before booking.
- Owners must register and authenticate before listing or booking management.
- Admins can manage users, roles, approvals, categories, policies, analytics, and reports.

### Listing Rules
- Each listing must include title, description, category, condition, daily price, deposit amount, photos, and owner.
- Allowed conditions are: `New`, `Good`, and `Acceptable`.
- A listing must be approved before it is treated as publishable in the marketplace.

### Booking Rules
- A booking requires a selected date range and validated availability.
- A booking must not overlap with another approved booking for the same listing.
- A booking can be cancelled only before approval.
- Approved bookings reserve dates immediately.
- Returned bookings close the rental lifecycle.
- Booking statuses are: `Pending`, `Approved`, `Active`, `Returned`, `Cancelled`, `Rejected`.

### Payment Rules
- Two supported payment methods exist: `Online Payment` and `Cash On Pickup`.
- A payment is always associated with a booking.
- Cash-on-pickup still needs a tracking record even if no gateway transaction exists.

### Deposit Rules
- Deposit belongs to the booking, not to the item globally.
- Deposit is tracked separately from the base rental payment.
- Deposit is released after successful return.
- Deposit may be deducted if damage is confirmed.

### Damage Rules
- Only owners can report damage for their items.
- Damage reports must be linked to booking, item, owner, and renter.
- Damage reports can include evidence photos, description, and deduction amount.

### Review Rules
- Reviews are allowed only after return.
- One review per booking per direction is allowed.
- Ratings must be visible on profiles.

### Verification Rules
- Owners upload a National ID image and submit a verification request.
- Verification status values are: `Pending`, `Approved`, `Rejected`.

### Admin Rules
- Admins approve owner verification requests.
- Admins can approve or reject listings.
- Admins can configure categories, pricing policies, and deposit policies.

### Audit Rules
- All sensitive operations must write audit events.
- Audit logs must be tamper-resistant and append-only from the application perspective.

## 4. Dependencies Between Modules

- **Authentication** is foundational for all owner, renter, and admin actions.
- **Authorization** depends on Authentication and is enforced across all modules.
- **Profile** depends on Authentication and feeds Review, Booking, and Admin views.
- **Listing** depends on Profile, Media/Storage, Category, Authorization, and Audit Logging.
- **Availability** depends on Listing and Booking data.
- **Booking** depends on Listing, Availability, Authentication, Authorization, Payment, Deposit, and Notification.
- **Payment** depends on Booking and external payment provider integration for online flows.
- **Deposit** depends on Booking outcome and Damage Reporting resolution.
- **Damage Reporting** depends on Booking, Listing, Owner, Renter, Media/Storage, and Audit Logging.
- **Review & Rating** depends on Booking completion and Profile data.
- **Owner Verification** depends on Authentication, Media/Storage, Admin Governance, and Audit Logging.
- **Admin Governance** depends on Authentication, Authorization, Verification, Listing, Category, Analytics, and Audit Logging.
- **Analytics** depends on Booking, Payment, Verification, and Listing aggregates.
- **Localization** is cross-cutting and touches every user-facing module.

## 5. High-Level Architecture

### Logical View
- **Frontend**: Next.js application serving responsive web pages for desktop and mobile.
- **Backend**: NestJS REST API handling business logic, security, orchestration, and integrations.
- **Database**: PostgreSQL storing transactional data, policy data, and audit records.
- **ORM**: Prisma providing typed data access and schema management.
- **Storage**: Cloudinary for images and media assets.

### Architectural Style
- Client-server architecture with RESTful communication.
- Modular monolith on the backend is the most natural initial shape, with clear bounded modules and service boundaries.
- Domain logic lives on the server, not in the UI.

### Deployment View
- Public web frontend.
- API service behind a reverse proxy or gateway.
- Managed PostgreSQL database.
- Cloudinary external asset storage.
- Optional background jobs for reminders, cleanup, analytics aggregation, and moderation workflows.

## 6. Application Layers

### Presentation Layer
- Next.js pages, components, form handling, routing, and localized UI.
- Handles responsive design and RTL/LTR rendering.

### API Layer
- REST controllers, request validation, response shaping, and auth guards.

### Application Layer
- Use-case orchestration such as register user, create booking, approve listing, submit damage report, and approve verification.

### Domain Layer
- Entities, enums, invariants, policies, and business rules.
- Booking overlap rules, review limits, deposit behavior, and status transitions belong here.

### Infrastructure Layer
- Prisma repositories, PostgreSQL persistence, Cloudinary adapters, JWT handling, payment gateway integration, and logging adapters.

### Cross-Cutting Concerns
- Authentication
- RBAC authorization
- Validation
- Error handling
- Audit logging
- Localization
- Media handling
- Analytics aggregation

## 7. Security Architecture

### Identity and Session Security
- JWT-based authentication for API access.
- Passwords must be hashed with a strong adaptive algorithm.
- Refresh-token or session renewal strategy should be used for longer user sessions if needed.

### Authorization
- RBAC enforced on every protected route and service.
- Resource-level checks prevent users from acting on listings, bookings, or reports they do not own.

### Data Protection
- National ID images and damage evidence are sensitive documents and must be protected with restricted access.
- Payment references and audit records should be write-only from the application perspective.
- Personal data should be minimized in API responses.

### Input and Transport Security
- Server-side validation for all requests.
- HTTPS required in all environments that exchange real user data.
- File uploads must be type-validated, size-limited, and malware-aware where possible.

### Abuse Prevention
- Rate limiting for login, registration, search abuse, booking submission, and upload endpoints.
- Duplicate booking requests and replayed payment callbacks must be handled idempotently.

### Audit and Traceability
- Log admin actions, verification decisions, booking lifecycle changes, payment changes, damage reports, and review submissions.
- Include actor, timestamp, resource, and action metadata.

### Privacy Controls
- Restrict who can view National ID images and damage evidence.
- Hide sensitive owner or renter details unless required by a permitted workflow.

## 8. Localization Architecture

### Languages
- Primary supported languages: Arabic and English.

### UI Behavior
- Support both RTL and LTR layout rendering.
- Persist a preferred language per user.
- Allow guest language switching without login.

### Content Strategy
- Static labels, validation messages, status labels, notifications, and system messages must be localized.
- Domain values such as booking statuses and condition labels should be mapped through translation keys rather than hardcoded strings.

### Date, Currency, and Format Handling
- Dates must respect locale display format while remaining stored in a canonical backend format.
- Currency display should be consistent with the deployment market and policy configuration.

### API Strategy
- API responses should expose stable keys, not translated text where avoidable.
- The frontend should resolve locale strings from translation catalogs.

## 9. Data Flow

### Browse Flow
1. Guest opens the frontend.
2. Frontend requests listings, categories, and filters from REST APIs.
3. Backend returns localized, paginated listing data.
4. User views listing details and owner rating summary.

### Registration and Login Flow
1. User submits registration data.
2. Backend validates, stores the user, and issues JWT-based auth artifacts.
3. User profile becomes available for renter or owner actions.

### Owner Verification Flow
1. Owner uploads National ID image.
2. Media is stored in Cloudinary.
3. Verification request is created with status `Pending`.
4. Admin reviews and approves or rejects the request.
5. Audit log records the decision.

### Listing Flow
1. Owner creates or updates a listing.
2. Backend validates category, condition, price, deposit, and photos.
3. Listing is stored as pending or approved based on governance rules.
4. Approved listing becomes searchable and bookable.

### Booking Flow
1. Renter selects dates on the listing detail page.
2. Backend validates availability and detects conflicts.
3. Booking is created as `Pending`.
4. Owner approves or rejects the request.
5. Approved booking reserves the dates.
6. Booking progresses to `Active`, then `Returned`, or may move to `Cancelled` or `Rejected`.

### Payment and Deposit Flow
1. Booking creation or approval triggers payment intent creation if online payment is used.
2. Payment status is tracked independently from booking state.
3. Deposit is tracked in its own ledger.
4. On successful return, deposit is released.
5. On confirmed damage, deposit is partially or fully deducted according to policy.

### Damage and Review Flow
1. Owner submits damage evidence after an incident.
2. Renter and booking are linked to the damage report.
3. After booking return, each side may submit one review.
4. Ratings update profile summaries and visible reputation indicators.

### Admin and Analytics Flow
1. Admin opens governance dashboards.
2. Backend aggregates active rentals, revenue, top rented items, and pending verification requests.
3. Admin actions are audited and reflected in downstream views.

## 10. Assumptions

- The system is a marketplace for peer-to-peer item rentals rather than a warehouse-managed inventory platform.
- One authenticated account can act as renter, owner, or admin depending on assigned role.
- The platform uses REST APIs between frontend and backend.
- Cloudinary is the canonical media store for uploaded images.
- A booking is the core transactional unit for payment, deposit, damage, and review workflows.
- Review visibility is public on profiles, as required by the context.
- Admin review is required for owner verification and listing moderation.
- Currency and regional policy defaults are configurable through admin settings.

## 11. Constraints

- Frontend stack is constrained to Next.js, TypeScript, and TailwindCSS.
- Backend stack is constrained to NestJS.
- PostgreSQL is the database.
- Prisma is the ORM.
- Cloudinary is the media storage service.
- Authentication is JWT-based.
- The architecture must support responsive design and mobile use.
- The product must support Arabic and English.
- Audit logging is mandatory.
- The system must respect booking non-overlap and review-after-return rules.

## 12. Risks

- **Booking race conditions**: simultaneous booking attempts can create conflicts if locking and transaction handling are weak.
- **Payment ambiguity**: online and cash-on-pickup flows may diverge unless their states are modeled carefully.
- **Deposit disputes**: damage deductions can become contentious without clear policy snapshots and audit trails.
- **Moderation backlog**: owner verification and listing approval may delay marketplace growth if admin throughput is low.
- **Localization drift**: untranslated strings or inconsistent RTL handling can degrade the Arabic experience.
- **Media abuse**: unrestricted uploads can introduce storage cost, malicious files, or privacy leaks.
- **Role confusion**: a user acting in multiple capacities may trigger authorization mistakes if RBAC is not explicit.
- **Data inconsistency**: booking, payment, deposit, and review states can diverge without transactional boundaries.
- **Analytics accuracy**: metrics can become misleading if computed from partially updated data.
- **Trust and safety gaps**: insufficient audit logging or evidence retention weakens dispute resolution.

## Requirement Coverage Summary

- **Listings**: title, description, category, condition, daily price, deposit amount, photos, owner, create/update/delete/view/approval.
- **Booking**: date range selection, availability validation, conflict detection, approval workflow, lifecycle statuses.
- **Payment**: online payment, cash on pickup, separate deposit handling, deduction on damage, release on return.
- **Damage reports**: owner reporting, evidence photos, description, deduction amount, linked to booking/item/owner/renter.
- **Reviews and ratings**: renter-to-owner and owner-to-renter, only after return, one per booking.
- **Owner verification**: national ID upload, pending/approved/rejected workflow.
- **Admin analytics**: active rentals, revenue summary, top rented items, pending verification requests.
- **Shared requirements**: authentication, authorization, responsive design, Arabic, English, mobile support, REST APIs, audit logging.

This blueprint should be treated as the default reference for implementation decisions unless a later architecture decision record explicitly overrides it.
