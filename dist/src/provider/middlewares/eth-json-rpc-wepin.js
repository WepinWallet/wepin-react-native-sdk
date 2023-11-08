import { createScaffoldMiddleware } from 'json-rpc-engine';
import { requestAccounts } from '../methods/requestAccounts';
import { signTransaction } from '../methods/signTransaction';
import { sendTransaction } from '../methods/sendTransaction';
import { signTypedData } from '../methods/signTypedData';
import { sign } from '../methods/sign';
import { switchEthereumChain } from '../methods/switchEthererumCahin';
export const createWepinEtherMiddleware = ({ wepin, network, }) => {
    return createScaffoldMiddleware({
        eth_requestAccounts: requestAccounts({ wepin, network }),
        eth_accounts: requestAccounts({ wepin, network }),
        eth_signTransaction: signTransaction({ wepin, network }),
        eth_sendTransaction: sendTransaction({ wepin, network }),
        eth_signTypedData_v1: signTypedData({ wepin, network, version: 'V1' }),
        eth_signTypedData_v3: signTypedData({ wepin, network, version: 'V3' }),
        eth_signTypedData_v4: signTypedData({ wepin, network, version: 'V4' }),
        eth_sign: sign({ wepin, network, isPersonal: false }),
        personal_sign: sign({ wepin, network, isPersonal: true }),
        wallet_switchEthereumChain: switchEthereumChain({ wepin, network }),
    });
};
//# sourceMappingURL=eth-json-rpc-wepin.js.map