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
    listOwnerVerifications(): Promise<({
        reviewer: {
            id: string;
            name: string;
            email: string;
        };
        owner: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        nationalIdUrl: string;
        decisionReason: string | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
        ownerId: string;
    })[]>;
    approveOwnerVerification(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        nationalIdUrl: string;
        decisionReason: string | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
        ownerId: string;
    }>;
    rejectOwnerVerification(id: string, decisionReason: string | undefined, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        nationalIdUrl: string;
        decisionReason: string | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
        ownerId: string;
    }>;
}
