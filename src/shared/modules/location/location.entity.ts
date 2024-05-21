import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import { Location } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface LocationEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'locations',
    timestamps: true,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class LocationEntity extends defaultClasses.TimeStamps implements Location {
  @prop({ required: true, default: 0.0 })
  public latitude: number;

  @prop({ required: true, default: 0.0 })
  public longitude: number;
}

export const LocationModel = getModelForClass(LocationEntity);
