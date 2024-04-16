import { Wepin } from "../wepin";
export type SupportedChains = 'evmeth-goerli' | 'klaytn' | 'ethereum' | 'klaytn-testnet' | 'evmpolygon' | 'evmsongbird' | 'evmtime-elizabeth' | 'evmeth-sepolia' | 'evmpolygon-amoy';
export interface CreateWepinMiddlewareOptions {
    wepin: Wepin;
    network?: SupportedChains;
}
