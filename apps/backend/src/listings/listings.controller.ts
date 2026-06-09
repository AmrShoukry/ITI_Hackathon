import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto, UpdateListingDto } from './dto/listing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { VerificationGuard } from '../auth/verification.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all listing categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved' })
  async getCategories() {
    return this.listingsService.getCategories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard, VerificationGuard)
  @Roles('OWNER', 'ADMIN')
  @Post()
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateListingDto })
  @ApiOperation({ summary: 'Create a new listing (owner/admin only)' })
  @ApiResponse({ status: 201, description: 'Listing created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() dto: CreateListingDto, @CurrentUser() user: any) {
    return this.listingsService.create(dto, user.id);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'condition', required: false })
  @ApiQuery({ name: 'ownerId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'List and filter listings' })
  @ApiResponse({ status: 200, description: 'Listings list' })
  async findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('condition') condition?: string,
    @Query('ownerId') ownerId?: string,
    @Query('status') status?: string,
  ) {
    return this.listingsService.findAll({
      search,
      categoryId,
      minPrice,
      maxPrice,
      condition,
      ownerId,
      status,
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiOperation({ summary: 'Get a listing by ID' })
  @ApiResponse({ status: 200, description: 'Listing details' })
  async findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @Put(':id')
  @ApiParam({ name: 'id', description: 'Listing ID to update' })
  @ApiBody({ type: UpdateListingDto })
  @ApiOperation({ summary: 'Update a listing (owner/admin)' })
  @ApiResponse({ status: 200, description: 'Listing updated' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
    @CurrentUser() user: any,
  ) {
    return this.listingsService.update(id, dto, user.id, user.role.name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Listing ID to delete' })
  @ApiOperation({ summary: 'Delete a listing (owner/admin)' })
  @ApiResponse({ status: 200, description: 'Listing removed' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.listingsService.remove(id, user.id, user.role.name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/approve')
  @ApiParam({ name: 'id', description: 'Listing ID to approve' })
  @ApiOperation({ summary: 'Approve a listing (admin)' })
  @ApiResponse({ status: 200, description: 'Listing approved' })
  async approve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.listingsService.approve(id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/reject')
  @ApiParam({ name: 'id', description: 'Listing ID to reject' })
  @ApiOperation({ summary: 'Reject a listing (admin)' })
  @ApiResponse({ status: 200, description: 'Listing rejected' })
  async reject(@Param('id') id: string, @CurrentUser() user: any) {
    return this.listingsService.reject(id, user.id);
  }
}
