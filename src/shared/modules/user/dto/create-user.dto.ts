import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';

import { UserMessages } from './user.messages.js';

export class CreateUserDto {
  @IsString({ message: UserMessages.name.invalidFormat })
  @Length(1, 15, { message: UserMessages.name.lengthField })
  public name: string;

  @IsEmail({}, { message: UserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: UserMessages.password.invalidFormat })
  @Length(6, 12, { message: UserMessages.password.lengthField })
  public password: string;

  @IsBoolean({ message: UserMessages.isPro.invalidFormat })
  public isPro: boolean;
}
