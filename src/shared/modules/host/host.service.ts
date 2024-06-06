import { DocumentType, types } from '@typegoose/typegoose';

import { HostService } from './host-service.interface.js';
import { HostEntity } from './host.entity.js';
import { CreateHostDto } from './dto/create-host.dto.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { UpdateHostDto } from './dto/update-host.dto.js';


@injectable()
export class DefaultHostService implements HostService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.HostModel) private readonly hostModel: types.ModelType<HostEntity>
  ) {}

  public async exists(documentId: string): Promise<boolean> {
    const document = await this.hostModel.exists({_id: documentId});
    return document !== null;
  }

  public async create(dto: CreateHostDto, salt: string): Promise<DocumentType<HostEntity>> {
    const host = new HostEntity(dto);
    host.setPassword(dto.password, salt);

    const result = await this.hostModel.create(host);
    this.logger.info(`New user created: ${host.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<HostEntity> | null> {
    return this.hostModel.findOne({email});
  }

  public async findById(hostId: string): Promise<DocumentType<HostEntity> | null> {
    return this.hostModel.findById(hostId).exec();
  }

  public async findOrCreate(dto: CreateHostDto, salt: string): Promise<DocumentType<HostEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async updateById(hostId: string, dto: UpdateHostDto): Promise<DocumentType<HostEntity> | null> {
    return this.hostModel
      .findByIdAndUpdate(hostId, dto, { new: true })
      .exec();
  }
}
