import { DocumentType, types } from '@typegoose/typegoose';

import { LocationService } from './location-service.interface.js';
import { LocationEntity } from './location.entity.js';
import { CreateLocationDto } from './dto/create-location.dto.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';


@injectable()
export class DefaultLocationService implements LocationService {
  constructor(
    @inject(Component.LocationModel) private readonly locationModel: types.ModelType<LocationEntity>
  ) {}

  public async create(dto: CreateLocationDto): Promise<DocumentType<LocationEntity>> {
    return await this.locationModel.create(dto);
  }

  public async findById(id: string): Promise<DocumentType<LocationEntity> | null> {
    return this.locationModel.findById(id).exec();
  }

  public async findByAttributes(latitude: number, longitude: number): Promise<DocumentType<LocationEntity> | null> {
    return await this.locationModel.findOne({ latitude, longitude });
  }

  public async findOrCreate(dto: CreateLocationDto): Promise<DocumentType<LocationEntity>> {
    const existedLocation = await this.findByAttributes(dto.latitude, dto.longitude);

    if (existedLocation) {
      return existedLocation;
    }

    return this.create(dto);
  }

  public async deleteById(id: string): Promise<void> {
    await this.locationModel.findByIdAndDelete(id).exec();
  }
}
