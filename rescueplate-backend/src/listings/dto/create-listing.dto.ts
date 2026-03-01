import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ListingCategory } from '../schemas/listing.schema';

export class CreateListingDto {
  @ApiProperty({ example: '5 Large Pizzas', description: 'Listing title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Fresh pizzas from today, various toppings',
    description: 'Detailed description of the food',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 12.99, description: 'Discounted price' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 45.0,
    description: 'Original price before discount',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @ApiProperty({
    enum: ListingCategory,
    example: 'HUMAN',
    description:
      'Category: HUMAN for human consumption or ANIMAL for animal feed',
  })
  @IsEnum(ListingCategory)
  category: ListingCategory;

  @ApiProperty({ example: '5 boxes', description: 'Quantity available' })
  @IsString()
  @IsNotEmpty()
  quantity: string;

  @ApiProperty({
    example: 'Today 5:00 PM - 6:00 PM',
    description: 'Pickup time window',
  })
  @IsString()
  @IsNotEmpty()
  pickupTime: string;

  @ApiProperty({
    example: '/images/food1.jpg',
    description: 'Image path or URL of the food',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    example: '+250788123456',
    description: 'Vendor phone number for pickup coordination (required)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+?250|0)?[7][0-9]{8}$/, {
    message:
      'Phone number must be a valid Rwandan number (e.g., +250788123456, 0788123456, or 788123456)',
  })
  phoneNumber: string;
}
