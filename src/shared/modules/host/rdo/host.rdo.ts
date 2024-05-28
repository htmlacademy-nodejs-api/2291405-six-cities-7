import { Expose } from 'class-transformer';

export class HostRdo {
  @Expose()
  public email: string ;

  @Expose()
  public avatarUrl: string;

  @Expose()
  public name: string;

  @Expose()
  public isPro: boolean;
}
