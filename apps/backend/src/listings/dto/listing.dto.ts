import { IsNotEmpty, IsNumber, IsString, MinLength, Min, IsArray, IsEnum, IsOptional } from 'class-validator';

export enum ListingCondition {
  NEW = 'New',
  GOOD = 'Good',
  ACCEPTABLE = 'Acceptable',
}

export class CreateListingDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(20, { message: 'Description must be at least 20 characters long' })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsEnum(ListingCondition, { message: 'Condition must be New, Good, or Acceptable' })
  condition: ListingCondition;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Daily price must be 0 or greater' })
  dailyPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Deposit amount must be 0 or greater' })
  depositAmount: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photoUrls?: string[];
}

export class UpdateListingDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  description?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsEnum(ListingCondition)
  condition?: ListingCondition;

  @IsOptional()
  @IsNumber()
  @Min(0)
  dailyPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmount?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photoUrls?: string[];
}
