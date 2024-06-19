import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

import { UserMessages } from './user.messages.js';
import { UserType } from '../../../types/index.js';
import { UserNameLimit } from '../limits/user-name-limit.enum.js';
import { UserPasswordLimit } from '../limits/user-password-limit.enum.js';

export class CreateUserDto {
  @IsString({ message: UserMessages.name.invalidFormat })
  @Length(UserNameLimit.Min, UserNameLimit.Max, { message: UserMessages.name.lengthField })
  public name: string;

  @IsEmail({}, { message: UserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: UserMessages.password.invalidFormat })
  @Length(UserPasswordLimit.Min, UserPasswordLimit.Max, { message: UserMessages.password.lengthField })
  public password: string;

  @IsEnum(UserType, { message: UserMessages.type.invalid })
  public type: UserType;
}
