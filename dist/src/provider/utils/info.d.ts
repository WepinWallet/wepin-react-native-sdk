import { SupportedChains } from '../../types/Provider';
export interface NetworkInformation {
    rpcUrl: string;
    chainId: string;
}
export declare const getNetworkInfoByName: (network: SupportedChains) => NetworkInformation;
export declare const getNetworkByChainId: (chainId: unknown) => string;
