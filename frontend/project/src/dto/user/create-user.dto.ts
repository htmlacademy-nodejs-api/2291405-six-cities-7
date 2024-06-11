import { UserType } from '../../const';

export class CreateUserDto {
  public name!: string;

  public avatarUrl!: string;

  public email!: string;

  public password!: string;

  public type!: UserType;
}
