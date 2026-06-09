import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VerificationGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Admins don't need verification
    if (user.role.name === 'ADMIN') {
      return true;
    }

    if (user.role.name !== 'OWNER') {
      throw new ForbiddenException('Only owners can perform this action');
    }

    const verification = await this.prisma.ownerVerification.findFirst({
      where: {
        ownerId: user.id,
        status: 'Approved',
      },
    });

    if (!verification) {
      throw new ForbiddenException('Your owner account is not verified. Please submit your National ID for verification.');
    }

    return true;
  }
}
