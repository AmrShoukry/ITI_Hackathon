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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email is already registered');
        }
        const targetRole = dto.roleName ? dto.roleName.toUpperCase() : 'RENTER';
        if (!['RENTER', 'OWNER'].includes(targetRole)) {
            throw new common_1.BadRequestException('Invalid registration role');
        }
        const role = await this.prisma.role.findUnique({
            where: { name: targetRole },
        });
        if (!role) {
            throw new common_1.BadRequestException('Role not found in system');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                phone: dto.phone,
                passwordHash: hashedPassword,
                roleId: role.id,
                status: 'Active',
                preferredLanguage: dto.preferredLanguage || 'en',
            },
            include: {
                role: true,
            },
        });
        if (targetRole === 'OWNER') {
            await this.prisma.ownerVerification.create({
                data: {
                    ownerId: user.id,
                    nationalIdUrl: dto.nationalIdUrl || 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                    status: 'Pending',
                },
            });
        }
        const payload = { sub: user.id, email: user.email, role: user.role.name };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role.name,
                preferredLanguage: user.preferredLanguage,
            },
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: {
                role: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status === 'Suspended') {
            throw new common_1.UnauthorizedException('Your account is suspended');
        }
        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email, role: user.role.name };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role.name,
                preferredLanguage: user.preferredLanguage,
            },
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: true,
                verifications: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const verificationStatus = user.verifications[0]?.status || 'Not Submitted';
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role.name,
            preferredLanguage: user.preferredLanguage,
            verificationStatus,
        };
    }
    async getUserProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: true,
                reviewsReceived: {
                    include: {
                        reviewer: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        booking: {
                            include: {
                                listing: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const reviews = user.reviewsReceived || [];
        const averageRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role.name,
            createdAt: user.createdAt,
            preferredLanguage: user.preferredLanguage,
            reviews,
            averageRating,
        };
    }
    async listOwnerVerifications() {
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
    async approveOwnerVerification(id, adminId) {
        const verification = await this.prisma.ownerVerification.findUnique({
            where: { id },
        });
        if (!verification) {
            throw new common_1.BadRequestException('Verification request not found');
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
    async rejectOwnerVerification(id, adminId, decisionReason) {
        const verification = await this.prisma.ownerVerification.findUnique({
            where: { id },
        });
        if (!verification) {
            throw new common_1.BadRequestException('Verification request not found');
        }
        return this.prisma.ownerVerification.update({
            where: { id },
            data: {
                status: 'Rejected',
                reviewedBy: adminId,
                reviewedAt: new Date(),
                decisionReason: decisionReason || 'Rejected by admin',
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map