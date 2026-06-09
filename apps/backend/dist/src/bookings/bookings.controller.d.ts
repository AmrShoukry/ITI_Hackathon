import { BookingsService } from './bookings.service';
import { CreateBookingDto, ResolveBookingDto } from './dto/booking.dto';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    create(dto: CreateBookingDto, user: any): Promise<{
        listing: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            ownerId: string;
            title: string;
            categoryId: number;
            condition: string;
            dailyPrice: import("@prisma/client/runtime/library").Decimal;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
        };
        deposit: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            bookingId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
            deductedAmount: import("@prisma/client/runtime/library").Decimal;
            releasedAt: Date | null;
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            bookingId: string;
            paymentMethod: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        listingId: string;
        renterId: string;
        startDate: Date;
        endDate: Date;
        dailyPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
        depositSnapshot: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(user: any): Promise<({
        listing: {
            photos: {
                id: string;
                createdAt: Date;
                photoUrl: string;
                displayOrder: number;
                listingId: string;
            }[];
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            ownerId: string;
            title: string;
            categoryId: number;
            condition: string;
            dailyPrice: import("@prisma/client/runtime/library").Decimal;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
        };
        deposit: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            bookingId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            status: string;
            bookingId: string;
            paymentMethod: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
        }[];
        damageReports: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            ownerId: string;
            bookingId: string;
            renterId: string;
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
        createdAt: Date;
        updatedAt: Date;
        status: string;
        listingId: string;
        renterId: string;
        startDate: Date;
        endDate: Date;
        dailyPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
        depositSnapshot: import("@prisma/client/runtime/library").Decimal;
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
                photoUrl: string;
                displayOrder: number;
                listingId: string;
            }[];
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            ownerId: string;
            title: string;
            categoryId: number;
            condition: string;
            dailyPrice: import("@prisma/client/runtime/library").Decimal;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
        };
        deposit: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            bookingId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            status: string;
            bookingId: string;
            paymentMethod: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
        }[];
        damageReports: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            ownerId: string;
            bookingId: string;
            renterId: string;
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
        createdAt: Date;
        updatedAt: Date;
        status: string;
        listingId: string;
        renterId: string;
        startDate: Date;
        endDate: Date;
        dailyPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
        depositSnapshot: import("@prisma/client/runtime/library").Decimal;
    }>;
    resolve(id: string, dto: ResolveBookingDto, user: any): Promise<{
        deposit: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            bookingId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
            deductedAmount: import("@prisma/client/runtime/library").Decimal;
            releasedAt: Date | null;
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            bookingId: string;
            paymentMethod: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        listingId: string;
        renterId: string;
        startDate: Date;
        endDate: Date;
        dailyPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
        depositSnapshot: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateStatus(id: string, status: string, user: any): Promise<{
        deposit: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            bookingId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
            deductedAmount: import("@prisma/client/runtime/library").Decimal;
            releasedAt: Date | null;
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            bookingId: string;
            paymentMethod: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            gatewayReference: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        listingId: string;
        renterId: string;
        startDate: Date;
        endDate: Date;
        dailyPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
        depositSnapshot: import("@prisma/client/runtime/library").Decimal;
    }>;
    reportDamage(id: string, description: string, deductionAmount: number, user: any): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        ownerId: string;
        bookingId: string;
        renterId: string;
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
