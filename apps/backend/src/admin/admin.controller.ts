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

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('roles')
  async getRoles() {
    return this.adminService.getRoles();
  }

  @Get('verifications')
  async getVerifications() {
    return this.adminService.getVerifications();
  }

  @Patch('verifications/:id/approve')
  async approveVerification(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.approveVerification(id, user.id);
  }

  @Patch('verifications/:id/reject')
  async rejectVerification(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.rejectVerification(id, user.id);
  }

  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.updateUserRole(id, dto.roleName as AdminUserRole, user.id);
  }

  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.updateUserStatus(id, dto.status as AdminUserStatus, user.id);
  }

  @Get('listings')
  async getListings(@Query('status') status?: string) {
    return this.adminService.getListings(status);
  }

  @Post('listings/:id/approve')
  async approveListing(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.approveListing(id, user.id);
  }

  @Post('listings/:id/reject')
  async rejectListing(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.rejectListing(id, user.id);
  }

  @Get('categories')
  async getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
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
