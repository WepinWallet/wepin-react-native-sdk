"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebviewResponseHandler = void 0;
var log_1 = __importDefault(require("../../utils/log"));
var WebviewResponseHandler = function (message, wepin) {
    log_1.default.debug('Got Response from webview =>', message);
    wepin.queue.shift();
};
exports.WebviewResponseHandler = WebviewResponseHandler;
//# sourceMappingURL=responseHandler.js.map