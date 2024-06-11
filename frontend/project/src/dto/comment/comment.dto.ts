import { UserDto } from '../user/user.dto';

export class CommentDto {
  public id!: string;

  public date!: string;

  public comment!: string;

  public user!: UserDto;

  public rating!: number;
}
