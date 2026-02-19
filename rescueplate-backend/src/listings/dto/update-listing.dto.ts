// DTO for updating an existing listing
// Vendors can edit their listings (change price, quantity, etc.)

// PartialType is a helper from NestJS that makes ALL fields optional
import { PartialType } from '@nestjs/mapped-types';
// Import the CreateListingDto
import { CreateListingDto } from './create-listing.dto';

// UpdateListingDto extends PartialType(CreateListingDto)
// This means it has the SAME fields as CreateListingDto, but ALL are optional
// Example: You can update ONLY the price without sending title, description, etc.
export class UpdateListingDto extends PartialType(CreateListingDto) {
  // PartialType automatically creates these optional fields:
  // title?: string;
  // description?: string;
  // price?: number;
  // originalPrice?: number;
  // category?: ListingCategory;
  // quantity?: string;
  // pickupTime?: string;
  
  // We don't need to write them manually! PartialType does it for us.
}

