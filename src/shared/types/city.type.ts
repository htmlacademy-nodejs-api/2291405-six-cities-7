import { IsEnum, ValidateNested } from 'class-validator';
import { Location } from './location.type.js';
import { CityNames } from './city-name.enum.js';

export class City {
  @IsEnum(CityNames)
  public name: CityNames;

  @ValidateNested()
  public location: Location;
}
