# REST API Documentation — Item Rental System

This document outlines the complete REST API specification for the Item Rental System. It provides paths, HTTP methods, authorization details, JSON request/response formats, validation rules, status codes, and error scenarios.

This design supports all requirements in [software_requirements_specification.md](file:///E:/UserFiles/Desktop/hackthon/software_requirements_specification.md), mapping back to the use cases in [use_cases.md](file:///E:/UserFiles/Desktop/hackthon/use_cases.md) and tables in [database_design.md](file:///E:/UserFiles/Desktop/hackthon/database_design.md).

---

## Global Headers & Authentication
All authenticated endpoints require the inclusion of a JWT token in the HTTP header:
```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. Authentication Module

### 1.1 Register Account
*   **Method**: `POST`
*   **URL**: `/api/auth/register`
*   **Description**: Registers a new Renter or Owner account.
*   **Authorization**: None (Guest)
*   **Request Example**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "phone": "+966501234567",
      "password": "Password123!",
      "role": "OWNER",
      "preferredLanguage": "en"
    }
    ```
*   **Response Example** (HTTP 201 Created):
    ```json
    {
      "id": "c8a8c5e5-ab1b-4a89-be16-a3de0f59c28d",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "role": "OWNER",
      "preferredLanguage": "en",
      "createdAt": "2026-06-09T08:00:00Z"
    }
    ```
*   **Validation Rules**:
    *   `email`: Must be a valid email format (VR-001).
    *   `password`: Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character (VR-002).
    *   `role`: Must be either 'RENTER' or 'OWNER'.
    *   `preferredLanguage`: Must be either 'en' or 'ar'.
*   **Error Responses**:
    *   **HTTP 400 Bad Request**: Input validation failed.
    *   **HTTP 409 Conflict**: Email already registered (EHR-002).

### 1.2 Login Session
*   **Method**: `POST`
*   **URL**: `/api/auth/login`
*   **Description**: Authenticates credentials and returns a session JWT.
*   **Authorization**: None (Guest)
*   **Request Example**:
    ```json
    {
      "email": "jane.doe@example.com",
      "password": "Password123!"
    }
    ```
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "c8a8c5e5-ab1b-4a89-be16-a3de0f59c28d",
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "role": "OWNER",
        "preferredLanguage": "en"
      }
    }
    ```
*   **Error Responses**:
    *   **HTTP 401 Unauthorized**: Invalid email or password (EHR-001).

### 1.3 Logout Session
*   **Method**: `POST`
*   **URL**: `/api/auth/logout`
*   **Description**: Client-side hook to indicate session termination.
*   **Authorization**: Authenticated (Renter, Owner, Admin)
*   **Response Example** (HTTP 204 No Content): No payload returned.

---

## 2. Verification Module

### 2.1 Submit Verification Request
*   **Method**: `POST`
*   **URL**: `/api/verification/request`
*   **Description**: Uploads Owner's National ID scan for account verification.
*   **Authorization**: Authenticated (Owner only)
*   **Request Format**: `multipart/form-data`
    *   `nationalId`: File (Binary, JPG/PNG, max 10MB)
*   **Response Example** (HTTP 202 Accepted):
    ```json
    {
      "verificationId": "v8a8c5e5-ab1b-4a89-be16-a3de0f59c28f",
      "status": "Pending",
      "nationalIdUrl": "https://res.cloudinary.com/itemrental/image/upload/v12345/national_ids/c8a8c5e5.jpg",
      "submittedAt": "2026-06-09T08:05:00Z"
    }
    ```
*   **Validation Rules**:
    *   Uploaded file format must be `.jpg`, `.jpeg`, `.png`, or `.pdf` (VR-009).
    *   Max file size constraint: 10MB (NFR-010).
*   **Error Responses**:
    *   **HTTP 413 Payload Too Large**: ID document exceeds 10MB (EHR-009).
    *   **HTTP 400 Bad Request**: Invalid file type.

### 2.2 Get Verification Status
*   **Method**: `GET`
*   **URL**: `/api/verification/status`
*   **Description**: Gets the verification status of the logged-in owner.
*   **Authorization**: Authenticated (Owner only)
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "status": "Pending",
      "decisionReason": null,
      "submittedAt": "2026-06-09T08:05:00Z"
    }
    ```

