import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

export class ValidateAuthorizedMiddleware implements Middleware {
  public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (tokenPayload) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'This user is already logged in',
        'ValidateAuthorizedMiddleware'
      );
    }

    return next();
  }
}
