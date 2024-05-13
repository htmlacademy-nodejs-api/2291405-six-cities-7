import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { CityService } from './city-service.interface.js';
import { CreateCityDto } from './dto/create-city.dto.js';
import { Component } from '../../types/index.js';
import { CityEntity } from './city.entity.js';
import { Logger } from '../../libs/logger/index.js';


@injectable()
export class DefaultCityService implements CityService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CityModel) private readonly cityModel: types.ModelType<CityEntity>,
  ) {}

  public async create(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const result = await this.cityModel.create(dto);
    this.logger.info(`New city created: ${dto.name}`);

    return result;
  }

  public async findById(id: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findById(id).exec();
  }

  public async findByName(name: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({ name });
  }

  public async findOrCreate(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const existedCity = await this.findByName(dto.name);

    if (existedCity) {
      return existedCity;
    }

    return this.create(dto);
  }
}
