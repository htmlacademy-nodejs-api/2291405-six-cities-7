import { IsEmail, IsString, Length } from 'class-validator';

import { CreateHostMessages } from './create-host.messages.js';

export class CreateHostDto {
  @IsString({ message: CreateHostMessages.name.invalidFormat })
  @Length(1, 15, { message: CreateHostMessages.name.lengthField })
  public name: string;

  @IsEmail({}, { message: CreateHostMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateHostMessages.avatarUrl.invalidFormat })
  public avatarUrl: string;

  @IsString({ message: CreateHostMessages.password.invalidFormat })
  @Length(6, 12, { message: CreateHostMessages.password.lengthField })
  public password: string;

  public isPro: boolean;
}
