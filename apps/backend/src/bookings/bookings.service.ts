import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, ResolveBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookingDto, renterId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== 'Active') {
      throw new BadRequestException('This listing is not currently active or bookable');
    }

    if (listing.ownerId === renterId) {
      throw new BadRequestException('You cannot rent your own item');
    }

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid start or end date format');
    }

    // Set times to midnight for date-only comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    if (end < start) {
      throw new BadRequestException('End date must be on or after start date');
    }

    // Perform validation and database insertion in a single transaction
    return this.prisma.$transaction(async (tx) => {
      // 1. Check owner blockouts
      const blocked = await tx.availability.findFirst({
        where: {
          listingId: listing.id,
          isBlocked: true,
          startDate: { lte: end },
          endDate: { gte: start },
        },
      });

      if (blocked) {
        throw new BadRequestException('The listing is blocked by the owner during the selected dates');
      }

      // 2. Check overlapping approved/active bookings
      const overlap = await tx.booking.findFirst({
        where: {
          listingId: listing.id,
          status: { in: ['Approved', 'Active'] },
          startDate: { lte: end },
          endDate: { gte: start },
        },
      });

      if (overlap) {
        throw new BadRequestException('The item is already booked during these dates');
      }

      // Calculate total price
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const totalAmount = Number(listing.dailyPrice) * diffDays;

      // 3. Create the Booking
      const booking = await tx.booking.create({
        data: {
          renterId,
          listingId: listing.id,
          startDate: start,
          endDate: end,
          status: 'Pending',
          dailyPriceSnapshot: listing.dailyPrice,
          depositSnapshot: listing.depositAmount,
          payments: {
            create: {
              paymentMethod: dto.paymentMethod,
              amount: totalAmount,
              status: dto.paymentMethod === 'Online Payment' ? 'Paid' : 'Pending Cash Exchange',
            },
          },
          deposit: {
            create: {
              amount: listing.depositAmount,
              status: dto.paymentMethod === 'Online Payment' ? 'Held' : 'Authorized',
            },
          },
        },
        include: {
          listing: true,
          payments: true,
          deposit: true,
        },
      });

      // Write audit log
      await tx.auditLog.create({
        data: {
          actorId: renterId,
          action: 'CREATE_BOOKING',
          entityType: 'Booking',
          entityId: booking.id,
          metadata: { totalAmount, depositAmount: Number(listing.depositAmount) },
        },
      });

      return booking;
    });
  }

  async findAll(user: any) {
    const where: any = {};

    if (user.role.name === 'RENTER') {
      where.renterId = user.id;
    } else if (user.role.name === 'OWNER') {
      where.listing = { ownerId: user.id };
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        listing: {
          include: {
            photos: true,
          },
        },
        renter: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        payments: true,
        deposit: true,
        reviews: true,
        damageReports: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string, userRole: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        listing: {
          include: {
            photos: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        renter: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        payments: true,
        deposit: true,
        reviews: true,
        damageReports: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (
      booking.renterId !== userId &&
      booking.listing.ownerId !== userId &&
      userRole !== 'ADMIN'
    ) {
      throw new ForbiddenException('You do not have access to this booking');
    }

    return booking;
  }

  async resolve(id: string, dto: ResolveBookingDto, ownerId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { listing: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.listing.ownerId !== ownerId) {
      throw new ForbiddenException('Only the owner of the listing can resolve this request');
    }

    if (booking.status !== 'Pending') {
      throw new BadRequestException('This booking has already been resolved');
    }

    if (dto.status === 'Approved') {
      return this.prisma.$transaction(async (tx) => {
        // Double check overlap rules inside transaction to prevent concurrency issues
        const overlap = await tx.booking.findFirst({
          where: {
            listingId: booking.listingId,
            status: { in: ['Approved', 'Active'] },
            startDate: { lte: booking.endDate },
            endDate: { gte: booking.startDate },
            id: { not: booking.id },
          },
        });

        if (overlap) {
          throw new BadRequestException('Cannot approve booking: item is already approved for overlapping dates');
        }

        const updated = await tx.booking.update({
          where: { id },
          data: { status: 'Approved' },
          include: { payments: true, deposit: true },
        });

        await tx.auditLog.create({
          data: {
            actorId: ownerId,
            action: 'APPROVE_BOOKING',
            entityType: 'Booking',
            entityId: id,
            metadata: { prevStatus: booking.status, newStatus: 'Approved' },
          },
        });

        return updated;
      });
    } else {
      const updated = await this.prisma.booking.update({
        where: { id },
        data: { status: 'Rejected' },
        include: { payments: true, deposit: true },
      });

      await this.prisma.auditLog.create({
        data: {
          actorId: ownerId,
          action: 'REJECT_BOOKING',
          entityType: 'Booking',
          entityId: id,
          metadata: { prevStatus: booking.status, newStatus: 'Rejected' },
        },
      });

      return updated;
    }
  }

  async updateStatus(id: string, status: string, userId: string, userRole: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { listing: true, deposit: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const isOwner = booking.listing.ownerId === userId;
    const isRenter = booking.renterId === userId;
    const isAdmin = userRole === 'ADMIN';

    // State transition checks
    if (status === 'Active') {
      // Rental start - typically done by owner on pick up
      if (!isOwner && !isAdmin) {
        throw new ForbiddenException('Only the owner or admin can mark a booking as Active');
      }
      if (booking.status !== 'Approved') {
        throw new BadRequestException('Only approved bookings can be marked as Active');
      }
    } else if (status === 'Returned') {
      // Rental complete - done by owner on return
      if (!isOwner && !isAdmin) {
        throw new ForbiddenException('Only the owner or admin can mark a booking as Returned');
      }
      if (booking.status !== 'Active') {
        throw new BadRequestException('Only active bookings can be marked as Returned');
      }
    } else if (status === 'Cancelled') {
      // Cancelled - only before approval by renter
      if (!isRenter && !isAdmin) {
        throw new ForbiddenException('Only the renter or admin can cancel this booking');
      }
      if (booking.status !== 'Pending') {
        throw new BadRequestException('Bookings can only be cancelled before they are approved');
      }
    } else {
      throw new BadRequestException('Invalid status update request');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { status },
        include: { payments: true, deposit: true },
      });

      // Special side-effects
      if (status === 'Returned' && booking.deposit) {
        // Automatically release deposit if returned and no damage reported yet
        // In full flow, owner has 48h to report damage. Let's default release for MVP.
        await tx.deposit.update({
          where: { bookingId: id },
          data: {
            status: 'Released',
            releasedAt: new Date(),
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: `UPDATE_BOOKING_STATUS_${status.toUpperCase()}`,
          entityType: 'Booking',
          entityId: id,
          metadata: { prevStatus: booking.status, newStatus: status },
        },
      });

      return updated;
    });
  }

  async reportDamage(id: string, description: string, deductionAmount: number, ownerId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { listing: true, deposit: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.listing.ownerId !== ownerId) {
      throw new ForbiddenException('Only the listing owner can file damage reports');
    }

    if (booking.status !== 'Returned') {
      throw new BadRequestException('Damage reports can only be submitted after the item is returned');
    }

    if (!booking.deposit) {
      throw new BadRequestException('No deposit associated with this booking');
    }

    if (deductionAmount > Number(booking.deposit.amount)) {
      throw new BadRequestException('Deduction amount cannot exceed the deposit amount');
    }

    return this.prisma.$transaction(async (tx) => {
      const damage = await tx.damageReport.create({
        data: {
          bookingId: id,
          ownerId,
          renterId: booking.renterId,
          description,
          deductionAmount,
          status: 'Submitted',
        },
      });

      // Update Deposit ledger status
      await tx.deposit.update({
        where: { bookingId: id },
        data: {
          status: 'Deducted',
          deductedAmount: deductionAmount,
          releasedAt: new Date(),
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: ownerId,
          action: 'CREATE_DAMAGE_REPORT',
          entityType: 'DamageReport',
          entityId: damage.id,
          metadata: { deductionAmount },
        },
      });

      return damage;
    });
  }

  async leaveReview(id: string, rating: number, comment: string, reviewerId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { listing: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== 'Returned') {
      throw new BadRequestException('Reviews are only allowed after the item has been returned');
    }

    let reviewerRole: 'Renter' | 'Owner';
    let revieweeId: string;

    if (booking.renterId === reviewerId) {
      reviewerRole = 'Renter';
      revieweeId = booking.listing.ownerId;
    } else if (booking.listing.ownerId === reviewerId) {
      reviewerRole = 'Owner';
      revieweeId = booking.renterId;
    } else {
      throw new ForbiddenException('You are not authorized to review this booking');
    }

    // Check duplicate review
    const duplicate = await this.prisma.review.findFirst({
      where: {
        bookingId: id,
        reviewerRole,
      },
    });

    if (duplicate) {
      throw new BadRequestException('You have already reviewed this booking');
    }

    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          bookingId: id,
          reviewerId,
          revieweeId,
          rating,
          comment,
          reviewerRole,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: reviewerId,
          action: 'CREATE_REVIEW',
          entityType: 'Review',
          entityId: review.id,
          metadata: { rating },
        },
      });

      return review;
    });
  }
}
