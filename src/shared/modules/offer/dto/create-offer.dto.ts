import {
  MinLength,
  MaxLength,
  IsDateString,
  IsEnum,
  IsInt,
  Max,
  Min,
  IsBoolean,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsString,
  IsIn,
  Matches
} from 'class-validator';
import { GOODS } from '../../../helpers/index.js';
import { OfferValidationMessage } from './offer.messages.js';
import { City, CityNames, Location, OfferType } from '../../../types/index.js';

export class CreateOfferDto {
  @IsString({ message: OfferValidationMessage.title.invalidFormat })
  @MinLength(10, { message: OfferValidationMessage.title.minLength })
  @MaxLength(100, { message: OfferValidationMessage.title.maxLength })
  public title: string;

  @IsString({ message: OfferValidationMessage.description.invalidFormat })
  @MinLength(20, { message: OfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: OfferValidationMessage.description.maxLength })
  public description: string;

  @IsDateString({}, { message: OfferValidationMessage.dateOfPublication.invalidFormat })
  public dateOfPublication: string;

  @IsEnum(CityNames, { message: OfferValidationMessage.city.invalid })
  @ValidateNested({ message: OfferValidationMessage.city.invalid })
  public city: City;

  @IsString({ message: OfferValidationMessage.previewImage.invalidFormat })
  @Matches(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i, { message: OfferValidationMessage.previewImage.invalidFormat })
  @MaxLength(256, { message: OfferValidationMessage.previewImage.maxLength })
  public previewImage: string;

  @IsArray({ message: OfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(6, { message: OfferValidationMessage.images.arrayMinSize })
  @ArrayMaxSize(6, { message: OfferValidationMessage.images.arrayMaxSize })
  @Matches(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i, { each: true, message: OfferValidationMessage.images.invalidFormat })
  public images: string[];

  @IsBoolean({ message: OfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsBoolean({ message: OfferValidationMessage.isFavorite.invalidFormat })
  public isFavorite: boolean;

  @IsEnum(OfferType, { message: OfferValidationMessage.type.invalid })
  public type: OfferType;

  @IsInt({ message: OfferValidationMessage.bedrooms.invalidFormat })
  @Min(1, { message: OfferValidationMessage.bedrooms.minValue })
  @Max(8, { message: OfferValidationMessage.bedrooms.maxValue })
  public bedrooms: number;

  @IsInt({ message: OfferValidationMessage.maxAdults.invalidFormat })
  @Min(1, { message: OfferValidationMessage.maxAdults.minValue })
  @Max(10, { message: OfferValidationMessage.maxAdults.maxValue })
  public maxAdults: number;

  @IsInt({ message: OfferValidationMessage.price.invalidFormat })
  @Min(100, { message: OfferValidationMessage.price.minValue })
  @Max(100000, { message: OfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({message: OfferValidationMessage.goods.invalidFormat})
  @IsString({each: true, message: OfferValidationMessage.goods.invalidFormat})
  @IsIn(GOODS, {each: true, message: OfferValidationMessage.goods.invalidValue })
  public goods: string[];

  public hostId: string;

  @ValidateNested({ message: OfferValidationMessage.location.invalid })
  public location: Location;
}
