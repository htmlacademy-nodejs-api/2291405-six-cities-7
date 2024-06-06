import { IsInt, IsMongoId, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CommentValidationMessage } from './comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CommentValidationMessage.comment.invalidFormat })
  @MinLength(5, { message: CommentValidationMessage.comment.minLength })
  @MaxLength(1024, { message: CommentValidationMessage.comment.maxLength })
  public comment: string;

  @IsInt({ message: CommentValidationMessage.rating.invalidFormat })
  @Min(1, { message: CommentValidationMessage.rating.minValue })
  @Max(5, { message: CommentValidationMessage.rating.maxValue })
  public rating: string;

  @IsMongoId({ message: CommentValidationMessage.offerId.invalidId })
  public offerId: string;

  @IsMongoId({ message: CommentValidationMessage.hostId.invalidId })
  public hostId: string;
}
