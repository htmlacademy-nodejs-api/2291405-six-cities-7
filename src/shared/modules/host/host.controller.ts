import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { HostRdo } from './rdo/host.rdo.js';
import { LoginHostRequest } from './login-host-request.type.js';
import { HostService } from './host-service.interface.js';
import { CreateHostRequest } from './create-host-request.type.js';
import { BaseController, HttpMethod, HttpError, ValidateDtoMiddleware, ValidateObjectIdMiddleware, UploadFileMiddleware, DocumentExistsMiddleware } from '../../libs/rest/index.js';
import { CreateHostDto } from './dto/create-host.dto.js';
import { LoginHostDto } from './dto/login-host.dto.js';
import { AuthService } from '../auth/index.js';
import { LoggedHostRdo } from './rdo/logged-host.rdo.js';


@injectable()
export class HostController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.HostService) private readonly hostService: HostService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateHostDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginHostDto),
        new DocumentExistsMiddleware(this.hostService, 'Host', 'hostId')
      ]
    });
    this.addRoute({
      path: '/:hostId/avatar',
      method: HttpMethod.Post,
      handler: this.updateAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('hostId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatarUrl'),
        new DocumentExistsMiddleware(this.hostService, 'Host', 'hostId')
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });
  }

  public async create(
    { body }: CreateHostRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.hostService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.hostService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(HostRdo, result));
  }

  public async login(
    { body }: LoginHostRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedHostRdo, {
      email: user.email,
      token,
    });
    this.ok(res, responseData);
  }

  public async updateAvatar({file, params}: Request, res: Response): Promise<void> {
    const { hostId } = params;
    const updatedHost = await this.hostService.updateById(hostId, { avatarUrl: file?.path });
    this.ok(res, fillDTO(HostRdo, updatedHost));
  }

  public async checkAuthenticate({ tokenPayload: { email }}: Request, res: Response) {
    const foundedUser = await this.hostService.findByEmail(email);

    if (! foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedHostRdo, foundedUser));
  }
}
