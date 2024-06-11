import { OfferType, User } from '../../shared/types/index.js';
import { City } from './city.type.js';

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
  user: User;
  longitude: number;
  latitude: number;
}
