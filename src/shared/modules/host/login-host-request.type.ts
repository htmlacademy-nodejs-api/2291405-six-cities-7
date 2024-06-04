import { Request } from 'express';

import { RequestParams, RequestBody } from '../../../rest/index.js';
import { LoginHostDto } from './dto/login-host.dto.js';

export type LoginHostRequest = Request<RequestParams, RequestBody, LoginHostDto>;
