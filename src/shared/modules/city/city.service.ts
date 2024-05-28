import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { CityService } from './city-service.interface.js';
import { CreateCityDto } from './dto/create-city.dto.js';
import { Component } from '../../types/index.js';
import { CityEntity } from './city.entity.js';
import { Logger } from '../../libs/logger/index.js';
import { Types } from 'mongoose';

const addLocationToCity = [
  {
    $lookup: {
      from: 'locations',
      localField: 'locationId',
      foreignField: '_id',
      as: 'location',
    }
  },
  {
    $unwind: '$location',
  }
];

@injectable()
export class DefaultCityService implements CityService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CityModel) private readonly cityModel: types.ModelType<CityEntity>,
  ) {}

  public async findAll(): Promise<DocumentType<CityEntity>[]> {
    return await this.cityModel.aggregate([...addLocationToCity]).exec();
  }

  public async create(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const result = await this.cityModel.create(dto);
    this.logger.info(`New city created: ${dto.name}`);

    return result;
  }

  public async findById(id: string): Promise<DocumentType<CityEntity> | null> {
    const cities = await this.cityModel.aggregate([
      ...addLocationToCity,
      {
        $match: { _id: new Types.ObjectId(id) }
      }
    ]).exec();

    return cities[0];
  }

  public async findByName(name: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({ name }).exec();
  }

  public async findOrCreate(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const existedCity = await this.findByName(dto.name);

    if (existedCity) {
      return existedCity;
    }

    return this.create(dto);
  }
}
