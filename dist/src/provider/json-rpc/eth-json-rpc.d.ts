import { JsonRpcMiddleware } from 'json-rpc-engine';
type BlockData = string | string[];
type Block = Record<string, BlockData>;
interface FetchMiddlewareOptions {
    rpcUrl: string;
    originHttpHeaderKey?: string;
}
export declare function createFetchMiddlewareEther({ rpcUrl, originHttpHeaderKey, }: FetchMiddlewareOptions): JsonRpcMiddleware<string[], Block>;
export {};
