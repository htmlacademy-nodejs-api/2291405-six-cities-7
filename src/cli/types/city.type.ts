import { CityNames } from '../../shared/types/city-name.enum.js';
import { Location } from './location.type.js';

export type City = {
  name: CityNames;
  location: Location;
}
