import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { HostService } from './host-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultHostService } from './host.service.js';
import { HostEntity, HostModel } from './host.entity.js';

export function createHostContainer() {
  const userContainer = new Container();
  userContainer.bind<HostService>(Component.HostService).to(DefaultHostService).inSingletonScope();
  userContainer.bind<types.ModelType<HostEntity>>(Component.HostModel).toConstantValue(HostModel);

  return userContainer;
}
