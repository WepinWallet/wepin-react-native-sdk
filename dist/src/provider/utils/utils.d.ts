import { PendingJsonRpcResponse } from 'json-rpc-engine';
export declare const getRpcPromiseCallback: (resolve: (value?: any) => void, reject: (error?: Error) => void, unwrapResult?: boolean) => (error: Error, response: PendingJsonRpcResponse<unknown>) => void;
export declare const isValidChainId: (chainId: unknown) => chainId is string;
