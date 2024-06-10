import { Request } from 'express';

import { CreateUserDto } from './dto/create-user.dto.js';
import { RequestParams, RequestBody } from '../../libs/rest/index.js';

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;
