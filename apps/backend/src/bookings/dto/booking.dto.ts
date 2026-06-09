import { IsNotEmpty, IsString, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentMethod {
  ONLINE = 'Online Payment',
  CASH = 'Cash On Pickup',
}

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'ID of the listing to book' })
  listingId: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: 'Booking start date (ISO string)', example: '2026-06-20' })
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: 'Booking end date (ISO string)', example: '2026-06-25' })
  endDate: string;

  @IsNotEmpty()
  @IsEnum(PaymentMethod, { message: 'Payment method must be Online Payment or Cash On Pickup' })
  @ApiProperty({ enum: PaymentMethod, description: 'Payment method' })
  paymentMethod: PaymentMethod;
}

export class ResolveBookingDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(['Approved', 'Rejected'], { message: 'Resolution status must be Approved or Rejected' })
  @ApiProperty({ enum: ['Approved', 'Rejected'], description: 'Resolution status' })
  status: 'Approved' | 'Rejected';
}
