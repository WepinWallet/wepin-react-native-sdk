import { requestFactory } from '../utils/requestFactory';
import { ethErrors } from 'eth-rpc-errors';
export const requestAccounts = ({ wepin, network }) => (req, res, next, end) => {
    var _a, _b;
    if (!wepin._isInitialized) {
        end(ethErrors.provider.unauthorized());
    }
    const parameter = {
        network,
    };
    const { evmproviders } = window;
    if ((_a = evmproviders === null || evmproviders === void 0 ? void 0 : evmproviders.Wepin) === null || _a === void 0 ? void 0 : _a.selectedAddress) {
        res.result = [(_b = evmproviders === null || evmproviders === void 0 ? void 0 : evmproviders.Wepin) === null || _b === void 0 ? void 0 : _b.selectedAddress];
        end();
    }
    else {
        requestFactory({
            wepin,
            network,
            req,
            res,
            next,
            end,
            command: 'request_enable',
            parameter,
        });
    }
};
//# sourceMappingURL=requestAccounts.js.map