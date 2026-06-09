import { PaymentsService } from './payments.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    createCheckoutSession(dto: CreateCheckoutSessionDto, user: any): Promise<{
        url: string;
    }>;
    verifySession(sessionId: string, user: any): Promise<{
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
}
