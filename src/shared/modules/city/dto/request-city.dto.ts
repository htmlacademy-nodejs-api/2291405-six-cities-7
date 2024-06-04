import { CreateLocationDto } from '../../location/dto/create-location.dto.js';

export class RequestCityDto {
  public name: string;
  public location: CreateLocationDto;
}
