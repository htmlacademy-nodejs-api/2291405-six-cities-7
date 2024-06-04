import { DocumentType } from '@typegoose/typegoose';

import { HostEntity } from './host.entity.js';
import { CreateHostDto } from './dto/create-host.dto.js';
import { UpdateHostDto } from './dto/update-host.dto.js';
import { DocumentExists } from '../../types/document-exists.interface.js';

export interface HostService extends DocumentExists {
  create(dto: CreateHostDto, salt: string): Promise<DocumentType<HostEntity>>;
  findByEmail(email: string): Promise<DocumentType<HostEntity> | null>;
  findById(hostId: string): Promise<DocumentType<HostEntity> | null>;
  findOrCreate(dto: CreateHostDto, salt: string): Promise<DocumentType<HostEntity>>;
  updateById(userId: string, dto: UpdateHostDto): Promise<DocumentType<HostEntity> | null>;
}
