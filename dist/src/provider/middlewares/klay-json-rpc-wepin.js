import { createScaffoldMiddleware } from 'json-rpc-engine';
import { requestAccounts } from '../methods/requestAccounts';
import { signTransaction } from '../methods/signTransaction';
import { sendTransaction } from '../methods/sendTransaction';
import { signTypedData } from '../methods/signTypedData';
import { sign } from '../methods/sign';
import { switchEthereumChain } from '../methods/switchEthererumCahin';
export const createWepinKlayMiddleware = ({ wepin, network, }) => {
    return createScaffoldMiddleware({
        klay_requestAccounts: requestAccounts({ wepin, network }),
        klay_accounts: requestAccounts({ wepin, network }),
        klay_signTransaction: signTransaction({ wepin, network }),
        klay_sendTransaction: sendTransaction({ wepin, network }),
        klay_signTypedData_v1: signTypedData({ wepin, network, version: 'V1' }),
        klay_signTypedData_v3: signTypedData({ wepin, network, version: 'V3' }),
        klay_signTypedData_v4: signTypedData({ wepin, network, version: 'V4' }),
        klay_sign: sign({ wepin, network, isPersonal: false }),
        personal_sign: sign({ wepin, network, isPersonal: true }),
        eth_requestAccounts: requestAccounts({ wepin, network }),
        eth_accounts: requestAccounts({ wepin, network }),
        eth_signTransaction: signTransaction({ wepin, network }),
        eth_sendTransaction: sendTransaction({ wepin, network }),
        eth_signTypedData_v1: signTypedData({ wepin, network, version: 'V1' }),
        eth_signTypedData_v3: signTypedData({ wepin, network, version: 'V3' }),
        eth_signTypedData_v4: signTypedData({ wepin, network, version: 'V4' }),
        eth_sign: sign({ wepin, network, isPersonal: false }),
        wallet_switchEthereumChain: switchEthereumChain({ wepin, network }),
    });
};
//# sourceMappingURL=klay-json-rpc-wepin.js.map