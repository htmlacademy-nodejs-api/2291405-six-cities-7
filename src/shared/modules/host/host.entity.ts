import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import { Host } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';


// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface HostEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'hosts',
    timestamps: true,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class HostEntity extends defaultClasses.TimeStamps implements Host {
  @prop({ required: true, default: '' })
  public name: string;

  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: false, default: '' })
  public avatarUrl: string;

  @prop({ required: true, default: false })
  public isPro: boolean;

  @prop({ required: true })
  private password?: string;

  constructor(hostData: Host) {
    super();

    this.name = hostData.name;
    this.email = hostData.email;
    this.avatarUrl = hostData.avatarUrl;
    this.isPro = hostData.isPro;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const HostModel = getModelForClass(HostEntity);
