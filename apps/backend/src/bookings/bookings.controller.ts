import { Controller, Get, Post, Param, Body, UseGuards, Put } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, ResolveBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  async create(@Body() dto: CreateBookingDto, @CurrentUser() user: any) {
    return this.bookingsService.create(dto, user.id);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.bookingsService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.findOne(id, user.id, user.role.name);
  }

  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @Post(':id/resolve')
  async resolve(
    @Param('id') id: string,
    @Body() dto: ResolveBookingDto,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.resolve(id, dto, user.id);
  }

  @Post(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.updateStatus(id, status, user.id, user.role.name);
  }

  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @Post(':id/damage')
  async reportDamage(
    @Param('id') id: string,
    @Body('description') description: string,
    @Body('deductionAmount') deductionAmount: number,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.reportDamage(id, description, deductionAmount, user.id);
  }

  @Post(':id/reviews')
  async leaveReview(
    @Param('id') id: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.leaveReview(id, rating, comment, user.id);
  }
}
