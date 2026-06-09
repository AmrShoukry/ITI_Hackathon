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
            id: any;
            name: any;
            email: any;
            role: any;
            preferredLanguage: any;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            preferredLanguage: any;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: any;
        name: any;
        email: any;
        phone: any;
        role: any;
        preferredLanguage: any;
        verificationStatus: any;
    }>;
    listOwnerVerifications(): Promise<any>;
    approveOwnerVerification(id: string, adminId: string): Promise<any>;
    rejectOwnerVerification(id: string, adminId: string, decisionReason?: string): Promise<any>;
}
