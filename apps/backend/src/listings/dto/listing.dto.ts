import { IsNotEmpty, IsNumber, IsString, MinLength, Min, IsArray, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ListingCondition {
  NEW = 'New',
  GOOD = 'Good',
  ACCEPTABLE = 'Acceptable',
}

export class CreateListingDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @ApiProperty({ description: 'Listing title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(20, { message: 'Description must be at least 20 characters long' })
  @ApiProperty({ description: 'Listing description' })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Category ID' })
  categoryId: number;

  @IsNotEmpty()
  @IsEnum(ListingCondition, { message: 'Condition must be New, Good, or Acceptable' })
  @ApiProperty({ enum: ListingCondition, description: 'Condition of the item' })
  condition: ListingCondition;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Daily price must be 0 or greater' })
  @ApiProperty({ description: 'Daily rental price' })
  dailyPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Deposit amount must be 0 or greater' })
  @ApiProperty({ description: 'Deposit amount' })
  depositAmount: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ required: false, isArray: true, description: 'Photo URLs' })
  photoUrls?: string[];
}

export class UpdateListingDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @ApiProperty({ required: false, description: 'Listing title' })
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  @ApiProperty({ required: false, description: 'Listing description' })
  description?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, description: 'Category ID' })
  categoryId?: number;

  @IsOptional()
  @IsEnum(ListingCondition)
  @ApiProperty({ required: false, enum: ListingCondition, description: 'Condition' })
  condition?: ListingCondition;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ required: false, description: 'Daily price' })
  dailyPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ required: false, description: 'Deposit amount' })
  depositAmount?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ required: false, isArray: true, description: 'Photo URLs' })
  photoUrls?: string[];
}
