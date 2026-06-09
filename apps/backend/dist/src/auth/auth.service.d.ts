import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    getProfile(userId: string): Promise<{
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
    approveOwnerVerification(id: string, adminId: string): Promise<{
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
    rejectOwnerVerification(id: string, adminId: string, decisionReason?: string): Promise<{
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
