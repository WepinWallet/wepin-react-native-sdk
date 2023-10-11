import type { JsonRpcId, JsonRpcVersion } from 'json-rpc-engine';
export interface RequestArguments {
    readonly id?: number;
    readonly method: string;
    readonly params?: readonly unknown[] | object;
}
export interface UnvalidatedJsonRpcRequest {
    id: JsonRpcId;
    jsonrpc?: JsonRpcVersion;
    method: string;
    params?: unknown;
}
export interface BaseProviderState {
    accounts: null | string[];
    isConnected: boolean;
    initialized: boolean;
    isPermanentlyDisconnected: boolean;
}
export interface IProvider {
    request(args: RequestArguments): Promise<unknown>;
}
