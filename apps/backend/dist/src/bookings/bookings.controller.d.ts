import { BookingsService } from './bookings.service';
import { CreateBookingDto, ResolveBookingDto } from './dto/booking.dto';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    create(dto: CreateBookingDto, user: any): Promise<any>;
    findAll(user: any): Promise<any>;
    findOne(id: string, user: any): Promise<any>;
    resolve(id: string, dto: ResolveBookingDto, user: any): Promise<any>;
    updateStatus(id: string, status: string, user: any): Promise<any>;
    reportDamage(id: string, description: string, deductionAmount: number, user: any): Promise<any>;
    leaveReview(id: string, rating: number, comment: string, user: any): Promise<any>;
}
