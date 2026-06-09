import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import Stripe = require('stripe');
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { calculateBookingTotal, toStripeAmount } from './pricing.util';

type StripeClient = InstanceType<typeof Stripe>;

@Injectable()
export class PaymentsService {
  private stripeClient: StripeClient | null = null;
  private frontendUrl: string;

  constructor(private prisma: PrismaService) {
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  private getStripe(): StripeClient {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new BadRequestException(
        'Stripe is not configured. Set STRIPE_SECRET_KEY in the environment.',
      );
    }

    if (!this.stripeClient) {
      this.stripeClient = new Stripe(secretKey);
    }

    return this.stripeClient;
  }

  private async getServiceFeePercent(): Promise<number> {
    const setting = await this.prisma.adminSetting.findUnique({
      where: { settingKey: 'service_fee_percent' },
    });

    if (!setting) {
      return 0;
    }

    const parsed = parseFloat(setting.settingValue);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private async calculateServerTotal(booking: {
    startDate: Date;
    endDate: Date;
    dailyPriceSnapshot: { toString(): string };
  }) {
    const serviceFeePercent = await this.getServiceFeePercent();
    return calculateBookingTotal(
      Number(booking.dailyPriceSnapshot),
      booking.startDate,
      booking.endDate,
      serviceFeePercent,
    );
  }

  async createCheckoutSession(dto: CreateCheckoutSessionDto, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: {
        listing: true,
        payments: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.renterId !== userId) {
      throw new ForbiddenException('You can only pay for your own bookings');
    }

    if (booking.status !== 'Pending') {
      throw new BadRequestException(
        'Payment is only available for pending bookings',
      );
    }

    const payment = booking.payments.find(
      (record) => record.paymentMethod === 'Online Payment',
    );

    if (!payment) {
      throw new BadRequestException(
        'This booking does not require online payment',
      );
    }

    if (payment.status === 'Paid') {
      throw new BadRequestException('This booking has already been paid');
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
          unit_amount: toStripeAmount(pricing.rentalSubtotal),
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
          unit_amount: toStripeAmount(pricing.serviceFee),
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
      throw new InternalServerErrorException(
        'Failed to create Stripe checkout session',
      );
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

  async verifySession(sessionId: string, userId: string) {
    if (!sessionId) {
      throw new BadRequestException('session_id is required');
    }

    let session: Awaited<
      ReturnType<StripeClient['checkout']['sessions']['retrieve']>
    >;
    try {
      session = await this.getStripe().checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent'],
      });
    } catch {
      throw new BadRequestException('Invalid or expired checkout session');
    }

    const bookingId = session.metadata?.bookingId;
    const metadataUserId = session.metadata?.userId;

    if (!bookingId || !metadataUserId) {
      throw new BadRequestException('Checkout session metadata is invalid');
    }

    if (metadataUserId !== userId) {
      throw new ForbiddenException(
        'This payment session does not belong to your account',
      );
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: true,
        payments: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const payment = booking.payments.find(
      (record) => record.paymentMethod === 'Online Payment',
    );

    if (!payment) {
      throw new BadRequestException(
        'No online payment record found for this booking',
      );
    }

    if (
      payment.status === 'Paid' &&
      payment.stripeCheckoutSessionId === sessionId
    ) {
      return {
        success: true,
        alreadyProcessed: true,
        bookingId: booking.id,
        paymentStatus: payment.status,
        amount: Number(payment.amount),
      };
    }

    if (payment.status === 'Paid') {
      throw new BadRequestException(
        'This booking was already paid through a different session',
      );
    }

    if (session.payment_status !== 'paid') {
      throw new BadRequestException(
        'Payment has not been completed. Please try again.',
      );
    }

    const pricing = await this.calculateServerTotal(booking);
    const paidAmountCents = session.amount_total;

    if (paidAmountCents !== toStripeAmount(pricing.totalAmount)) {
      throw new BadRequestException(
        'Paid amount does not match the server-calculated total',
      );
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id;

    if (!paymentIntentId) {
      throw new BadRequestException('Payment intent not found on session');
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

  async refundPayment(paymentIntentId: string) {
    const stripe = this.getStripe();
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
      });
      return refund;
    } catch (error: any) {
      console.error('Failed to refund Stripe payment:', error);
      throw new BadRequestException(`Stripe refund failed: ${error.message}`);
    }
  }
}

