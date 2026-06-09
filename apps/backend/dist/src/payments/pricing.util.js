"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRentalDays = calculateRentalDays;
exports.calculateBookingTotal = calculateBookingTotal;
exports.toStripeAmount = toStripeAmount;
function calculateRentalDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}
function calculateBookingTotal(dailyPrice, startDate, endDate, serviceFeePercent = 0) {
    const rentalDays = calculateRentalDays(startDate, endDate);
    const rentalSubtotal = Number((dailyPrice * rentalDays).toFixed(2));
    const serviceFee = Number(((rentalSubtotal * serviceFeePercent) / 100).toFixed(2));
    const totalAmount = Number((rentalSubtotal + serviceFee).toFixed(2));
    return {
        rentalDays,
        dailyPrice,
        rentalSubtotal,
        serviceFee,
        totalAmount,
    };
}
function toStripeAmount(amount) {
    return Math.round(amount * 100);
}
//# sourceMappingURL=pricing.util.js.map