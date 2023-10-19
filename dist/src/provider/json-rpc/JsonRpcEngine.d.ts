import EventEmitter from '../../utils/safeEventEmitter';
type Maybe<T> = Partial<T> | null | undefined;
export type Json = boolean | number | string | null | {
    [property: string]: Json;
} | Json[];
export type JsonRpcVersion = '2.0';
export type JsonRpcId = number | string | void;
export interface JsonRpcError {
    code: number;
    message: string;
    data?: unknown;
    stack?: string;
}
export interface JsonRpcRequest<T> {
    jsonrpc: JsonRpcVersion;
    method: string;
    id: JsonRpcId;
    params?: T;
}
export interface JsonRpcNotification<T> {
    jsonrpc: JsonRpcVersion;
    method: string;
    params?: T;
}
interface JsonRpcResponseBase {
    jsonrpc: JsonRpcVersion;
    id: JsonRpcId;
}
export interface JsonRpcSuccess<T> extends JsonRpcResponseBase {
    result: Maybe<T>;
}
export interface JsonRpcFailure extends JsonRpcResponseBase {
    error: JsonRpcError;
}
export type JsonRpcResponse<T> = JsonRpcSuccess<T> | JsonRpcFailure;
export interface PendingJsonRpcResponse<T> extends JsonRpcResponseBase {
    result?: T;
    error?: Error | JsonRpcError;
}
export type JsonRpcEngineCallbackError = Error | JsonRpcError | null;
export type JsonRpcEngineReturnHandler = (done: (error?: JsonRpcEngineCallbackError) => void) => void;
export type JsonRpcEngineNextCallback = (returnHandlerCallback?: JsonRpcEngineReturnHandler) => void;
export type JsonRpcEngineEndCallback = (error?: JsonRpcEngineCallbackError) => void;
export type JsonRpcMiddleware<T, U> = (req: JsonRpcRequest<T>, res: PendingJsonRpcResponse<U>, next: JsonRpcEngineNextCallback, end: JsonRpcEngineEndCallback) => void;
export declare class WepinJsonRpcEngine extends EventEmitter {
    private _middleware;
    constructor();
    push<T, U>(middleware: JsonRpcMiddleware<T, U>): void;
    handle<T, U>(request: JsonRpcRequest<T>, callback: (error: unknown, response: JsonRpcResponse<U>) => void): void;
    handle<T, U>(requests: JsonRpcRequest<T>[], callback: (error: unknown, responses: JsonRpcResponse<U>[]) => void): void;
    handle<T, U>(request: JsonRpcRequest<T>): Promise<JsonRpcResponse<U>>;
    handle<T, U>(requests: JsonRpcRequest<T>[]): Promise<JsonRpcResponse<U>[]>;
    asMiddleware(): JsonRpcMiddleware<unknown, unknown>;
    private _handleBatch;
    private _promiseHandle;
    private _handle;
    private _processRequest;
    private static _runAllMiddleware;
    private static _runMiddleware;
    private static _runReturnHandlers;
    private static _checkForCompletion;
}
export {};
