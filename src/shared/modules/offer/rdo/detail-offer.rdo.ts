import { Expose, Type } from 'class-transformer';
import { HostRdo } from '../../host/index.js';
import { City, Location } from '../../../types/index.js';


export class DetailOfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public dateOfPublication: string;

  @Expose()
  public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: string;

  @Expose()
  public bedrooms: number;

  @Expose()
  public maxAdults: number;

  @Expose()
  public price: number;

  @Expose()
  public goods: string[];

  @Expose()
  @Type(() => HostRdo)
  public host: HostRdo;

  @Expose()
  public location: Location;

  @Expose()
  public commentCount: number;
}
