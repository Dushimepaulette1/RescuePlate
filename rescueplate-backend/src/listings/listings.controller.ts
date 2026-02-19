import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new food listing (Vendor only)' })
  @ApiResponse({ status: 201, description: 'Listing successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createListingDto: CreateListingDto, @Request() req) {
    const vendorId = req.user.userId;
    return this.listingsService.create(createListingDto, vendorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all food listings' })
  @ApiResponse({ status: 200, description: 'Returns all listings' })
  findAll() {
    return this.listingsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-listings')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current vendor\'s listings' })
  @ApiResponse({ status: 200, description: 'Returns vendor\'s listings' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMyListings(@Request() req) {
    const vendorId = req.user.userId;
    return this.listingsService.findByVendor(vendorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific listing by ID' })
  @ApiResponse({ status: 200, description: 'Returns the listing' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a listing (Vendor only - own listings)' })
  @ApiResponse({ status: 200, description: 'Listing successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your listing' })
  update(
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.listingsService.update(id, updateListingDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a listing (Vendor only - own listings)' })
  @ApiResponse({ status: 200, description: 'Listing successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your listing' })
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.listingsService.remove(id, userId);
  }
}
