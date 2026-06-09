export declare enum PaymentMethod {
    ONLINE = "Online Payment",
    CASH = "Cash On Pickup"
}
export declare class CreateBookingDto {
    listingId: string;
    startDate: string;
    endDate: string;
    paymentMethod: PaymentMethod;
}
export declare class ResolveBookingDto {
    status: 'Approved' | 'Rejected';
}
