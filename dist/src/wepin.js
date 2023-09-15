var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WEPIN_DEFAULT_LANG, WEPIN_DEFAULT_CURRENCY } from './const/config';
import LOG from './utils/log';
import Utils from './utils/utils';
import { WebView } from './components/Webview';
import EventEmitter from 'eventemitter3';
import { getBundleId } from 'react-native-device-info';
import { WepinWidget } from './components/WepinWidget';
import PackageJson from '../package.json';
export class Wepin extends EventEmitter {
    static getInstance() {
        if (!this._instance) {
            this._instance = new Wepin();
        }
        return this._instance;
    }
    constructor() {
        super();
        this._isInitialized = false;
        this.version = PackageJson.version;
        console.log(`WepinJavaScript SDK v${this.version} Initialized`);
        this._wepinLifeCycle = 'not_initialized';
        this.queue = new Proxy([], {
            set: (target, prop, value) => {
                var _a;
                const result = Reflect.set(target, prop, value);
                if (Object.prototype.hasOwnProperty.call(value, 'body') &&
                    Object.prototype.hasOwnProperty.call(value, 'header')) {
                    (_a = this.Widget) === null || _a === void 0 ? void 0 : _a.request({
                        header: {
                            request_from: 'react-native',
                            request_to: 'wepin_widget',
                            id: new Date().getTime(),
                        },
                        body: {
                            command: 'provider_request',
                            parameter: '',
                        },
                    });
                }
                return result;
            },
        });
    }
    setAccountInfo(accounts) {
        this.accountInfo = accounts;
        this.emit('onAccountSet', accounts);
    }
    get Widget() {
        return this._widget;
    }
    setModeByAppKey(appKey) {
        if (appKey.slice(0, 8) === 'ak_live_') {
            this._modeByAppKey = 'production';
            return;
        }
        else if (appKey.slice(0, 8) === 'ak_test_') {
            this._modeByAppKey = 'test';
            return;
        }
        else if (appKey.slice(0, 7) === 'ak_dev_') {
            this._modeByAppKey = 'development';
            return;
        }
        else {
            throw new Error('Wepin.setModeByAppKey: Invalid appKey');
        }
    }
    get modeByAppKey() {
        if (this._modeByAppKey === undefined) {
            throw new Error('Wepin.modeByAppKey: wepin widget has to be initialized');
        }
        return this._modeByAppKey;
    }
    toJSON() {
        return '';
    }
    init(appId, appKey, attributes = {
        type: 'hide',
        defaultLanguage: WEPIN_DEFAULT_LANG,
        defaultCurrency: WEPIN_DEFAULT_CURRENCY,
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug('Wepin init starts with Key', appKey);
            if (this._isInitialized) {
                throw new Error('Wepin is already initialized!');
            }
            this.setModeByAppKey(appKey);
            this.wepinAppId = appId;
            this.wepinAppKey = appKey;
            this.wepinAppAttributes = attributes;
            this.wepinDomain = getBundleId();
            this._isInitialized = false;
            this._wepinLifeCycle = 'initializing';
            yield this._open({ isInit: true });
            return new Promise(resolve => {
                this.once('widgetOpened', () => {
                    var _a, _b;
                    if (this._isInitialized) {
                        this._wepinLifeCycle = 'initialized';
                    }
                    else {
                        this._wepinLifeCycle = 'not_initialized';
                    }
                    if (((_b = (_a = WebView.Wepin) === null || _a === void 0 ? void 0 : _a.wepinAppAttributes) === null || _b === void 0 ? void 0 : _b.type) !== 'show') {
                        this._close();
                    }
                    resolve(this);
                });
            });
        });
    }
    isInitialized() {
        return this._isInitialized;
    }
    finalize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.accountInfo = [];
            yield this._close();
            this._isInitialized = false;
            this._wepinLifeCycle = 'not_initialized';
        });
    }
    openWidget() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._wepinLifeCycle !== 'login') {
                throw new Error('Wepin.openWidget: You can open it only if you are logged in to the wepin.');
            }
            yield this._open();
        });
    }
    _open(options) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            let baseUrl = Utils.getUrls(this.modeByAppKey).wepinWebview;
            if (this._widget && this._widget.state.visible) {
                LOG.debug('already opened widget', this._widget);
                return;
            }
            if (options === null || options === void 0 ? void 0 : options.url) {
                baseUrl += options.url;
            }
            try {
                if ((options === null || options === void 0 ? void 0 : options.type) === 'hide' ||
                    (((_a = this.wepinAppAttributes) === null || _a === void 0 ? void 0 : _a.type) !== 'show' && (options === null || options === void 0 ? void 0 : options.isInit))) {
                    this._widget = yield WebView.show({
                        url: baseUrl,
                        appInfo: {
                            appKey: this.wepinAppKey,
                            domain: this.wepinDomain,
                            attributes: { type: 'hide', defaultCurrency: (_b = this.wepinAppAttributes) === null || _b === void 0 ? void 0 : _b.defaultCurrency, defaultLanguage: (_c = this.wepinAppAttributes) === null || _c === void 0 ? void 0 : _c.defaultLanguage },
                            platform: '',
                        },
                        wepin: this,
                    });
                }
                else {
                    this._widget = yield WebView.show({
                        url: baseUrl,
                        appInfo: {
                            appKey: this.wepinAppKey,
                            domain: this.wepinDomain,
                            attributes: { type: 'show', defaultCurrency: (_d = this.wepinAppAttributes) === null || _d === void 0 ? void 0 : _d.defaultCurrency, defaultLanguage: (_e = this.wepinAppAttributes) === null || _e === void 0 ? void 0 : _e.defaultLanguage },
                            platform: '',
                        },
                        wepin: this,
                    });
                }
                LOG.debug('openWidget this._widget', this._widget);
            }
            catch (e) {
                LOG.debug(e);
                throw new Error("Wepin.openWidget: Can't open wepin sdk widget");
            }
        });
    }
    _resize(options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const type = (_a = options === null || options === void 0 ? void 0 : options.type) !== null && _a !== void 0 ? _a : 'show';
            let baseUrl = Utils.getUrls(this.modeByAppKey).wepinWebview;
            if (options === null || options === void 0 ? void 0 : options.url) {
                baseUrl += options.url;
            }
            try {
                if (this._widget && this._widget.state.visible) {
                    this._widget = yield WebView.show({
                        url: baseUrl,
                        appInfo: {
                            appKey: this.wepinAppKey,
                            domain: this.wepinDomain,
                            attributes: { type, defaultCurrency: (_b = this.wepinAppAttributes) === null || _b === void 0 ? void 0 : _b.defaultCurrency, defaultLanguage: (_c = this.wepinAppAttributes) === null || _c === void 0 ? void 0 : _c.defaultLanguage },
                            platform: '',
                        },
                        wepin: this,
                    });
                    return;
                }
                LOG.debug('openWidget this._widget', this._widget);
            }
            catch (e) {
                LOG.debug(e);
                throw new Error("Wepin.openWidget: Can't open wepin sdk widget");
            }
        });
    }
    closeWidget() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized) {
                throw new Error('Wepin.closeWidget: wepin sdk widget has to be initialized');
            }
            if (this._widget) {
                yield this._close();
            }
            else {
                throw new Error('Wepin.closeWidget: wepin sdk widget is not exist');
            }
        });
    }
    _close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._widget) {
                LOG.debug('close this._widget', this._widget);
                yield WebView.hide();
                this._widget = undefined;
            }
        });
    }
    getAccounts(networks) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized) {
                LOG.debug('wepin sdk widget has to be initialized');
                return [];
            }
            if (!this.accountInfo) {
                yield this.openWidget();
                return new Promise(resolve => {
                    this.once('onAccountSet', (accounts) => __awaiter(this, void 0, void 0, function* () {
                        yield this._close();
                        if (networks !== undefined && networks.length > 0) {
                            const filteredAccounts = accounts.filter(account => networks.includes(account.network));
                            resolve(filteredAccounts);
                        }
                        else {
                            resolve(accounts);
                        }
                    }));
                });
            }
            if (networks !== undefined && networks.length > 0) {
                const filteredAccounts = this.accountInfo.filter(account => networks.includes(account.network));
                return filteredAccounts;
            }
            else {
                return this.accountInfo;
            }
        });
    }
    setUserInfo(userInfo) {
        this._userInfo = userInfo;
        if (userInfo && userInfo.status === 'success') {
            this._wepinLifeCycle = 'login';
        }
        this.emit('onUserInfoSet', userInfo);
    }
    getStatus() {
        return this._wepinLifeCycle;
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized) {
                throw new Error('Wepin.login: wepin sdk widget has to be initialized');
            }
            this._wepinLifeCycle = 'before_login';
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                this.once('onUserInfoSet', (userInfo) => __awaiter(this, void 0, void 0, function* () {
                    LOG.debug('onUserInfoSet1', userInfo);
                    if (!userInfo || userInfo.status !== 'success') {
                        this.once('onUserInfoSet', (userInfo) => __awaiter(this, void 0, void 0, function* () {
                            LOG.debug('onUserInfoSet2', userInfo);
                            yield this._close();
                            resolve(userInfo);
                        }));
                        yield this._resize();
                    }
                    else {
                        yield this._close();
                        resolve(userInfo);
                    }
                }));
                yield this._open({ type: 'hide', url: '/wepin-sdk-login/login' });
            }));
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized && this._wepinLifeCycle !== 'login') {
                throw new Error('Wepin.logout: wepin sdk widget has to be initialized and logined');
            }
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.once('onLogout', (result) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    yield this._close();
                    if (result.status !== 'success') {
                        reject(new Error((_a = result.message) !== null && _a !== void 0 ? _a : 'Internal error'));
                    }
                    else {
                        this.setAccountInfo([]);
                        this._wepinLifeCycle = 'initialized';
                        resolve();
                    }
                }));
                yield this._open({ url: '/wepin-sdk-login/logout', type: 'hide' });
            }));
        });
    }
}
Wepin.WidgetView = WepinWidget;
//# sourceMappingURL=wepin.js.map