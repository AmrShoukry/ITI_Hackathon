export function calculateRentalDays(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export interface PriceBreakdown {
  rentalDays: number;
  dailyPrice: number;
  rentalSubtotal: number;
  serviceFee: number;
  totalAmount: number;
}

export function calculateBookingTotal(
  dailyPrice: number,
  startDate: Date,
  endDate: Date,
  serviceFeePercent = 0,
): PriceBreakdown {
  const rentalDays = calculateRentalDays(startDate, endDate);
  const rentalSubtotal = Number((dailyPrice * rentalDays).toFixed(2));
  const serviceFee = Number(
    ((rentalSubtotal * serviceFeePercent) / 100).toFixed(2),
  );
  const totalAmount = Number((rentalSubtotal + serviceFee).toFixed(2));

  return {
    rentalDays,
    dailyPrice,
    rentalSubtotal,
    serviceFee,
    totalAmount,
  };
}

export function toStripeAmount(amount: number): number {
  return Math.round(amount * 100);
}
