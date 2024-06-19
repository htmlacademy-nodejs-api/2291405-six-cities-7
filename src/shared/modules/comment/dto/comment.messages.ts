import { CommentLimit } from '../limits/comment-limit.enum.js';
import { RatingLimit } from '../limits/rating-limit.enum.js';

export const CommentValidationMessage = {
  comment: {
    invalidFormat: 'comment must be an string',
    minLength: `Minimum comment length must be ${ CommentLimit.Min }`,
    maxLength: `Maximum comment length must be ${ CommentLimit.Max }`
  },
  date: {
    invalidFormat: 'date must be a valid ISO date',
  },
  rating: {
    invalidFormat: 'rating must be an integer',
    minValue: `Minimum rating length must be ${ RatingLimit.Min }`,
    maxValue: `Maximum rating length must be ${ RatingLimit.Max }`
  },
  offerId: {
    invalidId: 'offerId field must be a valid id',
  },
};
