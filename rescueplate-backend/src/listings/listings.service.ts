import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing } from './schemas/listing.schema';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(@InjectModel(Listing.name) private listingModel: Model<Listing>) {}

  async create(createListingDto: CreateListingDto, vendorId: string): Promise<Listing> {
    const newListing = new this.listingModel({
      ...createListingDto,
      vendorId,
    });

    return await newListing.save();
  }

  async findAll(): Promise<Listing[]> {
    return await this.listingModel
      .find()
      .populate('vendorId', 'name email')
      .exec();
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.listingModel
      .findById(id)
      .populate('vendorId', 'name email')
      .exec();

    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }

    return listing;
  }

  async findByVendor(vendorId: string): Promise<Listing[]> {
    return await this.listingModel.find({ vendorId }).exec();
  }

  async update(
    id: string,
    updateListingDto: UpdateListingDto,
    userId: string,
  ): Promise<Listing> {
    const listing = await this.listingModel.findById(id).exec();

    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }

    if (listing.vendorId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    const updatedListing = await this.listingModel
      .findByIdAndUpdate(id, updateListingDto, { new: true })
      .exec();

    if (!updatedListing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }

    return updatedListing;
  }

  async remove(id: string, userId: string): Promise<void> {
    const listing = await this.listingModel.findById(id).exec();

    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }

    if (listing.vendorId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await this.listingModel.findByIdAndDelete(id).exec();
  }
}