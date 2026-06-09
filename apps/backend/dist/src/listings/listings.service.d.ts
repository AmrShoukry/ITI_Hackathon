import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto, UpdateListingDto } from './dto/listing.dto';
export declare class ListingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateListingDto, ownerId: string): Promise<any>;
    findAll(query: {
        search?: string;
        categoryId?: string;
        minPrice?: string;
        maxPrice?: string;
        condition?: string;
        ownerId?: string;
        status?: string;
    }): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateListingDto, userId: string, userRole: string): Promise<any>;
    remove(id: string, userId: string, userRole: string): Promise<{
        success: boolean;
    }>;
    approve(id: string, adminId: string): Promise<any>;
    reject(id: string, adminId: string): Promise<any>;
    getCategories(): Promise<any>;
}
