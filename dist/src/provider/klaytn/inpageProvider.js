import { BaseProvider } from '../BaseProvider';
import { createWepinMiddleware } from '../middlewares/klay-json-rpc-wepin';
import { createFetchMiddlewareEther } from '../json-rpc/eth-json-rpc';
import { getNetworkInfoByName } from '../utils/info';
export default class InpageProvider extends BaseProvider {
    constructor({ network, wepin, }) {
        const wepinMiddleware = createWepinMiddleware({ wepin, network });
        const { rpcUrl, chainId } = getNetworkInfoByName(network);
        const klaytnRPCMiddleware = createFetchMiddlewareEther({
            rpcUrl,
        });
        super({
            rpcMiddleware: [wepinMiddleware, klaytnRPCMiddleware],
        });
        this._initializeState({
            accounts: [],
            chainId,
        });
    }
    static generate(params) {
        const provider = new InpageProvider(params);
        if (window) {
            window.evmproviders = window.evmproviders || {};
            window.evmproviders[provider.name] = provider;
        }
        return provider;
    }
}
//# sourceMappingURL=inpageProvider.js.map