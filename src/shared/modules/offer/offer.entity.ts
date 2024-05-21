import { Ref, Severity, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

import { Location, City, Host } from '../../types/index.js';
import { LocationEntity } from '../location/index.js';
import { CityEntity } from '../city/index.js';
import { OfferType } from '../../helpers/index.js';
import { HostEntity } from '../host/index.js';

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
  public title!: string;

  @prop({trim: true})
  public description!: string;

  @prop()
  public dateOfPublication!: Date;

  @prop({
    ref: CityEntity,
    required: true
  })
  public cityId: Ref<City>;

  @prop()
  public previewImage!: string;

  @prop()
  public images: string[];

  @prop({default: false})
  public isPremium: boolean;

  @prop({default: false})
  public isFavorite: boolean;

  @prop({default: 1})
  public rating: number;

  @prop({
    type: () => String,
    enum: OfferType
  })
  public type: OfferType;

  @prop({default: 0})
  public bedrooms: number;

  @prop()
  public maxAdults: number;

  @prop({required: true, default: 0})
  public price!: number;

  @prop({default: []})
  public goods: string[];

  @prop({
    ref: HostEntity,
    required: true
  })
  public hostId: Ref<Host>;

  @prop({
    ref: LocationEntity,
    required: true
  })
  public locationId: Ref<Location>;
}

export const OfferModel = getModelForClass(OfferEntity);
