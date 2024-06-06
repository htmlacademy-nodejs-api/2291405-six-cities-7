import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { Component, SortType } from '../../types/index.js';
import { OfferEntity } from './offer.entity.js';
import { Logger } from '../../libs/logger/index.js';
import { Types } from 'mongoose';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

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
      rating: { $avg: '$comments.rating' },
      id: '$_id'
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

@injectable()
export class DefaultOfferService implements OfferService {
  private readonly DEFAULT_OFFER_LIMIT: number = 60;
  private readonly DEFAULT_PREMIUM_OFFER_LIMIT: number = 3;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);
    return this.findById(offer.id);
  }

  public async updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findByIdAndUpdate(id, dto, {new: true}).exec();
    return this.findById(offer?.id);
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    const offers = await this.offerModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) }
      },
      ...addFieldsToOffers,
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

  public async exists(documentId: string): Promise<boolean> {
    const document = await this.offerModel.exists({_id: documentId});
    return document !== null;
  }

  public async findFavorites(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      {
        $match: { isFavorite: true }
      },
      ...addFieldsToOffers
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
      {
        $limit: this.DEFAULT_PREMIUM_OFFER_LIMIT
      }
    ]).exec();
  }
}
