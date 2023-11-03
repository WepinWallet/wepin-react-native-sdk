import LOG from '../../utils/log';
export const WebviewResponseHandler = (message, wepin) => {
    var _a;
    LOG.debug('Got Response from webview =>', message);
    (_a = wepin.queue) === null || _a === void 0 ? void 0 : _a.shift();
    wepin.emit(message.header.id.toString(), message);
};
//# sourceMappingURL=responseHandler.js.map