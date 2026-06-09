import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
export declare class PaymentsService {
    private prisma;
    private stripeClient;
    private frontendUrl;
    constructor(prisma: PrismaService);
    private getStripe;
    private getServiceFeePercent;
    private calculateServerTotal;
    createCheckoutSession(dto: CreateCheckoutSessionDto, userId: string): Promise<{
        url: string;
    }>;
    verifySession(sessionId: string, userId: string): Promise<{
        success: boolean;
        alreadyProcessed: boolean;
        bookingId: string;
        paymentStatus: string;
        amount: number;
        paidAt?: undefined;
    } | {
        success: boolean;
        alreadyProcessed: boolean;
        bookingId: string;
        paymentStatus: string;
        amount: number;
        paidAt: string;
    }>;
    refundPayment(paymentIntentId: string): Promise<import("stripe/cjs/lib").Response<import("stripe/cjs/resources/Refunds").Refund>>;
}
