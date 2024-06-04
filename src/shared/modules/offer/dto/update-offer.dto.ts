import { OfferType } from '../../../helpers/index.js';
import { CreateLocationDto } from '../../location/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public cityId?: string;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public isFavorite?: boolean;
  public type?: OfferType;
  public bedrooms?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: string[];
  public location?: CreateLocationDto;
}
