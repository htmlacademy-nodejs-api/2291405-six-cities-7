import { CommentDto } from '../../dto/comment/comment.dto';
import { OfferDto } from '../../dto/offer/offer.dto';
import { LoginUserDto } from '../../dto/user/login-user.dto';
import { UserDto } from '../../dto/user/user.dto';
import { Offer, User, UserAuth, Comment } from '../../types/types';


export const adaptLoginToClient =
  (user: LoginUserDto): UserAuth => ({
    email: user.email,
    password: user.password
  });

export const adaptUserToClient =
  (user: UserDto): User => ({
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    type: user.type
  });

export const adaptOffersToClient =
  (offers: OfferDto[]): Offer[] =>
    offers
      .filter((offer: OfferDto) =>
        offer.user !== null,
      )
      .map((offer: OfferDto) => ({
        id: offer.id,
        price: offer.price,
        rating: offer.rating,
        title: offer.title,
        isPremium: offer.isPremium,
        isFavorite: offer.isFavorite,
        city: {
          name: 'Paris',
          location: {
            latitude: 48.85661,
            longitude: 2.351499
          }
        },
        location: {
          latitude: offer.latitude,
          longitude: offer.longitude,
        },
        previewImage: offer.previewImage,
        type: offer.type,
        bedrooms: offer.bedrooms,
        description: offer.description,
        goods: offer.goods,
        host: adaptUserToClient(offer.user),
        images: offer.images,
        maxAdults: offer.maxAdults
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
        user: adaptUserToClient(comment.user),
        rating: comment.rating
      }));
