import { Request } from 'express';

import { RequestOfferDto } from './dto/request-offer.dto.js';
import { RequestParams, RequestBody } from '../../libs/rest/index.js';

export type CreateOfferRequest = Request<RequestParams, RequestBody, RequestOfferDto>;
