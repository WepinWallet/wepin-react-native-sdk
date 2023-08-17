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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.WebView = void 0;
var React = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_webview_1 = __importDefault(require("react-native-webview"));
var log_1 = __importDefault(require("../utils/log"));
var eventListener_1 = require("./event/eventListener");
var react_native_inappbrowser_reborn_1 = require("react-native-inappbrowser-reborn");
var utils_1 = __importDefault(require("../utils/utils"));
var react_native_status_bar_height_1 = require("react-native-status-bar-height");
var WebView = (function (_super) {
    __extends(WebView, _super);
    function WebView(props) {
        var _this = _super.call(this, props) || this;
        _this._open = function (config) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.state.visible) return [3, 2];
                        if (this._timeout) {
                            clearTimeout(this._timeout);
                        }
                        return [4, new Promise(function (resolve) {
                                return _this.setState(function (prevState) { return (__assign(__assign({}, prevState), { config: config })); }, resolve);
                            })];
                    case 1:
                        _b.sent();
                        return [2];
                    case 2:
                        this.setState(function (prevState) { return (__assign(__assign({}, prevState), { visible: true, config: config })); });
                        return [2];
                }
            });
        }); };
        _this._close = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.state.visible) {
                            return [2];
                        }
                        if (this._timeout) {
                            clearTimeout(this._timeout);
                        }
                        return [4, new Promise(function (resolve) {
                                return _this.setState(function (prevState) { return (__assign(__assign({}, prevState), { config: undefined, visible: false })); }, resolve);
                            })];
                    case 1:
                        _b.sent();
                        return [2];
                }
            });
        }); };
        _this._handleSetRef = function (_ref) {
            _this.webRef = _ref;
        };
        _this.response = function (message) {
            var _b;
            log_1.default.debug('response', message);
            (_b = _this.webRef) === null || _b === void 0 ? void 0 : _b.postMessage(JSON.stringify(message));
        };
        _this.request = function (message) {
            var _b;
            log_1.default.debug('request', message);
            (_b = _this.webRef) === null || _b === void 0 ? void 0 : _b.postMessage(JSON.stringify(message));
        };
        _this._WebivewRender = function () {
            if (!_this.state.config) {
                return React.createElement(React.Fragment, null);
            }
            var _b = _this.state, styles = _b.styles, url = _b.config.url;
            return (React.createElement(react_native_1.View, { style: styles.webviewContainer },
                React.createElement(react_native_webview_1.default, { ref: _this._handleSetRef, source: { uri: url }, style: styles.webview, javaScriptEnabled: true, domStorageEnabled: true, onError: function (_b) {
                        var nativeEvent = _b.nativeEvent;
                        return log_1.default.error('Webview error: ', nativeEvent);
                    }, onMessage: _this.EL, onOpenWindow: function (eventData) {
                        var _b;
                        var inAppUrl = (_b = eventData === null || eventData === void 0 ? void 0 : eventData.nativeEvent) === null || _b === void 0 ? void 0 : _b.targetUrl;
                        log_1.default.debug('onOpenWindow Url : ', inAppUrl);
                        _this.openUrl(inAppUrl);
                    } })));
        };
        _this.render = function () {
            var _b = _this.state, visible = _b.visible, styles = _b.styles;
            var _WebivewRender = _this._WebivewRender;
            return (React.createElement(react_native_1.Modal, { transparent: true, visible: visible },
                React.createElement(react_native_1.View, { style: styles.backgroundContainer }),
                React.createElement(_WebivewRender, null)));
        };
        _this.EL = (0, eventListener_1.getEventListener)(_this);
        _this.state = {
            styles: __styles(),
            visible: false,
        };
        return _this;
    }
    Object.defineProperty(WebView, "Wepin", {
        get: function () {
            return this._wepin;
        },
        enumerable: false,
        configurable: true
    });
    WebView.prototype.openUrl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var isAvailable, deeplink, result, idToken, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4, react_native_inappbrowser_reborn_1.InAppBrowser.isAvailable()];
                    case 1:
                        isAvailable = _b.sent();
                        if (!isAvailable) return [3, 3];
                        log_1.default.debug('Open Url InAppBrowser');
                        deeplink = utils_1.default.getDeeplink();
                        return [4, react_native_inappbrowser_reborn_1.InAppBrowser.openAuth(url, deeplink, {
                                dismissButtonStyle: 'cancel',
                                preferredBarTintColor: 'gray',
                                preferredControlTintColor: 'white',
                                showTitle: true,
                                toolbarColor: '#6200EE',
                                secondaryToolbarColor: 'black',
                                enableUrlBarHiding: true,
                                enableDefaultShare: true,
                                forceCloseOnRedirection: true,
                                modalEnabled: true,
                            })];
                    case 2:
                        result = _b.sent();
                        if (result.type === 'success' && result.url) {
                            log_1.default.debug('success, url: ', result.url);
                            if (result.url.includes('?token=')) {
                                idToken = result.url.substring(deeplink.length + '?token='.length);
                                if (idToken) {
                                    this.request({
                                        header: {
                                            request_from: 'react-native',
                                            request_to: 'wepin_widget',
                                            id: new Date().getTime(),
                                        },
                                        body: {
                                            command: 'set_token',
                                            parameter: {
                                                token: idToken,
                                            },
                                        },
                                    });
                                    return [2];
                                }
                            }
                        }
                        else if (result.type === 'cancel' || result.type === 'dismiss') {
                            log_1.default.debug('close');
                            if (url.includes('login')) {
                                this.request({
                                    header: {
                                        request_from: 'react-native',
                                        request_to: 'wepin_widget',
                                        id: new Date().getTime(),
                                    },
                                    body: {
                                        command: 'set_token',
                                        parameter: {
                                            token: '',
                                        },
                                    },
                                });
                            }
                            return [2];
                        }
                        return [3, 4];
                    case 3:
                        react_native_1.Linking.openURL(url);
                        _b.label = 4;
                    case 4: return [3, 6];
                    case 5:
                        error_1 = _b.sent();
                        log_1.default.debug(error_1);
                        return [3, 6];
                    case 6: return [2];
                }
            });
        });
    };
    var _a;
    _a = WebView;
    WebView.instance = React.createRef();
    WebView.show = function (args) {
        var _b;
        _a._wepin = args.wepin;
        (_b = WebView.instance.current) === null || _b === void 0 ? void 0 : _b._open(args);
        return WebView.instance.current;
    };
    WebView.hide = function () {
        var _b;
        (_b = WebView.instance.current) === null || _b === void 0 ? void 0 : _b._close();
    };
    return WebView;
}(React.Component));
exports.WebView = WebView;
var __styles = function () {
    return react_native_1.StyleSheet.create({
        backgroundContainer: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { backgroundColor: 'rgba(0,0,0,0.7)' }),
        webviewContainer: {
            flex: 1,
            width: '100%',
            height: react_native_1.Platform.OS === 'ios' ? react_native_1.Dimensions.get('screen').height - (0, react_native_status_bar_height_1.getStatusBarHeight)() : '100%',
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#ff000000',
        },
        webview: {
            flex: 1,
            width: '100%',
            height: '100%',
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#ff000000',
        },
    });
};
//# sourceMappingURL=Webview.js.map