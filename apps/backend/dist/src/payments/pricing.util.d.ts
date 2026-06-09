export declare function calculateRentalDays(startDate: Date, endDate: Date): number;
export interface PriceBreakdown {
    rentalDays: number;
    dailyPrice: number;
    rentalSubtotal: number;
    serviceFee: number;
    totalAmount: number;
}
export declare function calculateBookingTotal(dailyPrice: number, startDate: Date, endDate: Date, serviceFeePercent?: number): PriceBreakdown;
export declare function toStripeAmount(amount: number): number;
