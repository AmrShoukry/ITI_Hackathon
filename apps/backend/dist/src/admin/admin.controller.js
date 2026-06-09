"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const admin_dto_1 = require("./dto/admin.dto");
const admin_service_1 = require("./admin.service");
const swagger_1 = require("@nestjs/swagger");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getUsers() {
        return this.adminService.getUsers();
    }
    async getRoles() {
        return this.adminService.getRoles();
    }
    async getVerifications() {
        return this.adminService.getVerifications();
    }
    async approveVerification(id, user) {
        return this.adminService.approveVerification(id, user.id);
    }
    async rejectVerification(id, user) {
        return this.adminService.rejectVerification(id, user.id);
    }
    async updateUserRole(id, dto, user) {
        return this.adminService.updateUserRole(id, dto.roleName, user.id);
    }
    async updateUserStatus(id, dto, user) {
        return this.adminService.updateUserStatus(id, dto.status, user.id);
    }
    async getListings(status) {
        return this.adminService.getListings(status);
    }
    async approveListing(id, user) {
        return this.adminService.approveListing(id, user.id);
    }
    async rejectListing(id, user) {
        return this.adminService.rejectListing(id, user.id);
    }
    async getCategories() {
        return this.adminService.getCategories();
    }
    async createCategory(dto, user) {
        return this.adminService.createCategory(dto, user.id);
    }
    async updateCategory(id, dto, user) {
        return this.adminService.updateCategory(parseInt(id, 10), dto, user.id);
    }
    async deleteCategory(id, user) {
        return this.adminService.deleteCategory(parseInt(id, 10), user.id);
    }
    async getSettings() {
        return this.adminService.getSettings();
    }
    async updateSetting(key, dto, user) {
        return this.adminService.updateSetting(key, dto, user.id);
    }
    async getAnalytics() {
        return this.adminService.getAnalytics();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('roles'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available roles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Roles list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Get)('verifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending verifications (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verifications list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getVerifications", null);
__decorate([
    (0, common_1.Patch)('verifications/:id/approve'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Verification ID' }),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a verification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verification approved' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveVerification", null);
__decorate([
    (0, common_1.Patch)('verifications/:id/reject'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Verification ID' }),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a verification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verification rejected' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectVerification", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_1.ApiBody)({ type: admin_dto_1.UpdateUserRoleDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update user role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.UpdateUserRoleDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Patch)('users/:id/status'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_1.ApiBody)({ type: admin_dto_1.UpdateUserStatusDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update user status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.UpdateUserStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Get)('listings'),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiOperation)({ summary: 'Get listings with optional status filter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listings list' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getListings", null);
__decorate([
    (0, common_1.Post)('listings/:id/approve'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing approved' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveListing", null);
__decorate([
    (0, common_1.Post)('listings/:id/reject'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing rejected' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectListing", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiBody)({ type: admin_dto_1.CreateCategoryDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.UpdateCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Patch)('settings/:key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.UpdateAdminSettingDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSetting", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAnalytics", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map