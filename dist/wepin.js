"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wepin = void 0;
var config_1 = require("./const/config");
var log_1 = __importDefault(require("./utils/log"));
var utils_1 = __importDefault(require("./utils/utils"));
var Webview_1 = require("./components/Webview");
var eventemitter3_1 = __importDefault(require("eventemitter3"));
var react_native_device_info_1 = require("react-native-device-info");
var WepinWidget_1 = require("./components/WepinWidget");
var Wepin = (function (_super) {
    __extends(Wepin, _super);
    function Wepin() {
        var _this = _super.call(this) || this;
        _this._isInitialized = false;
        _this.queue = new Proxy([], {
            set: function (target, prop, value) {
                var _a;
                var result = Reflect.set(target, prop, value);
                if (Object.prototype.hasOwnProperty.call(value, 'body') &&
                    Object.prototype.hasOwnProperty.call(value, 'header')) {
                    (_a = _this.Widget) === null || _a === void 0 ? void 0 : _a.request({
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
        return _this;
    }
    Wepin.getInstance = function () {
        if (!this._instance) {
            this._instance = new Wepin();
        }
        return this._instance;
    };
    Wepin.prototype.setAccountInfo = function (accounts) {
        this.accountInfo = accounts;
        this.emit('onAccountSet', accounts);
    };
    Object.defineProperty(Wepin.prototype, "Widget", {
        get: function () {
            return this._widget;
        },
        enumerable: false,
        configurable: true
    });
    Wepin.prototype.setModeByAppKey = function (appKey) {
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
    };
    Object.defineProperty(Wepin.prototype, "modeByAppKey", {
        get: function () {
            if (this._modeByAppKey === undefined) {
                throw new Error('Wepin.modeByAppKey: wepin widget has to be initialized');
            }
            return this._modeByAppKey;
        },
        enumerable: false,
        configurable: true
    });
    Wepin.prototype.toJSON = function () {
        return '';
    };
    Wepin.prototype.init = function (appId, appKey, attributes) {
        if (attributes === void 0) { attributes = {
            type: 'hide',
            defaultLanguage: config_1.WEPIN_DEFAULT_LANG,
            defaultCurrency: config_1.WEPIN_DEFAULT_CURRENCY,
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                log_1.default.debug('Wepin init starts with Key', appKey);
                if (this._isInitialized) {
                    throw new Error('Wepin is already initialized!');
                }
                this.setModeByAppKey(appKey);
                this.wepinAppId = appId;
                this.wepinAppKey = appKey;
                this.wepinAppAttributes = attributes;
                this.wepinDomain = (0, react_native_device_info_1.getBundleId)();
                this._isInitialized = false;
                this.openWidget();
                return [2, new Promise(function (resolve) {
                        _this.once('widgetOpened', function () {
                            resolve(_this);
                        });
                    })];
            });
        });
    };
    Wepin.prototype.isInitialized = function () {
        return this._isInitialized;
    };
    Wepin.prototype.finalize = function () {
        this.accountInfo = [];
        if (this._widget) {
            Webview_1.WebView.hide();
            this._widget = undefined;
        }
        this._isInitialized = false;
    };
    Wepin.prototype.openWidget = function () {
        return __awaiter(this, void 0, void 0, function () {
            var baseUrl;
            return __generator(this, function (_a) {
                baseUrl = utils_1.default.getUrls(this.modeByAppKey).wepinWebview;
                if (this._widget && this._widget.state.visible) {
                    log_1.default.debug('already opened widget', this._widget);
                    return [2];
                }
                try {
                    this._widget = Webview_1.WebView.show({
                        url: baseUrl,
                        appInfo: {
                            appKey: this.wepinAppKey,
                            domain: this.wepinDomain,
                            attributes: this.wepinAppAttributes,
                            platform: '',
                        },
                        wepin: this,
                    });
                    log_1.default.debug('openWidget this._widget', this._widget);
                }
                catch (e) {
                    log_1.default.debug(e);
                    throw new Error("Wepin.openWidget: Can't open wepin sdk widget");
                }
                return [2];
            });
        });
    };
    Wepin.prototype.closeWidget = function () {
        if (!this._isInitialized) {
            throw new Error('Wepin.closeWidget: wepin sdk widget has to be initialized');
        }
        if (this._widget) {
            Webview_1.WebView.hide();
            this._widget = undefined;
        }
        else {
            throw new Error('Wepin.closeWidget: wepin sdk widget is not exist');
        }
    };
    Wepin.prototype.getAccounts = function (networks) {
        return __awaiter(this, void 0, void 0, function () {
            var filteredAccounts;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._isInitialized) {
                            log_1.default.debug('wepin sdk widget has to be initialized');
                            return [2, []];
                        }
                        if (!!this.accountInfo) return [3, 2];
                        return [4, this.openWidget()];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve) {
                                _this.once('onAccountSet', function (accounts) {
                                    if (_this._widget) {
                                        Webview_1.WebView.hide();
                                    }
                                    if (networks !== undefined && networks.length > 0) {
                                        var filteredAccounts = accounts.filter(function (account) { return networks.includes(account.network); });
                                        resolve(filteredAccounts);
                                    }
                                    else {
                                        resolve(accounts);
                                    }
                                });
                            })];
                    case 2:
                        if (networks !== undefined && networks.length > 0) {
                            filteredAccounts = this.accountInfo.filter(function (account) {
                                return networks.includes(account.network);
                            });
                            return [2, filteredAccounts];
                        }
                        else {
                            return [2, this.accountInfo];
                        }
                        return [2];
                }
            });
        });
    };
    Wepin.WidgetView = WepinWidget_1.WepinWidget;
    return Wepin;
}(eventemitter3_1.default));
exports.Wepin = Wepin;
//# sourceMappingURL=wepin.js.map