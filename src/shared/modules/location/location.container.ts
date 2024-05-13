import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { LocationService } from './location-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultLocationService } from './location.service.js';
import { LocationEntity, LocationModel } from './location.entity.js';

export function createLocationContainer() {
  const locationContainer = new Container();
  locationContainer.bind<LocationService>(Component.LocationService).to(DefaultLocationService).inSingletonScope();
  locationContainer.bind<types.ModelType<LocationEntity>>(Component.LocationModel).toConstantValue(LocationModel);

  return locationContainer;
}
