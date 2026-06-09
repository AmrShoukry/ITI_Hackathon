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
exports.ResolveBookingDto = exports.CreateBookingDto = exports.PaymentMethod = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["ONLINE"] = "Online Payment";
    PaymentMethod["CASH"] = "Cash On Pickup";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
class CreateBookingDto {
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'ID of the listing to book' }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "listingId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)({ description: 'Booking start date (ISO string)', example: '2026-06-20' }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)({ description: 'Booking end date (ISO string)', example: '2026-06-25' }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(PaymentMethod, { message: 'Payment method must be Online Payment or Cash On Pickup' }),
    (0, swagger_1.ApiProperty)({ enum: PaymentMethod, description: 'Payment method' }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "paymentMethod", void 0);
class ResolveBookingDto {
}
exports.ResolveBookingDto = ResolveBookingDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['Approved', 'Rejected'], { message: 'Resolution status must be Approved or Rejected' }),
    (0, swagger_1.ApiProperty)({ enum: ['Approved', 'Rejected'], description: 'Resolution status' }),
    __metadata("design:type", String)
], ResolveBookingDto.prototype, "status", void 0);
//# sourceMappingURL=booking.dto.js.map