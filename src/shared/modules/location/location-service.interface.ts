import { DocumentType } from '@typegoose/typegoose';

import { LocationEntity } from './location.entity.js';
import { CreateLocationDto } from './dto/create-location.dto.js';

export interface LocationService {
  create(dto: CreateLocationDto): Promise<DocumentType<LocationEntity>>;
  findById(locationId: string): Promise<DocumentType<LocationEntity> | null>;
  findByAttributes(latitude: number, longitude: number): Promise<DocumentType<LocationEntity> | null>;
  findOrCreate(dto: CreateLocationDto): Promise<DocumentType<LocationEntity>>;
}
