import { CreateCategoryDto, UpdateAdminSettingDto, UpdateCategoryDto, UpdateUserRoleDto, UpdateUserStatusDto } from './dto/admin.dto';
import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getUsers(): Promise<({
        role: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
        };
        verifications: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            nationalIdUrl: string;
            decisionReason: string | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            ownerId: string;
        }[];
        _count: {
            listings: number;
            bookings: number;
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
    })[]>;
    getRoles(): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
    }[]>;
    getVerifications(): Promise<({
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
    approveVerification(id: string, user: any): Promise<{
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
    rejectVerification(id: string, user: any): Promise<{
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
    updateUserRole(id: string, dto: UpdateUserRoleDto, user: any): Promise<{
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
    updateUserStatus(id: string, dto: UpdateUserStatusDto, user: any): Promise<{
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
    getListings(status?: string): Promise<({
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
    approveListing(id: string, user: any): Promise<{
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
    rejectListing(id: string, user: any): Promise<{
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
    createCategory(dto: CreateCategoryDto, user: any): Promise<{
        id: number;
        createdAt: Date;
        nameEn: string;
        nameAr: string;
        descriptionEn: string | null;
        descriptionAr: string | null;
    }>;
    updateCategory(id: string, dto: UpdateCategoryDto, user: any): Promise<{
        id: number;
        createdAt: Date;
        nameEn: string;
        nameAr: string;
        descriptionEn: string | null;
        descriptionAr: string | null;
    }>;
    deleteCategory(id: string, user: any): Promise<{
        success: boolean;
    }>;
    getSettings(): Promise<({
        updater: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: number;
        description: string | null;
        settingKey: string;
        settingValue: string;
        updatedBy: string | null;
        updatedAt: Date;
    })[]>;
    updateSetting(key: string, dto: UpdateAdminSettingDto, user: any): Promise<{
        updater: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: number;
        description: string | null;
        settingKey: string;
        settingValue: string;
        updatedBy: string | null;
        updatedAt: Date;
    }>;
    getAnalytics(): Promise<{
        activeRentals: number;
        pendingListings: number;
        pendingVerifications: number;
        revenue: number;
        topItems: {
            listingId: string;
            title: string;
            count: number;
        }[];
    }>;
}
