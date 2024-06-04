import { Request } from 'express';

import { RequestCityDto } from './index.js';
import { RequestParams, RequestBody } from '../../libs/rest/index.js';

export type CreateCityRequest = Request<RequestParams, RequestBody, RequestCityDto>;
