import { ethErrors } from 'eth-rpc-errors';
export const makeRequestID = () => new Date().getTime();
export const requestFactory = ({ wepin, network, req, res, next, end, command, parameter, }) => {
    var _a;
    const id = makeRequestID();
    wepin.once(id.toString(), (message) => {
        if (message.body.data === 'User Cancel') {
            end(ethErrors.provider.userRejectedRequest());
        }
        res.result = message.body.data === 'User Cancel' ? '' : message.body.data;
        end();
    });
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
    wepin.queue.push(request);
    if (!((_a = wepin.Widget) === null || _a === void 0 ? void 0 : _a.isOpen)) {
        setTimeout(() => {
            wepin.openWidget();
        }, 100);
    }
};
//# sourceMappingURL=requestFactory.js.map