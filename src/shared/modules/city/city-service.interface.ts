import { DocumentType } from '@typegoose/typegoose';

import { CityEntity } from './city.entity.js';
import { CreateCityDto } from './dto/create-city.dto.js';
import { DocumentExists } from '../../types/index.js';

export interface CityService extends DocumentExists {
  create(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  findById(id: string): Promise<DocumentType<CityEntity> | null>;
  findByName(name: string): Promise<DocumentType<CityEntity> | null>;
  findOrCreate(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  findAll(): Promise<DocumentType<CityEntity>[]>;
  exists(documentId: string): Promise<boolean>;
}
