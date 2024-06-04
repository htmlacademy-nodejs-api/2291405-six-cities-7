import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { DetailOfferRdo } from './rdo/detail-offer.rdo.js';
import { LocationService } from '../location/index.js';
import { CityService, ParamCityId } from '../city/index.js';
import { StatusCodes } from 'http-status-codes';
import { CommentService } from '../comment/index.js';
import dayjs from 'dayjs';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { BaseController, HttpMethod, HttpError, ValidateObjectIdMiddleware, ValidateDtoMiddleware, DocumentExistsMiddleware } from '../../libs/rest/index.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';


@injectable()
export class OfferController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CityService) private readonly cityService: CityService,
    @inject(Component.LocationService) private readonly locationService: LocationService,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavorites });
    this.addRoute({ path: '/:cityId/premium', method: HttpMethod.Get, handler: this.getPremiumForCity, middlewares: [new ValidateObjectIdMiddleware('cityId'), new DocumentExistsMiddleware(this.cityService, 'City', 'cityId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.get, middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete, middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Put, handler: this.update, middlewares: [new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(UpdateOfferDto), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.gets });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [new ValidateDtoMiddleware(CreateOfferDto)] });
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

  public async getPremiumForCity({ params }: Request<ParamCityId>, res: Response): Promise<void> {
    const { cityId } = params;
    const offers = await this.offerService.findPremiumByCityId(cityId);
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
    const location = await this.locationService.findOrCreate(body.location);

    let city = await this.cityService.findByName(body.city.name);
    if (!city) {
      const cityLocation = await this.locationService.findOrCreate(body.city.location);
      city = await this.cityService.create({
        name: body.city.name,
        locationId: cityLocation.id
      });
    }

    const createdOffer = await this.offerService.create({
      title: body.title,
      description: body.description,
      dateOfPublication: dateOfPublication,
      cityId: city.id,
      previewImage: body.previewImage,
      images: body.images,
      isPremium: body.isPremium,
      isFavorite: body.isFavorite,
      type: body.type,
      bedrooms: body.bedrooms,
      maxAdults: body.maxAdults,
      price: body.price,
      goods: body.goods,
      hostId: body.hostId,
      locationId: location.id
    });

    this.created(res, fillDTO(OfferRdo, createdOffer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const existOffer = await this.offerService.findById(offerId);

    const deletedCommentCount = await this.commentService.deleteByOfferId(offerId);
    if (existOffer) {
      await this.locationService.deleteById(existOffer.locationId.toString());
    }

    await this.offerService.deleteById(offerId);

    this.ok(res, { message:  `Offer with ID:${offerId} has been deleted (${deletedCommentCount} comment removed).`});
  }

  public async update({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const offerId = params.offerId;

    if (body.location) {
      await this.locationService.findOrCreate(body.location);
    }

    if (body.cityId) {
      const foundCity = await this.cityService.findById(body.cityId);
      if (!foundCity) {
        throw new HttpError(StatusCodes.BAD_REQUEST, 'City not exists', 'DefaultOfferService');
      }
    }

    const updatedOffer = await this.offerService.updateById(offerId, body);
    this.ok(res, fillDTO(DetailOfferRdo, updatedOffer));
  }
}
