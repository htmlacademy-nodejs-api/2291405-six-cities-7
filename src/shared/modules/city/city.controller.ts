import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CityService } from './city-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CityRdo, RequestCityDto } from './index.js';
import { LocationService } from '../location/index.js';
import { CreateCityRequest } from './create-city-request.type.js';
import { BaseController, HttpMethod, HttpError, ValidateObjectIdMiddleware, ValidateDtoMiddleware, DocumentExistsMiddleware } from '../../libs/rest/index.js';


@injectable()
export class CityController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CityService) private readonly cityService: CityService,
    @inject(Component.LocationService) private readonly locationService: LocationService,
  ) {
    super(logger);

    this.logger.info('Register routes for CityController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.gets });
    this.addRoute({ path: '/:cityId', method: HttpMethod.Get, handler: this.get, middlewares: [new ValidateObjectIdMiddleware('cityId'), new DocumentExistsMiddleware(this.cityService, 'City', 'cityId')] });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [new ValidateDtoMiddleware(RequestCityDto)] });
  }

  public async gets(_req: Request, res: Response): Promise<void> {
    const cities = await this.cityService.findAll();
    const responseData = fillDTO(CityRdo, cities);
    this.ok(res, responseData);
  }

  public async get({ params }: Request, res: Response): Promise<void> {
    const { cityId } = params;
    const city = await this.cityService.findById(cityId);
    const responseData = fillDTO(CityRdo, city);
    this.ok(res, responseData);
  }

  public async create(
    { body }: CreateCityRequest,
    res: Response
  ): Promise<void> {
    const name = body.name as string;
    const existCity = await this.cityService.findByName(name);

    if (existCity) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `City with name:${name} already exists.`,
        'CityController',
      );
    }

    const location = await this.locationService.findOrCreate(body.location);

    const result = await this.cityService.create({
      name: body.name,
      locationId: location.id
    });
    this.created(res, fillDTO(CityRdo, result));
  }
}
