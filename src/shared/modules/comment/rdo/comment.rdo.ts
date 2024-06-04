import { Expose, Type } from 'class-transformer';

import { HostRdo } from '../../host/rdo/host.rdo.js';

export class CommentRdo {
  @Expose()
  public id: string;

  @Expose()
  public text: string;

  @Expose({ name: 'createdAt'})
  public postDate: string;

  @Expose({ name: 'userId'})
  @Type(() => HostRdo)
  public user: HostRdo;
}
