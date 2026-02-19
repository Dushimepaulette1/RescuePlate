import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum ListingCategory {
  HUMAN = 'HUMAN',
  ANIMAL = 'ANIMAL',
}

@Schema({ timestamps: true })
export class Listing extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  price!: number;

  @Prop()
  originalPrice?: number;

  @Prop({
    required: true,
    enum: ListingCategory,
  })
  category!: ListingCategory;

  @Prop({ required: true })
  quantity!: string;

  @Prop({ required: true })
  pickupTime!: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  vendorId!: mongoose.Types.ObjectId;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
