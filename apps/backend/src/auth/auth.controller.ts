import { Controller, Post, Body, Get, UseGuards, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/verifications')
  async listOwnerVerifications() {
    return this.authService.listOwnerVerifications();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/verifications/:id/approve')
  async approveOwnerVerification(@Param('id') id: string, @CurrentUser() user: any) {
    return this.authService.approveOwnerVerification(id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/verifications/:id/reject')
  async rejectOwnerVerification(
    @Param('id') id: string,
    @Body('decisionReason') decisionReason: string | undefined,
    @CurrentUser() user: any,
  ) {
    return this.authService.rejectOwnerVerification(id, user.id, decisionReason);
  }
}
