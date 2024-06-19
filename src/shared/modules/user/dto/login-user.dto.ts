import { IsEmail, IsString, Length } from 'class-validator';

import { UserMessages } from './user.messages.js';
import { UserPasswordLimit } from '../limits/user-password-limit.enum.js';

export class LoginUserDto {
  @IsEmail({}, { message: UserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: UserMessages.password.invalidFormat })
  @Length(UserPasswordLimit.Min, UserPasswordLimit.Max, { message: UserMessages.password.lengthField })
  public password: string;
}
