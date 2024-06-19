import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { Component, SortType } from '../../types/index.js';
import { OfferEntity } from './offer.entity.js';
import { Logger } from '../../libs/logger/index.js';
import { Types } from 'mongoose';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';

const addFieldsToOffers = [
  {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'offerId',
      as: 'comments'
    }
  },
  {
    $addFields: {
      commentCount: { $size: '$comments' },
      rating: { $trunc : [ {$avg: '$comments.rating'}, 1 ] },
    }
  },
  {
    $unset: [
      'comments'
    ]
  },
  {
    $sort: { createAt: SortType.Desc }
  }
];

const addFieldUser = [
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'users',
    },
  },
  {
    $addFields: {
      user: { $arrayElemAt: ['$users', 0] },
    },
  },
  {
    $unset: ['users'],
  },
];

@injectable()
export class DefaultOfferService implements OfferService {
  private readonly DEFAULT_OFFER_LIMIT: number = 60;
  private readonly DEFAULT_PREMIUM_OFFER_LIMIT: number = 3;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);
    return this.findById(offer.id);
  }

  public async updateById(offerId: string, dto: UpdateOfferDto, userId: string): Promise<DocumentType<OfferEntity> | null> {
    await this.checkUser(offerId, userId);

    const updatedOffer = await this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).exec();
    return this.findById(updatedOffer?.id);
  }

  public async findById(id: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const offers = await this.offerModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) }
      },
      {
        $set: {isFavorite: { $in: [new Types.ObjectId(userId), '$favoritesForUsers'] }}
      },
      ...addFieldsToOffers,
      ...addFieldUser,
      {
        $addFields: { id: { $toString: '$_id' } }
      },
      {
        $sort: { createAt: SortType.Desc }
      }
    ]).exec();

    return offers[0];
  }

  public async deleteById(offerId: string, userId: string): Promise<void> {
    await this.checkUser(offerId, userId);

    this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async findAll(userId?: string, count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count || this.DEFAULT_OFFER_LIMIT;
    const offers = await this.offerModel.aggregate([
      {
        $set: {isFavorite: { $in: [new Types.ObjectId(userId), '$favoritesForUsers'] }}
      },
      ...addFieldsToOffers,
      {
        $addFields: { id: { $toString: '$_id' } }
      },
      {
        $limit: limit
      },

    ]).exec();

    return offers;
  }

  public async exists(documentId: string): Promise<boolean> {
    const document = await this.offerModel.exists({_id: documentId});
    return document !== null;
  }

  public async findFavorites(userId?: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      {
        $match: { $expr: { $in: [new Types.ObjectId(userId), '$favoritesForUsers'] } }
      },
      {
        $set: { isFavorite: { $in: [new Types.ObjectId(userId), '$favoritesForUsers'] } }
      },
      ...addFieldsToOffers,
      ...addFieldUser
    ]).exec();
  }

  public async findPremiumByCityId(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      {
        $match: {
          'city.name': city,
          isPremium: true
        }
      },
      ...addFieldsToOffers,
      ...addFieldUser,
      {
        $addFields: { id: { $toString: '$_id' } }
      },
      {
        $limit: this.DEFAULT_PREMIUM_OFFER_LIMIT
      }
    ]).exec();
  }

  public async toggleFavorite(offerId: string, isFavorite: boolean, userId: string): Promise<void> {
    const offer = await this.offerModel.findById(offerId).exec();

    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`, 'OfferService');
    }

    const userObjectId = new Types.ObjectId(userId);

    if (isFavorite) {
      offer.favoritesForUsers.push(userObjectId);
    } else {
      offer.favoritesForUsers.pull(userObjectId);
    }

    await offer.save();
  }

  private async checkUser(offerId: string, userId: string): Promise<void> {
    const offer = await this.offerModel.findById(offerId);
    if (userId !== offer?.userId.toString()) {
      throw new HttpError(StatusCodes.NOT_ACCEPTABLE, 'No access for this user', 'OfferService');
    }
  }
}
