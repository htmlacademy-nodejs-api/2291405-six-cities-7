import { Location, Host } from './index.js';

export type MockServerData = {
  titles: string[],
  descriptions: string[],
  previewImages: string[],
  images: string[],
  types: string[],
  goods: string[],
  hosts: Host[],
  locations: Location[]
};
