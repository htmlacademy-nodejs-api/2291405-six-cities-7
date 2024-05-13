import { OfferType } from '../../../helpers/index.js';

export class CreateOfferDto {
  public offerId?: string;
  public title: string;
  public description: string;
  public dateOfPublication: Date;
  public cityId: string;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: OfferType;
  public bedrooms: number;
  public maxAdults: number;
  public price: number;
  public goods: string[];
  public hostId: string;
  public locationId: string;
}
