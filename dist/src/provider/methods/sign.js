import { requestFactory } from '../utils/requestFactory';
import { ethErrors } from 'eth-rpc-errors';
export const sign = ({ wepin, network, isPersonal, }) => (req, res, next, end) => {
    if (!wepin._isInitialized) {
        end(ethErrors.provider.unauthorized());
        return;
    }
    if (req.params.length !== 2) {
        end(ethErrors.rpc.invalidParams());
        return;
    }
    const parameter = {
        account: {
            network,
            address: isPersonal
                ? req.params[1]
                : req.params[0],
        },
        data: isPersonal
            ? req.params[0]
            : req.params[1],
    };
    requestFactory({
        wepin,
        network,
        req,
        res,
        next,
        end,
        command: 'sign',
        parameter,
    });
};
//# sourceMappingURL=sign.js.map