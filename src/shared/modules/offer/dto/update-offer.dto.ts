import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsMongoId, IsOptional, Max, MaxLength, Min, MinLength } from 'class-validator';
import { OfferType } from '../../../helpers/index.js';
import { CreateLocationDto } from '../../location/index.js';
import { UpdateOfferValidationMessage } from './update-offer.messages.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: UpdateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: UpdateOfferValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: UpdateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: UpdateOfferValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsMongoId({ message: UpdateOfferValidationMessage.cityId.invalidId })
  public cityId?: string;

  @IsOptional()
  @MaxLength(256, { message: UpdateOfferValidationMessage.previewImage.maxLength })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(6, { message: UpdateOfferValidationMessage.images.arrayMinSize })
  @ArrayMaxSize(6, { message: UpdateOfferValidationMessage.images.arrayMaxSize })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: UpdateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean({ message: UpdateOfferValidationMessage.isFavorite.invalidFormat })
  public isFavorite?: boolean;

  @IsEnum(OfferType, { message: UpdateOfferValidationMessage.type.invalid })
  public type?: OfferType;

  @IsInt({ message: UpdateOfferValidationMessage.bedrooms.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.bedrooms.minValue })
  @Max(8, { message: UpdateOfferValidationMessage.bedrooms.maxValue })
  public bedrooms?: number;

  @IsInt({ message: UpdateOfferValidationMessage.maxAdults.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.maxAdults.minValue })
  @Max(10, { message: UpdateOfferValidationMessage.maxAdults.maxValue })
  public maxAdults?: number;

  @IsInt({ message: UpdateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: UpdateOfferValidationMessage.price.minValue })
  @Max(200000, { message: UpdateOfferValidationMessage.price.maxValue })
  public price?: number;

  public goods?: string[];

  public location?: CreateLocationDto;
}
