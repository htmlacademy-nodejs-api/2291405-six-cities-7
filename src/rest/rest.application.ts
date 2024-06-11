import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getFullServerPath, getMongoURI } from '../shared/helpers/index.js';
import { Controller, ExceptionFilter, ParseTokenMiddleware } from '../shared/libs/rest/index.js';
import { STATIC_UPLOAD_ROUTE, STATIC_FILES_ROUTE } from './rest.constant.js';


@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilter,
    @inject(Component.HttpExceptionFilter) private readonly httpExceptionFilter: ExceptionFilter,
    @inject(Component.ValidationExceptionFilter) private readonly validationExceptionFilter: ExceptionFilter
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
    this.logger.info(`Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);
  }

  private _initControllers() {
    this.logger.info('Init controllers');

    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);

    this.logger.info('Controller initialization completed');
  }

  private _initMiddleware() {
    this.logger.info('Init app-level middleware');
    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));

    this.server.use(express.json());
    this.server.use(
      STATIC_UPLOAD_ROUTE,
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(
      STATIC_FILES_ROUTE,
      express.static(this.config.get('STATIC_DIRECTORY_PATH'))
    );
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.server.use(cors());
    this.logger.info('App-level middleware initialization completed');
  }

  private _initExceptionFilters() {
    this.logger.info('Init exception filters');
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
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
