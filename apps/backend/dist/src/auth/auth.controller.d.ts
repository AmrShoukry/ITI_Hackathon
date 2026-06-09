import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            preferredLanguage: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            preferredLanguage: string;
        };
    }>;
    getProfile(user: any): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        preferredLanguage: string;
        verificationStatus: string;
    }>;
    getUserProfile(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        createdAt: Date;
        preferredLanguage: string;
        reviews: ({
            reviewer: {
                id: string;
                name: string;
            };
            booking: {
                listing: {
                    id: string;
                    status: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string;
                    ownerId: string;
                    categoryId: number;
                    title: string;
                    condition: string;
                    dailyPrice: import("@prisma/client/runtime/library").Decimal;
                    depositAmount: import("@prisma/client/runtime/library").Decimal;
                };
            } & {
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                renterId: string;
                listingId: string;
                startDate: Date;
                endDate: Date;
                dailyPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
                depositSnapshot: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            bookingId: string;
            reviewerId: string;
            revieweeId: string;
            rating: number;
            comment: string | null;
            reviewerRole: string;
        })[];
        averageRating: number;
    }>;
    listOwnerVerifications(): Promise<({
        owner: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        reviewer: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        nationalIdUrl: string;
        decisionReason: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    })[]>;
    approveOwnerVerification(id: string, user: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        nationalIdUrl: string;
        decisionReason: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
    rejectOwnerVerification(id: string, decisionReason: string | undefined, user: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        nationalIdUrl: string;
        decisionReason: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
}
