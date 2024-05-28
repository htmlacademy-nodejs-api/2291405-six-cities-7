import { DocumentType } from '@typegoose/typegoose';

import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';


export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  updateById(id: string, dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  findFavorites(): Promise<DocumentType<OfferEntity>[]>;
  changeFavorites(id: string): Promise<void>;
  findAll(): Promise<DocumentType<OfferEntity>[]>;
  deleteById(id: string): Promise<void>;
  incCommentCount(id: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCityId(cityId: string): Promise<DocumentType<OfferEntity>[]>;
}
