import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { BaseController, HttpError, HttpMethod } from '../../../rest/index.js';
import { CityService } from './city-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CityRdo } from './index.js';
import { LocationService } from '../location/index.js';
import { CreateCityRequest } from './create-city-request.type.js';


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
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.get });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async gets(_req: Request, res: Response): Promise<void> {
    const cities = await this.cityService.findAll();
    const responseData = fillDTO(CityRdo, cities);
    this.ok(res, responseData);
  }

  public async get(req: Request, res: Response): Promise<void> {
    const city = await this.cityService.findById(req.params['id']);
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
        StatusCodes.NOT_FOUND,
        `City with name:${name} exists.`,
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
