"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventListener = void 0;
var log_1 = __importDefault(require("../../utils/log"));
var requestHandler_1 = require("./requestHandler");
var responseHandler_1 = require("./responseHandler");
var Webview_1 = require("../Webview");
var getEventListener = function (widget) {
    var isValidEvent = function (event) {
        var data = JSON.parse(event.nativeEvent.data);
        if (!Object.prototype.hasOwnProperty.call(data, 'header')) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(data, 'body')) {
            return false;
        }
        return true;
    };
    return function (event) {
        if (!isValidEvent(event)) {
            return;
        }
        var data = JSON.parse(event.nativeEvent.data);
        handleMessage(data, widget);
    };
};
exports.getEventListener = getEventListener;
var handleMessage = function (message, widget) {
    if (message.header.request_to === 'react-native') {
        (0, requestHandler_1.WebviewRequestHandler)(message, widget);
    }
    else if (message.header.response_to === 'react-native') {
        (0, responseHandler_1.WebviewResponseHandler)(message, Webview_1.WebView.Wepin);
    }
    else {
        log_1.default.error('Failed to handle message:', message);
    }
};
//# sourceMappingURL=eventListener.js.map