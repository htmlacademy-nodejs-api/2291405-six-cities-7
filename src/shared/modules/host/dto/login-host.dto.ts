import { IsEmail, IsString, Length } from 'class-validator';

import { HostMessages } from './host.messages.js';

export class LoginHostDto {
  @IsEmail({}, { message: HostMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: HostMessages.password.invalidFormat })
  @Length(6, 12, { message: HostMessages.password.lengthField })
  public password: string;
}
