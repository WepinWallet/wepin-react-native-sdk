import { CreateWepinMiddlewareOptions } from '../../types/Provider';
export declare const createWepinEtherMiddleware: ({ wepin, network, }: CreateWepinMiddlewareOptions) => import("json-rpc-engine").JsonRpcMiddleware<unknown, unknown>;
