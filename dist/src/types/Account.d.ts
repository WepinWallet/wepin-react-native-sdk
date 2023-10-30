export interface Account {
    address: string;
    network: string;
}
export interface DetailAccount {
    accountId: string;
    address: string;
    addressPath: string;
    coinId?: number;
    contract?: string;
    symbol: string;
    label: string;
    name: string;
    network: string;
    balance: string;
    decimals: number;
    iconUrl: string;
    ids: string;
    accountTokenId?: string;
    cmkId?: number;
}
