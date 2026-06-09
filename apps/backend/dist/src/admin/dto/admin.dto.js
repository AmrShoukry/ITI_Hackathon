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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdminSettingDto = exports.UpdateCategoryDto = exports.CreateCategoryDto = exports.UpdateUserStatusDto = exports.UpdateUserRoleDto = exports.AdminUserStatus = exports.AdminUserRole = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var AdminUserRole;
(function (AdminUserRole) {
    AdminUserRole["GUEST"] = "GUEST";
    AdminUserRole["RENTER"] = "RENTER";
    AdminUserRole["OWNER"] = "OWNER";
    AdminUserRole["ADMIN"] = "ADMIN";
})(AdminUserRole || (exports.AdminUserRole = AdminUserRole = {}));
var AdminUserStatus;
(function (AdminUserStatus) {
    AdminUserStatus["Active"] = "Active";
    AdminUserStatus["Suspended"] = "Suspended";
})(AdminUserStatus || (exports.AdminUserStatus = AdminUserStatus = {}));
class UpdateUserRoleDto {
}
exports.UpdateUserRoleDto = UpdateUserRoleDto;
__decorate([
    (0, class_validator_1.IsEnum)(AdminUserRole),
    (0, swagger_1.ApiProperty)({ enum: AdminUserRole, description: 'New role for the user' }),
    __metadata("design:type", String)
], UpdateUserRoleDto.prototype, "roleName", void 0);
class UpdateUserStatusDto {
}
exports.UpdateUserStatusDto = UpdateUserStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(AdminUserStatus),
    (0, swagger_1.ApiProperty)({ enum: AdminUserStatus, description: 'New status for the user' }),
    __metadata("design:type", String)
], UpdateUserStatusDto.prototype, "status", void 0);
class CreateCategoryDto {
}
exports.CreateCategoryDto = CreateCategoryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, swagger_1.ApiProperty)({ description: 'Category name in English' }),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "nameEn", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, swagger_1.ApiProperty)({ description: 'Category name in Arabic' }),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "nameAr", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ required: false, description: 'Category description in English' }),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "descriptionEn", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ required: false, description: 'Category description in Arabic' }),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "descriptionAr", void 0);
class UpdateCategoryDto {
}
exports.UpdateCategoryDto = UpdateCategoryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, swagger_1.ApiProperty)({ required: false, description: 'Category name in English' }),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "nameEn", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, swagger_1.ApiProperty)({ required: false, description: 'Category name in Arabic' }),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "nameAr", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ required: false, description: 'Category description in English' }),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "descriptionEn", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ required: false, description: 'Category description in Arabic' }),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "descriptionAr", void 0);
class UpdateAdminSettingDto {
}
exports.UpdateAdminSettingDto = UpdateAdminSettingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, swagger_1.ApiProperty)({ description: 'Setting value' }),
    __metadata("design:type", String)
], UpdateAdminSettingDto.prototype, "settingValue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ required: false, description: 'Setting description' }),
    __metadata("design:type", String)
], UpdateAdminSettingDto.prototype, "description", void 0);
//# sourceMappingURL=admin.dto.js.map