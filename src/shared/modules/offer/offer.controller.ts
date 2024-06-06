import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { DetailOfferRdo } from './rdo/detail-offer.rdo.js';
import { CommentService } from '../comment/index.js';
import dayjs from 'dayjs';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { BaseController, HttpMethod, ValidateObjectIdMiddleware, ValidateDtoMiddleware, DocumentExistsMiddleware } from '../../libs/rest/index.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { ValidateCityMiddleware } from '../../libs/rest/middleware/validate-city.middleware.js';


@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    const middlewares = [
      new ValidateObjectIdMiddleware('offerId'),
      new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
    ];

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites
    });
    this.addRoute({
      path: '/:city/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumForCity,
      middlewares: [new ValidateCityMiddleware('city')]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.get,
      middlewares: middlewares
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: middlewares
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new ValidateDtoMiddleware(UpdateOfferDto),
        ...middlewares
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.gets
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
  }

  public async gets(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findAll();
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async get({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);
    const responseData = fillDTO(DetailOfferRdo, offer);
    this.ok(res, responseData);
  }

  public async getPremiumForCity({ params }: Request, res: Response): Promise<void> {
    const { city } = params;
    const offers = await this.offerService.findPremiumByCityId(city);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async getFavorites(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorites();
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    { body }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const dateOfPublication = dayjs().toISOString();

    const createdOffer = await this.offerService.create({
      ...body,
      dateOfPublication: dateOfPublication
    });

    this.created(res, fillDTO(OfferRdo, createdOffer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;

    const deletedCommentCount = await this.commentService.deleteByOfferId(offerId);
    await this.offerService.deleteById(offerId);

    this.ok(res, { message:  `Offer with ID:${offerId} has been deleted (${deletedCommentCount} comment removed).`});
  }

  public async update({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const offerId = params.offerId;
    const updatedOffer = await this.offerService.updateById(offerId, body);
    this.ok(res, fillDTO(DetailOfferRdo, updatedOffer));
  }
}
