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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const Stripe = require("stripe");
const prisma_service_1 = require("../prisma/prisma.service");
const pricing_util_1 = require("./pricing.util");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.stripeClient = null;
        this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    }
    getStripe() {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            throw new common_1.BadRequestException('Stripe is not configured. Set STRIPE_SECRET_KEY in the environment.');
        }
        if (!this.stripeClient) {
            this.stripeClient = new Stripe(secretKey);
        }
        return this.stripeClient;
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
    async calculateServerTotal(booking) {
        const serviceFeePercent = await this.getServiceFeePercent();
        return (0, pricing_util_1.calculateBookingTotal)(Number(booking.dailyPriceSnapshot), booking.startDate, booking.endDate, serviceFeePercent);
    }
    async createCheckoutSession(dto, userId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: {
                listing: true,
                payments: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.renterId !== userId) {
            throw new common_1.ForbiddenException('You can only pay for your own bookings');
        }
        if (booking.status !== 'Pending') {
            throw new common_1.BadRequestException('Payment is only available for pending bookings');
        }
        const payment = booking.payments.find((record) => record.paymentMethod === 'Online Payment');
        if (!payment) {
            throw new common_1.BadRequestException('This booking does not require online payment');
        }
        if (payment.status === 'Paid') {
            throw new common_1.BadRequestException('This booking has already been paid');
        }
        const pricing = await this.calculateServerTotal(booking);
        const lineItems = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Rental: ${booking.listing.title}`,
                        description: `${pricing.rentalDays} day rental`,
                    },
                    unit_amount: (0, pricing_util_1.toStripeAmount)(pricing.rentalSubtotal),
                },
                quantity: 1,
            },
        ];
        if (pricing.serviceFee > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Service Fee',
                        description: 'Platform service fee',
                    },
                    unit_amount: (0, pricing_util_1.toStripeAmount)(pricing.serviceFee),
                },
                quantity: 1,
            });
        }
        const session = await this.getStripe().checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: lineItems,
            metadata: {
                bookingId: booking.id,
                userId,
            },
            success_url: `${this.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.frontendUrl}/payment/cancel?booking_id=${booking.id}`,
        });
        if (!session.url) {
            throw new common_1.InternalServerErrorException('Failed to create Stripe checkout session');
        }
        await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                amount: pricing.totalAmount,
                stripeCheckoutSessionId: session.id,
                status: 'Pending',
            },
        });
        return { url: session.url };
    }
    async verifySession(sessionId, userId) {
        if (!sessionId) {
            throw new common_1.BadRequestException('session_id is required');
        }
        let session;
        try {
            session = await this.getStripe().checkout.sessions.retrieve(sessionId, {
                expand: ['payment_intent'],
            });
        }
        catch {
            throw new common_1.BadRequestException('Invalid or expired checkout session');
        }
        const bookingId = session.metadata?.bookingId;
        const metadataUserId = session.metadata?.userId;
        if (!bookingId || !metadataUserId) {
            throw new common_1.BadRequestException('Checkout session metadata is invalid');
        }
        if (metadataUserId !== userId) {
            throw new common_1.ForbiddenException('This payment session does not belong to your account');
        }
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                listing: true,
                payments: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        const payment = booking.payments.find((record) => record.paymentMethod === 'Online Payment');
        if (!payment) {
            throw new common_1.BadRequestException('No online payment record found for this booking');
        }
        if (payment.status === 'Paid' &&
            payment.stripeCheckoutSessionId === sessionId) {
            return {
                success: true,
                alreadyProcessed: true,
                bookingId: booking.id,
                paymentStatus: payment.status,
                amount: Number(payment.amount),
            };
        }
        if (payment.status === 'Paid') {
            throw new common_1.BadRequestException('This booking was already paid through a different session');
        }
        if (session.payment_status !== 'paid') {
            throw new common_1.BadRequestException('Payment has not been completed. Please try again.');
        }
        const pricing = await this.calculateServerTotal(booking);
        const paidAmountCents = session.amount_total;
        if (paidAmountCents !== (0, pricing_util_1.toStripeAmount)(pricing.totalAmount)) {
            throw new common_1.BadRequestException('Paid amount does not match the server-calculated total');
        }
        const paymentIntentId = typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id;
        if (!paymentIntentId) {
            throw new common_1.BadRequestException('Payment intent not found on session');
        }
        const paidAt = new Date();
        await this.prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'Paid',
                    amount: pricing.totalAmount,
                    stripeCheckoutSessionId: sessionId,
                    stripePaymentIntentId: paymentIntentId,
                    gatewayReference: sessionId,
                    paidAt,
                },
            });
            await tx.deposit.updateMany({
                where: { bookingId: booking.id },
                data: { status: 'Held' },
            });
            await tx.auditLog.create({
                data: {
                    actorId: userId,
                    action: 'PAYMENT_VERIFIED',
                    entityType: 'Payment',
                    entityId: payment.id,
                    metadata: {
                        bookingId: booking.id,
                        sessionId,
                        paymentIntentId,
                        amount: pricing.totalAmount,
                    },
                },
            });
        });
        return {
            success: true,
            alreadyProcessed: false,
            bookingId: booking.id,
            paymentStatus: 'Paid',
            amount: pricing.totalAmount,
            paidAt: paidAt.toISOString(),
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map