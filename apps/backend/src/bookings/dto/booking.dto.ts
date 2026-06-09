import { IsNotEmpty, IsString, IsDateString, IsEnum } from 'class-validator';

export enum PaymentMethod {
  ONLINE = 'Online Payment',
  CASH = 'Cash On Pickup',
}

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  listingId: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsEnum(PaymentMethod, { message: 'Payment method must be Online Payment or Cash On Pickup' })
  paymentMethod: PaymentMethod;
}

export class ResolveBookingDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(['Approved', 'Rejected'], { message: 'Resolution status must be Approved or Rejected' })
  status: 'Approved' | 'Rejected';
}
