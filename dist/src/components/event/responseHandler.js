import LOG from '../../utils/log';
export const WebviewResponseHandler = (message, wepin) => {
    LOG.debug('Got Response from webview =>', message);
    wepin.queue.shift();
    wepin.emit(message.header.id.toString(), message);
};
//# sourceMappingURL=responseHandler.js.map