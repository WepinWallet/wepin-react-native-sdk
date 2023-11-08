import { requestFactory } from '../utils/requestFactory';
import { ethErrors } from 'eth-rpc-errors';
import { isValidChainId } from '../utils/utils';
import { getNetworkByChainId } from '../utils/info';
export const switchEthereumChain = ({ wepin, network }) => (req, res, next, end) => {
    if (!wepin._isInitialized) {
        end(ethErrors.provider.unauthorized());
    }
    const testingParam = Array.isArray(req.params) ? req.params[0] : req.params;
    if (!(testingParam === null || testingParam === void 0 ? void 0 : testingParam.chainId) || !(testingParam === null || testingParam === void 0 ? void 0 : testingParam.chainId.startsWith('0x'))) {
        end(ethErrors.rpc.invalidParams());
    }
    if (!isValidChainId(testingParam.chainId)) {
        return end(ethErrors.rpc.invalidParams());
    }
    const parameter = Object.assign({ account: {
            address: window.evmproviders.Wepin.selectedAddress,
            network,
        }, toNetwork: getNetworkByChainId(testingParam.chainId) }, req.params[0]);
    requestFactory({
        wepin,
        network,
        req,
        res,
        next,
        end,
        command: 'wallet_switchEthereumChain',
        parameter,
    });
};
//# sourceMappingURL=switchEthererumCahin.js.map