import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { UserService } from './user-service.interface.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { BaseController, HttpMethod, HttpError, ValidateDtoMiddleware, ValidateObjectIdMiddleware, UploadFileMiddleware, DocumentExistsMiddleware } from '../../libs/rest/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { AuthService } from '../auth/index.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';


@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto)
      ]
    });
    this.addRoute({
      path: '/:hostId/avatar',
      method: HttpMethod.Post,
      handler: this.updateAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('hostId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatarUrl'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId')
      ]
    });
    this.addRoute({
      path: '/profile',
      method: HttpMethod.Get,
      handler: this.profile,
    });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {
      email: user.email,
      token,
    });
    this.ok(res, responseData);
  }

  public async updateAvatar({file, params}: Request, res: Response): Promise<void> {
    const { hostId } = params;
    const updatedHost = await this.userService.updateById(hostId, { avatarUrl: file?.path });
    this.ok(res, fillDTO(UserRdo, updatedHost));
  }

  public async profile({ tokenPayload: { email }}: Request, res: Response) {
    const foundUser = await this.userService.findByEmail(email);

    if (! foundUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundUser));
  }
}
