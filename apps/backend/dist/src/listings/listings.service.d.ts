import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto, UpdateListingDto } from './dto/listing.dto';
export declare class ListingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateListingDto, ownerId: string): Promise<{
        category: {
            id: number;
            nameEn: string;
            nameAr: string;
            descriptionEn: string | null;
            descriptionAr: string | null;
            createdAt: Date;
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
        createdAt: Date;
        title: string;
        description: string;
        condition: string;
        dailyPrice: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        status: string;
        updatedAt: Date;
        ownerId: string;
        categoryId: number;
    }>;
    findAll(query: {
        search?: string;
        categoryId?: string;
        minPrice?: string;
        maxPrice?: string;
        condition?: string;
        ownerId?: string;
        status?: string;
    }): Promise<({
        category: {
            id: number;
            nameEn: string;
            nameAr: string;
            descriptionEn: string | null;
            descriptionAr: string | null;
            createdAt: Date;
        };
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
        createdAt: Date;
        title: string;
        description: string;
        condition: string;
        dailyPrice: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        status: string;
        updatedAt: Date;
        ownerId: string;
        categoryId: number;
    })[]>;
    findOne(id: string): Promise<{
        category: {
            id: number;
            nameEn: string;
            nameAr: string;
            descriptionEn: string | null;
            descriptionAr: string | null;
            createdAt: Date;
        };
        owner: {
            id: string;
            name: string;
            email: string;
            phone: string;
            reviewsReceived: {
                rating: number;
            }[];
        };
        photos: {
            id: string;
            createdAt: Date;
            photoUrl: string;
            displayOrder: number;
            listingId: string;
        }[];
        bookings: {
            startDate: Date;
            endDate: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string;
        condition: string;
        dailyPrice: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        status: string;
        updatedAt: Date;
        ownerId: string;
        categoryId: number;
    }>;
    update(id: string, dto: UpdateListingDto, userId: string, userRole: string): Promise<{
        category: {
            id: number;
            nameEn: string;
            nameAr: string;
            descriptionEn: string | null;
            descriptionAr: string | null;
            createdAt: Date;
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
        createdAt: Date;
        title: string;
        description: string;
        condition: string;
        dailyPrice: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        status: string;
        updatedAt: Date;
        ownerId: string;
        categoryId: number;
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        success: boolean;
    }>;
    approve(id: string, adminId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string;
        condition: string;
        dailyPrice: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        status: string;
        updatedAt: Date;
        ownerId: string;
        categoryId: number;
    }>;
    reject(id: string, adminId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string;
        condition: string;
        dailyPrice: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        status: string;
        updatedAt: Date;
        ownerId: string;
        categoryId: number;
    }>;
    getCategories(): Promise<{
        id: number;
        nameEn: string;
        nameAr: string;
        descriptionEn: string | null;
        descriptionAr: string | null;
        createdAt: Date;
    }[]>;
}
