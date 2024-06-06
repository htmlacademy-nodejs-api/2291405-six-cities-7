import { IsLatitude, IsLongitude } from 'class-validator';

export class Location {
  @IsLatitude()
  public latitude: number;

  @IsLongitude()
  public longitude: number;
}
