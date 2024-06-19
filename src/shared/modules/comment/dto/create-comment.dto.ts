import { IsInt, IsMongoId, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CommentValidationMessage } from './comment.messages.js';
import { CommentLimit } from '../limits/comment-limit.enum.js';
import { RatingLimit } from '../limits/rating-limit.enum.js';

export class CreateCommentDto {
  @IsString({ message: CommentValidationMessage.comment.invalidFormat })
  @MinLength(CommentLimit.Min, { message: CommentValidationMessage.comment.minLength })
  @MaxLength(CommentLimit.Max, { message: CommentValidationMessage.comment.maxLength })
  public comment: string;

  @IsInt({ message: CommentValidationMessage.rating.invalidFormat })
  @Min(RatingLimit.Min, { message: CommentValidationMessage.rating.minValue })
  @Max(RatingLimit.Max, { message: CommentValidationMessage.rating.maxValue })
  public rating: string;

  @IsMongoId({ message: CommentValidationMessage.offerId.invalidId })
  public offerId: string;

  public userId: string;
}
