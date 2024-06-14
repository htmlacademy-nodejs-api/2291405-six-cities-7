import { City, Type, User, Location } from '../../types/types';


export class OfferDto {
  public id!: string;

  public title!: string;

  public description!: string;

  public city!: City;

  public previewImage!: string;

  public images!: string[];

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public type!: Type;

  public bedrooms!: number;

  public maxAdults!: number;

  public price!: number;

  public rating!: number;

  public commentCount!: number;

  public goods!: string[];

  public user!: User;

  public location!: Location;
}
