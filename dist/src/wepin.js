var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Wepin_adminLoginResult, _Wepin_detailAccount, _Wepin_tokens, _Wepin_permission, _Wepin_wepinRequest;
import { WEPIN_DEFAULT_LANG, WEPIN_DEFAULT_CURRENCY } from './const/config';
import LOG from './utils/log';
import Utils from './utils/utils';
import EventEmitter from './utils/safeEventEmitter';
import { getBundleId } from 'react-native-device-info';
import PackageJson from '../package.json';
import KlayProvider from './provider/klaytn/inpageProvider';
import EthProvider from './provider/ethereum/inpageProvider';
import CustomDialogManager from './components/dialog';
import DialogManager from './components/dialog';
import { RootSiblingParent } from 'react-native-root-siblings';
import { getNetworkByChainId } from './provider/utils/info';
import { closeWidgetAndClearWebview } from './utils/commmonWidget';
import { emailRegExp } from './const/regExp';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';
const cameraPermissions = Platform.OS === "ios"
    ? PERMISSIONS.IOS.CAMERA
    : PERMISSIONS.ANDROID.CAMERA;
const audioPermissions = Platform.OS === "ios" ? PERMISSIONS.IOS.MICROPHONE :
    PERMISSIONS.ANDROID.RECORD_AUDIO;
