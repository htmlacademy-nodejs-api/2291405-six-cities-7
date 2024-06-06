import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import { GOODS } from '../../../helpers/index.js';
import { City, CityNames, Location, OfferType } from '../../../types/index.js';
import { OfferValidationMessage } from './offer.messages.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: OfferValidationMessage.title.invalidFormat })
  @MinLength(10, { message: OfferValidationMessage.title.minLength })
  @MaxLength(100, { message: OfferValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @IsString({ message: OfferValidationMessage.description.invalidFormat })
  @MinLength(20, { message: OfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: OfferValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsEnum(CityNames, { message: OfferValidationMessage.city.invalid })
  @ValidateNested({ message: OfferValidationMessage.city.invalid })
  public city?: City;

  @IsOptional()
  @IsString({ message: OfferValidationMessage.previewImage.invalidFormat })
  @Matches(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i, { message: OfferValidationMessage.previewImage.invalidFormat })
  @MaxLength(256, { message: OfferValidationMessage.previewImage.maxLength })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: OfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(6, { message: OfferValidationMessage.images.arrayMinSize })
  @ArrayMaxSize(6, { message: OfferValidationMessage.images.arrayMaxSize })
  @Matches(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i, { each: true, message: OfferValidationMessage.images.invalidFormat })
  @MaxLength(256, { message: OfferValidationMessage.previewImage.maxLength })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: OfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean({ message: OfferValidationMessage.isFavorite.invalidFormat })
  public isFavorite?: boolean;

  @IsOptional()
  @IsEnum(OfferType, { message: OfferValidationMessage.type.invalid })
  public type?: OfferType;

  @IsOptional()
  @IsInt({ message: OfferValidationMessage.bedrooms.invalidFormat })
  @Min(1, { message: OfferValidationMessage.bedrooms.minValue })
  @Max(8, { message: OfferValidationMessage.bedrooms.maxValue })
  public bedrooms?: number;

  @IsOptional()
  @IsInt({ message: OfferValidationMessage.maxAdults.invalidFormat })
  @Min(1, { message: OfferValidationMessage.maxAdults.minValue })
  @Max(10, { message: OfferValidationMessage.maxAdults.maxValue })
  public maxAdults?: number;

  @IsOptional()
  @IsInt({ message: OfferValidationMessage.price.invalidFormat })
  @Min(100, { message: OfferValidationMessage.price.minValue })
  @Max(200000, { message: OfferValidationMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({message: OfferValidationMessage.goods.invalidFormat })
  @IsString({each: true, message: OfferValidationMessage.goods.invalidFormat })
  @IsIn(GOODS, {each: true, message: OfferValidationMessage.goods.invalidValue })
  public goods?: string[];

  @IsOptional()
  @ValidateNested({ message: OfferValidationMessage.location.invalid })
  public location?: Location;
}
