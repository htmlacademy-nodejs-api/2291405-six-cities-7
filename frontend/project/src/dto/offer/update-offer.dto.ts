import { City, Type, Location } from '../../types/types';

export class UpdateOfferDto {
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

  public goods!: string[];

  public location!: Location;
}
