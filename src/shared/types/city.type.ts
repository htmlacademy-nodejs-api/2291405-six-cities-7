import { IsString, ValidateNested } from 'class-validator';
import { Location } from './location.type.js';

export class City {
  @IsString()
  public name: string;

  @ValidateNested()
  public location: Location;
}
