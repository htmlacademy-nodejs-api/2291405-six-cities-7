import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';

import { HostMessages } from './host.messages.js';

export class CreateHostDto {
  @IsString({ message: HostMessages.name.invalidFormat })
  @Length(1, 15, { message: HostMessages.name.lengthField })
  public name: string;

  @IsEmail({}, { message: HostMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: HostMessages.avatarUrl.invalidFormat })
  public avatarUrl: string;

  @IsString({ message: HostMessages.password.invalidFormat })
  @Length(6, 12, { message: HostMessages.password.lengthField })
  public password: string;

  @IsBoolean({ message: HostMessages.isPro.invalidFormat })
  public isPro: boolean;
}
