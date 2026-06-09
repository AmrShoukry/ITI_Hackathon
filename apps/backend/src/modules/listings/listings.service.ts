import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, data: {
    title: string;
    description: string;
    categoryId: number;
    condition: string;
    dailyPrice: number;
    depositAmount: number;
    photos?: string[];
  }) {
    // 1. Verify Category exists
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID [${data.categoryId}] not found`);
    }

    // 2. Validate bounds
    if (data.title.length < 5 || data.title.length > 100) {
      throw new BadRequestException('Title must be between 5 and 100 characters');
    }
    if (data.description.length < 20 || data.description.length > 1000) {
      throw new BadRequestException('Description must be between 20 and 1000 characters');
    }
    if (!['New', 'Good', 'Acceptable'].includes(data.condition)) {
      throw new BadRequestException("Condition must be 'New', 'Good', or 'Acceptable'");
    }
    if (data.dailyPrice < 0 || data.depositAmount < 0) {
      throw new BadRequestException('Daily price and deposit amount must be positive');
    }

    // 3. Create listing database entry
    return this.prisma.$transaction(async (tx) => {
      const listing = await tx.listing.create({
        data: {
          ownerId,
          categoryId: data.categoryId,
          title: data.title,
          description: data.description,
          condition: data.condition,
          dailyPrice: data.dailyPrice,
          depositAmount: data.depositAmount,
          status: 'Pending Approval',
        },
      });

      if (data.photos && data.photos.length > 0) {
        await tx.listingPhoto.createMany({
          data: data.photos.map((url, index) => ({
            listingId: listing.id,
            photoUrl: url,
            displayOrder: index,
          })),
        });
      }

      return listing;
    });
  }

  async update(ownerId: string, listingId: string, data: any) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.ownerId !== ownerId) {
      throw new ForbiddenException('Access denied: You do not own this listing');
    }

    // Major changes (title, description, price) trigger re-moderation
    const triggersRemoderation = data.title || data.description || data.dailyPrice;

    return this.prisma.listing.update({
      where: { id: listingId },
      data: {
        ...data,
        status: triggersRemoderation ? 'Pending Approval' : listing.status,
      },
    });
  }

  async delete(ownerId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { bookings: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.ownerId !== ownerId) {
      throw new ForbiddenException('Access denied: You do not own this listing');
    }

    // Check for active or approved future bookings
    const activeBookingsExist = listing.bookings.some((booking) =>
      ['Approved', 'Active'].includes(booking.status)
    );
    if (activeBookingsExist) {
      throw new BadRequestException('Cannot delete listing with active or future approved bookings');
    }

    // Soft-delete listing by marking it inactive/rejected or deleting if empty
    return this.prisma.listing.update({
      where: { id: listingId },
      data: { status: 'Rejected' }, // Hide it from searches
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { photos: true, owner: { select: { name: true, preferredLanguage: true } } },
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return listing;
  }

  async blockDates(ownerId: string, listingId: string, range: { startDate: string; endDate: string; description?: string }) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.ownerId !== ownerId) {
      throw new ForbiddenException('Access denied: You do not own this listing');
    }

    const start = new Date(range.startDate);
    const end = new Date(range.endDate);

    if (end < start) {
      throw new BadRequestException('End date must be after or equal to start date');
    }

    return this.prisma.availability.create({
      data: {
        listingId,
        startDate: start,
        endDate: end,
        isBlocked: true,
        description: range.description || 'Blocked by owner',
      },
    });
  }
}
