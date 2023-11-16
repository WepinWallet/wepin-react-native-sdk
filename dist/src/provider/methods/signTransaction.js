import { requestFactory } from '../utils/requestFactory';
import { ethErrors } from 'eth-rpc-errors';
export const signTransaction = ({ wepin, network }) => (req, res, next, end) => {
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
            return;
        }
    });
    if (!isError) {
        const parameter = Object.assign({ account: {
                address: req.params[0].from,
                network,
            } }, req.params[0]);
        requestFactory({
            wepin,
            network,
            req,
            res,
            next,
            end,
            command: 'sign_transaction',
            parameter,
        });
    }
};
//# sourceMappingURL=signTransaction.js.map