var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import dequal from 'fast-deep-equal';
import { ethErrors, EthereumRpcError } from 'eth-rpc-errors';
import { getRpcPromiseCallback, isValidChainId } from './utils/utils';
import EventEmitter from '../utils/safeEventEmitter';
import { WepinJsonRpcEngine } from './json-rpc/JsonRpcEngine';
import LOG from '../utils/log';
import { getNetworkInfoByName } from './utils/info';
import { createFetchMiddlewareEther } from './json-rpc/eth-json-rpc';
import { createWepinEtherMiddleware } from './middlewares/eth-json-rpc-wepin';
import { createWepinKlayMiddleware } from './middlewares/klay-json-rpc-wepin';
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
        this.setRpcEngine(rpcMiddleware);
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
            if (payload.method === 'wallet_switchEthereumChain') {
                cb = (err, res) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    this._log.debug('_rpcRequest to handler chain changes', err, res);
                    if (((_a = res.result) === null || _a === void 0 ? void 0 : _a.wepin) && ((_b = res.result) === null || _b === void 0 ? void 0 : _b.network) && ((_c = res.result) === null || _c === void 0 ? void 0 : _c.address)) {
                        const _h = res.result, { wepin } = _h, parsedRes = __rest(_h, ["wepin"]);
                        LOG.debug('parsedRes', parsedRes);
                        try {
                            this.changeChain({ wepin, network: (_d = res.result) === null || _d === void 0 ? void 0 : _d.network, address: (_e = res.result) === null || _e === void 0 ? void 0 : _e.address });
                        }
                        catch (e) {
                            err = e;
                        }
                        res.result = parsedRes;
                    }
                    if ((_f = res.result) === null || _f === void 0 ? void 0 : _f.chainId) {
                        this._handleChainChanged({ chainId: res.result.chainId });
                    }
                    if (this !== ((_g = window === null || window === void 0 ? void 0 : window.evmproviders) === null || _g === void 0 ? void 0 : _g.Wepin)) {
                        LOG.debug('this is not window evmproviders Wepin');
                        window.evmproviders.Wepin = this;
                    }
                    LOG.debug('this.chainId', this.chainId);
                    LOG.debug('window.evmproviders.Wepin.chainId', window.evmproviders.Wepin.chainId);
                    callback(err, res);
                };
            }
            return this._rpcEngine.handle(payload, cb);
        }
        return this._rpcEngine.handle(payload, cb);
    }
    setRpcEngine(rpcMiddleware) {
        const rpcEngine = new WepinJsonRpcEngine();
        rpcMiddleware.forEach((middleware) => rpcEngine.push(middleware));
        LOG.debug('before this._rpcEngine', this._rpcEngine);
        this._rpcEngine = rpcEngine;
        LOG.debug('after this._rpcEngine', this._rpcEngine);
    }
    changeChain({ wepin, network, address }) {
        const lowerCasedNetworkStr = network.toLowerCase();
        LOG.debug('changeChain network', network);
        LOG.debug('changeChain lowerCasedNetworkStr', lowerCasedNetworkStr);
        const { rpcUrl, chainId } = getNetworkInfoByName(network);
        const evmRPCMiddleware = createFetchMiddlewareEther({
            rpcUrl,
        });
        LOG.debug('changeChain rpcUrl', rpcUrl);
        LOG.debug('changeChain chainId', chainId);
        switch (lowerCasedNetworkStr) {
            case 'ethereum':
            case 'evmeth-goerli':
            case 'evmsongbird':
            case 'evmpolygon':
            case 'evmpolygon-testnet':
            case 'evmtime-elizabeth':
                {
                    const wepinMiddleware = createWepinEtherMiddleware({ wepin, network });
                    this.setRpcEngine([wepinMiddleware, evmRPCMiddleware]);
                    this.selectedAddress = address;
                }
                break;
            case 'klaytn':
            case 'klaytn-testnet':
                {
                    const wepinMiddleware = createWepinKlayMiddleware({ wepin, network });
                    this.setRpcEngine([wepinMiddleware, evmRPCMiddleware]);
                    this.selectedAddress = address;
                }
                break;
            default:
                throw new Error(`Can not resolve network name: ${network}`);
        }
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