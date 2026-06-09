import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<{
        role: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        roleId: number;
        updatedAt: Date;
        email: string;
        phone: string;
        passwordHash: string;
        status: string;
        preferredLanguage: string;
    }>;
}
export {};
