import { requestFactory } from '../utils/requestFactory';
import { ethErrors } from 'eth-rpc-errors';
export const sendTransaction = ({ wepin, network }) => (req, res, next, end) => {
    if (!wepin._isInitialized) {
        end(ethErrors.provider.unauthorized());
        return;
    }
    const testingParam = Array.isArray(req.params) ? req.params[0] : req.params;
    let isError = false;
    Object.values(testingParam).forEach((value) => {
        if (value && !value.startsWith('0x')) {
            console.error(`${value} is not start with '0x'`);
            end(ethErrors.rpc.invalidParams());
            isError = true;
        }
    });
    if (!isError) {
        requestFactory({
            wepin,
            network,
            req,
            res,
            next,
            end,
            command: 'send_transaction',
            parameter: Object.assign({ account: {
                    address: req.params[0].from,
                    network,
                } }, req.params[0]),
        });
    }
};
//# sourceMappingURL=sendTransaction.js.map