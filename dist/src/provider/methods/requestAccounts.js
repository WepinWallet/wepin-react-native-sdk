import { requestFactory } from '../utils/requestFactory';
import { ethErrors } from 'eth-rpc-errors';
export const requestAccounts = ({ wepin, network }) => (req, res, next, end) => {
    if (!wepin._isInitialized) {
        end(ethErrors.provider.unauthorized());
    }
    const parameter = {
        network,
    };
    {
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