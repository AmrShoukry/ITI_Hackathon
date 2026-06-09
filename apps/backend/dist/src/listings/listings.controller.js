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
exports.ListingsController = void 0;
const common_1 = require("@nestjs/common");
const listings_service_1 = require("./listings.service");
const listing_dto_1 = require("./dto/listing.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const verification_guard_1 = require("../auth/verification.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const swagger_1 = require("@nestjs/swagger");
let ListingsController = class ListingsController {
    constructor(listingsService) {
        this.listingsService = listingsService;
    }
    async getCategories() {
        return this.listingsService.getCategories();
    }
    async create(dto, user) {
        return this.listingsService.create(dto, user.id);
    }
    async findAll(search, categoryId, minPrice, maxPrice, condition, ownerId, status) {
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
    async findOne(id) {
        return this.listingsService.findOne(id);
    }
    async update(id, dto, user) {
        return this.listingsService.update(id, dto, user.id, user.role.name);
    }
    async remove(id, user) {
        return this.listingsService.remove(id, user.id, user.role.name);
    }
    async approve(id, user) {
        return this.listingsService.approve(id, user.id);
    }
    async reject(id, user) {
        return this.listingsService.reject(id, user.id);
    }
};
exports.ListingsController = ListingsController;
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all listing categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, verification_guard_1.VerificationGuard),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiBody)({ type: listing_dto_1.CreateListingDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new listing (owner/admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Listing created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listing_dto_1.CreateListingDto, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'condition', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'ownerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiOperation)({ summary: 'List and filter listings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listings list' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('categoryId')),
    __param(2, (0, common_1.Query)('minPrice')),
    __param(3, (0, common_1.Query)('maxPrice')),
    __param(4, (0, common_1.Query)('condition')),
    __param(5, (0, common_1.Query)('ownerId')),
    __param(6, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    (0, swagger_1.ApiOperation)({ summary: 'Get a listing by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID to update' }),
    (0, swagger_1.ApiBody)({ type: listing_dto_1.UpdateListingDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a listing (owner/admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, listing_dto_1.UpdateListingDto, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID to delete' }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a listing (owner/admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing removed' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Post)(':id/approve'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID to approve' }),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a listing (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing approved' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "approve", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Post)(':id/reject'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID to reject' }),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a listing (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing rejected' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "reject", null);
exports.ListingsController = ListingsController = __decorate([
    (0, swagger_1.ApiTags)('Listings'),
    (0, common_1.Controller)('listings'),
    __metadata("design:paramtypes", [listings_service_1.ListingsService])
], ListingsController);
//# sourceMappingURL=listings.controller.js.map