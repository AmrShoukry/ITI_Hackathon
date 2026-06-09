import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto, UpdateListingDto } from './dto/listing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { VerificationGuard } from '../auth/verification.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Get('categories')
  async getCategories() {
    return this.listingsService.getCategories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard, VerificationGuard)
  @Roles('OWNER', 'ADMIN')
  @Post()
  async create(@Body() dto: CreateListingDto, @CurrentUser() user: any) {
    return this.listingsService.create(dto, user.id);
  }

  @Get()
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
  async findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @Put(':id')
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
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.listingsService.remove(id, user.id, user.role.name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/approve')
  async approve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.listingsService.approve(id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/reject')
  async reject(@Param('id') id: string, @CurrentUser() user: any) {
    return this.listingsService.reject(id, user.id);
  }
}
