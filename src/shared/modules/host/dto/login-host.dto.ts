import { IsEmail, IsString, Length } from 'class-validator';

import { CreateHostMessages } from './create-host.messages.js';

export class LoginHostDto {
  @IsEmail({}, { message: CreateHostMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateHostMessages.password.invalidFormat })
  @Length(6, 12, { message: CreateHostMessages.password.lengthField })
  public password: string;
}
