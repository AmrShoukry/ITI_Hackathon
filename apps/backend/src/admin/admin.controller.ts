import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  AdminUserRole,
  AdminUserStatus,
  CreateCategoryDto,
  UpdateAdminSettingDto,
  UpdateCategoryDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
} from './dto/admin.dto';
import { AdminService } from './admin.service';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users (admin)' })
  @ApiResponse({ status: 200, description: 'Users list' })
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('roles')
  @ApiOperation({ summary: 'Get available roles' })
  @ApiResponse({ status: 200, description: 'Roles list' })
  async getRoles() {
    return this.adminService.getRoles();
  }

  @Get('verifications')
  @ApiOperation({ summary: 'Get pending verifications (admin)' })
  @ApiResponse({ status: 200, description: 'Verifications list' })
  async getVerifications() {
    return this.adminService.getVerifications();
  }

  @Patch('verifications/:id/approve')
  @ApiParam({ name: 'id', description: 'Verification ID' })
  @ApiOperation({ summary: 'Approve a verification' })
  @ApiResponse({ status: 200, description: 'Verification approved' })
  async approveVerification(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.approveVerification(id, user.id);
  }

  @Patch('verifications/:id/reject')
  @ApiParam({ name: 'id', description: 'Verification ID' })
  @ApiOperation({ summary: 'Reject a verification' })
  @ApiResponse({ status: 200, description: 'Verification rejected' })
  async rejectVerification(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.rejectVerification(id, user.id);
  }

  @Patch('users/:id/role')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({ status: 200, description: 'Role updated' })
  async updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.updateUserRole(id, dto.roleName as AdminUserRole, user.id);
  }

  @Patch('users/:id/status')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserStatusDto })
  @ApiOperation({ summary: 'Update user status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.updateUserStatus(id, dto.status as AdminUserStatus, user.id);
  }

  @Get('listings')
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'Get listings with optional status filter' })
  @ApiResponse({ status: 200, description: 'Listings list' })
  async getListings(@Query('status') status?: string) {
    return this.adminService.getListings(status);
  }

  @Post('listings/:id/approve')
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiOperation({ summary: 'Approve a listing' })
  @ApiResponse({ status: 200, description: 'Listing approved' })
  async approveListing(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.approveListing(id, user.id);
  }

  @Post('listings/:id/reject')
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiOperation({ summary: 'Reject a listing' })
  @ApiResponse({ status: 200, description: 'Listing rejected' })
  async rejectListing(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.rejectListing(id, user.id);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get categories' })
  @ApiResponse({ status: 200, description: 'Categories list' })
  async getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
  @ApiBody({ type: CreateCategoryDto })
  async createCategory(@Body() dto: CreateCategoryDto, @CurrentUser() user: any) {
    return this.adminService.createCategory(dto, user.id);
  }

  @Patch('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.updateCategory(parseInt(id, 10), dto, user.id);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.deleteCategory(parseInt(id, 10), user.id);
  }

  @Get('settings')
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings/:key')
  async updateSetting(
    @Param('key') key: string,
    @Body() dto: UpdateAdminSettingDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.updateSetting(key, dto, user.id);
  }

  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }
}