---

## 3. Profiles Module

### 3.1 Get Profile Details
*   **Method**: `GET`
*   **URL**: `/api/profile`
*   **Description**: Gets detailed contact and preference information for the authenticated user.
*   **Authorization**: Authenticated (Renter, Owner, Admin)
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "id": "c8a8c5e5-ab1b-4a89-be16-a3de0f59c28d",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "phone": "+966501234567",
      "role": "OWNER",
      "preferredLanguage": "en",
      "averageRating": 4.8
    }
    ```

### 3.2 Update Profile & Preferences
*   **Method**: `PUT`
*   **URL**: `/api/profile`
*   **Description**: Updates user's contact information and primary language preference.
*   **Authorization**: Authenticated (Renter, Owner, Admin)
*   **Request Example**:
    ```json
    {
      "name": "Jane Smith",
      "phone": "+966509999999",
      "preferredLanguage": "ar"
    }
    ```
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "id": "c8a8c5e5-ab1b-4a89-be16-a3de0f59c28d",
      "name": "Jane Smith",
      "phone": "+966509999999",
      "preferredLanguage": "ar"
    }
    ```
*   **Validation Rules**:
    *   `preferredLanguage`: Must be either 'en' or 'ar'.

---

## 4. Listings Module

### 4.1 Create Listing
*   **Method**: `POST`
*   **URL**: `/api/listings`
*   **Description**: Submits a new listing for Admin moderation.
*   **Authorization**: Authenticated (Owner only)
*   **Request Example**:
    ```json
    {
      "title": "Professional Cordless Drill",
      "description": "High power 20V battery drill with accessory kit. Perfect for concrete drilling.",
      "categoryId": 3,
      "condition": "Good",
      "dailyPrice": 25.00,
      "depositAmount": 150.00,
      "photos": ["https://res.cloudinary.com/itemrental/image/upload/v12/drill.jpg"]
    }
    ```
*   **Response Example** (HTTP 201 Created):
    ```json
    {
      "id": "l8a8c5e5-ab1b-4a89-be16-a3de0f59c28a",
      "title": "Professional Cordless Drill",
      "status": "Pending Approval",
      "createdAt": "2026-06-09T08:10:00Z"
    }
    ```
*   **Validation Rules**:
    *   Title: 5 to 100 characters (VR-003).
    *   Description: 20 to 1000 characters (VR-004).
    *   Condition: Must match 'New', 'Good', or 'Acceptable' (VR-006).
    *   DailyPrice & DepositAmount: positive float values >= 0 (VR-005).
*   **Error Responses**:
    *   **HTTP 403 Forbidden**: Owner's account is not verified (BR-001, EHR-011).

