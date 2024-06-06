import 'reflect-metadata';
import { Container } from 'inversify';

import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createHostContainer } from './shared/modules/host/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';
import { createAuthContainer } from './shared/modules/auth/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createHostContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createAuthContainer()
  );
  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
