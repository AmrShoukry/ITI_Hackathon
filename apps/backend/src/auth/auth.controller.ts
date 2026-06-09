import { Controller, Post, Body, Get, UseGuards, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Login user and return JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile/:id')
  @ApiOperation({ summary: 'Get a specific user profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserProfile(@Param('id') id: string) {
    return this.authService.getUserProfile(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/verifications')
  @ApiOperation({ summary: 'List pending owner verifications (admin only)' })
  @ApiResponse({ status: 200, description: 'List of verifications' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async listOwnerVerifications() {
    return this.authService.listOwnerVerifications();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/verifications/:id/approve')
  @ApiOperation({ summary: 'Approve an owner verification (admin only)' })
  @ApiResponse({ status: 200, description: 'Verification approved' })
  @ApiResponse({ status: 404, description: 'Verification not found' })
  async approveOwnerVerification(@Param('id') id: string, @CurrentUser() user: any) {
    return this.authService.approveOwnerVerification(id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/verifications/:id/reject')
  @ApiOperation({ summary: 'Reject an owner verification (admin only)' })
  @ApiResponse({ status: 200, description: 'Verification rejected' })
  @ApiResponse({ status: 404, description: 'Verification not found' })
  async rejectOwnerVerification(
    @Param('id') id: string,
    @Body('decisionReason') decisionReason: string | undefined,
    @CurrentUser() user: any,
  ) {
    return this.authService.rejectOwnerVerification(id, user.id, decisionReason);
  }
}
