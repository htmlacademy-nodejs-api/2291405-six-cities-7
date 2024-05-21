import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { Offer } from '../../shared/types/offer.type.js';
import { DefaultHostService, HostModel, HostService } from '../../shared/modules/host/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DefaultLocationService, LocationModel, LocationService } from '../../shared/modules/location/index.js';
import { DefaultCityService, CityModel, CityService } from '../../shared/modules/city/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { Logger, PinoLogger } from '../../shared/libs/logger/index.js';


export class ImportCommand implements Command {
  private hostService: HostService;
  private offerService: OfferService;
  private locationService: LocationService;
  private cityService: CityService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new PinoLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.hostService = new DefaultHostService(this.logger, HostModel);
    this.locationService = new DefaultLocationService(LocationModel);
    this.cityService = new DefaultCityService(this.logger, CityModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedOffer(offer: Offer, resolve: () => void) {
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(offer: Offer) {
    const host = await this.hostService.findOrCreate({
      ...offer.host,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    const [offerLocation, cityLocation] = await Promise.all([
      this.locationService.findOrCreate({...offer.location}),
      this.locationService.findOrCreate({...offer.city.location})
    ]);

    const city = await this.cityService.findOrCreate({
      name: offer.city.name,
      locationId: cityLocation.id
    });

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      dateOfPublication: offer.dateOfPublication,
      cityId: city.id,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      bedrooms: offer.bedrooms,
      maxAdults: offer.maxAdults,
      price: offer.price,
      goods: offer.goods,
      hostId: host.id,
      locationId: offerLocation.id
    });
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
