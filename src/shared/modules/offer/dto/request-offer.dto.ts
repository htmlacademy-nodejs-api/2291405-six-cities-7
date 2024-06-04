import { OfferType } from '../../../helpers/index.js';
import { CityRdo } from '../../city/index.js';
import { CreateLocationDto } from '../../location/index.js';

export class RequestOfferDto {
  public title: string;
  public description: string;
  public city: CityRdo;
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
  public location: CreateLocationDto;
}
