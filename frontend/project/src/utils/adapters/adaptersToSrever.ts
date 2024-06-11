import { CreateUserDto } from '../../dto/user/create-user.dto';
import { CommentAuth, NewOffer, Offer, UserRegister } from '../../types/types';
import { UpdateOfferDto } from '../../dto/offer/update-offer.dto';
import { CreateOfferDto } from '../../dto/offer/create-offer.dto';
import { CreateCommentDto } from '../../dto/comment/create-comment.dto';

export const adaptSignupToServer =
  (user: UserRegister): CreateUserDto => ({
    name: user.name,
    email: user.email,
    avatarUrl: ' ',
    password: user.password,
    type: user.type
  });

export const adaptEditTicketToServer =
  (ticket: Offer): UpdateOfferDto => ({
    title: ticket.title,
    description: ticket.description,
    city: ticket.city,
    previewImage: ticket.previewImage,
    images: ticket.images,
    isPremium: ticket.isPremium,
    isFavorite: ticket.isFavorite,
    type: ticket.type,
    price: ticket.price,
    bedrooms: ticket.bedrooms,
    maxAdults: ticket.maxAdults,
    goods: ticket.goods,
    location: ticket.location
  });

export const adaptCreateTicketToServer =
  (ticket: NewOffer): CreateOfferDto => ({
    title: ticket.title,
    description: ticket.description,
    city: ticket.city,
    previewImage: ' ',
    isPremium: ticket.isPremium,
    type: ticket.type,
    bedrooms: ticket.bedrooms,
    maxAdults: ticket.maxAdults,
    price: ticket.price,
    goods: ticket.goods,
    location: ticket.location,
    images: []
  });

export const adaptCreateCommentToServer =
  (comment: CommentAuth): CreateCommentDto => ({
    comment: comment.comment,
    offerId: comment.id,
  });

export const adaptAvatarToServer =
  (file: string) => {
    const formData = new FormData();
    formData.set('avatar', file);

    return formData;
  };

export const adaptImageToServer =
  (file: string) => {
    const formData = new FormData();
    formData.set('image', file);

    return formData;
  };
