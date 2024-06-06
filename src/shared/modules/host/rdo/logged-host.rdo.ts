import { Expose } from 'class-transformer';

export class LoggedHostRdo {
  @Expose()
  public token: string;

  @Expose()
  public email: string;
}
