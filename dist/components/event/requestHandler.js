"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebviewRequestHandler = void 0;
var react_native_1 = require("react-native");
var log_1 = __importDefault(require("../../utils/log"));
var Webview_1 = require("../Webview");
var WebviewRequestHandler = function (message, widget) {
    var _a, _b, _c;
    var response = {
        header: {
            response_from: 'react-native',
            response_to: 'wepin_widget',
            id: message.header.id,
        },
    };
    switch (message.body.command) {
        case 'ready_to_widget':
            log_1.default.debug('web request: message.bod ', message.body);
            response.body = {
                command: 'ready_to_widget',
                state: 'SUCCESS',
                data: {
                    appKey: Webview_1.WebView.Wepin.wepinAppKey,
                    domain: Webview_1.WebView.Wepin.wepinDomain,
                    platform: react_native_1.Platform.OS === 'ios' ? 3 : 2,
                    attributes: Webview_1.WebView.Wepin.wepinAppAttributes,
                    version: '0.2.0',
                },
            };
            break;
        case 'initialized_widget':
            log_1.default.debug('initialized_widget result =>', (_a = message.body.parameter) === null || _a === void 0 ? void 0 : _a.result);
            Webview_1.WebView.Wepin._isInitialized = (_b = message.body.parameter) === null || _b === void 0 ? void 0 : _b.result;
            response.body = {
                command: 'initialized_widget',
                state: 'SUCCESS',
                data: '',
            };
            Webview_1.WebView.Wepin.emit('widgetOpened');
            break;
        case 'set_accounts':
            Webview_1.WebView.Wepin.setAccountInfo((_c = message.body.parameter) === null || _c === void 0 ? void 0 : _c.accounts);
            response.body = {
                command: 'set_accounts',
                state: 'SUCCESS',
                data: '',
            };
            break;
        case 'close_wepin_widget':
            Webview_1.WebView.hide();
            break;
        case 'dequeue_request':
            if (Webview_1.WebView.Wepin.queue[0]) {
                windowCloseObserver();
                response.body = {
                    command: message.body.command,
                    state: 'SUCCESS',
                    data: Webview_1.WebView.Wepin.queue[0],
                };
            }
            else {
                response.body = {
                    command: message.body.command,
                    state: 'ERROR',
                    data: null,
                };
            }
            break;
        default:
            throw new Error("Command ".concat(message.body.command, " is not supported."));
    }
    if (widget.state.visible) {
        widget.response(response);
    }
    function windowCloseObserver() {
    }
};
exports.WebviewRequestHandler = WebviewRequestHandler;
//# sourceMappingURL=requestHandler.js.map