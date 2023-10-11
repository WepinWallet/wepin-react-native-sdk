export const getNetworkInfoByName = (network) => {
    switch (network) {
        case 'ethereum':
            return {
                rpcUrl: 'https://mainnet.infura.io/v3/69e7888727b84a5ab6a06cac0294ff6b',
                chainId: '0x' + (1).toString(16),
            };
        case 'evmeth-goerli':
            return {
                rpcUrl: 'https://goerli.infura.io/v3/69e7888727b84a5ab6a06cac0294ff6b',
                chainId: '0x' + (5).toString(16),
            };
        case 'klaytn':
            return {
                rpcUrl: 'https://gateway-v2.dcentwallet.com/klaytn/mainnet',
                chainId: '0x' + (8217).toString(16),
            };
        case 'klaytn-testnet':
            return {
                rpcUrl: 'https://gateway-v2.dcentwallet.com/klaytn/testnet',
                chainId: '0x' + (1001).toString(16),
            };
        case 'evmsongbird':
            return {
                rpcUrl: 'https://songbird-api.flare.network/ext/C/rpc',
                chainId: '0x' + (19).toString(16),
            };
        case 'evmpolygon':
            return {
                rpcUrl: 'https://polygon-rpc.com',
                chainId: '0x' + (137).toString(16),
            };
        case 'evmpolygon-testnet':
            return {
                rpcUrl: 'https://gateway-v2.dcentwallet.com/matic/testnet',
                chainId: '0x' + (80001).toString(16),
            };
        case 'evmanttime-testnet':
            return {
                rpcUrl: 'https://testnet-rpc.timenetwork.io',
                chainId: '0x' + (2731).toString(16),
            };
        default:
            throw new Error(`There is No network info about provided network : ${network}`);
    }
};
//# sourceMappingURL=info.js.map