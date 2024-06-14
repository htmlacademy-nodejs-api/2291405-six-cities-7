import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { DetailOfferRdo } from './rdo/detail-offer.rdo.js';
import { CommentRdo, CommentService } from '../comment/index.js';
import dayjs from 'dayjs';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import {
  BaseController,
  HttpMethod,
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware,
  PrivateRouteMiddleware,
  RequestBody
} from '../../libs/rest/index.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { CreateCommentRequest } from '../comment/types/create-comment-request.type.js';


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
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/premium:city?',
      method: HttpMethod.Get,
      handler: this.getPremiumForCity
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
      middlewares: [
        new PrivateRouteMiddleware(),
        ...middlewares
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(UpdateOfferDto),
        ...middlewares
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        ...middlewares
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.postComment,
      middlewares: [
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
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.appendToFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        ...middlewares,
      ],
    });
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.removeFromFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        ...middlewares,
      ],
    });
  }

  public async gets({tokenPayload}: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findAll(tokenPayload?.id);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async get({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId, tokenPayload?.id);
    const responseData = fillDTO(DetailOfferRdo, offer);
    this.ok(res, responseData);
  }

  public async getPremiumForCity(req: Request, res: Response): Promise<void> {
    const city = req.query.city as string;
    const offers = await this.offerService.findPremiumByCityId(city);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async getFavorites({ tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorites(tokenPayload?.id);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async getComments({ params }: Request, res: Response): Promise<void> {
    const { offerId } = params;
    const comments = await this.commentService.findByOfferId(offerId);
    const responseData = fillDTO(CommentRdo, comments);
    this.ok(res, responseData);
  }

  public async postComment(
    { params, body, tokenPayload }: CreateCommentRequest,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const comment = await this.commentService.create(tokenPayload.id, offerId as string, body);
    const responseData = fillDTO(CommentRdo, comment);

    this.created(res, responseData);
  }

  public async create(
    { body, tokenPayload }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const dateOfPublication = dayjs().toISOString();

    const createdOffer = await this.offerService.create({
      ...body,
      dateOfPublication: dateOfPublication,
      userId: tokenPayload.id
    });

    this.created(res, fillDTO(OfferRdo, createdOffer));
  }

  public async delete({ params, tokenPayload }: Request<ParamOfferId, RequestBody>, res: Response): Promise<void> {
    const { offerId } = params;
    const deletedCommentCount = await this.commentService.deleteByOfferId(offerId);
    await this.offerService.deleteById(offerId, tokenPayload.id);

    this.ok(res, { message:  `Offer with ID:${offerId} has been deleted (${deletedCommentCount} comment removed).`});
  }

  public async update({ body, params, tokenPayload }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const offerId = params.offerId;
    const updatedOffer = await this.offerService.updateById(offerId, body, tokenPayload.id);
    this.ok(res, fillDTO(DetailOfferRdo, updatedOffer));
  }

  public async appendToFavorites(
    { params, tokenPayload }: Request<ParamOfferId, RequestBody>,
    res: Response): Promise<void> {
    const responseData = await this.toggleFavorites(params, true, tokenPayload.id);
    this.ok(res, responseData);
  }

  public async removeFromFavorites({ params, tokenPayload }: Request<ParamOfferId, RequestBody>,
    res: Response,
  ): Promise<void> {
    const responseData = await this.toggleFavorites(params, false, tokenPayload.id);
    this.ok(res, responseData);
  }

  private async toggleFavorites(params: ParamOfferId, isFavorite: boolean, userId: string): Promise<DetailOfferRdo> {
    const { offerId } = params;

    await this.offerService.toggleFavorite(offerId, isFavorite, userId);
    const offer = await this.offerService.findById(offerId, userId);

    return fillDTO(DetailOfferRdo, offer);
  }
}
