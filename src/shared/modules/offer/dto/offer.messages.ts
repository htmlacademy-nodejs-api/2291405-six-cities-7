import { IMAGES_COUNT } from '../../../helpers/const.js';
import { DescriptionLimit } from '../limits/description-limit.enum.js';
import { GuestLimit } from '../limits/guest-limit.enum.js';
import { PriceLimit } from '../limits/price-limit.enum.js';
import { RoomLimit } from '../limits/room-limit.enum.js';
import { TitleLimit } from '../limits/title-limit.enum.js';

export const OfferValidationMessage = {
  title: {
    invalidFormat: 'title must be an string',
    minLength: `Minimum title length must be ${ TitleLimit.Min }`,
    maxLength: `Maximum title length must be ${ TitleLimit.Max }`,
  },
  description: {
    invalidFormat: 'description must be an string',
    minLength: `Minimum description length must be ${ DescriptionLimit.Min }`,
    maxLength: `Maximum description length must be ${ DescriptionLimit.Max }`,
  },
  dateOfPublication: {
    invalidFormat: 'dateOfPublication must be a valid ISO date',
  },
  city: {
    invalid: 'city field must be  Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  previewImage: {
    invalidFormat: 'previewImage must be an path string for image file',
    maxLength: 'Too short for field «image»',
  },
  images: {
    invalidFormat: 'images must be an array of path string for image file',
    arrayMinSize: `Minimum length of array images must be ${ IMAGES_COUNT }`,
    arrayMaxSize: `Maximum length of array images must be ${ IMAGES_COUNT }`
  },
  isPremium: {
    invalidFormat: 'isPremium must be an boolean',
  },
  isFavorite: {
    invalidFormat: 'isFavorite must be an boolean',
  },
  type: {
    invalid: 'invalid offer type',
  },
  bedrooms: {
    invalidFormat: 'Bedrooms must be an integer',
    minValue: `Minimum bedrooms is ${ RoomLimit.Min }`,
    maxValue: `Maximum bedrooms is ${ RoomLimit.Max }`,
  },
  maxAdults: {
    invalidFormat: 'MaxAdults must be an integer',
    minValue: `Minimum maxAdults is ${ GuestLimit.Min }`,
    maxValue: `Maximum maxAdults is ${ GuestLimit.Max }`,
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: `Minimum price is ${ PriceLimit.Min }`,
    maxValue: `Maximum price is ${ PriceLimit.Max }`,
  },
  goods: {
    invalidFormat: 'Goods must be string array',
    invalidValue: 'Goods must be Breakfast | Air conditioning | Laptop friendly workspace | Baby seat | Washer | Towels | Fridge',
  },
  location: {
    invalid: 'Location must be an object with latitude and longitude values'
  }
};
