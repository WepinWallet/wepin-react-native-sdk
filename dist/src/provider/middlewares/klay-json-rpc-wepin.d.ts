import { CreateWepinMiddlewareOptions } from '@/types/Provider';
export declare const createWepinMiddleware: ({ wepin, network, }: CreateWepinMiddlewareOptions) => import("json-rpc-engine").JsonRpcMiddleware<unknown, unknown>;
