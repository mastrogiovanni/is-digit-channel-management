import { ApiVersion, ClientConfig } from '@iota/is-client';

import * as dotenv from 'dotenv';
dotenv.config();

export const defaultConfig: ClientConfig = {
    apiKey: process.env.API_KEY,
    isGatewayUrl: process.env.API_URL,
    apiVersion: ApiVersion.v01
};
