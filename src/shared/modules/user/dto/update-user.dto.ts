import { IsOptional, IsString } from 'class-validator';
import { UserMessages } from './user.messages.js';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: UserMessages.avatarUrl.invalidFormat })
  public avatarUrl?: string;

  @IsOptional()
  @IsString({ message: UserMessages.name.invalidFormat })
  public name?: string;
}
