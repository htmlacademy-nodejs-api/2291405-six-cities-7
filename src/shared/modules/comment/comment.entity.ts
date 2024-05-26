import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose';

import { OfferEntity } from '../offer/index.js';
import { HostEntity } from '../host/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public comment: string;

  @prop({ required: true })
  public rating: number;

  @prop({ required: true })
  public date: string;

  @prop({
    ref: OfferEntity,
    required: true
  })
  public offerId: Ref<OfferEntity>;

  @prop({
    ref: HostEntity,
    required: true,
  })
  public hostId: Ref<HostEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
