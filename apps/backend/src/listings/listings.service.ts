import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto, UpdateListingDto } from './dto/listing.dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateListingDto, ownerId: string) {
    const listing = await this.prisma.listing.create({
      data: {
        title: dto.title,
        description: dto.description,
        condition: dto.condition,
        dailyPrice: dto.dailyPrice,
        depositAmount: dto.depositAmount,
        ownerId: ownerId,
        categoryId: dto.categoryId,
        status: 'Active', // Auto-activate or start as Active for MVP simplicity, or set default to Active
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

    // Write an audit log
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

  async findAll(query: {
    search?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    condition?: string;
    ownerId?: string;
    status?: string;
  }) {
    const where: any = {};

    // Filter by status (default to Active for guests/renters, unless filtered specifically)
    if (query.status) {
      where.status = query.status;
    } else if (query.ownerId) {
      // If filtering by owner, they can see all their listings
      where.ownerId = query.ownerId;
    } else {
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

  async findOne(id: string) {
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
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  async update(id: string, dto: UpdateListingDto, userId: string, userRole: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You do not own this listing');
    }

    const updateData: any = {
      title: dto.title,
      description: dto.description,
      condition: dto.condition,
      dailyPrice: dto.dailyPrice,
      depositAmount: dto.depositAmount,
      categoryId: dto.categoryId,
    };

    if (dto.photoUrls) {
      // Re-create photos
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

  async remove(id: string, userId: string, userRole: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You do not own this listing');
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

  async approve(id: string, adminId: string) {
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

  async reject(id: string, adminId: string) {
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
}