### 4.2 Edit Listing
*   **Method**: `PUT`
*   **URL**: `/api/listings/:id`
*   **Description**: Updates listing attributes. Puts status back to `Pending Approval` for re-moderation.
*   **Authorization**: Authenticated (Listing Owner only)
*   **Request Example**:
    ```json
    {
      "dailyPrice": 20.00,
      "description": "High power 20V battery drill. Battery and charger included."
    }
    ```
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "id": "l8a8c5e5-ab1b-4a89-be16-a3de0f59c28a",
      "status": "Pending Approval",
      "dailyPrice": 20.00
    }
    ```
*   **Error Responses**:
    *   **HTTP 403 Forbidden**: User does not own the listing (EHR-004).

### 4.3 Delete Listing
*   **Method**: `DELETE`
*   **URL**: `/api/listings/:id`
*   **Description**: Soft-deletes a listing if no active bookings exist.
*   **Authorization**: Authenticated (Listing Owner only)
*   **Response Example** (HTTP 204 No Content): No payload returned.
*   **Error Responses**:
    *   **HTTP 400 Bad Request**: Cannot delete listing with active or future approved bookings.

### 4.4 Set Calendar Blockout Range
*   **Method**: `POST`
*   **URL**: `/api/listings/:id/blockout`
*   **Description**: Blocks owner-specified dates from search discovery.
*   **Authorization**: Authenticated (Listing Owner only)
*   **Request Example**:
    ```json
    {
      "startDate": "2026-07-01",
      "endDate": "2026-07-05",
      "description": "Family camping trip"
    }
    ```
*   **Response Example** (HTTP 201 Created):
    ```json
    {
      "id": 14,
      "listingId": "l8a8c5e5-ab1b-4a89-be16-a3de0f59c28a",
      "startDate": "2026-07-01",
      "endDate": "2026-07-05",
      "isBlocked": true
    }
    ```
*   **Validation Rules**:
    *   `endDate` must be >= `startDate` (VR-008).

---

## 5. Search Module

### 5.1 Marketplace Search
*   **Method**: `GET`
*   **URL**: `/api/search`
*   **Description**: Queries and filters listings available in the marketplace.
*   **Authorization**: None (Guest)
*   **Query Parameters**:
    *   `q`: Keyword string (matches title/desc).
    *   `categoryId`: Integer ID.
    *   `condition`: 'New', 'Good', or 'Acceptable'.
    *   `minPrice`: Numeric.
    *   `maxPrice`: Numeric.
    *   `startDate`: Date (YYYY-MM-DD).
    *   `endDate`: Date (YYYY-MM-DD).
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "listings": [
        {
          "id": "l8a8c5e5-ab1b-4a89-be16-a3de0f59c28a",
          "title": "Professional Cordless Drill",
          "category": "Tools",
          "condition": "Good",
          "dailyPrice": 25.00,
          "depositAmount": 150.00,
          "photos": ["https://res.cloudinary.com/itemrental/v1/drill.jpg"],
          "owner": {
            "name": "Jane Doe",
            "isVerified": true,
            "rating": 4.8
          }
        }
      ],
      "totalResults": 1
    }
    ```

---

## 6. Booking Module

### 6.1 Submit Booking Request
*   **Method**: `POST`
*   **URL**: `/api/bookings`
*   **Description**: Submits a booking request. If "Online Payment" is chosen, includes payment intent.
*   **Authorization**: Authenticated (Renter only)
*   **Request Example**:
    ```json
    {
      "listingId": "l8a8c5e5-ab1b-4a89-be16-a3de0f59c28a",
      "startDate": "2026-06-15",
      "endDate": "2026-06-18",
      "paymentMethod": "Online Payment"
    }
    ```
*   **Response Example** (HTTP 201 Created):
    ```json
    {
      "id": "b8a8c5e5-ab1b-4a89-be16-a3de0f59c28c",
      "status": "Pending",
      "totalFee": 75.00,
      "deposit": 150.00,
      "paymentIntentClientSecret": "pi_12345_secret_abcde",
      "startDate": "2026-06-15",
      "endDate": "2026-06-18"
    }
    ```
*   **Validation Rules**:
    *   StartDate must be in the future (VR-007) and EndDate >= StartDate (VR-008).
    *   PaymentMethod must be 'Online Payment' or 'Cash On Pickup'.
*   **Error Responses**:
    *   **HTTP 400 Bad Request**: Date range overlaps with an approved booking (EHR-005).

