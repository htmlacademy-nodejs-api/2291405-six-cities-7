import { UserType } from '../../const';
import { CommentDto } from '../../dto/comment/comment.dto';
import { OfferDto } from '../../dto/offer/offer.dto';
import { LoginUserDto } from '../../dto/user/login-user.dto';
import { Offer, UserAuth, Comment } from '../../types/types';


export const adaptLoginToClient =
  (user: LoginUserDto): UserAuth => ({
    email: user.email,
    password: user.password
  });

export const adaptOfferToClient =
  (offer: OfferDto): Offer => ({
    ...offer,
    host: offer.user
  });

export const adaptOffersToClient =
  (offers: OfferDto[]): Offer[] => offers.map((offer: OfferDto) => ({
    ...offer,
    host: {
      name: '',
      avatarUrl: '',
      type: UserType.Regular,
      email: ''
    }
  }));

export const adaptCommentsToClient =
  (comments: CommentDto[]): Comment[] =>
    comments
      .filter((comment: CommentDto) =>
        comment.user !== null,
      )
      .map((comment: CommentDto) => ({
        id: comment.id,
        comment: comment.comment,
        date: comment.date,
        user: comment.user,
        rating: comment.rating
      }));
