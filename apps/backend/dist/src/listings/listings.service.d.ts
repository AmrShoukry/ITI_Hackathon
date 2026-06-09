import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto, UpdateListingDto } from './dto/listing.dto';
export declare class ListingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateListingDto, ownerId: string): Promise<{
        category: {
            id: number;
            createdAt: Date;
            nameEn: string;
            nameAr: string;
            descriptionEn: string | null;
            descriptionAr: string | null;
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
            createdAt: Date;
            nameEn: string;
            nameAr: string;
            descriptionEn: string | null;
            descriptionAr: string | null;
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
    })[]>;
    findOne(id: string): Promise<{
        category: {
            id: number;
            createdAt: Date;
            nameEn: string;
            nameAr: string;
            descriptionEn: string | null;
            descriptionAr: string | null;
        };
        bookings: {
            startDate: Date;
            endDate: Date;
        }[];
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
    }>;
    update(id: string, dto: UpdateListingDto, userId: string, userRole: string): Promise<{
        category: {
            id: number;
            createdAt: Date;
            nameEn: string;
            nameAr: string;
            descriptionEn: string | null;
            descriptionAr: string | null;
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
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        success: boolean;
    }>;
    approve(id: string, adminId: string): Promise<{
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
    }>;
    reject(id: string, adminId: string): Promise<{
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
    }>;
    getCategories(): Promise<{
        id: number;
        createdAt: Date;
        nameEn: string;
        nameAr: string;
        descriptionEn: string | null;
        descriptionAr: string | null;
    }[]>;
}
