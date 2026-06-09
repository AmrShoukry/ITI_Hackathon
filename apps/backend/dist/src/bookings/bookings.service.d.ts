import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, ResolveBookingDto } from './dto/booking.dto';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateBookingDto, renterId: string): Promise<any>;
    findAll(user: any): Promise<any>;
    findOne(id: string, userId: string, userRole: string): Promise<any>;
    resolve(id: string, dto: ResolveBookingDto, ownerId: string): Promise<any>;
    updateStatus(id: string, status: string, userId: string, userRole: string): Promise<any>;
    reportDamage(id: string, description: string, deductionAmount: number, ownerId: string): Promise<any>;
    leaveReview(id: string, rating: number, comment: string, reviewerId: string): Promise<any>;
}
