import { City, Location, OfferType } from '../../../types/index.js';

export class RequestOfferDto {
  public title: string;
  public description: string;
  public city: City;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public type: OfferType;
  public bedrooms: number;
  public maxAdults: number;
  public price: number;
  public goods: string[];
  public hostId: string;
  public location: Location;
}
