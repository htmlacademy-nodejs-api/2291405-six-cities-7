import dayjs from 'dayjs';

import { Location, Host } from '../../types/index.js';

import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems, OfferType, GOODS, ParseObject } from '../../helpers/index.js';
import { getRandomCity } from '../../helpers/common.js';

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);

    const dateOfPublication = dayjs().
      subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').
      toISOString();

    const city = getRandomCity();
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomItems<string>(this.mockData.images).join(';');

    const isPremium = getRandomItem([true, false]);
    const isFavorite = getRandomItem([true, false]);

    const rating = generateRandomValue(MIN_RATING, MAX_RATING).toString();
    const type = getRandomItem(Object.values(OfferType));
    const bedrooms = generateRandomValue(MIN_ROOMS, MAX_ROOMS).toString();
    const maxAdults = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();

    const goods = getRandomItems<string>(GOODS).join(';');
    const host = ParseObject(getRandomItem<Host>(this.mockData.hosts));
    const location = ParseObject(getRandomItem<Location>(this.mockData.locations));

    return [
      title, description, dateOfPublication,
      city, previewImage, images, isPremium,
      isFavorite, rating, type, bedrooms,
      maxAdults, price, goods, host,
      location
    ].join('\t');
  }
}
