export const OfferValidationMessage = {
  title: {
    invalidFormat: 'title must be an string',
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    invalidFormat: 'description must be an string',
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
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
    arrayMinSize: 'Minimum length of array images must be 6',
    arrayMaxSize: 'Maximum length of array images must be 6'
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
    minValue: 'Minimum bedrooms is 1',
    maxValue: 'Maximum bedrooms is 8',
  },
  maxAdults: {
    invalidFormat: 'MaxAdults must be an integer',
    minValue: 'Minimum maxAdults is 1',
    maxValue: 'Maximum maxAdults is 10',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  goods: {
    invalidFormat: 'Goods must be string array',
    invalidValue: 'Goods must be Breakfast | Air conditioning | Laptop friendly workspace | Baby seat | Washer | Towels | Fridge',
  },
  location: {
    invalid: 'Location must be an object with latitude and longitude values'
  }
};
