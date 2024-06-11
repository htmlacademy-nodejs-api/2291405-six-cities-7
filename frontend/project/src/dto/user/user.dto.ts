import { UserType } from '../../const';

export class UserDto {
  public name!: string;

  public email!: string;

  public type!: UserType;

  public avatarUrl!: string;
}
