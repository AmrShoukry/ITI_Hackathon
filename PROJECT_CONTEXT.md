PROJECT: Item Rental System

OVERVIEW

A web platform where people can rent out their own items or rent items from other users instead of buying them.

====================================================
USER ROLES
====================================================

1. Guest

Permissions:

- Browse listings
- Search items
- View item details
- View owner rating

Restrictions:

- Cannot create bookings
- Cannot leave reviews
- Must register before booking

---

2. Renter

Permissions:

- Register
- Login
- Manage profile
- Search items
- Filter items
- View item details
- Create booking requests
- Select rental period
- Pay online
- Pay cash on pickup
- Track bookings
- View rental history
- Rate owners
- Leave reviews

---

3. Owner

Permissions:

- Register
- Login
- Upload National ID
- Submit verification request
- Create listing
- Edit listing
- Delete listing
- Upload photos
- Manage availability
- Approve booking
- Reject booking
- Confirm item return
- Report damage

---

4. Admin

Permissions:

- Manage users
- Manage roles
- Approve owner verification
- Approve listings
- Reject listings
- Configure categories
- Configure pricing policies
- Configure deposit policies
- View analytics
- View reports

====================================================
LISTINGS MODULE
====================================================

Each listing contains:

- Title
- Description
- Category
- Condition
- Daily Price
- Deposit Amount
- Photos
- Owner

Condition Values:

- New
- Good
- Acceptable

Features:

- Create Listing
- Update Listing
- Delete Listing
- View Listing
- Listing Approval

====================================================
BOOKING MODULE
====================================================

Booking Features:

- Date Range Selection
- Availability Validation
- Conflict Detection
- Booking Approval Workflow

Booking Statuses:

Pending
Approved
Active
Returned
Cancelled
Rejected

Booking Rules:

- Booking must not overlap with another approved booking.
- Booking can be cancelled only before approval.
- Approved booking reserves dates.
- Returned booking closes rental lifecycle.

====================================================
PAYMENT MODULE
====================================================

Supported Payment Methods:

1. Online Payment
2. Cash On Pickup

Deposit Rules:

- Deposit belongs to booking
- Deposit tracked separately
- Deposit released after successful return
- Deposit deducted if damage confirmed

====================================================
DAMAGE REPORTS
====================================================

Owner can:

- Report damage
- Upload evidence photos
- Enter damage description
- Specify deduction amount

Damage Report linked to:

- Booking
- Item
- Owner
- Renter

====================================================
REVIEWS & RATINGS
====================================================

Renter rates Owner

Owner rates Renter

Rules:

- Review only after return
- One review per booking
- Ratings visible on profiles

====================================================
OWNER VERIFICATION
====================================================

Owner uploads:

- National ID image

Verification Status:

Pending
Approved
Rejected

====================================================
ADMIN ANALYTICS
====================================================

Metrics:

- Active Rentals
- Revenue Summary
- Top Rented Items
- Pending Verification Requests

====================================================
SHARED REQUIREMENTS
====================================================

Authentication
Authorization (RBAC)
Responsive Design
Arabic Language
English Language
Mobile Support
REST APIs
Audit Logging

====================================================
RECOMMENDED TECH STACK
====================================================

Frontend:
Next.js
TypeScript
TailwindCSS

Backend:
NestJS

Database:
PostgreSQL

ORM:
Prisma

Storage:
Cloudinary

Authentication:
JWT

Architecture:
REST API
