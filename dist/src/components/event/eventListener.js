import LOG from '../../utils/log';
import { WebviewRequestHandler } from './requestHandler';
import { WebviewResponseHandler } from './responseHandler';
export const getEventListener = (widget) => {
    const isValidEvent = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (!Object.prototype.hasOwnProperty.call(data, 'header')) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(data, 'body')) {
            return false;
        }
        return true;
    };
    return (event) => {
        if (!isValidEvent(event)) {
            return;
        }
        const data = JSON.parse(event.nativeEvent.data);
        handleMessage(data, widget);
    };
};
const handleMessage = (message, widget) => {
    if (message.header.request_to === 'react-native') {
        WebviewRequestHandler(message, widget);
    }
    else if (message.header.response_to === 'react-native') {
        WebviewResponseHandler(message, widget.props.config.wepin);
    }
    else {
        LOG.error('Failed to handle message:', message);
    }
};
//# sourceMappingURL=eventListener.js.map