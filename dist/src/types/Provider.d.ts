import { Wepin } from "../wepin";
export type SupportedChains = 'evmeth-goerli' | 'klaytn' | 'ethereum' | 'klaytn-testnet' | 'evmpolygon' | 'evmpolygon-testnet' | 'evmsongbird' | 'evmanttime-testnet';
export interface CreateWepinMiddlewareOptions {
    wepin: Wepin;
    network?: SupportedChains;
}
