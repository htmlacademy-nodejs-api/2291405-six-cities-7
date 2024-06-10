import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { UserService } from './user-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultUserService } from './user.service.js';
import { UserEntity, UserModel } from './user.entity.js';
import { UserController } from './user.controller.js';
import { Controller } from '../../libs/rest/index.js';

export function createUserContainer() {
  const hostContainer = new Container();
  hostContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  hostContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  hostContainer.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();

  return hostContainer;
}
