import { PrismaService } from '../prisma/prisma.service';
import { AdminUserRole, AdminUserStatus, CreateCategoryDto, UpdateAdminSettingDto, UpdateCategoryDto } from './dto/admin.dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
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
    updateUserRole(userId: string, roleName: AdminUserRole, adminId: string): Promise<{
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
    updateUserStatus(userId: string, status: AdminUserStatus, adminId: string): Promise<{
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
    approveVerification(id: string, adminId: string): Promise<{
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
    rejectVerification(id: string, adminId: string): Promise<{
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
    approveListing(id: string, adminId: string): Promise<{
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
    rejectListing(id: string, adminId: string): Promise<{
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
    createCategory(dto: CreateCategoryDto, adminId: string): Promise<{
        id: number;
        createdAt: Date;
        nameEn: string;
        nameAr: string;
        descriptionEn: string | null;
        descriptionAr: string | null;
    }>;
    updateCategory(id: number, dto: UpdateCategoryDto, adminId: string): Promise<{
        id: number;
        createdAt: Date;
        nameEn: string;
        nameAr: string;
        descriptionEn: string | null;
        descriptionAr: string | null;
    }>;
    deleteCategory(id: number, adminId: string): Promise<{
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
    updateSetting(settingKey: string, dto: UpdateAdminSettingDto, adminId: string): Promise<{
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
