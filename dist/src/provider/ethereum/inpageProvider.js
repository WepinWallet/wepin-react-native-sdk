import { BaseProvider } from '../BaseProvider';
import { createWepinMiddleware } from '../middlewares/eth-json-rpc-wepin';
import { createFetchMiddlewareEther } from '../json-rpc/eth-json-rpc';
import { getNetworkInfoByName } from '../utils/info';
import LOG from '../../utils/log';
export default class InpageProvider extends BaseProvider {
    constructor({ network, wepin, }) {
        const wepinMiddleware = createWepinMiddleware({ wepin, network });
        const { rpcUrl, chainId } = getNetworkInfoByName(network);
        const evmRPCMiddleware = createFetchMiddlewareEther({
            rpcUrl,
        });
        super({ rpcMiddleware: [wepinMiddleware, evmRPCMiddleware] });
        this._initializeState({
            accounts: [],
            chainId,
        });
    }
    static generate(params) {
        const provider = new InpageProvider(params);
        LOG.debug('generate provider', provider);
        if (window) {
            window.evmproviders = window.evmproviders || {};
            window.evmproviders[provider.name] = provider;
        }
        return provider;
    }
}
//# sourceMappingURL=inpageProvider.js.map