import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer, User, Location, City, CityNames, OfferType} from '../../types/index.js';
import { convertStringToBoolean} from '../../helpers/index.js';
import { CITIES } from '../../helpers/const.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384;

  constructor(
    private readonly filename: string
  ) {
    super();
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
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      name,
      email,
      avatarUrl,
      isPro,
      latitude,
      longitude
    ] = line.split('\t');

    return {
      title,
      description,
      dateOfPublication: dateOfPublication,
      city: this.parseCity(city as CityNames),
      previewImage,
      images: images.split(';'),
      isPremium: convertStringToBoolean(isPremium),
      isFavorite: convertStringToBoolean(isFavorite),
      type: type as OfferType,
      bedrooms: Number(bedrooms),
      maxAdults: Number(maxAdults),
      price: Number(price),
      goods: goods.split(';'),
      user: this.parseUser(name, email, avatarUrl, isPro),
      location: this.parseLocation(latitude, longitude)
    };
  }

  private parseCity(city: CityNames): City {
    return {
      name: city,
      location: CITIES[city]
    };
  }

  private parseLocation(latitude: string, longitude: string): Location {
    return { latitude: Number(latitude), longitude: Number(longitude) };
  }

  private parseUser(name: string, email: string, avatarUrl:string, isPro: string): User {
    return {
      name,
      email,
      avatarUrl,
      isPro: convertStringToBoolean(isPro)
    };
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });
      }
    }

    this.emit('end', importedRowCount);
  }
}
