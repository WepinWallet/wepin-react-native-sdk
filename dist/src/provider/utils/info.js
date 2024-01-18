import GatewayUrl from '../const/gatewayUrl';
import { isValidChainId } from './utils';
export const getNetworkInfoByName = (network) => {
    switch (network) {
        case 'ethereum':
            return {
                rpcUrl: GatewayUrl.Gateway + '/alchemy/eth',
                chainId: '0x' + (1).toString(16),
            };
        case 'evmeth-goerli':
            return {
                rpcUrl: GatewayUrl.Gateway + '/infura/goerli',
                chainId: '0x' + (5).toString(16),
            };
        case 'klaytn':
            return {
                rpcUrl: GatewayUrl.Gateway + '/klaytn/mainnet',
                chainId: '0x' + (8217).toString(16),
            };
        case 'klaytn-testnet':
            return {
                rpcUrl: GatewayUrl.Gateway + '/klaytn/testnet',
                chainId: '0x' + (1001).toString(16),
            };
        case 'evmsongbird':
            return {
                rpcUrl: GatewayUrl.Gateway + '/songbird/api-portal/mainnet',
                chainId: '0x' + (19).toString(16),
            };
        case 'evmpolygon':
            return {
                rpcUrl: GatewayUrl.Gateway + '/matic/alchemy/mainnet',
                chainId: '0x' + (137).toString(16),
            };
        case 'evmpolygon-testnet':
            return {
                rpcUrl: GatewayUrl.Gateway + '/matic/testnet',
                chainId: '0x' + (80001).toString(16),
            };
        case 'evmtime-elizabeth':
            return {
                rpcUrl: GatewayUrl.Gateway + '/timenetwork/testnet ',
                chainId: '0x' + (2731).toString(16),
            };
        case 'evmeth sepolia':
            return {
                rpcUrl: GatewayUrl.Gateway + '/sepolia/alchemy/testnet',
                chainId: '0x' + (11155111).toString(16),
            };
        default:
            throw new Error(`There is No network info about provided network : ${network}`);
    }
};
export const getNetworkByChainId = (chainId) => {
    if (!isValidChainId(chainId)) {
        throw new Error(`Invalid chain ID: ${chainId}`);
    }
    const chainIdMappings = {
        '0x1': 'ethereum',
        '0x5': 'evmeth-goerli',
        [`0x${(19).toString(16)}`]: 'evmsongbird',
        [`0x${(137).toString(16)}`]: 'evmpolygon',
        [`0x${(1001).toString(16)}`]: 'klaytn-testnet',
        [`0x${(8217).toString(16)}`]: 'klaytn',
        [`0x${(80001).toString(16)}`]: 'evmpolygon-testnet',
        [`0x${(2731).toString(16)}`]: 'evmtime-elizabeth',
        [`0x${(11155111).toString(16)}`]: 'evmeth sepolia',
    };
    return chainIdMappings[chainId];
};
//# sourceMappingURL=info.js.map