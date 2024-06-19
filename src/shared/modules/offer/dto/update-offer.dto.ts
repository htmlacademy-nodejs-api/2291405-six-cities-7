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
import { Goods, IMAGES_COUNT } from '../../../helpers/index.js';
import { City, Location, OfferType } from '../../../types/index.js';
import { OfferValidationMessage } from './offer.messages.js';
import { TitleLimit } from '../limits/title-limit.enum.js';
import { DescriptionLimit } from '../limits/description-limit.enum.js';
import { RoomLimit } from '../limits/room-limit.enum.js';
import { GuestLimit } from '../limits/guest-limit.enum.js';
import { PriceLimit } from '../limits/price-limit.enum.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: OfferValidationMessage.title.invalidFormat })
  @MinLength(TitleLimit.Min, { message: OfferValidationMessage.title.minLength })
  @MaxLength(TitleLimit.Max, { message: OfferValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @IsString({ message: OfferValidationMessage.description.invalidFormat })
  @MinLength(DescriptionLimit.Min, { message: OfferValidationMessage.description.minLength })
  @MaxLength(DescriptionLimit.Max, { message: OfferValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @ValidateNested({ message: OfferValidationMessage.city.invalid })
  public city?: City;

  @IsOptional()
  @IsString({ message: OfferValidationMessage.previewImage.invalidFormat })
  @Matches(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i, { message: OfferValidationMessage.previewImage.invalidFormat })
  @MaxLength(256, { message: OfferValidationMessage.previewImage.maxLength })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: OfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(IMAGES_COUNT, { message: OfferValidationMessage.images.arrayMinSize })
  @ArrayMaxSize(IMAGES_COUNT, { message: OfferValidationMessage.images.arrayMaxSize })
  @Matches(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i, { each: true, message: OfferValidationMessage.images.invalidFormat })
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
  @Min(RoomLimit.Min, { message: OfferValidationMessage.bedrooms.minValue })
  @Max(RoomLimit.Max, { message: OfferValidationMessage.bedrooms.maxValue })
  public bedrooms?: number;

  @IsOptional()
  @IsInt({ message: OfferValidationMessage.maxAdults.invalidFormat })
  @Min(GuestLimit.Min, { message: OfferValidationMessage.maxAdults.minValue })
  @Max(GuestLimit.Max, { message: OfferValidationMessage.maxAdults.maxValue })
  public maxAdults?: number;

  @IsOptional()
  @IsInt({ message: OfferValidationMessage.price.invalidFormat })
  @Min(PriceLimit.Min, { message: OfferValidationMessage.price.minValue })
  @Max(PriceLimit.Max, { message: OfferValidationMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({message: OfferValidationMessage.goods.invalidFormat })
  @IsString({each: true, message: OfferValidationMessage.goods.invalidFormat })
  @IsIn(Goods, {each: true, message: OfferValidationMessage.goods.invalidValue })
  public goods?: string[];

  @IsOptional()
  @ValidateNested({ message: OfferValidationMessage.location.invalid })
  public location?: Location;
}
