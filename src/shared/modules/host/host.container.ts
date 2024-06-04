import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { HostService } from './host-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultHostService } from './host.service.js';
import { HostEntity, HostModel } from './host.entity.js';
import { HostController } from './host.controller.js';
import { Controller } from '../../libs/rest/index.js';

export function createHostContainer() {
  const hostContainer = new Container();
  hostContainer.bind<HostService>(Component.HostService).to(DefaultHostService).inSingletonScope();
  hostContainer.bind<types.ModelType<HostEntity>>(Component.HostModel).toConstantValue(HostModel);
  hostContainer.bind<Controller>(Component.HostController).to(HostController).inSingletonScope();

  return hostContainer;
}
