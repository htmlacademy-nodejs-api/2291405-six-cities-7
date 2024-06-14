import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/index.js';


export class CommentRdo {
  @Expose()
  public id: string;

  @Expose()
  public comment: string;

  @Expose({ name: 'createdAt'})
  public date: string;

  @Expose()
  public rating: number;

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public user: UserRdo;
}
