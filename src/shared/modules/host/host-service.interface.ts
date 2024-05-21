import { DocumentType } from '@typegoose/typegoose';

import { HostEntity } from './host.entity.js';
import { CreateHostDto } from './dto/create-host.dto.js';

export interface HostService {
  create(dto: CreateHostDto, salt: string): Promise<DocumentType<HostEntity>>;
  findByEmail(email: string): Promise<DocumentType<HostEntity> | null>;
  findById(hostId: string): Promise<DocumentType<HostEntity> | null>;
  findOrCreate(dto: CreateHostDto, salt: string): Promise<DocumentType<HostEntity>>;
}
