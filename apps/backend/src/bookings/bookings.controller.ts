import { Controller, Get, Post, Param, Body, UseGuards, Put } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, ResolveBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiBody({ type: CreateBookingDto })
  @ApiOperation({ summary: 'Create a booking' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() dto: CreateBookingDto, @CurrentUser() user: any) {
    return this.bookingsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List bookings for current user' })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  async findAll(@CurrentUser() user: any) {
    return this.bookingsService.findAll(user);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.findOne(id, user.id, user.role.name);
  }

  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @Post(':id/resolve')
  @ApiParam({ name: 'id', description: 'Booking ID to resolve' })
  @ApiBody({ type: ResolveBookingDto })
  @ApiOperation({ summary: 'Resolve a booking (approve/reject) - owner/admin' })
  @ApiResponse({ status: 200, description: 'Booking resolved' })
  async resolve(
    @Param('id') id: string,
    @Body() dto: ResolveBookingDto,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.resolve(id, dto, user.id);
  }

  @Post(':id/status')
  @ApiParam({ name: 'id', description: 'Booking ID to update status' })
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
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
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiOperation({ summary: 'Report damage and deduction for booking' })
  @ApiResponse({ status: 200, description: 'Damage reported' })
  async reportDamage(
    @Param('id') id: string,
    @Body('description') description: string,
    @Body('deductionAmount') deductionAmount: number,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.reportDamage(id, description, deductionAmount, user.id);
  }

  @Post(':id/reviews')
  @ApiParam({ name: 'id', description: 'Booking ID to review' })
  @ApiOperation({ summary: 'Leave a review for a booking' })
  @ApiResponse({ status: 200, description: 'Review submitted' })
  async leaveReview(
    @Param('id') id: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.leaveReview(id, rating, comment, user.id);
  }
}
