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
exports.UpdateListingDto = exports.CreateListingDto = exports.ListingCondition = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var ListingCondition;
(function (ListingCondition) {
    ListingCondition["NEW"] = "New";
    ListingCondition["GOOD"] = "Good";
    ListingCondition["ACCEPTABLE"] = "Acceptable";
})(ListingCondition || (exports.ListingCondition = ListingCondition = {}));
class CreateListingDto {
}
exports.CreateListingDto = CreateListingDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5, { message: 'Title must be at least 5 characters long' }),
    (0, swagger_1.ApiProperty)({ description: 'Listing title' }),
    __metadata("design:type", String)
], CreateListingDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20, { message: 'Description must be at least 20 characters long' }),
    (0, swagger_1.ApiProperty)({ description: 'Listing description' }),
    __metadata("design:type", String)
], CreateListingDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ description: 'Category ID' }),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(ListingCondition, { message: 'Condition must be New, Good, or Acceptable' }),
    (0, swagger_1.ApiProperty)({ enum: ListingCondition, description: 'Condition of the item' }),
    __metadata("design:type", String)
], CreateListingDto.prototype, "condition", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Daily price must be 0 or greater' }),
    (0, swagger_1.ApiProperty)({ description: 'Daily rental price' }),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "dailyPrice", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Deposit amount must be 0 or greater' }),
    (0, swagger_1.ApiProperty)({ description: 'Deposit amount' }),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "depositAmount", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ required: false, isArray: true, description: 'Photo URLs' }),
    __metadata("design:type", Array)
], CreateListingDto.prototype, "photoUrls", void 0);
class UpdateListingDto {
}
exports.UpdateListingDto = UpdateListingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, swagger_1.ApiProperty)({ required: false, description: 'Listing title' }),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20),
    (0, swagger_1.ApiProperty)({ required: false, description: 'Listing description' }),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ required: false, description: 'Category ID' }),
    __metadata("design:type", Number)
], UpdateListingDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ListingCondition),
    (0, swagger_1.ApiProperty)({ required: false, enum: ListingCondition, description: 'Condition' }),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "condition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiProperty)({ required: false, description: 'Daily price' }),
    __metadata("design:type", Number)
], UpdateListingDto.prototype, "dailyPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiProperty)({ required: false, description: 'Deposit amount' }),
    __metadata("design:type", Number)
], UpdateListingDto.prototype, "depositAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, swagger_1.ApiProperty)({ required: false, isArray: true, description: 'Photo URLs' }),
    __metadata("design:type", Array)
], UpdateListingDto.prototype, "photoUrls", void 0);
//# sourceMappingURL=listing.dto.js.map