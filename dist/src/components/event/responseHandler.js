import LOG from '../../utils/log';
export const WebviewResponseHandler = (message, wepin) => {
    LOG.debug('Got Response from webview =>', message);
    wepin.queue.shift();
};
//# sourceMappingURL=responseHandler.js.map