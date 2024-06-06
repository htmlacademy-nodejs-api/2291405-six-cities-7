import { IsOptional, IsString } from 'class-validator';
import { HostMessages } from './host.messages.js';

export class UpdateHostDto {
  @IsOptional()
  @IsString({ message: HostMessages.avatarUrl.invalidFormat })
  public avatarUrl?: string;

  @IsOptional()
  @IsString({ message: HostMessages.name.invalidFormat })
  public name?: string;
}
