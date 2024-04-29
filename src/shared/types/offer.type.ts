import { Host } from './host.type.js';
import { City } from './city.type.js';
import { Location } from './location.type.js';

export type Offer = {
  title: string;
  description: string;
  dateOfPublication: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  host: Host;
  location: Location;
}