### 6.2 Process Booking Decision (Owner action)
*   **Method**: `POST`
*   **URL**: `/api/bookings/:id/resolve`
*   **Description**: Owners approve or reject pending requests.
*   **Authorization**: Authenticated (Listing Owner only)
*   **Request Example**:
    ```json
    {
      "decision": "Approved"
    }
    ```
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "id": "b8a8c5e5-ab1b-4a89-be16-a3de0f59c28c",
      "status": "Approved",
      "resolvedAt": "2026-06-09T08:15:00Z"
    }
    ```
*   **Validation Rules**:
    *   `decision` must be 'Approved' or 'Rejected'.
*   **Error Responses**:
    *   **HTTP 403 Forbidden**: User does not own this item's listing.

### 6.3 Cancel Booking Request
*   **Method**: `POST`
*   **URL**: `/api/bookings/:id/cancel`
*   **Description**: Renters cancel a pending request.
*   **Authorization**: Authenticated (Booking Renter only)
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "id": "b8a8c5e5-ab1b-4a89-be16-a3de0f59c28c",
      "status": "Cancelled"
    }
    ```
*   **Error Responses**:
    *   **HTTP 400 Bad Request**: Booking is already Approved or Active (EHR-006).

### 6.4 Handover Item (Pickup)
*   **Method**: `POST`
*   **URL**: `/api/bookings/:id/handover`
*   **Description**: Owner confirms the item pickup, transitioning status to `Active`.
*   **Authorization**: Authenticated (Listing Owner only)
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "id": "b8a8c5e5-ab1b-4a89-be16-a3de0f59c28c",
      "status": "Active",
      "handedOverAt": "2026-06-15T09:00:00Z"
    }
    ```

### 6.5 Confirm Item Return
*   **Method**: `POST`
*   **URL**: `/api/bookings/:id/return`
*   **Description**: Owner confirms receipt of returned item, transitioning status to `Returned` and triggering the deposit release.
*   **Authorization**: Authenticated (Listing Owner only)
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "id": "b8a8c5e5-ab1b-4a89-be16-a3de0f59c28c",
      "status": "Returned",
      "returnedAt": "2026-06-18T10:00:00Z"
    }
    ```

---

## 7. Payments Module

### 7.1 Confirm Online Payment Success
*   **Method**: `POST`
*   **URL**: `/api/bookings/:id/pay/confirm`
*   **Description**: Webhook or client callback to verify successful card capture.
*   **Authorization**: Authenticated (Renter or Webhook secret)
*   **Request Example**:
    ```json
    {
      "paymentIntentId": "pi_12345"
    }
    ```
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "bookingId": "b8a8c5e5-ab1b-4a89-be16-a3de0f59c28c",
      "paymentStatus": "Paid",
      "depositStatus": "Authorized"
    }
    ```
*   **Error Responses**:
    *   **HTTP 402 Payment Required**: Gateway declined or failed (EHR-011).

### 7.2 Record Cash Collection
*   **Method**: `POST`
*   **URL**: `/api/bookings/:id/collect-cash`
*   **Description**: Marks cash as physically collected during handover.
*   **Authorization**: Authenticated (Listing Owner only)
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "bookingId": "b8a8c5e5-ab1b-4a89-be16-a3de0f59c28c",
      "paymentStatus": "Collected"
    }
    ```

---

## 8. Damage Reports Module

### 8.1 Submit Damage Report
*   **Method**: `POST`
*   **URL**: `/api/damage-reports`
*   **Description**: Owner reports post-rental damage. Suspends automatic deposit release.
*   **Authorization**: Authenticated (Owner only)
*   **Request Example**:
    ```json
    {
      "bookingId": "b8a8c5e5-ab1b-4a89-be16-a3de0f59c28c",
      "description": "Chuck lock is broken and housing is cracked from dropping.",
      "deductionAmount": 50.00,
      "photos": ["https://res.cloudinary.com/itemrental/v1/damages/drill_broken.jpg"]
    }
    ```
*   **Response Example** (HTTP 201 Created):
    ```json
    {
      "reportId": "d8a8c5e5-ab1b-4a89-be16-a3de0f59c28e",
      "bookingId": "b8a8c5e5-ab1b-4a89-be16-a3de0f59c28c",
      "status": "Submitted",
      "deductionAmount": 50.00
    }
    ```
*   **Validation Rules**:
    *   `description`: Minimum 10 characters.
    *   `deductionAmount`: Must be > 0 and <= snapshot booking deposit (VR-012).
