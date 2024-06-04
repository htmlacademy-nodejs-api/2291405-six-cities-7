import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { BaseController, HttpError, HttpMethod } from '../../../rest/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { DetailOfferRdo } from './rdo/detail-offer.rdo.js';
import { LocationService } from '../location/index.js';
import { CityService } from '../city/index.js';
import { StatusCodes } from 'http-status-codes';
import { CommentService } from '../comment/index.js';
import dayjs from 'dayjs';
import { ParamOfferId } from './type/param-offerid.type.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';


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
    this.addRoute({ path: '/:id/premium', method: HttpMethod.Get, handler: this.getPremiumForCity });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.get });
    this.addRoute({ path: '/:id', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/:id', method: HttpMethod.Put, handler: this.update });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.gets });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async gets(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findAll();
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async get({ params }: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params['id']);
    const responseData = fillDTO(DetailOfferRdo, offer);
    this.ok(res, responseData);
  }

  public async getPremiumForCity({ params }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCityId(params['id']);
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

    const result = await this.offerService.create({
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

    this.created(res, fillDTO(OfferRdo, result));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const existOffer = await this.offerService.findById(offerId);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with ID:${offerId} not found.`,
        'OfferController',
      );
    }

    const deletedCommentCount = await this.commentService.deleteByOfferId(offerId);
    await this.locationService.deleteById(existOffer.locationId.toString());

    await this.offerService.deleteById(offerId);

    this.ok(res, { message:  `Offer with ID:${offerId} has been deleted (${deletedCommentCount} comment removed).`});
  }

  public async update({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, updatedOffer);
  }
}
