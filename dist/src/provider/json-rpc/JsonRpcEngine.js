var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import EventEmitter from '../../utils/safeEventEmitter';
import { errorCodes, EthereumRpcError } from 'eth-rpc-errors';
export class WepinJsonRpcEngine extends EventEmitter {
    constructor() {
        super();
        this._middleware = [];
    }
    push(middleware) {
        this._middleware.push(middleware);
    }
    handle(req, cb) {
        if (cb && typeof cb !== 'function') {
            throw new Error('"callback" must be a function if provided.');
        }
        if (Array.isArray(req)) {
            if (cb) {
                return this._handleBatch(req, cb);
            }
            return this._handleBatch(req);
        }
        if (cb) {
            return this._handle(req, cb);
        }
        return this._promiseHandle(req);
    }
    asMiddleware() {
        return (req, res, next, end) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [middlewareError, isComplete, returnHandlers,] = yield WepinJsonRpcEngine._runAllMiddleware(req, res, this._middleware);
                if (isComplete) {
                    yield WepinJsonRpcEngine._runReturnHandlers(returnHandlers);
                    return end(middlewareError);
                }
                return next((handlerCallback) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield WepinJsonRpcEngine._runReturnHandlers(returnHandlers);
                    }
                    catch (error) {
                        return handlerCallback(error);
                    }
                    return handlerCallback();
                }));
            }
            catch (error) {
                return end(error);
            }
        });
    }
    _handleBatch(reqs, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responses = yield Promise.all(reqs.map(this._promiseHandle.bind(this)));
                if (cb) {
                    return cb(null, responses);
                }
                return responses;
            }
            catch (error) {
                if (cb) {
                    return cb(error);
                }
                throw error;
            }
        });
    }
    _promiseHandle(req) {
        return new Promise((resolve) => {
            this._handle(req, (_err, res) => {
                resolve(res);
            });
        });
    }
    _handle(callerReq, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!callerReq ||
                Array.isArray(callerReq) ||
                typeof callerReq !== 'object') {
                const error = new EthereumRpcError(errorCodes.rpc.invalidRequest, `Requests must be plain objects. Received: ${typeof callerReq}`, { request: callerReq });
                return cb(error, { id: undefined, jsonrpc: '2.0', error });
            }
            if (typeof callerReq.method !== 'string') {
                const error = new EthereumRpcError(errorCodes.rpc.invalidRequest, `Must specify a string method. Received: ${typeof callerReq.method}`, { request: callerReq });
                return cb(error, { id: callerReq.id, jsonrpc: '2.0', error });
            }
            const req = Object.assign({}, callerReq);
            const res = {
                id: req.id,
                jsonrpc: req.jsonrpc,
            };
            let error = null;
            try {
                yield this._processRequest(req, res);
            }
            catch (_error) {
                error = _error;
            }
            if (error) {
                delete res.result;
                if (!res.error) {
                    if (error instanceof Error) {
                        res.error = error;
                    }
                    else {
                        res.error = new Error('unknown error');
                    }
                }
            }
            return cb(error, res);
        });
    }
    _processRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const [error, isComplete, returnHandlers,] = yield WepinJsonRpcEngine._runAllMiddleware(req, res, this._middleware);
            WepinJsonRpcEngine._checkForCompletion(req, res, isComplete);
            yield WepinJsonRpcEngine._runReturnHandlers(returnHandlers);
            if (error) {
                throw error;
            }
        });
    }
    static _runAllMiddleware(req, res, middlewareStack) {
        return __awaiter(this, void 0, void 0, function* () {
            const returnHandlers = [];
            let error = null;
            let isComplete = false;
            for (const middleware of middlewareStack) {
                [error, isComplete] = yield WepinJsonRpcEngine._runMiddleware(req, res, middleware, returnHandlers);
                if (isComplete) {
                    break;
                }
            }
            return [error, isComplete, returnHandlers.reverse()];
        });
    }
    static _runMiddleware(req, res, middleware, returnHandlers) {
        return new Promise((resolve) => {
            const end = (err) => {
                const error = err;
                if (error) {
                    if (error instanceof Error) {
                        res.error = error;
                    }
                    else {
                        res.error = new Error('unknown error');
                    }
                }
                resolve([error, true]);
            };
            const next = (returnHandler) => {
                if (res.error) {
                    end(res.error);
                }
                else {
                    if (returnHandler) {
                        if (typeof returnHandler !== 'function') {
                            end(new EthereumRpcError(errorCodes.rpc.internal, `JsonRpcEngine: "next" return handlers must be functions. ` +
                                `Received "${typeof returnHandler}" for request:\n${jsonify(req)}`, { request: req }));
                        }
                        returnHandlers.push(returnHandler);
                    }
                    resolve([null, false]);
                }
            };
            try {
                middleware(req, res, next, end);
            }
            catch (error) {
                end(error);
            }
        });
    }
    static _runReturnHandlers(handlers) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const handler of handlers) {
                yield new Promise((resolve, reject) => {
                    handler((err) => (err ? reject(err) : resolve()));
                });
            }
        });
    }
    static _checkForCompletion(req, res, isComplete) {
        if (!('result' in res) && !('error' in res)) {
            throw new EthereumRpcError(errorCodes.rpc.internal, `JsonRpcEngine: Response has no error or result for request:\n${jsonify(req)}`, { request: req });
        }
        if (!isComplete) {
            throw new EthereumRpcError(errorCodes.rpc.internal, `JsonRpcEngine: Nothing ended request:\n${jsonify(req)}`, { request: req });
        }
    }
}
function jsonify(request) {
    return JSON.stringify(request, null, 2);
}
//# sourceMappingURL=JsonRpcEngine.js.map