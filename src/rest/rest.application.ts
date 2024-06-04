import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import swaggerUi from 'swagger-ui-express';

import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { Controller, ExceptionFilter } from './index.js';

@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.CityController) private readonly cityController: Controller,
    @inject(Component.HostController) private readonly hostController: Controller,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
  ) {
    this.server = express();
  }

  private async initDb() {
    this.logger.info('Init database…');
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_SERVER'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private _enableSwagger() {
    const file = readFileSync('./specification/specification.yml', 'utf-8');
    const swaggerDocument = parse(file);
    const path = '/api';

    this.logger.info(`Swagger UI mapped to ${path}`);
    this.server.use(path, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private _initServer() {
    this.logger.info('Try to init server…');
    const port = this.config.get('PORT');
    this.server.listen(port);
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }

  private _initControllers() {
    this.logger.info('Init controllers');

    this.server.use('/cities', this.cityController.router);
    this.server.use('/users', this.hostController.router);
    this.server.use('/offers', this.offerController.router);

    this.logger.info('Controller initialization completed');
  }

  private _initMiddleware() {
    this.logger.info('Init app-level middleware');
    this.server.use(express.json());
    this.logger.info('App-level middleware initialization completed');
  }

  private _initExceptionFilters() {
    this.logger.info('Init exception filters');
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
    this.logger.info('Exception filters initialization compleated');
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT:${this.config.get('PORT')}`);

    this.initDb();
    this.logger.info('Init database completed');

    this._initMiddleware();
    this._initControllers();
    this._initExceptionFilters();
    this._enableSwagger();

    this._initServer();
  }
}
