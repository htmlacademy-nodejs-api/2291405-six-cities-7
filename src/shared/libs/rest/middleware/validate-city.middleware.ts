import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { CITIES } from '../../../helpers/index.js';

export class ValidateCityMiddleware implements Middleware {
  constructor(private param: string) {}

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const city = params[this.param];

    if (city in CITIES) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${city} is invalid City`,
      'ValidateCityMiddleware'
    );
  }
}
