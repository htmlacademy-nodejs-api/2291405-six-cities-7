import { Request } from 'express';

import { RequestParams, RequestBody } from '../../../rest/index.js';
import { RequestOfferDto } from './dto/request-offer.dto.js';

export type CreateOfferRequest = Request<RequestParams, RequestBody, RequestOfferDto>;
