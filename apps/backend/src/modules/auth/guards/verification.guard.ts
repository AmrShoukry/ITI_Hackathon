import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class VerificationGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied: User session is unauthenticated');
    }

    // Admins are exempt from owner verification rules
    if (user.role.toUpperCase() === 'ADMIN') {
      return true;
    }

    // Only owners undergo identity verification checks
    if (user.role.toUpperCase() === 'OWNER') {
      const dbUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { verifications: { orderBy: { createdAt: 'desc' }, take: 1 } },
      });

      if (!dbUser) {
        throw new ForbiddenException('User record not found');
      }

      const latestVerification = dbUser.verifications[0];
      if (!latestVerification || latestVerification.status !== 'Approved') {
        throw new ForbiddenException(
          'Access denied: Account identity verification is required before performing owner operations. Current verification status is [' + 
          (latestVerification ? latestVerification.status : 'None') + ']'
        );
      }
    }

    return true;
  }
}
