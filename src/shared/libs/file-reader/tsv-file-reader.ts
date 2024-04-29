import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer, Host, Location, City } from '../../types/index.js';
import { getCityLocation, stringToBoolean} from '../../../common.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim())
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      dateOfPublication,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      name,
      email,
      avatarUrl,
      password,
      isPro,
      latitude,
      longitude
    ] = line.split('\t');

    return {
      title,
      description,
      dateOfPublication: new Date(dateOfPublication),
      city: this.parseCity(city),
      previewImage,
      images: images.split(';'),
      isPremium: stringToBoolean(isPremium),
      isFavorite: stringToBoolean(isFavorite),
      rating: Number(rating),
      type,
      bedrooms: Number(bedrooms),
      maxAdults: Number(maxAdults),
      price: Number(price),
      goods: goods.split(';'),
      host: this.parseHost(name, email, avatarUrl, password, isPro),
      location: this.parseLocation(latitude, longitude)
    };
  }

  private parseCity(name: string): City {
    const location = getCityLocation(name);
    return {
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      name: name
    };
  }

  private parseLocation(latitude: string, longitude: string): Location {
    return { latitude: Number(latitude), longitude: Number(longitude) };
  }

  private parseHost(name: string, email: string, avatarUrl:string, password: string, isPro: string): Host {
    return {
      name,
      email,
      avatarUrl,
      password,
      isPro: stringToBoolean(isPro)
    };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
