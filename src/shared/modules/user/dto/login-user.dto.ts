import { IsEmail, IsString, Length } from 'class-validator';

import { UserMessages } from './user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: UserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: UserMessages.password.invalidFormat })
  @Length(6, 12, { message: UserMessages.password.lengthField })
  public password: string;
}
