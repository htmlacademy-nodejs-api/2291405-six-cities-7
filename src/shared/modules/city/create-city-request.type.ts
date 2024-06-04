import { Request } from 'express';

import { RequestParams, RequestBody } from '../../../rest/index.js';
import { RequestCityDto } from './index.js';

export type CreateCityRequest = Request<RequestParams, RequestBody, RequestCityDto>;
