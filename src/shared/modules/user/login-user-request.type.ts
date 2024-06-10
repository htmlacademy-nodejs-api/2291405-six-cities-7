import { Request } from 'express';

import { LoginUserDto } from './dto/login-user.dto.js';
import { RequestParams, RequestBody } from '../../libs/rest/index.js';

export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDto>;
