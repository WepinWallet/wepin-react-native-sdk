import { ethErrors } from 'eth-rpc-errors';
import LOG from '../../utils/log';
import { closeWidgetAndClearWebview } from '../../utils/commmonWidget';
export const makeRequestID = () => new Date().getTime();
export const requestFactory = ({ wepin, network, req, res, next, end, command, parameter, }) => {
    var _a, _b, _c, _d;
    const id = makeRequestID();
    wepin.once(id.toString(), (message) => {
        if (message.body.data === 'User Cancel') {
            closeAndEnd(ethErrors.provider.userRejectedRequest());
        }
        res.result = message.body.data === 'User Cancel' ? '' : message.body.data;
        if (message.body.command === 'wallet_switchEthereumChain') {
            const lowerCasedNetworkStr = res.result.network.toLowerCase();
            res.result.wepin = wepin;
        }
        closeAndEnd();
    });
    const closeAndEnd = (param) => {
        try {
            closeWidgetAndClearWebview(wepin, wepin.Widget);
            end(param);
        }
        catch (e) {
            end(e);
        }
    };
    const request = {
        header: {
            request_from: 'react-native',
            request_to: 'wepin_widget',
            id,
        },
        body: {
            command,
            parameter,
        },
    };
    (_a = wepin.queue) === null || _a === void 0 ? void 0 : _a.push(request);
    LOG.debug('wepin.Widget: ', wepin.Widget);
    LOG.debug('wepin.Widget?.props.visible: ', (_b = wepin.Widget) === null || _b === void 0 ? void 0 : _b.props.visible);
    if (!((_c = wepin.Widget) === null || _c === void 0 ? void 0 : _c.props.visible)) {
        try {
            LOG.debug('wepin.openWidget', wepin.openWidget);
            wepin.openWidget().catch((e) => {
                var _a;
                LOG.debug('wepin open error: ', e);
                (_a = wepin.queue) === null || _a === void 0 ? void 0 : _a.pop();
                end(e);
            });
        }
        catch (e) {
            LOG.debug('wepin open error: ', e);
            (_d = wepin.queue) === null || _d === void 0 ? void 0 : _d.pop();
            end(e);
        }
    }
};
//# sourceMappingURL=requestFactory.js.map