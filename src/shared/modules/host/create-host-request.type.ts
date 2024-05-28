import { Request } from 'express';

import { CreateHostDto } from './dto/create-host.dto.js';
import { RequestParams, RequestBody } from '../../../rest/index.js';

export type CreateHostRequest = Request<RequestParams, RequestBody, CreateHostDto>;
