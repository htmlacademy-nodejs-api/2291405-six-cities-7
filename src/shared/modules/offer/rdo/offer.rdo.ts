import { Expose, Type } from 'class-transformer';
import { CityRdo } from '../../city/index.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public price: number;

  @Expose()
  public title: string;

  @Expose()
  public type: string;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public dateOfPublication: string;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public rating: boolean;

  @Expose()
  public commentCount: number;

  @Expose()
  @Type(() => CityRdo)
  public city: CityRdo;
}
