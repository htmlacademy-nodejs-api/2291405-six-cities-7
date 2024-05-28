import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { Component } from '../../types/index.js';
import { OfferEntity } from './offer.entity.js';
import { Logger } from '../../libs/logger/index.js';
import { SortType } from '../../helpers/index.js';
import { Types } from 'mongoose';

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
    $lookup: {
      from: 'cities',
      localField: 'cityId',
      foreignField: '_id',
      as: 'city'
    }
  },
  {
    $unwind: '$city'
  },
  {
    $addFields: {
      commentCount: { $size: '$comments' },
      rating: { $avg: '$comments.rating' }
    }
  },
  {
    $lookup: {
      from: 'locations',
      localField: 'city.locationId',
      foreignField: '_id',
      as: 'city.location',
    }
  },
  {
    $unwind: '$city.location',
  },
  {
    $unset: [
      'comments',
      'city._id'
    ]
  },
  {
    $sort: { createAt: SortType.Desc }
  }
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

  public async updateById(id: string, dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findByIdAndUpdate(id, dto, {new: true}).exec();
    return this.findById(offer?.id);
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    const offers = await this.offerModel.aggregate([
      ...addFieldsToOffers,
      {
        $match: { _id: new Types.ObjectId(id) }
      },
      {
        $lookup: {
          from: 'hosts',
          localField: 'hostId',
          foreignField: '_id',
          as: 'host'
        }
      },
      {
        $unwind: '$host'
      },
      {
        $lookup: {
          from: 'locations',
          localField: 'locationId',
          foreignField: '_id',
          as: 'location',
        }
      },
      {
        $unwind: '$location',
      },
      {
        $sort: { createAt: SortType.Desc }
      }
    ]).exec();

    return offers[0];
  }

  public async changeFavorites(id: string): Promise<void> {
    const offer = await this.findById(id);
    if (offer) {
      this.offerModel.findByIdAndUpdate(id, {isFavorite: !(offer.isFavorite)}, {new: !(offer.isFavorite)}).exec();
    }
  }

  public async deleteById(id: string): Promise<void> {
    this.offerModel.findByIdAndDelete(id).exec();
  }

  public async findAll(count: number = this.DEFAULT_OFFER_LIMIT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      ...addFieldsToOffers,
      {
        $limit: count
      }
    ]).exec();
  }

  public async findFavorites(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      {
        $match: { isFavorite: true }
      },
      ...addFieldsToOffers
    ]).exec();
  }

  public async findPremiumByCityId(cityId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      ...addFieldsToOffers,
      {
        $match: {
          'cityId': new Types.ObjectId(cityId),
          isPremium: true
        }
      },
      {
        $limit: this.DEFAULT_PREMIUM_OFFER_LIMIT
      }
    ]).exec();
  }

  public async incCommentCount(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(id, {'$inc': {
      commentCount: 1,
    }}).exec();
  }
}
