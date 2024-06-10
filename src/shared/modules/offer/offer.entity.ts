import { Ref, Severity, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

import { Location, User, City, OfferType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title: string;

  @prop({ trim: true, required: true })
  public description: string;

  @prop({ required: true })
  public dateOfPublication: Date;

  @prop({ required: true })
  public city: City;

  @prop({ required: true })
  public previewImage: string;

  @prop({ required: true })
  public images: string[];

  @prop({default: false, required: true })
  public isPremium: boolean;

  @prop({default: false, required: true })
  public isFavorite: boolean;

  @prop({default: 1, required: true })
  public rating: number;

  @prop({
    type: () => String,
    enum: OfferType,
    required: true
  })
  public type: OfferType;

  @prop({default: 1, required: true })
  public bedrooms: number;

  @prop({default: 1, required: true })
  public maxAdults: number;

  @prop({required: true, default: 0})
  public price: number;

  @prop({default: [], required: true })
  public goods: string[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public hostId: Ref<User>;

  @prop({ required: true })
  public location: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
