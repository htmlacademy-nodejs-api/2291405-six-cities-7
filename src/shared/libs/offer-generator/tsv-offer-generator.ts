import dayjs from 'dayjs';

import { Location, User, OfferType } from '../../types/index.js';

import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems, Goods, ParseObject } from '../../helpers/index.js';
import { getRandomCity } from '../../helpers/common.js';
import { GuestLimit, PriceLimit, RoomLimit } from '../../modules/offer/index.js';

const enum WeekDays {
  First = 1,
  Last = 7
}

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);

    const dateOfPublication = dayjs().
      subtract(generateRandomValue(WeekDays.First, WeekDays.Last), 'day').
      toISOString();

    const city = getRandomCity();
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomItems<string>(this.mockData.images).join(';');

    const isPremium = getRandomItem([true, false]);

    const type = getRandomItem(Object.values(OfferType));
    const bedrooms = generateRandomValue(RoomLimit.Min, RoomLimit.Max).toString();
    const maxAdults = generateRandomValue(GuestLimit.Min, GuestLimit.Max).toString();
    const price = generateRandomValue(PriceLimit.Min, PriceLimit.Max).toString();

    const goods = getRandomItems<string>(Goods).join(';');
    const user = ParseObject(getRandomItem<User>(this.mockData.users));
    const location = ParseObject(getRandomItem<Location>(this.mockData.locations));

    return [
      title, description, dateOfPublication,
      city, previewImage, images, isPremium,
      type, bedrooms,
      maxAdults, price, goods, user,
      location
    ].join('\t');
  }
}
