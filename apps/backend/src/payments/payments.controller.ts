import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-checkout-session')
  createCheckoutSession(
    @Body() dto: CreateCheckoutSessionDto,
    @CurrentUser() user: any,
  ) {
    return this.paymentsService.createCheckoutSession(dto, user.id);
  }

  @Get('verify-session')
  verifySession(
    @Query('session_id') sessionId: string,
    @CurrentUser() user: any,
  ) {
    return this.paymentsService.verifySession(sessionId, user.id);
  }
}
