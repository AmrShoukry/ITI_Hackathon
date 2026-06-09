import { ListingsService } from './listings.service';
import { CreateListingDto, UpdateListingDto } from './dto/listing.dto';
export declare class ListingsController {
    private listingsService;
    constructor(listingsService: ListingsService);
    getCategories(): Promise<{
        id: number;
        nameEn: string;
        nameAr: string;
        descriptionEn: string | null;
        descriptionAr: string | null;
        createdAt: Date;
    }[]>;
    create(dto: CreateListingDto, user: any): Promise<{
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
    findAll(search?: string, categoryId?: string, minPrice?: string, maxPrice?: string, condition?: string, ownerId?: string, status?: string): Promise<({
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
    update(id: string, dto: UpdateListingDto, user: any): Promise<{
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
    remove(id: string, user: any): Promise<{
        success: boolean;
    }>;
    approve(id: string, user: any): Promise<{
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
    reject(id: string, user: any): Promise<{
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
}
