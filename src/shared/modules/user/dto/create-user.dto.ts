import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

import { UserMessages } from './user.messages.js';
import { UserType } from '../../../types/index.js';

export class CreateUserDto {
  @IsString({ message: UserMessages.name.invalidFormat })
  @Length(1, 15, { message: UserMessages.name.lengthField })
  public name: string;

  @IsEmail({}, { message: UserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: UserMessages.password.invalidFormat })
  @Length(6, 12, { message: UserMessages.password.lengthField })
  public password: string;

  @IsEnum(UserType, { message: UserMessages.type.invalid })
  public type: UserType;
}
