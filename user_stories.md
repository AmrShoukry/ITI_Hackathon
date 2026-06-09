# User Stories Document — Item Rental System

This document outlines the complete set of User Stories for the Item Rental System. It translates the requirements specified in the [software_requirements_specification.md](file:///E:/UserFiles/Desktop/hackthon/software_requirements_specification.md) and the operational rules in [PROJECT_CONTEXT.md](file:///E:/UserFiles/Desktop/hackthon/PROJECT_CONTEXT.md) into developer-ready backlogs.

Every requirement from the Software Requirements Specification (SRS) is mapped to at least one User Story.

---

## Epic 1: Authentication & Profile Management

This Epic covers registration, login, logout, profile management, language switching, and basic role capabilities.

### US-001: Renter and Owner Registration
*   **Story**: As a Guest, I want to create a new account with my name, email, phone number, password, and language preference, so that I can use the platform's renting and listing features.
*   **Mapped Requirements**: FR-001, VR-001, VR-002, EHR-002, FR-058.
*   **Acceptance Criteria**:
    *   System must display a registration form containing fields for full name, email, phone number, password, and primary language preference (English/Arabic).
    *   Emails must follow RFC 5322 validation patterns (VR-001).
    *   Passwords must have at least 8 characters, containing uppercase, lowercase, numbers, and special characters (VR-002).
    *   If the email is already registered, the backend must return HTTP 409 Conflict with a localized error message (EHR-002).
    *   The user's default language choice must be saved to their profile database record upon registration.
*   **Priority**: High

### US-002: JWT-Based Login
*   **Story**: As a Registered User (Renter or Owner), I want to log in using my email and password, so that I can securely authenticate my session.
*   **Mapped Requirements**: FR-002, NFR-001, NFR-002, EHR-001.
*   **Acceptance Criteria**:
    *   Login form must collect email and password over HTTPS using TLS 1.3 (NFR-001).
    *   Password must be verified against the secure database hash (using bcrypt/Argon2) (NFR-002).
    *   Successful login must return a JWT containing user ID, role, and language scopes.
    *   Failed login must return an HTTP 401 Unauthorized status with a localized error string: "Invalid email or password" / "البريد الإلكتروني أو كلمة المرور غير صالحة" (EHR-001).
*   **Priority**: High

### US-003: User Profile & Language Preference Switcher
*   **Story**: As a Registered User, I want to update my profile contact details, default pickup address, and preferred language, so that my details remain correct and my interface displays in my preferred language.
*   **Mapped Requirements**: FR-003, FR-055, FR-056, FR-057, FR-058, NFR-006, NFR-007, CO-008, CO-009.
*   **Acceptance Criteria**:
    *   Users can view and edit name, phone number, address, and language settings from their profile dashboard.
    *   Toggling the language preference from English to Arabic must immediately flip the UI layout to Right-to-Left (RTL) mode, align all text to the right, mirror navigation headers, and translate all system messages (FR-056, FR-057, NFR-007, CO-009).
    *   The frontend layout must support viewports down to 320px for both LTR and RTL rendering without display errors (NFR-006).
    *   The preference must persist in the database and carry over between sessions (FR-058).
*   **Priority**: Medium

### US-004: User Logout
*   **Story**: As an Authenticated User, I want to sign out of my account, so that my session is terminated and my account is secure on shared devices.
*   **Mapped Requirements**: FR-004.
*   **Acceptance Criteria**:
    *   Clicking the logout button must invalidate the client-side JWT token.
    *   All stored JWTs in browser cookies or local storage must be removed.
    *   The user must be redirected to the public marketplace landing page.
*   **Priority**: High

---

## Epic 2: Verification

This Epic covers identity verification for item Owners.

### US-005: Upload National ID & Submit Verification Request
*   **Story**: As an Owner, I want to upload a clear scan of my National ID card and submit it for review, so that I can verify my account and unlock listing capabilities.
*   **Mapped Requirements**: FR-010, FR-011, VR-009, NFR-003, NFR-010, EHR-009.
*   **Acceptance Criteria**:
    *   Owners must see a "Verification" section on their dashboard allowing them to upload a file.
    *   The file must be a JPG, JPEG, PNG, or PDF (VR-009) and must not exceed 10MB in size (NFR-010). If the file size is larger, return HTTP 413 Payload Too Large (EHR-009).
    *   The uploaded image must be stored securely on Cloudinary, and access URLs must require Admin or owning User authentication (NFR-003).
    *   Upon successful upload, a `VerificationRequest` record must be created in the database with status set to `Pending`.
*   **Priority**: High

### US-006: Verification Governance & Restriction Enforcement
*   **Story**: As an Owner, I expect the system to restrict me from publishing active listings or accepting rentals until my ID verification is approved, to ensure platform safety.
*   **Mapped Requirements**: FR-013, BR-001, BR-002, EHR-003, EHR-004.
*   **Acceptance Criteria**:
    *   An Owner whose verification status is `Pending` or `Rejected` must be blocked from publishing items to the public market or accepting booking requests.
    *   If an unverified owner attempts to call publish or approve APIs, the backend must block the transaction and return HTTP 403 Forbidden with a localized message: "Account verification required" (EHR-003).
    *   If the verification is `Approved`, restrictions are immediately lifted.
*   **Priority**: High

---

## Epic 3: Listings

This Epic covers creation, editing, deleting, photo uploads, and availability scheduling of listings.

### US-007: Listing Creation
*   **Story**: As a Verified Owner, I want to create a new item listing with a title, description, category, condition, price, deposit, and pictures, so that it can be reviewed and made available for rent.
*   **Mapped Requirements**: FR-014, FR-017, BR-003, BR-004, VR-003, VR-004, VR-005, VR-006, VR-009, NFR-010, EHR-009.
*   **Acceptance Criteria**:
    *   Listing form must enforce validation: Title must be 5–100 characters (VR-003); Description must be 20–1000 characters (VR-004); Price and Deposit must be positive numbers >= 0 (VR-005); Condition must match `New`, `Good`, or `Acceptable` (VR-006, BR-004).
    *   At least one photo must be uploaded (BR-003), formatted as JPG/PNG under 5MB per file (VR-009, NFR-010). Large files must return HTTP 413 (EHR-009).
    *   Photos must be hosted on Cloudinary (CO-005).
    *   Upon submission, the listing must be saved in the database with status `Pending Approval` (BR-005).
*   **Priority**: High

### US-008: Edit Listing and Re-moderation
*   **Story**: As an Owner, I want to modify my existing listing details, so that my listing description, daily price, or deposit settings are updated in the market.
*   **Mapped Requirements**: FR-015, BR-005, EHR-004.
*   **Acceptance Criteria**:
    *   Only the authenticated Owner of the listing can edit the record; other users must receive HTTP 403 Forbidden (EHR-004).
    *   All edits must satisfy the standard listing validation rules (VR-003, VR-004, VR-005, VR-006).
    *   Any major changes to price or descriptions must automatically set the listing's search status back to `Pending Approval` to undergo re-moderation (BR-005).
*   **Priority**: Medium

### US-009: Listing Deletion
*   **Story**: As an Owner, I want to delete my item listing, so that it is no longer visible to search.
*   **Mapped Requirements**: FR-016.
*   **Acceptance Criteria**:
    *   An Owner can request deletion of a listing.
    *   If the listing is associated with active bookings (`Active`) or future approved bookings (`Approved`), the deletion must be blocked, returning an HTTP 400 error.
    *   If eligible, the system performs a soft-delete (sets an `isDeleted` flag to true) so that historical records and past bookings remain intact in the database while hiding the listing from the frontend search.
*   **Priority**: Medium

### US-010: Listing Availability & Personal Blockouts
*   **Story**: As an Owner, I want to schedule blockout dates on my listing's availability calendar, so that renters cannot book the item on days I need it for personal use.
*   **Mapped Requirements**: FR-018.
*   **Acceptance Criteria**:
    *   The listing dashboard must present a calendar view showing reserved dates and free dates.
    *   The Owner must be able to select a date range and mark it as "Blocked".
    *   Blocked dates must prevent booking requests from Renters for overlapping ranges (FR-025).
*   **Priority**: Medium

---

## Epic 4: Search & Filtering

This Epic covers browsing, filtering, and listing detail queries for guests and renters.

### US-011: Public Listing Search & Filtering
*   **Story**: As a User (Guest or Renter), I want to search listings by keywords and apply category, condition, price, and date filters, so that I can quickly find available items.
*   **Mapped Requirements**: FR-005, FR-007, FR-021, FR-022, FR-023, FR-024, FR-025.
*   **Acceptance Criteria**:
    *   Keyword search must look up matches in listing title and description fields (FR-021).
    *   Users can filter listings by category (FR-022), condition (`New`, `Good`, `Acceptable`) (FR-023), and price range (minimum/maximum daily price) (FR-024).
    *   Entering a date range must automatically filter out listings with overlapping active/approved bookings or owner blockout dates (FR-025).
*   **Priority**: High

### US-012: Listing Details Page
*   **Story**: As a User, I want to view a listing's complete detail page, including photos, condition, price, deposit, owner verification badge, and owner rating, so that I can evaluate its trustworthiness.
*   **Mapped Requirements**: FR-005, FR-007, FR-026, FR-049.
*   **Acceptance Criteria**:
    *   Displays listing details: title, description, category, condition, daily price, deposit amount, and photo carousel.
    *   If the Owner's verification status is `Approved`, a visual "Verified Owner" badge must render next to their name.
    *   Renders the Owner's aggregated star rating and links to their historical renter reviews (FR-049).
*   **Priority**: High

### US-013: Guest Access Controls
*   **Story**: As a Guest, I expect the system to allow me to search and inspect listings, but block me from booking or reviewing until I register and log in.
*   **Mapped Requirements**: FR-005, FR-006, EHR-003.
*   **Acceptance Criteria**:
    *   Guests can access listing search, filtering, and details views (FR-005).
    *   If a Guest clicks "Book Now" or attempts to write a review, the UI must intercept the action and show a login/registration modal or redirect them to register.
    *   API requests for booking or reviewing items submitted without a valid JWT must return HTTP 403 Forbidden (EHR-003).
*   **Priority**: High

---

## Epic 5: Booking

This Epic covers the reservation lifecycle: requests, approvals, activations, returns, and cancellations.

### US-014: Booking Request & Date Validation
*   **Story**: As a Renter, I want to select a date range on an item calendar and submit a booking request, so that I can initiate the rental process.
*   **Mapped Requirements**: FR-027, FR-028, FR-029, VR-007, VR-008, EHR-005, EHR-010.
*   **Acceptance Criteria**:
    *   Renter must select start and end dates.
    *   Start date must be in the future (>= today) (VR-007) and end date must be >= start date (VR-008).
    *   Backend must validate date overlaps with existing approved/active bookings. If conflict is found, return HTTP 400 Bad Request: "Requested dates are unavailable" (EHR-005).
    *   On validation success, the booking must be created in the database with status `Pending`.
    *   Creation must utilize database transactions to ensure database consistency; any sub-operation failure triggers a rollback (EHR-010).
*   **Priority**: High

### US-015: Booking Decisions (Owner approval/rejection)
*   **Story**: As an Owner, I want to review pending booking requests and approve or reject them, so that I can manage who rents my items.
*   **Mapped Requirements**: FR-030, BR-006, BR-008, EHR-004.
*   **Acceptance Criteria**:
    *   Owners see a list of pending bookings for their items.
    *   If the Owner clicks "Approve", the status changes to `Approved`, and the dates are blocked in the calendar (BR-008). Overlapping pending requests must be rejected.
    *   If the Owner clicks "Reject", the status changes to `Rejected`.
    *   Only the resource Owner can trigger these actions; attempts by other users must return HTTP 403 (EHR-004).
*   **Priority**: High

### US-016: Booking Cancellation
*   **Story**: As a Renter, I want to cancel my booking request before it is approved, so that I do not get charged.
*   **Mapped Requirements**: FR-031, BR-007, EHR-006.
*   **Acceptance Criteria**:
    *   Renters can cancel bookings from their renter dashboard.
    *   Cancellation is restricted to bookings with status `Pending` (BR-007).
    *   If a renter attempts to cancel a booking in `Approved` or `Active` status, return HTTP 400 Bad Request: "Approved bookings cannot be cancelled" (EHR-006).
*   **Priority**: Medium

### US-017: Rental Handover and Return
*   **Story**: As an Owner, I want to confirm when the item has been picked up by the renter, and when the renter returns it, so that the status is updated and the rental is closed.
*   **Mapped Requirements**: FR-032, FR-033, BR-009.
*   **Acceptance Criteria**:
    *   On the pickup date, the Owner confirms pickup, changing status from `Approved` to `Active`.
    *   Upon return, the Owner clicks "Confirm Return". The booking status transitions to `Returned`, closing the rental lifecycle (BR-009) and triggering the deposit release timer.
*   **Priority**: High

---

## Epic 6: Payments & Deposits

This Epic covers online checkout, cash payments, deposit bookkeeping, releases, and deductions.

### US-018: Online Payment & Checkout
*   **Story**: As a Renter, I want to pay for my rental online during booking, so that my payment is processed securely.
*   **Mapped Requirements**: FR-035, FR-036, VR-014, EHR-011.
*   **Acceptance Criteria**:
    *   Renters can select "Online Payment" as their payment method.
    *   The system integrates with a payment gateway (e.g., Stripe) and validates credit card details (VR-014).
    *   On payment success, the transaction status is marked `Paid`.
    *   If payment fails, transaction status is updated to `Failed`, the booking remains `Pending`, and the user is prompted to retry payment (EHR-011).
*   **Priority**: High

### US-019: Cash on Pickup Ledger Tracking
*   **Story**: As a Renter, I want to choose cash payment, so that I can pay the Owner in person during the physical item pickup.
*   **Mapped Requirements**: FR-035, FR-037.
*   **Acceptance Criteria**:
    *   Renter can select "Cash on Pickup" as their payment method.
    *   The transaction is created with status `Pending Cash Exchange`.
    *   When the Owner confirms the pickup (handover), the payment status must transition to `Collected`.
*   **Priority**: Medium

### US-020: Deposit Isolation & Ledgers
*   **Story**: As a System Accountant, I want the platform to ledger security deposits separately from daily rental fees, so that we maintain transparent financial reporting.
*   **Mapped Requirements**: FR-038, FR-039, BR-010.
*   **Acceptance Criteria**:
    *   At the time of booking, the daily price and deposit amount are snapshotted in the `DepositLedger` (FR-038).
    *   Deposits must be stored in a separate table record associated with the booking, distinct from base platform transaction fees (BR-010).
    *   For online payments, the deposit must be authorized or captured separately to allow simple refunds.
*   **Priority**: High

### US-021: Deposit Release & Deduction Execution
*   **Story**: As a Renter, I want my security deposit released automatically within 48 hours if no damage is reported, or have damage fees deducted from it with the remaining balance refunded, so that I receive my money back.
*   **Mapped Requirements**: FR-040, FR-041, BR-011, BR-012.
*   **Acceptance Criteria**:
    *   If no damage report is submitted within 48 hours of return, the system must trigger an automatic release of the deposit to the Renter (BR-011).
    *   If a damage report is approved, the approved deduction amount (capped at deposit value, BR-012) is captured from the ledger, and the remainder is refunded to the renter.
*   **Priority**: High

---

## Epic 7: Reviews & Ratings

This Epic covers renter and owner post-rental ratings and public profile summaries.

### US-022: Renter-Owner Feedback Loop
*   **Story**: As a User (Renter or Owner), I want to rate the other party (1-5 stars) and write comments after the rental is returned, so that I can share my experience with the community.
*   **Mapped Requirements**: FR-046, FR-047, FR-048, FR-049, BR-015, BR-016, VR-010, VR-011, EHR-007, EHR-008.
*   **Acceptance Criteria**:
    *   A review can only be submitted if the booking status is `Returned` (BR-015). If submitted early, return HTTP 400 (EHR-008).
    *   Only 1 review per direction is allowed (Renter-to-Owner, Owner-to-Renter) (BR-016). If a user attempts to submit a second review, return HTTP 400 (EHR-007).
    *   Rating must be an integer between 1 and 5 (VR-010); Comments must not exceed 500 characters (VR-011).
    *   Submitting a review must recalculate and update the target user's aggregated rating on their profile page (FR-049).
*   **Priority**: Medium

---

## Epic 8: Damage Reports

This Epic covers reporting item damages, evidence uploads, and fee deductions.

### US-023: File Damage Report
*   **Story**: As an Owner, I want to report item damage with photos, descriptions, and a deduction amount, so that I can claim repair costs from the security deposit.
*   **Mapped Requirements**: FR-042, FR-043, FR-044, FR-045, BR-012, BR-013, BR-014, VR-012.
*   **Acceptance Criteria**:
    *   An Owner can submit a damage report only if the booking is `Active` or has been returned within the last 48 hours (BR-013).
    *   The report must link to the Booking, Listing, Owner, and Renter (BR-014).
    *   The Owner must upload at least one photo of the damage (stored on Cloudinary) and write a description (FR-043).
    *   The deduction amount must be greater than 0 and less than or equal to the snapshot deposit value of the booking (VR-012, BR-012).
    *   The report goes into `Submitted` status, and the deposit release is suspended.
*   **Priority**: High

---

## Epic 9: Admin

This Epic covers user and role administration, listing/verification moderation, policies, and audit trails.

### US-024: Admin Verification Review
*   **Story**: As an Admin, I want to review pending Owner verification requests, so that I can verify their National IDs and approve them.
*   **Mapped Requirements**: FR-009, FR-012, BR-002, BR-017.
*   **Acceptance Criteria**:
    *   Admins see a queue of pending Owner verification requests with links to uploaded National ID images.
    *   Admin can change status to `Approved` or `Rejected`. If rejected, Admin must provide a decision reason (FR-012).
    *   Admin profiles are prohibited from creating listings or requesting rentals (BR-017).
*   **Priority**: High

### US-025: Listing Moderation Queue
*   **Story**: As an Admin, I want to approve or reject new listing submissions, so that only quality items are visible in the marketplace.
*   **Mapped Requirements**: FR-009, FR-020, BR-005.
*   **Acceptance Criteria**:
    *   Admins see a list of listings with status `Pending Approval`.
    *   Admins can click "Approve" (status becomes `Active` and search-visible) or "Reject" (status becomes `Rejected` and remains hidden).
*   **Priority**: High

### US-026: Admin Policy and Category Settings
*   **Story**: As an Admin, I want to configure item categories and adjust platform pricing and deposit policies, so that the marketplace configurations can be updated.
*   **Mapped Requirements**: FR-009, FR-054.
*   **Acceptance Criteria**:
    *   Admins can add, edit, or delete categories.
    *   Admins can set global variables: platform fee percentages and deposit policies.
    *   Policy changes must not retroactively affect existing bookings.
*   **Priority**: Medium

### US-027: Immutable Audit Log Review
*   **Story**: As an Admin or Auditor, I want to view system logs of critical actions, so that I can verify compliance and trace system modifications.
*   **Mapped Requirements**: FR-059, FR-060, BR-018, CO-010, NFR-011.
*   **Acceptance Criteria**:
    *   Admins can view a read-only list of audit log entries.
    *   Logs must capture: timestamp, actor ID, action name, resource type, resource ID, IP address, and payload metadata (FR-059).
    *   Audit log entries must be write-only for the application; no edit or delete APIs must exist for the audit log table (FR-060, BR-018, CO-010, NFR-011).
*   **Priority**: High

---

## Epic 10: Analytics

This Epic covers the administrative analytical dashboards.

### US-028: Admin Operations Analytics Dashboard
*   **Story**: As an Admin, I want to view operational metrics, so that I can monitor active rentals, platform revenue, popular items, and moderation queues.
*   **Mapped Requirements**: FR-009, FR-050, FR-051, FR-052, FR-053.
*   **Acceptance Criteria**:
    *   Dashboard must display real-time indicators for:
        *   **Active Rentals**: Count of bookings in `Active` status (FR-050).
        *   **Revenue Summary**: Total platform transaction volume from payment logs (FR-051).
        *   **Top Rented Items**: List of listings sorted by booking count (FR-052).
        *   **Pending Verifications**: Count of requests in `Pending` verification status (FR-053).
*   **Priority**: Medium
