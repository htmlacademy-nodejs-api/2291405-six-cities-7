import { Host } from './host.type.js';
import { City } from './city.type.js';
import { Location } from './location.type.js';
import { OfferType } from './offer-type.enum.js';

export type Offer = {
  title: string;
  description: string;
  dateOfPublication: string;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  type: OfferType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  host: Host;
  location: Location;
}
