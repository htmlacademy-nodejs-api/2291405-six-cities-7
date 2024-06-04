import { IsMongoId, MaxLength } from 'class-validator';
import { CreateCityValidationMessage } from './create-city.messages.js';

export class CreateCityDto {
  @MaxLength(256, { message: CreateCityValidationMessage.name.maxLength })
  public name: string;

  @IsMongoId({ message: CreateCityValidationMessage.locationId.invalidId })
  public locationId: string;
}
