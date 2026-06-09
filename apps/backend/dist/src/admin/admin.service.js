"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUsers() {
        return this.prisma.user.findMany({
            include: {
                role: true,
                verifications: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                _count: {
                    select: {
                        listings: true,
                        bookings: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async updateUserRole(userId, roleName, adminId) {
        const role = await this.prisma.role.findUnique({ where: { name: roleName } });
        if (!role) {
            throw new common_1.BadRequestException('Role not found');
        }
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: { roleId: role.id },
            include: { role: true },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: adminId,
                action: 'UPDATE_USER_ROLE',
                entityType: 'User',
                entityId: userId,
                metadata: { roleName },
            },
        });
        return updated;
    }
    async updateUserStatus(userId, status, adminId) {
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: { status },
            include: { role: true },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: adminId,
                action: 'UPDATE_USER_STATUS',
                entityType: 'User',
                entityId: userId,
                metadata: { status },
            },
        });
        return updated;
    }
    async getRoles() {
        return this.prisma.role.findMany({
            orderBy: { id: 'asc' },
        });
    }
    async getVerifications() {
        return this.prisma.ownerVerification.findMany({
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async approveVerification(id, adminId) {
        const verification = await this.prisma.ownerVerification.findUnique({
            where: { id },
        });
        if (!verification) {
            throw new common_1.NotFoundException('Verification request not found');
        }
        return this.prisma.ownerVerification.update({
            where: { id },
            data: {
                status: 'Approved',
                reviewedBy: adminId,
                reviewedAt: new Date(),
                decisionReason: null,
            },
        });
    }
    async rejectVerification(id, adminId) {
        const verification = await this.prisma.ownerVerification.findUnique({
            where: { id },
        });
        if (!verification) {
            throw new common_1.NotFoundException('Verification request not found');
        }
        return this.prisma.ownerVerification.update({
            where: { id },
            data: {
                status: 'Rejected',
                reviewedBy: adminId,
                reviewedAt: new Date(),
                decisionReason: 'Rejected by admin',
            },
        });
    }
    async getListings(status) {
        return this.prisma.listing.findMany({
            where: status ? { status } : undefined,
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                category: true,
                photos: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async approveListing(id, adminId) {
        const listing = await this.prisma.listing.update({
            where: { id },
            data: { status: 'Active' },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: adminId,
                action: 'APPROVE_LISTING',
                entityType: 'Listing',
                entityId: id,
                metadata: { title: listing.title },
            },
        });
        return listing;
    }
    async rejectListing(id, adminId) {
        const listing = await this.prisma.listing.update({
            where: { id },
            data: { status: 'Rejected' },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: adminId,
                action: 'REJECT_LISTING',
                entityType: 'Listing',
                entityId: id,
                metadata: { title: listing.title },
            },
        });
        return listing;
    }
    async getCategories() {
        return this.prisma.category.findMany({
            orderBy: { id: 'asc' },
        });
    }
    async createCategory(dto, adminId) {
        const category = await this.prisma.category.create({
            data: dto,
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: adminId,
                action: 'CREATE_CATEGORY',
                entityType: 'Category',
                entityId: category.id.toString(),
                metadata: { nameEn: category.nameEn },
            },
        });
        return category;
    }
    async updateCategory(id, dto, adminId) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const updated = await this.prisma.category.update({
            where: { id },
            data: dto,
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: adminId,
                action: 'UPDATE_CATEGORY',
                entityType: 'Category',
                entityId: id.toString(),
                metadata: { nameEn: updated.nameEn },
            },
        });
        return updated;
    }
    async deleteCategory(id, adminId) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        await this.prisma.category.delete({
            where: { id },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: adminId,
                action: 'DELETE_CATEGORY',
                entityType: 'Category',
                entityId: id.toString(),
                metadata: { nameEn: category.nameEn },
            },
        });
        return { success: true };
    }
    async getSettings() {
        return this.prisma.adminSetting.findMany({
            include: {
                updater: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { settingKey: 'asc' },
        });
    }
    async updateSetting(settingKey, dto, adminId) {
        const setting = await this.prisma.adminSetting.upsert({
            where: { settingKey },
            update: {
                settingValue: dto.settingValue,
                description: dto.description,
                updatedBy: adminId,
                updatedAt: new Date(),
            },
            create: {
                settingKey,
                settingValue: dto.settingValue,
                description: dto.description,
                updatedBy: adminId,
            },
            include: {
                updater: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: adminId,
                action: 'UPDATE_ADMIN_SETTING',
                entityType: 'AdminSetting',
                entityId: setting.id.toString(),
                metadata: { settingKey },
            },
        });
        return setting;
    }
    async getAnalytics() {
        const [activeRentals, pendingListings, pendingVerifications, paidRevenue, topBookings] = await this.prisma.$transaction([
            this.prisma.booking.count({
                where: { status: 'Active' },
            }),
            this.prisma.listing.count({
                where: { status: 'Pending Approval' },
            }),
            this.prisma.ownerVerification.count({
                where: { status: 'Pending' },
            }),
            this.prisma.payment.aggregate({
                _sum: {
                    amount: true,
                },
                where: {
                    status: 'Paid',
                },
            }),
            this.prisma.booking.findMany({
                include: {
                    listing: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    payments: {
                        select: {
                            amount: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 200,
            }),
        ]);
        const topItemsMap = new Map();
        for (const booking of topBookings) {
            const current = topItemsMap.get(booking.listing.id);
            if (current) {
                current.count += 1;
            }
            else {
                topItemsMap.set(booking.listing.id, {
                    listingId: booking.listing.id,
                    title: booking.listing.title,
                    count: 1,
                });
            }
        }
        return {
            activeRentals,
            pendingListings,
            pendingVerifications,
            revenue: Number(paidRevenue._sum.amount || 0),
            topItems: Array.from(topItemsMap.values())
                .sort((a, b) => b.count - a.count)
                .slice(0, 5),
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map