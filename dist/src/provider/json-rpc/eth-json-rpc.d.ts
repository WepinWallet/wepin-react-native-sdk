import { JsonRpcMiddleware } from 'json-rpc-engine';
interface FetchMiddlewareOptions {
    rpcUrl: string;
    originHttpHeaderKey?: string;
}
export declare function createFetchMiddlewareEther({ rpcUrl, originHttpHeaderKey, }: FetchMiddlewareOptions): JsonRpcMiddleware<unknown, unknown>;
export {};
