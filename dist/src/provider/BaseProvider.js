var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dequal from 'fast-deep-equal';
import { ethErrors, EthereumRpcError } from 'eth-rpc-errors';
import { getRpcPromiseCallback, isValidChainId } from './utils/utils';
import EventEmitter from '../utils/safeEventEmitter';
import { WepinJsonRpcEngine } from './json-rpc/JsonRpcEngine';
import LOG from '../utils/log';
export class BaseProvider extends EventEmitter {
    constructor({ logger = console, rpcMiddleware = [], } = {}) {
        super();
        this.uuid = 'wepinprovider';
        this.name = 'Wepin';
        this._log = logger;
        this._state = Object.assign({}, BaseProvider._defaultState);
        this.selectedAddress = null;
        this.chainId = null;
        this._handleAccountsChanged = this._handleAccountsChanged.bind(this);
        this._handleConnect = this._handleConnect.bind(this);
        this._handleChainChanged = this._handleChainChanged.bind(this);
        this._handleDisconnect = this._handleDisconnect.bind(this);
        this._rpcRequest = this._rpcRequest.bind(this);
        this.request = this.request.bind(this);
        const rpcEngine = new WepinJsonRpcEngine();
        rpcMiddleware.forEach((middleware) => rpcEngine.push(middleware));
        this._rpcEngine = rpcEngine;
    }
    request(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args || typeof args !== 'object' || Array.isArray(args)) {
                throw ethErrors.rpc.invalidRequest({
                    message: 'Invalid request arguments',
                    data: args,
                });
            }
            LOG.debug('[RPC Request]: requesting args', args);
            const { method, params, id = new Date().getTime() } = args;
            if (typeof method !== 'string' || method.length === 0) {
                throw ethErrors.rpc.invalidRequest({
                    message: 'Invalid request methods',
                    data: args,
                });
            }
            if (params !== undefined &&
                !Array.isArray(params) &&
                (typeof params !== 'object' || params === null)) {
                throw ethErrors.rpc.invalidRequest({
                    message: 'Invalid request params',
                    data: args,
                });
            }
            return new Promise((resolve, reject) => {
                this._rpcRequest({ method, params, id }, getRpcPromiseCallback(resolve, reject));
            });
        });
    }
    _initializeState(initialState) {
        if (this._state.initialized === true) {
            throw new Error('Provider already initialized.');
        }
        if (initialState) {
            const { accounts, chainId, networkVersion } = initialState;
            this._handleConnect(chainId);
            this._handleChainChanged({ chainId, networkVersion });
            this._handleAccountsChanged(accounts);
        }
        this._state.initialized = true;
        this.emit('_initialized');
    }
    _rpcRequest(payload, callback) {
        let cb = callback;
        if (!Array.isArray(payload)) {
            if (!payload.jsonrpc) {
                payload.jsonrpc = '2.0';
            }
            if (payload.method === 'eth_accounts' ||
                payload.method === 'klay_accounts' ||
                payload.method === 'eth_requestAccounts' ||
                payload.method === 'klay_requestAccounts') {
                cb = (err, res) => {
                    LOG.debug('_rpcRequest to handler account changes', err, res);
                    this._handleAccountsChanged(res.result || [], payload.method === 'eth_accounts');
                    callback(err, res);
                };
            }
            return this._rpcEngine.handle(payload, cb);
        }
        return this._rpcEngine.handle(payload, cb);
    }
    _handleConnect(chainId) {
        if (!this._state.isConnected) {
            this._state.isConnected = true;
            this.emit('connect', { chainId });
        }
    }
    _handleDisconnect(isRecoverable, errorMessage) {
        if (this._state.isConnected ||
            (!this._state.isPermanentlyDisconnected && !isRecoverable)) {
            this._state.isConnected = false;
            let error;
            if (isRecoverable) {
                error = new EthereumRpcError(1013, errorMessage || 'Provider diconnected');
                this._log.debug(error);
            }
            else {
                error = new EthereumRpcError(1011, errorMessage || 'Provider permenantly disconnected');
                this._log.error(error);
                this.chainId = null;
                this._state.accounts = null;
                this.selectedAddress = null;
                this._state.isPermanentlyDisconnected = true;
            }
            this.emit('disconnect', error);
        }
    }
    _handleChainChanged({ chainId, } = {}) {
        if (!isValidChainId(chainId)) {
            this._log.error('Invalid network params', { chainId });
            return;
        }
        this._handleConnect(chainId);
        if (chainId !== this.chainId) {
            this.chainId = chainId;
            if (this._state.initialized) {
                this.emit('chainChanged', this.chainId);
            }
        }
    }
    _handleAccountsChanged(accounts, isEthAccounts = false) {
        let _accounts = accounts;
        if (!Array.isArray(accounts)) {
            LOG.debug('Received invalid accounts parameter. Please report this bug.', accounts);
            _accounts = [];
        }
        for (const account of accounts) {
            if (typeof account !== 'string') {
                LOG.debug('Received non-string account. Please report this bug.', accounts);
                _accounts = [];
                break;
            }
        }
        if (!dequal(this._state.accounts, _accounts)) {
            if (isEthAccounts && this._state.accounts !== null) {
                LOG.debug(`'eth_accounts' unexpectedly updated accounts. Please report this bug.`, _accounts);
            }
            this._state.accounts = _accounts;
            if (this.selectedAddress !== _accounts[0]) {
                this.selectedAddress = _accounts[0] || null;
            }
            if (this._state.initialized) {
                this.emit('accountsChanged', _accounts);
            }
        }
    }
}
BaseProvider._defaultState = {
    accounts: null,
    isConnected: false,
    initialized: false,
    isPermanentlyDisconnected: false,
};
//# sourceMappingURL=BaseProvider.js.map