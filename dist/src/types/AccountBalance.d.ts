export interface IAccountBalance {
    symbol: string;
    balance: string;
    tokens: ITokenBalance[];
}
export interface ITokenBalance {
    name: string;
    contract: string;
    symbol: string;
    balance: string;
}
