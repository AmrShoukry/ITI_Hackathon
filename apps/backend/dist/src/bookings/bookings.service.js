"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pricing_util_1 = require("../payments/pricing.util");
const payments_service_1 = require("../payments/payments.service");
let BookingsService = class BookingsService {
    constructor(prisma, paymentsService) {
        this.prisma = prisma;
        this.paymentsService = paymentsService;
    }
    async getServiceFeePercent() {
        const setting = await this.prisma.adminSetting.findUnique({
            where: { settingKey: 'service_fee_percent' },
        });
        if (!setting) {
            return 0;
        }
        const parsed = parseFloat(setting.settingValue);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    async create(dto, renterId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: dto.listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.status !== 'Active') {
            throw new common_1.BadRequestException('This listing is not currently active or bookable');
        }
        if (listing.ownerId === renterId) {
            throw new common_1.BadRequestException('You cannot rent your own item');
        }
        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid start or end date format');
        }
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (start < today) {
            throw new common_1.BadRequestException('Start date cannot be in the past');
        }
        if (end < start) {
            throw new common_1.BadRequestException('End date must be on or after start date');
        }
        return this.prisma.$transaction(async (tx) => {
            const blocked = await tx.availability.findFirst({
                where: {
                    listingId: listing.id,
                    isBlocked: true,
                    startDate: { lte: end },
                    endDate: { gte: start },
                },
            });
            if (blocked) {
                throw new common_1.BadRequestException('The listing is blocked by the owner during the selected dates');
            }
            const overlap = await tx.booking.findFirst({
                where: {
                    listingId: listing.id,
                    status: { in: ['Approved', 'Active'] },
                    startDate: { lte: end },
                    endDate: { gte: start },
                },
            });
            if (overlap) {
                throw new common_1.BadRequestException('The item is already booked during these dates');
            }
            const serviceFeePercent = await this.getServiceFeePercent();
            const pricing = (0, pricing_util_1.calculateBookingTotal)(Number(listing.dailyPrice), start, end, serviceFeePercent);
            const totalAmount = pricing.totalAmount;
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
                            status: dto.paymentMethod === 'Online Payment'
                                ? 'Pending'
                                : 'Pending Cash Exchange',
                        },
                    },
                    deposit: {
                        create: {
                            amount: listing.depositAmount,
                            status: dto.paymentMethod === 'Online Payment'
                                ? 'Authorized'
                                : 'Authorized',
                        },
                    },
                },
                include: {
                    listing: true,
                    payments: true,
                    deposit: true,
                },
            });
            await tx.auditLog.create({
                data: {
                    actorId: renterId,
                    action: 'CREATE_BOOKING',
                    entityType: 'Booking',
                    entityId: booking.id,
                    metadata: {
                        totalAmount,
                        rentalSubtotal: pricing.rentalSubtotal,
                        serviceFee: pricing.serviceFee,
                        depositAmount: Number(listing.depositAmount),
                    },
                },
            });
            return booking;
        });
    }
    async findAll(user) {
        const where = {};
        if (user.role.name === 'RENTER') {
            where.renterId = user.id;
        }
        else if (user.role.name === 'OWNER') {
            where.listing = { ownerId: user.id };
        }
        return this.prisma.booking.findMany({
            where,
            include: {
                listing: {
                    include: {
                        photos: true,
                        owner: {
                            select: {
                                id: true,
                                name: true,
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
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id, userId, userRole) {
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
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.renterId !== userId &&
            booking.listing.ownerId !== userId &&
            userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('You do not have access to this booking');
        }
        return booking;
    }
    async resolve(id, dto, ownerId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { listing: true, payments: true, deposit: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.listing.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Only the owner of the listing can resolve this request');
        }
        if (booking.status !== 'Pending') {
            throw new common_1.BadRequestException('This booking has already been resolved');
        }
        if (dto.status === 'Approved') {
            return this.prisma.$transaction(async (tx) => {
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
                    throw new common_1.BadRequestException('Cannot approve booking: item is already approved for overlapping dates');
                }
                const paymentRecord = await tx.payment.findFirst({
                    where: { bookingId: id },
                });
                if (paymentRecord &&
                    paymentRecord.paymentMethod === 'Online Payment' &&
                    paymentRecord.status !== 'Paid') {
                    throw new common_1.BadRequestException('Cannot approve booking: online payment not completed');
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
        }
        else {
            return this.prisma.$transaction(async (tx) => {
                const updated = await tx.booking.update({
                    where: { id },
                    data: { status: 'Rejected' },
                    include: { payments: true, deposit: true },
                });
                const paidPayment = booking.payments.find((p) => p.paymentMethod === 'Online Payment' && p.status === 'Paid');
                if (paidPayment && paidPayment.stripePaymentIntentId) {
                    try {
                        await this.paymentsService.refundPayment(paidPayment.stripePaymentIntentId);
                        await tx.payment.update({
                            where: { id: paidPayment.id },
                            data: { status: 'Refunded' },
                        });
                    }
                    catch (err) {
                        console.error(`Failed to refund payment for booking ${id}:`, err);
                    }
                }
                if (booking.deposit) {
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
                        actorId: ownerId,
                        action: 'REJECT_BOOKING',
                        entityType: 'Booking',
                        entityId: id,
                        metadata: { prevStatus: booking.status, newStatus: 'Rejected' },
                    },
                });
                return updated;
            });
        }
    }
    async updateStatus(id, status, userId, userRole) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { listing: true, deposit: true, payments: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        const isOwner = booking.listing.ownerId === userId;
        const isRenter = booking.renterId === userId;
        const isAdmin = userRole === 'ADMIN';
        if (status === 'Active') {
            if (!isOwner && !isAdmin) {
                throw new common_1.ForbiddenException('Only the owner or admin can mark a booking as Active');
            }
            if (booking.status !== 'Approved') {
                throw new common_1.BadRequestException('Only approved bookings can be marked as Active');
            }
        }
        else if (status === 'Returned') {
            if (!isOwner && !isAdmin) {
                throw new common_1.ForbiddenException('Only the owner or admin can mark a booking as Returned');
            }
            if (booking.status !== 'Active') {
                throw new common_1.BadRequestException('Only active bookings can be marked as Returned');
            }
        }
        else if (status === 'Cancelled') {
            if (!isRenter && !isOwner && !isAdmin) {
                throw new common_1.ForbiddenException('Only the renter, owner, or admin can cancel this booking');
            }
            if (booking.status !== 'Pending' && booking.status !== 'Approved') {
                throw new common_1.BadRequestException('Bookings can only be cancelled before they start');
            }
        }
        else {
            throw new common_1.BadRequestException('Invalid status update request');
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.booking.update({
                where: { id },
                data: { status },
                include: { payments: true, deposit: true },
            });
            if (status === 'Returned' && booking.deposit) {
                await tx.deposit.update({
                    where: { bookingId: id },
                    data: {
                        status: 'Released',
                        releasedAt: new Date(),
                    },
                });
            }
            if (status === 'Cancelled') {
                const paidPayment = booking.payments.find((p) => p.paymentMethod === 'Online Payment' && p.status === 'Paid');
                if (paidPayment && paidPayment.stripePaymentIntentId) {
                    try {
                        await this.paymentsService.refundPayment(paidPayment.stripePaymentIntentId);
                        await tx.payment.update({
                            where: { id: paidPayment.id },
                            data: { status: 'Refunded' },
                        });
                    }
                    catch (err) {
                        console.error(`Failed to refund payment for booking ${id}:`, err);
                    }
                }
                if (booking.deposit) {
                    await tx.deposit.update({
                        where: { bookingId: id },
                        data: {
                            status: 'Released',
                            releasedAt: new Date(),
                        },
                    });
                }
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
    async reportDamage(id, description, deductionAmount, ownerId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { listing: true, deposit: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.listing.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Only the listing owner can file damage reports');
        }
        if (booking.status !== 'Returned') {
            throw new common_1.BadRequestException('Damage reports can only be submitted after the item is returned');
        }
        if (!booking.deposit) {
            throw new common_1.BadRequestException('No deposit associated with this booking');
        }
        if (deductionAmount > Number(booking.deposit.amount)) {
            throw new common_1.BadRequestException('Deduction amount cannot exceed the deposit amount');
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
    async leaveReview(id, rating, comment, reviewerId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { listing: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== 'Returned') {
            throw new common_1.BadRequestException('Reviews are only allowed after the item has been returned');
        }
        let reviewerRole;
        let revieweeId;
        if (booking.renterId === reviewerId) {
            reviewerRole = 'Renter';
            revieweeId = booking.listing.ownerId;
        }
        else if (booking.listing.ownerId === reviewerId) {
            reviewerRole = 'Owner';
            revieweeId = booking.renterId;
        }
        else {
            throw new common_1.ForbiddenException('You are not authorized to review this booking');
        }
        const duplicate = await this.prisma.review.findFirst({
            where: {
                bookingId: id,
                reviewerRole,
            },
        });
        if (duplicate) {
            throw new common_1.BadRequestException('You have already reviewed this booking');
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
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payments_service_1.PaymentsService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map