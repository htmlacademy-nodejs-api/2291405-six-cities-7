export const CreateCityValidationMessage = {
  name: {
    maxLength: 'Too short for field «name»',
  },
  locationId: {
    invalidId: 'locationId field must be a valid id',
  }
} as const;