const requestPermission = (permissions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield request(permissions);
        return result === RESULTS.GRANTED;
    }
    catch (err) {
        return false;
    }
});
export class Wepin extends EventEmitter {
    static getInstance() {
        if (!this._instance) {
            this._instance = new Wepin();
        }
        return this._instance;
    }
    constructor() {
        super();
        _Wepin_adminLoginResult.set(this, void 0);
        _Wepin_detailAccount.set(this, void 0);
        _Wepin_tokens.set(this, void 0);
        _Wepin_permission.set(this, { camera: false, clipboard: false });
        _Wepin_wepinRequest.set(this, void 0);
        this._isInitialized = false;
        this.version = PackageJson.version;
        console.log(`WepinJavaScript SDK v${this.version} Initialized`);
        this._wepinLifeCycle = 'not_initialized';
        if (DialogManager.currentDialog) {
            DialogManager.dismiss();
            DialogManager.destroy();
        }
        this._initQueue();
    }
    _initQueue() {
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
    setAccountInfo(accounts, detailAccount) {
        this.accountInfo = accounts;
        __classPrivateFieldSet(this, _Wepin_detailAccount, detailAccount !== null && detailAccount !== void 0 ? detailAccount : [], "f");
        this.emit('onAccountSet', accounts);
    }
    get Widget() {
        return this._widget;
    }
    setModeByAppKey(appKey) {
        if (appKey.slice(0, 8) === 'ak_live_') {
            this._modeByAppKey = 'production';
            LOG.debug = () => { };
            return;
        }
        else if (appKey.slice(0, 8) === 'ak_test_') {
            this._modeByAppKey = 'test';
            LOG.debug = console.log.bind(window.console, '[SDK][debug]');
            return;
        }
        else if (appKey.slice(0, 7) === 'ak_dev_') {
            this._modeByAppKey = 'development';
            LOG.debug = console.log.bind(window.console, '[SDK][debug]');
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
    setPermission(permission) {
        __classPrivateFieldSet(this, _Wepin_permission, permission, "f");
    }
    getPermission() {
        return __classPrivateFieldGet(this, _Wepin_permission, "f");
    }
    init(appId, appKey, attributes = {
        type: 'hide',
        defaultLanguage: WEPIN_DEFAULT_LANG,
        defaultCurrency: WEPIN_DEFAULT_CURRENCY,
    }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
            if (((_a = this.wepinAppAttributes) === null || _a === void 0 ? void 0 : _a.type) !== 'show') {
                yield this._open({ isInit: true, url: '/sdk/init' });
            }
            else {
                yield this._open({ isInit: true });
            }
            return new Promise((resolve, reject) => {
                this.once('widgetOpened', (response) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    try {
                        if (this._isInitialized) {
                            const isLogin = yield this.isLogedIn();
                            if (isLogin) {
                                this._wepinLifeCycle = 'login';
                            }
                            else {
                                this._wepinLifeCycle = 'initialized';
                            }
                        }
                        else {
                            this._wepinLifeCycle = 'not_initialized';
                        }
                        if (((_a = this.wepinAppAttributes) === null || _a === void 0 ? void 0 : _a.type) !== 'show') {
                            yield this._close();
                        }
                        if (response.error)
                            reject(new Error(`${response.error.code}: ${response.error.message}`));
                        else {
                            if (!this._isInitialized)
                                reject(new Error('unknown-error: init-failed. please check your app key or domain(package name or bundile id).'));
                            else
                                resolve(this);
                        }
                    }
                    catch (e) {
                        console.error('init error:', e);
                        this._wepinLifeCycle = 'not_initialized';
                        if (((_b = this.wepinAppAttributes) === null || _b === void 0 ? void 0 : _b.type) !== 'show') {
                            yield this._close();
                        }
                        reject(e);
                    }
                }));
            });
        });
    }
    isLogedIn() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const storage = yield Utils.getLocalStorage(this.wepinAppId);
            LOG.debug('isLogedIn');
            if (storage && storage['wepin:connectUser']) {
                const wepinRefreshToken = (_a = storage['wepin:connectUser']) === null || _a === void 0 ? void 0 : _a.refreshToken;
                const isExpired = Utils.isExpired(wepinRefreshToken);
                if (!isExpired && this._userInfo && this._userInfo.status === 'success') {
                    __classPrivateFieldSet(this, _Wepin_tokens, storage['wepin:connectUser'], "f");
                    LOG.debug('isLogedIn: true');
                    return true;
                }
            }
            LOG.debug('isLogedIn: false');
            return false;
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
            __classPrivateFieldSet(this, _Wepin_adminLoginResult, undefined, "f");
            __classPrivateFieldSet(this, _Wepin_detailAccount, [], "f");
            this._initQueue();
        });
    }
    openWidget() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.getStatus() !== 'login') {
                if ((_a = this.queue) === null || _a === void 0 ? void 0 : _a.length) {
                    this._initQueue();
                }
                throw new Error('Wepin.openWidget: You can open it only if you are logged in to the wepin.');
            }
            yield this._open();
        });
    }
    setWidgetWebview(webview) {
        this._widget = webview;
        this.emit('onRenderCompleteWebview');
    }
    _open(options) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            let baseUrl = Utils.getUrls(this.modeByAppKey).wepinWebview;
            if (this._widget && this._widget.props.visible) {
                return;
            }
            if (options === null || options === void 0 ? void 0 : options.url) {
                baseUrl += options.url;
            }
            __classPrivateFieldGet(this, _Wepin_permission, "f").clipboard = true;
            __classPrivateFieldGet(this, _Wepin_permission, "f").camera = yield requestPermission(cameraPermissions);
            try {
                if ((options === null || options === void 0 ? void 0 : options.type) === 'hide' ||
                    (((_a = this.wepinAppAttributes) === null || _a === void 0 ? void 0 : _a.type) !== 'show' && (options === null || options === void 0 ? void 0 : options.isInit))) {
                    CustomDialogManager.show({
                        webviewConfig: {
                            url: baseUrl,
                            appInfo: {
                                appKey: this.wepinAppKey,
                                appId: this.wepinAppId,
                                domain: this.wepinDomain,
                                attributes: { type: 'hide', defaultCurrency: (_b = this.wepinAppAttributes) === null || _b === void 0 ? void 0 : _b.defaultCurrency, defaultLanguage: (_c = this.wepinAppAttributes) === null || _c === void 0 ? void 0 : _c.defaultLanguage },
                                platform: '',
                            },
                            specifiedEmail: options === null || options === void 0 ? void 0 : options.specifiedEmail,
                            wepin: this,
                        }
                    });
                }
                else {
                    CustomDialogManager.show({
                        webviewConfig: {
                            url: baseUrl,
                            appInfo: {
                                appKey: this.wepinAppKey,
                                appId: this.wepinAppId,
                                domain: this.wepinDomain,
                                attributes: { type: 'show', defaultCurrency: (_d = this.wepinAppAttributes) === null || _d === void 0 ? void 0 : _d.defaultCurrency, defaultLanguage: (_e = this.wepinAppAttributes) === null || _e === void 0 ? void 0 : _e.defaultLanguage },
                                platform: '',
                            },
                            specifiedEmail: options === null || options === void 0 ? void 0 : options.specifiedEmail,
                            wepin: this,
                        }
                    });
                }
                return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                    this.once('onRenderCompleteWebview', () => __awaiter(this, void 0, void 0, function* () {
                        LOG.debug('onRenderCompleteWebview');
                        resolve();
                    }));
                }));
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
                if (this._widget && this._widget.props.visible) {
                    CustomDialogManager.update({
                        webviewConfig: {
                            url: baseUrl,
                            appInfo: {
                                appKey: this.wepinAppKey,
                                appId: this.wepinAppId,
                                domain: this.wepinDomain,
                                attributes: { type, defaultCurrency: (_b = this.wepinAppAttributes) === null || _b === void 0 ? void 0 : _b.defaultCurrency, defaultLanguage: (_c = this.wepinAppAttributes) === null || _c === void 0 ? void 0 : _c.defaultLanguage },
                                platform: '',
                            },
                            wepin: this,
                        },
                        visible: true,
                    });
                    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        this.once('onRenderCompleteWebview', () => __awaiter(this, void 0, void 0, function* () {
                            LOG.debug('onRenderCompleteWebview');
                            resolve();
                        }));
                    }));
                }
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
            LOG.debug('closeWidget');
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
            LOG.debug('close this._widget');
            LOG.debug('CustomDialogManager', CustomDialogManager.currentDialog);
            closeWidgetAndClearWebview(this, this._widget);
        });
    }
    getAccounts(networks) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized) {
                LOG.debug('wepin sdk widget has to be initialized');
                return [];
            }
            if (this.getStatus() !== 'login') {
                throw new Error(`Wepin.getAccounts: lifecycle of wepin sdk is not 'login'`);
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
    setUserInfo(userInfo, withEmit) {
        LOG.debug('setUserInfo: ', userInfo);
        this._userInfo = userInfo;
        if (userInfo && userInfo.status === 'success') {
            this._wepinLifeCycle = 'login';
        }
        else {
            if (!__classPrivateFieldGet(this, _Wepin_adminLoginResult, "f")) {
                this._wepinLifeCycle = 'initialized';
            }
        }
        if (withEmit) {
            this.emit('onUserInfoSet', userInfo);
        }
    }
    setWepinToken(tokens) {
        __classPrivateFieldSet(this, _Wepin_tokens, tokens, "f");
    }
    getStatus() {
        var _a;
        if (this._wepinLifeCycle === 'login') {
            const wepinRefreshToken = (_a = __classPrivateFieldGet(this, _Wepin_tokens, "f")) === null || _a === void 0 ? void 0 : _a.refreshToken;
            if (!wepinRefreshToken || Utils.isExpired(wepinRefreshToken)) {
                this._wepinLifeCycle = 'initialized';
            }
        }
        return this._wepinLifeCycle;
    }
    login(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized) {
                throw new Error('Wepin.login: wepin sdk widget has to be initialized');
            }
            if (email) {
                if (!emailRegExp.test(email)) {
                    throw new Error('The email does not match the correct format');
                }
            }
            this._wepinLifeCycle = 'before_login';
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                this.once('onUserInfoSet', (userInfo) => __awaiter(this, void 0, void 0, function* () {
                    LOG.debug('onUserInfoSet1', userInfo);
                    if (!userInfo || userInfo.status !== 'success') {
                        this.once('onUserInfoSet', (userInfo) => __awaiter(this, void 0, void 0, function* () {
                            LOG.debug('onUserInfoSet2', userInfo);
                            yield this._close();
                            __classPrivateFieldSet(this, _Wepin_adminLoginResult, undefined, "f");
                            resolve(userInfo);
                        }));
                        yield this._close();
                        yield this._open({ type: 'show', specifiedEmail: email });
                    }
                    else {
                        yield this._close();
                        __classPrivateFieldSet(this, _Wepin_adminLoginResult, undefined, "f");
                        resolve(userInfo);
                    }
                }));
                yield this._open({ type: 'hide', url: '/wepin-sdk-login/login', specifiedEmail: email });
            }));
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized && this.getStatus() !== 'login') {
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
                        __classPrivateFieldSet(this, _Wepin_adminLoginResult, undefined, "f");
                        resolve();
                    }
                }));
                yield this._open({ url: '/wepin-sdk-login/logout', type: 'hide' });
            }));
        });
    }
    registerWithWidget({ loginStatus, pinRequired, token, sign, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Date.now();
            const url = `/sdk/register?loginStatus=${loginStatus}&pinRequired=${pinRequired}&token=${token}&sign=${sign}&response_id=${id}`;
            return new Promise((resolve, reject) => {
                this.once(id.toString(), (data) => __awaiter(this, void 0, void 0, function* () {
                    LOG.debug('response data: ', data.body.data);
                    this._close();
                    if (data.body.state === 'SUCCESS') {
                        const loginStatus = data.body.data.loginStatus;
                        if (loginStatus === 'complete') {
                            const user = data.body.data.userInfo;
                            this._wepinLifeCycle = 'login';
                            resolve(user);
                        }
                        else {
                            reject(new Error('fail/wepin-register'));
                        }
                    }
                    else {
                        if (data.body.data) {
                            reject(new Error(data.body.data));
                        }
                        else {
                            reject(new Error('unkonw/error'));
                        }
                    }
                }));
                if (loginStatus === 'registerRequired' && pinRequired === false)
                    this._open({ url, type: 'hide' });
                else
                    this._open({ url });
            });
        });
    }
    loginWithExternalToken(token, sign, withUI) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized) {
                throw new Error('Wepin.login: wepin sdk widget has to be initialized');
            }
            this._wepinLifeCycle = 'before_login';
            LOG.debug('cookie: ', Utils.getLocalStorage(this.wepinAppId));
            const id = Date.now();
            const url = `/sdk/login?token=${token}&sign=${sign}&response_id=${id}`;
            return new Promise((resolve, reject) => {
                this.once(id.toString(), (data) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    LOG.debug('response data: ', data.body.data);
                    this._close();
                    if (data.body.state === 'SUCCESS') {
                        const loginStatus = data.body.data.loginStatus;
                        const loginToken = data.body.data.token;
                        if (loginStatus === 'complete') {
                            const user = data.body.data.userInfo;
                            this._wepinLifeCycle = 'login';
                            resolve(user);
                        }
                        else {
                            if (withUI) {
                                this.registerWithWidget({
                                    loginStatus,
                                    pinRequired: (_a = data.body.data) === null || _a === void 0 ? void 0 : _a.pinRequired,
                                    token,
                                    sign,
                                })
                                    .then((user) => {
                                    resolve(user);
                                })
                                    .catch((e) => {
                                    reject(e);
                                });
                                return;
                            }
                            __classPrivateFieldSet(this, _Wepin_adminLoginResult, { loginStatus, token: loginToken }, "f");
                            if (loginStatus === 'registerRequired') {
                                __classPrivateFieldGet(this, _Wepin_adminLoginResult, "f").pinRequired = data.body.data.pinRequired;
                            }
                            this._wepinLifeCycle = 'login_before_register';
                            reject(new Error('required/wepin-register'));
                        }
                    }
                    else {
                        if (data.body.data) {
                            reject(new Error(data.body.data));
                        }
                        else {
                            reject(new Error('unkonw/error'));
                        }
                    }
                }));
                this._open({ url, type: 'hide' });
            });
        });
    }
    getProvider({ network }) {
        var _a, _b, _c, _d, _e;
        if (!this._isInitialized)
            throw new Error('Wepin must be initialized to get Provider.');
        if (window) {
            if ((_a = window.evmproviders) === null || _a === void 0 ? void 0 : _a.Wepin) {
                const chianId = (_b = window.evmproviders) === null || _b === void 0 ? void 0 : _b.Wepin.chainId;
                LOG.debug(' getProvider - window.evmproviders?.Wepin.chainId', (_c = window.evmproviders) === null || _c === void 0 ? void 0 : _c.Wepin.chainId);
                const lastNetwork = getNetworkByChainId(chianId);
                const selectedAddress = (_d = window.evmproviders) === null || _d === void 0 ? void 0 : _d.Wepin.selectedAddress;
                const accountInfo = (_e = this.accountInfo) !== null && _e !== void 0 ? _e : [];
                const findAccount = accountInfo.filter((v) => v.address === selectedAddress && v.network.toLowerCase() === lastNetwork);
                if (findAccount.length && lastNetwork === network) {
                    return window.evmproviders.Wepin;
                }
            }
        }
        const lowerCasedNetworkStr = network.toLowerCase();
        const wepin = this;
        switch (lowerCasedNetworkStr) {
            case 'ethereum':
            case 'evmeth-goerli':
            case 'evmsongbird':
            case 'evmpolygon':
            case 'evmtime-elizabeth':
            case 'evmeth-sepolia':
            case 'evmpolygon-amoy':
                return EthProvider.generate({ network: lowerCasedNetworkStr, wepin });
            case 'klaytn':
            case 'klaytn-testnet':
                return KlayProvider.generate({
                    network: lowerCasedNetworkStr,
                    wepin,
                });
            default:
                throw new Error(`Can not resolve network name: ${network}`);
        }
    }
    signUpWithEmailAndPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized) {
                throw new Error('Wepin.signUpWithEmailAndPassword: wepin sdk widget has to be initialized');
            }
            const id = new Date().getTime();
            const adminSignupRequest = () => {
                var _a;
                LOG.debug('wait adminSignupRequest');
                (_a = this.Widget) === null || _a === void 0 ? void 0 : _a.request({
                    header: {
                        request_from: 'react-native',
                        request_to: 'wepin_widget',
                        id,
                    },
                    body: {
                        command: 'signup_email',
                        parameter: {
                            email,
                            password,
                        },
                    },
                });
            };
            this.once('startAdminRequest', adminSignupRequest);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.once(id.toString(), (data) => __awaiter(this, void 0, void 0, function* () {
                    LOG.debug('response data: ', data.body.data);
                    yield this._close();
                    if (data.body.state === 'SUCCESS') {
                        resolve(true);
                    }
                    else {
                        if (data.body.data) {
                            reject(new Error(data.body.data));
                        }
                        else {
                            reject(new Error('unkonw/error'));
                        }
                    }
                }));
                yield this._open({ type: 'hide', url: '/sdk/signup' });
            }));
        });
    }
    loginWithEmailAndPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized) {
                throw new Error('Wepin.loginWithEmailAndPassword: wepin sdk widget has to be initialized');
            }
            const id = new Date().getTime();
            const adminLoginRequest = () => {
                var _a;
                LOG.debug('wait adminLoginRequest');
                (_a = this.Widget) === null || _a === void 0 ? void 0 : _a.request({
                    header: {
                        request_from: 'react-native',
                        request_to: 'wepin_widget',
                        id,
                    },
                    body: {
                        command: 'login_email',
                        parameter: {
                            email,
                            password,
                        },
                    },
                });
            };
            this.once('startAdminRequest', adminLoginRequest);
            this._wepinLifeCycle = 'before_login';
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.once(id.toString(), (data) => __awaiter(this, void 0, void 0, function* () {
                    LOG.debug('response data: ', data.body.data);
                    yield this._close();
                    if (data.body.state === 'SUCCESS') {
                        const loginStatus = data.body.data.loginStatus;
                        const token = data.body.data.token;
                        if (loginStatus === 'complete') {
                            const user = data.body.data.userInfo;
                            __classPrivateFieldSet(this, _Wepin_adminLoginResult, undefined, "f");
                            this._wepinLifeCycle = 'login';
                            resolve(user);
                        }
                        else {
                            __classPrivateFieldSet(this, _Wepin_adminLoginResult, { loginStatus, token }, "f");
                            LOG.debug('login response adminLoginRequest: ', __classPrivateFieldGet(this, _Wepin_adminLoginResult, "f"));
                            if (loginStatus === 'registerRequired') {
                                __classPrivateFieldGet(this, _Wepin_adminLoginResult, "f").pinRequired = data.body.data.pinRequired;
                            }
                            this._wepinLifeCycle = 'login_before_register';
                            LOG.debug('this._wepinLifeCycle', this._wepinLifeCycle);
                            reject(new Error('required/wepin-register'));
                        }
                    }
                    else {
                        if (data.body.data) {
                            reject(new Error(data.body.data));
                        }
                        else {
                            reject(new Error('unkonw/error'));
                        }
                    }
                }));
                yield this._open({ type: 'hide', url: '/sdk/login' });
            }));
        });
    }
    register(pin) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized) {
                throw new Error('Wepin.register: wepin sdk widget has to be initialized');
            }
            if (this.getStatus() !== 'login_before_register') {
                throw new Error(`Wepin.register: lifecycle of wepin sdk is not 'login_before_register'`);
            }
            if (Utils.checkSameNumber(pin, 4, ((_a = __classPrivateFieldGet(this, _Wepin_adminLoginResult, "f")) === null || _a === void 0 ? void 0 : _a.loginStatus) === 'registerRequired')) {
                throw new Error('invalid/pin-format');
            }
            LOG.debug('register request adminLoginRequest: ', __classPrivateFieldGet(this, _Wepin_adminLoginResult, "f"));
            const id = new Date().getTime();
            const adminRegisterRequest = () => {
                var _a, _b, _c, _d;
                LOG.debug('wait adminRegisterRequest');
                (_a = this.Widget) === null || _a === void 0 ? void 0 : _a.request({
                    header: {
                        request_from: 'react-native',
                        request_to: 'wepin_widget',
                        id,
                    },
                    body: {
                        command: 'register_wepin',
                        parameter: {
                            pin,
                            loginStatus: (_b = __classPrivateFieldGet(this, _Wepin_adminLoginResult, "f")) === null || _b === void 0 ? void 0 : _b.loginStatus,
                            pinRequired: (_c = __classPrivateFieldGet(this, _Wepin_adminLoginResult, "f")) === null || _c === void 0 ? void 0 : _c.pinRequired,
                            token: (_d = __classPrivateFieldGet(this, _Wepin_adminLoginResult, "f")) === null || _d === void 0 ? void 0 : _d.token
                        },
                    },
                });
            };
            this.once('startAdminRequest', adminRegisterRequest);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.once(id.toString(), (data) => __awaiter(this, void 0, void 0, function* () {
                    LOG.debug('response data: ', data.body.data);
                    yield this._close();
                    if (data.body.state === 'SUCCESS') {
                        __classPrivateFieldSet(this, _Wepin_adminLoginResult, undefined, "f");
                        this._wepinLifeCycle = 'before_login';
                        resolve(true);
                    }
                    else {
                        if (data.body.data) {
                            reject(new Error(data.body.data));
                        }
                        else {
                            reject(new Error('unkonw/error'));
                        }
                    }
                }));
                yield this._open({ type: 'hide', url: '/sdk/register' });
            }));
        });
    }
    getBalance(account) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized) {
                throw new Error('Wepin.getBalance: wepin sdk widget has to be initialized');
            }
            if (this.getStatus() !== 'login') {
                throw new Error(`Wepin.getBalance: lifecycle of wepin sdk is not 'login'`);
            }
            if (!Array.isArray(__classPrivateFieldGet(this, _Wepin_detailAccount, "f")) || __classPrivateFieldGet(this, _Wepin_detailAccount, "f").length === 0) {
                throw new Error(`invalid/account`);
            }
            const selectedAccount = (_a = __classPrivateFieldGet(this, _Wepin_detailAccount, "f")) === null || _a === void 0 ? void 0 : _a.find((acc) => acc.address === account.address && acc.network === account.network);
            if (!selectedAccount) {
                throw new Error(`invalid/account`);
            }
            const id = new Date().getTime();
            const adminBalanceRequest = () => {
                var _a;
                LOG.debug('wait adminLoginRequest');
                (_a = this.Widget) === null || _a === void 0 ? void 0 : _a.request({
                    header: {
                        request_from: 'react-native',
                        request_to: 'wepin_widget',
                        id,
                    },
                    body: {
                        command: 'get_balance',
                        parameter: {
                            account: selectedAccount,
                        },
                    },
                });
            };
            this.once('startAdminRequest', adminBalanceRequest);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.once(id.toString(), (data) => __awaiter(this, void 0, void 0, function* () {
                    LOG.debug('response data: ', data.body.data);
                    yield this._close();
                    if (data.body.state === 'SUCCESS') {
                        const balance = data.body.data.balance;
                        resolve(balance);
                    }
                    else {
                        if (data.body.data) {
                            reject(new Error(data.body.data));
                        }
                        else {
                            reject(new Error('unkonw/error'));
                        }
                    }
                }));
                yield this._open({ type: 'hide', url: '/sdk/balance' });
            }));
        });
    }
    getSDKRequest() {
        return __classPrivateFieldGet(this, _Wepin_wepinRequest, "f");
    }
    send(account, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized) {
                throw new Error('Wepin.getBalance: wepin sdk widget has to be initialized');
            }
            if (this.getStatus() !== 'login') {
                throw new Error(`Wepin.getBalance: lifecycle of wepin sdk is not 'login'`);
            }
            if (!account) {
                throw new Error(`invalid/account`);
            }
            if (options && ((options === null || options === void 0 ? void 0 : options.toAddress) === undefined) !== ((options === null || options === void 0 ? void 0 : options.amount) === undefined)) {
                throw new Error(`invalid/options`);
            }
            const id = new Date().getTime();
            __classPrivateFieldSet(this, _Wepin_wepinRequest, {
                header: {
                    request_from: 'react-native',
                    request_to: 'wepin_widget',
                    id,
                },
                body: {
                    command: 'send_transaction_without_provider',
                    parameter: {
                        account: {
                            address: account.address,
                            network: account.network,
                            contract: account === null || account === void 0 ? void 0 : account.contract,
                        },
                        from: account.address,
                        to: options === null || options === void 0 ? void 0 : options.toAddress,
                        value: options === null || options === void 0 ? void 0 : options.amount,
                    },
                },
            }, "f");
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.once(id.toString(), (data) => __awaiter(this, void 0, void 0, function* () {
                    LOG.debug('response data: ', data.body.data);
                    yield this._close();
                    if (data.body.state === 'SUCCESS') {
                        const txid = data.body.data;
                        resolve(txid);
                    }
                    else {
                        if (data.body.data) {
                            reject(new Error(data.body.data));
                        }
                        else {
                            reject(new Error('unkonw/error'));
                        }
                    }
                }));
                yield this._open({ url: '/sdk/send' });
            }));
        });
    }
}
_Wepin_adminLoginResult = new WeakMap(), _Wepin_detailAccount = new WeakMap(), _Wepin_tokens = new WeakMap(), _Wepin_permission = new WeakMap(), _Wepin_wepinRequest = new WeakMap();
Wepin.WidgetView = RootSiblingParent;
//# sourceMappingURL=wepin.js.map