*   **Error Responses**:
    *   **HTTP 400 Bad Request**: Filing window is closed (>48 hours post-return) (BR-013) or deduction exceeds deposit limit (VR-012).

---

## 9. Reviews Module

### 9.1 Submit Review
*   **Method**: `POST`
*   **URL**: `/api/bookings/:id/reviews`
*   **Description**: Submits rating and commentary about the opposite party.
*   **Authorization**: Authenticated (Renter or Owner of the booking)
*   **Request Example**:
    ```json
    {
      "rating": 5,
      "comment": "Jane was extremely helpful and the drill worked perfectly. Recommended!"
    }
    ```
*   **Response Example** (HTTP 201 Created):
    ```json
    {
      "reviewId": "r8a8c5e5-ab1b-4a89-be16-a3de0f59c28f",
      "bookingId": "b8a8c5e5-ab1b-4a89-be16-a3de0f59c28c",
      "reviewerRole": "Renter",
      "rating": 5
    }
    ```
*   **Validation Rules**:
    *   `rating`: Integer between 1 and 5 (VR-010).
    *   `comment`: Maximum 500 characters (VR-011).
*   **Error Responses**:
    *   **HTTP 400 Bad Request**: Rental is not Returned (EHR-008) or review already submitted (EHR-007).

---

## 10. Admin Module

### 10.1 Manage Owner Verification Requests
*   **Method**: `POST`
*   **URL**: `/api/admin/verifications/:id/resolve`
*   **Description**: Approves or rejects owner identity requests.
*   **Authorization**: Authenticated (Admin only)
*   **Request Example**:
    ```json
    {
      "decision": "Approved",
      "reason": null
    }
    ```
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "verificationId": "v8a8c5e5-ab1b-4a89-be16-a3de0f59c28f",
      "status": "Approved"
    }
    ```

### 10.2 Manage Listings Approval Queue
*   **Method**: `POST`
*   **URL**: `/api/admin/listings/:id/resolve`
*   **Description**: Approves or rejects listings, controlling marketplace availability.
*   **Authorization**: Authenticated (Admin only)
*   **Request Example**:
    ```json
    {
      "decision": "Active",
      "feedback": "Approved for marketplace listing."
    }
    ```
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "listingId": "l8a8c5e5-ab1b-4a89-be16-a3de0f59c28a",
      "status": "Active"
    }
    ```

### 10.3 Inspect Audit Logs
*   **Method**: `GET`
*   **URL**: `/api/admin/audit-logs`
*   **Description**: Queries immutable action audit logs.
*   **Authorization**: Authenticated (Admin only)
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "logs": [
        {
          "id": 145,
          "actorId": "c8a8c5e5-ab1b-4a89-be16-a3de0f59c28d",
          "action": "VERIFY_OWNER_ID",
          "entityType": "OwnerVerification",
          "entityId": "v8a8c5e5-ab1b-4a89-be16-a3de0f59c28f",
          "ipAddress": "192.168.1.1",
          "metadata": { "status": "Approved" },
          "createdAt": "2026-06-09T08:20:00Z"
        }
      ],
      "totalCount": 1
    }
    ```

---

## 11. Analytics Module

### 11.1 Get Platform Metrics Dashboard
*   **Method**: `GET`
*   **URL**: `/api/admin/analytics`
*   **Description**: Aggregates operational performance metrics.
*   **Authorization**: Authenticated (Admin only)
*   **Response Example** (HTTP 200 OK):
    ```json
    {
      "metrics": {
        "activeRentalsCount": 142,
        "revenueSummary": {
          "totalVolume": 18450.00,
          "onlineVolume": 12450.00,
          "cashVolume": 6000.00
        },
        "topRentedItems": [
          {
            "listingId": "l8a8c5e5-ab1b-4a89-be16-a3de0f59c28a",
            "title": "Professional Cordless Drill",
            "bookingCount": 42
          }
        ],
        "pendingVerificationRequestsCount": 8
      }
    }
    ```
