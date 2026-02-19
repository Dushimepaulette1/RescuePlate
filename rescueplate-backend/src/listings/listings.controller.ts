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
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createListingDto: CreateListingDto, @Request() req) {
    const vendorId = req.user.userId;
    return this.listingsService.create(createListingDto, vendorId);
  }

  @Get()
  findAll() {
    return this.listingsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-listings')
  findMyListings(@Request() req) {
    const vendorId = req.user.userId;
    return this.listingsService.findByVendor(vendorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
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
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.listingsService.remove(id, userId);
  }
}
