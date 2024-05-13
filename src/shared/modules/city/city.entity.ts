import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

import { Location } from '../../types/index.js';
import { LocationEntity } from '../location/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CityEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'cities',
    timestamps: true,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CityEntity extends defaultClasses.TimeStamps {
  @prop({
    ref: LocationEntity,
    required: true
  })
  public locationId: Ref<Location>;

  @prop({ required: true, default: '' })
  public name: string;
}

export const CityModel = getModelForClass(CityEntity);
