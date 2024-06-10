import { Location, User } from './index.js';

export type MockServerData = {
  titles: string[],
  descriptions: string[],
  previewImages: string[],
  images: string[],
  types: string[],
  goods: string[],
  users: User[],
  locations: Location[]
};
