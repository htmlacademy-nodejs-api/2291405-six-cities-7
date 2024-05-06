import { City } from '../types/index.js';
import { CITIES } from './const.js';


export function stringToBoolean(value: string): boolean {
  return value.toLocaleLowerCase() === 'true';
}

export function generateRandomValue(min:number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]):T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]):T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function ParseObject(obj: object): string {
  const values = Object.values(obj);
  return values.join('\t');
}

export function getRandomCity(): City {
  const name = getRandomItem<string>(Object.keys(CITIES));
  return {
    name: name,
    location: CITIES[name]
  };
}
