import { LoginHostDto, HostEntity } from '../host/index.js';

export interface AuthService {
  authenticate(user: HostEntity): Promise<string>;
  verify(dto: LoginHostDto): Promise<HostEntity>;
}
