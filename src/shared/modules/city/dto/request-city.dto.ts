import { MaxLength } from 'class-validator';
import { CreateLocationDto } from '../../location/dto/create-location.dto.js';
import { CreateCityValidationMessage } from './create-city.messages.js';

export class RequestCityDto {
  @MaxLength(256, { message: CreateCityValidationMessage.name.maxLength })
  public name: string;

  public location: CreateLocationDto;
}
