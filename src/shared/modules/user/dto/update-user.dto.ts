import { IsOptional, IsString, Length } from 'class-validator';
import { UserMessages } from './user.messages.js';
import { UserNameLimit } from '../limits/user-name-limit.enum.js';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: UserMessages.avatarUrl.invalidFormat })
  public avatarUrl?: string;

  @IsOptional()
  @IsString({ message: UserMessages.name.invalidFormat })
  @Length(UserNameLimit.Min, UserNameLimit.Max, { message: UserMessages.name.lengthField })
  public name?: string;
}
