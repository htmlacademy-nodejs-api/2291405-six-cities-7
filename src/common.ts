import { Cities } from './const.js';
import { Location } from './shared/types/location.type.js';

function getCityLocation(city: string): Location {
  return Cities[city];
}

function stringToBoolean(value: string): boolean {
  return JSON.parse(value.toLocaleLowerCase()) as boolean;
}

export { getCityLocation, stringToBoolean};
