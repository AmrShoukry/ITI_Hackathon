import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    preferredLanguage?: string;
  }) {
    // 1. Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('Email address is already registered');
    }

    // 2. Resolve Role
    const normalizedRole = data.role.toUpperCase();
    let roleRecord = await this.prisma.role.findUnique({
      where: { name: normalizedRole },
    });

    // If role doesn't exist, seed it on demand
    if (!roleRecord) {
      roleRecord = await this.prisma.role.create({
        data: { name: normalizedRole, description: `${normalizedRole} role` },
      });
    }

    // 3. Hash Password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // 4. Create User
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        roleId: roleRecord.id,
        preferredLanguage: data.preferredLanguage || 'en',
        status: 'Active',
      },
      include: { role: true },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      preferredLanguage: user.preferredLanguage,
      createdAt: user.createdAt,
    };
  }

  async login(data: { email: string; password?: string }) {
    // 1. Query User
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'Suspended') {
      throw new UnauthorizedException('Access denied: Account is suspended');
    }

    // 2. Verify Password
    const isPasswordValid = await bcrypt.compare(data.password || '', user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Generate JWT
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_12345';
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role.name,
      preferredLanguage: user.preferredLanguage,
    };

    const token = jwt.sign(payload, secret, { expiresIn: '24h' });

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        preferredLanguage: user.preferredLanguage,
      },
    };
  }
}
