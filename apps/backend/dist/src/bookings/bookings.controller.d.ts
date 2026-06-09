import { BookingsService } from './bookings.service';
import { CreateBookingDto, ResolveBookingDto } from './dto/booking.dto';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    create(dto: CreateBookingDto, user: any): Promise<{
        listing: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            categoryId: number;
            title: string;
            description: string;
            condition: string;
            dailyPrice: import("@prisma/client/runtime/library").Decimal;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
        };
        deposit: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
            bookingId: string;
            deductedAmount: import("@prisma/client/runtime/library").Decimal;
            releasedAt: Date | null;
        };
        payments: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            paymentMethod: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
            stripeCheckoutSessionId: string | null;
            stripePaymentIntentId: string | null;
            paidAt: Date | null;
            bookingId: string;
        }[];
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        status: string;
        dailyPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
        depositSnapshot: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        renterId: string;
        listingId: string;
    }>;
    findAll(user: any): Promise<({
        listing: {
            owner: {
                id: string;
                name: string;
            };
            photos: {
                id: string;
                createdAt: Date;
                listingId: string;
                photoUrl: string;
                displayOrder: number;
            }[];
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            categoryId: number;
            title: string;
            description: string;
            condition: string;
            dailyPrice: import("@prisma/client/runtime/library").Decimal;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
        };
        deposit: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
            bookingId: string;
            deductedAmount: import("@prisma/client/runtime/library").Decimal;
            releasedAt: Date | null;
        };
        renter: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        payments: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            paymentMethod: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
            stripeCheckoutSessionId: string | null;
            stripePaymentIntentId: string | null;
            paidAt: Date | null;
            bookingId: string;
        }[];
        damageReports: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            renterId: string;
            ownerId: string;
            description: string;
            bookingId: string;
            deductionAmount: import("@prisma/client/runtime/library").Decimal;
        }[];
        reviews: {
            id: string;
            createdAt: Date;
            bookingId: string;
            reviewerId: string;
            revieweeId: string;
            rating: number;
            comment: string | null;
            reviewerRole: string;
        }[];
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        status: string;
        dailyPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
        depositSnapshot: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        renterId: string;
        listingId: string;
    })[]>;
    findOne(id: string, user: any): Promise<{
        listing: {
            owner: {
                id: string;
                name: string;
                email: string;
                phone: string;
            };
            photos: {
                id: string;
                createdAt: Date;
                listingId: string;
                photoUrl: string;
                displayOrder: number;
            }[];
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            categoryId: number;
            title: string;
            description: string;
            condition: string;
            dailyPrice: import("@prisma/client/runtime/library").Decimal;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
        };
        deposit: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
            bookingId: string;
            deductedAmount: import("@prisma/client/runtime/library").Decimal;
            releasedAt: Date | null;
        };
        renter: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        payments: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            paymentMethod: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
            stripeCheckoutSessionId: string | null;
            stripePaymentIntentId: string | null;
            paidAt: Date | null;
            bookingId: string;
        }[];
        damageReports: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            renterId: string;
            ownerId: string;
            description: string;
            bookingId: string;
            deductionAmount: import("@prisma/client/runtime/library").Decimal;
        }[];
        reviews: {
            id: string;
            createdAt: Date;
            bookingId: string;
            reviewerId: string;
            revieweeId: string;
            rating: number;
            comment: string | null;
            reviewerRole: string;
        }[];
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        status: string;
        dailyPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
        depositSnapshot: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        renterId: string;
        listingId: string;
    }>;
    resolve(id: string, dto: ResolveBookingDto, user: any): Promise<{
        deposit: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
            bookingId: string;
            deductedAmount: import("@prisma/client/runtime/library").Decimal;
            releasedAt: Date | null;
        };
        payments: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            paymentMethod: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
            stripeCheckoutSessionId: string | null;
            stripePaymentIntentId: string | null;
            paidAt: Date | null;
            bookingId: string;
        }[];
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        status: string;
        dailyPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
        depositSnapshot: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        renterId: string;
        listingId: string;
    }>;
    updateStatus(id: string, status: string, user: any): Promise<{
        deposit: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
            bookingId: string;
            deductedAmount: import("@prisma/client/runtime/library").Decimal;
            releasedAt: Date | null;
        };
        payments: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            paymentMethod: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
            stripeCheckoutSessionId: string | null;
            stripePaymentIntentId: string | null;
            paidAt: Date | null;
            bookingId: string;
        }[];
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        status: string;
        dailyPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
        depositSnapshot: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        renterId: string;
        listingId: string;
    }>;
    reportDamage(id: string, description: string, deductionAmount: number, user: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        renterId: string;
        ownerId: string;
        description: string;
        bookingId: string;
        deductionAmount: import("@prisma/client/runtime/library").Decimal;
    }>;
    leaveReview(id: string, rating: number, comment: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        bookingId: string;
        reviewerId: string;
        revieweeId: string;
        rating: number;
        comment: string | null;
        reviewerRole: string;
    }>;
}
