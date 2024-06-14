import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { CommentService } from './comment-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultCommentService implements CommentService {
  private readonly COMMENTS_LIMIT = 50;

  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(userId: string, offerId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {

    const comment = await this.commentModel.create({
      ...dto,
      offerId: new Types.ObjectId(offerId),
      userId: new Types.ObjectId(userId)
    });
    return comment.populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .sort({createdAt: SortType.Desc})
      .limit(this.COMMENTS_LIMIT)
      .populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({offerId});

    return result.deletedCount;
  }
}
