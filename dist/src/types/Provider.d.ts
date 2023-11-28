import { Wepin } from "../wepin";
export type SupportedChains = 'evmeth-goerli' | 'klaytn' | 'ethereum' | 'klaytn-testnet' | 'evmpolygon' | 'evmpolygon-testnet' | 'evmsongbird' | 'evmtime-elizabeth';
export interface CreateWepinMiddlewareOptions {
    wepin: Wepin;
    network?: SupportedChains;
}
