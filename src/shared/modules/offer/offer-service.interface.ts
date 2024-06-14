import { DocumentType } from '@typegoose/typegoose';

import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DocumentExists } from '../../types/index.js';


export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  updateById(id: string, dto: UpdateOfferDto, userId: string): Promise<DocumentType<OfferEntity> | null>;
  findById(id: string, userId?: string): Promise<DocumentType<OfferEntity> | null>;
  findFavorites(userId?: string): Promise<DocumentType<OfferEntity>[]>;
  findAll(userId?: string, count?: number): Promise<DocumentType<OfferEntity>[]>;
  deleteById(id: string, userId: string): Promise<void>;
  findPremiumByCityId(city: string): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
  toggleFavorite(offerId: string, isFavorite: boolean, userId?: string): Promise<void>;
}
