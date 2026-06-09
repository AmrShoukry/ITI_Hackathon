import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // Determine target role (only RENTER or OWNER allowed via public registration)
    const targetRole = dto.roleName ? dto.roleName.toUpperCase() : 'RENTER';
    if (!['RENTER', 'OWNER'].includes(targetRole)) {
      throw new BadRequestException('Invalid registration role');
    }

    const role = await this.prisma.role.findUnique({
      where: { name: targetRole },
    });

    if (!role) {
      throw new BadRequestException('Role not found in system');
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

    // If Owner, automatically start a verification request or let them do it later.
    // In our seed we pre-verified, but here we can just create it.
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

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === 'Suspended') {
      throw new UnauthorizedException('Your account is suspended');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
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

  async getProfile(userId: string) {
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
      throw new UnauthorizedException();
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

  async getUserProfile(userId: string) {
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
      throw new NotFoundException('User not found');
    }

    const reviews = user.reviewsReceived || [];
    const averageRating =
      reviews.length > 0
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

  async approveOwnerVerification(id: string, adminId: string) {
    const verification = await this.prisma.ownerVerification.findUnique({
      where: { id },
    });

    if (!verification) {
      throw new BadRequestException('Verification request not found');
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

  async rejectOwnerVerification(id: string, adminId: string, decisionReason?: string) {
    const verification = await this.prisma.ownerVerification.findUnique({
      where: { id },
    });

    if (!verification) {
      throw new BadRequestException('Verification request not found');
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
}
