import { requestFactory } from '../utils/requestFactory';
import { ethErrors } from 'eth-rpc-errors';
export const signTypedData = ({ wepin, network, version, }) => (req, res, next, end) => {
    if (!wepin._isInitialized) {
        end(ethErrors.provider.unauthorized());
    }
    if (req.params.length !== 2) {
        end(ethErrors.rpc.invalidParams());
    }
    const parameter = {
        account: {
            network,
            address: req.params[0],
        },
        data: req.params[1],
        version,
    };
    requestFactory({
        wepin,
        network,
        req,
        res,
        next,
        end,
        command: 'sign_typed_data',
        parameter,
    });
};
//# sourceMappingURL=signTypedData.js.map