import { Request } from 'express';

import { LoginHostDto } from './dto/login-host.dto.js';
import { RequestParams, RequestBody } from '../../libs/rest/index.js';

export type LoginHostRequest = Request<RequestParams, RequestBody, LoginHostDto>;
