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
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ListingsService = class ListingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, ownerId) {
        const listing = await this.prisma.listing.create({
            data: {
                title: dto.title,
                description: dto.description,
                condition: dto.condition,
                dailyPrice: dto.dailyPrice,
                depositAmount: dto.depositAmount,
                ownerId: ownerId,
                categoryId: dto.categoryId,
                status: 'Active',
                photos: {
                    create: dto.photoUrls?.map((url, index) => ({
                        photoUrl: url,
                        displayOrder: index,
                    })) || [],
                },
            },
            include: {
                photos: true,
                category: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: ownerId,
                action: 'CREATE_LISTING',
                entityType: 'Listing',
                entityId: listing.id,
                metadata: { title: listing.title },
            },
        });
        return listing;
    }
    async findAll(query) {
        const where = {};
        if (query.status) {
            where.status = query.status;
        }
        else if (query.ownerId) {
            where.ownerId = query.ownerId;
        }
        else {
            where.status = 'Active';
        }
        if (query.ownerId) {
            where.ownerId = query.ownerId;
        }
        if (query.categoryId) {
            where.categoryId = parseInt(query.categoryId, 10);
        }
        if (query.condition) {
            where.condition = query.condition;
        }
        if (query.minPrice || query.maxPrice) {
            where.dailyPrice = {};
            if (query.minPrice) {
                where.dailyPrice.gte = parseFloat(query.minPrice);
            }
            if (query.maxPrice) {
                where.dailyPrice.lte = parseFloat(query.maxPrice);
            }
        }
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.listing.findMany({
            where,
            include: {
                photos: true,
                category: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                photos: true,
                category: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        reviewsReceived: {
                            select: {
                                rating: true,
                            },
                        },
                    },
                },
                bookings: {
                    where: {
                        status: { in: ['Approved', 'Active'] },
                    },
                    select: {
                        startDate: true,
                        endDate: true,
                    },
                },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        return listing;
    }
    async update(id, dto, userId, userRole) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.ownerId !== userId && userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('You do not own this listing');
        }
        const updateData = {
            title: dto.title,
            description: dto.description,
            condition: dto.condition,
            dailyPrice: dto.dailyPrice,
            depositAmount: dto.depositAmount,
            categoryId: dto.categoryId,
        };
        if (dto.photoUrls) {
            await this.prisma.listingPhoto.deleteMany({
                where: { listingId: id },
            });
            updateData.photos = {
                create: dto.photoUrls.map((url, index) => ({
                    photoUrl: url,
                    displayOrder: index,
                })),
            };
        }
        const updated = await this.prisma.listing.update({
            where: { id },
            data: updateData,
            include: {
                photos: true,
                category: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: userId,
                action: 'UPDATE_LISTING',
                entityType: 'Listing',
                entityId: id,
                metadata: { title: updated.title },
            },
        });
        return updated;
    }
    async remove(id, userId, userRole) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.ownerId !== userId && userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('You do not own this listing');
        }
        await this.prisma.listing.delete({
            where: { id },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: userId,
                action: 'DELETE_LISTING',
                entityType: 'Listing',
                entityId: id,
                metadata: { title: listing.title },
            },
        });
        return { success: true };
    }
    async approve(id, adminId) {
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
    async reject(id, adminId) {
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
        return this.prisma.category.findMany();
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map