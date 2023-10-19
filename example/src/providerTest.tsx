import Wepin from "@wepin/react-native-sdk"
import { Dispatch } from "react"

export class providerTest {
    private static _instance: providerTest
    private wepin: Wepin
    public toAddress: string
    public toAmount: string
    public data: string
    public gasPrice: string
    public estimateGas: string
    public selectedAccount: string
    public prefix: string
    public suspectedNetwork: any
    public setResult: Dispatch<any>
    public setSelectedAccount: Dispatch<any>

    public static getInstance(wepin: Wepin) {
        if (this._instance) return this._instance
        this._instance = new providerTest(wepin)
        return this._instance
    }
    constructor(wepin: Wepin) {
        this.wepin = wepin
        this.toAddress = ''
        this.toAmount = ''
        this.data = ''
        this.gasPrice = ''
        this.estimateGas = ''
        this.selectedAccount = ''
        this.prefix = 'eth'
        this.setResult = (param: any) => { }
        this.setSelectedAccount = (param: any) => { }
    }

    public setConfig = (suspectedNetwork: any, setResult: Dispatch<any>, setSelectedAccount: Dispatch<any>) => {
        console.log('setConfig suspectedNetwork: ', suspectedNetwork)
        this.suspectedNetwork = suspectedNetwork
        // this.prefix = prefix
        if (
            suspectedNetwork?.toLowerCase() === 'klaytn' ||
            suspectedNetwork?.toLowerCase() === 'klaytn-testnet'
        ) {
            this.prefix = 'klay'
        } else {
            this.prefix = 'eth'
        }
        console.log('setConfig prefix: ', this.prefix)
        this.setResult = setResult
        this.setSelectedAccount = setSelectedAccount
    }

    public saveDataAndCall = (data: { toAddress: string, amount: string, gasPrice: string, gasLimit: string, data: string }, method: string) => {
        console.log('data: ', data)
        this.toAddress = data.toAddress
        this.toAmount = data.amount
        this.data = data.data
        this.gasPrice = data.gasPrice
        this.estimateGas = data.gasLimit
        console.log('this.toAddress: ', this.toAddress)
        console.log('this.toAmount: ', this.toAmount)
        console.log('this.data: ', this.data)
        console.log('this.gasPrice: ', this.gasPrice)
        console.log('this.estimateGas: ', this.estimateGas)

        switch (method) {
            case 'ethCall':
                this.ethCall()
                break
            case 'ethSign':
                this.ethSign()
                break
            case 'personalSign':
                this.personalSign()
                break
            case 'signTransaction':
                this.signTransaction()
                break
            case 'sendLegacyTransaction':
                this.sendLegacyTransaction()
                break
            case 'sendEIP1559Transaction':
                this.sendEIP1559Transaction()
                break
            case 'sendEIP2930Transaction':
                this.sendEIP2930Transaction()
                break
            default:
                return
        }
    }
    //////////////////////////////////////
    // Provider methods
    //////////////////////////////////////

    public getBlockNumber = async () => {
        try {
            // await getAccounts()
            console.log('getBlockNumber suspectedNetwork: ', this.suspectedNetwork)

            const provider = this.wepin.getProvider({
                network: this.suspectedNetwork,
            })
            console.log('getBlockNumber provider : ', provider)
            const providerResult = await provider.request({
                method: this.prefix + '_blockNumber',
                params: [],
            })
            console.log('setConfig providerResult: ', providerResult)
            this.setResult(providerResult)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }

    public getAccountsForProvider = async () => {
        try {
            // await getAccounts()
            const provider = this.wepin.getProvider({
                network: this.suspectedNetwork,
            })
            const res = await provider.request({
                method: this.prefix + '_accounts',
                params: [],
            })
            console.log('res', res)
            console.log('provider.selectedAddress', provider.selectedAddress)
            this.setResult(res)
            this.selectedAccount = provider.selectedAddress!
            this.setSelectedAccount(this.selectedAccount)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }

    public requestAccounts = async () => {
        try {
            const provider = this.wepin.getProvider({
                network: this.suspectedNetwork,
            })
            const res = await provider.request({
                method: this.prefix + '_requestAccounts',
                params: [],
            })
            this.setResult(res)
            this.selectedAccount = provider.selectedAddress!
            this.setSelectedAccount(this.selectedAccount)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }

    public getBalance = async () => {
        try {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            if (!this.selectedAccount) {
                this.setResult('Request account first.')
                return
            }
            const res = await provider.request({
                method: this.prefix + '_getBalance',
                params: [this.selectedAccount, 'latest'],
            })
            this.setResult(res)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }

    public getGasPrice = async () => {
        try {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            const res = await provider.request({
                method: this.prefix + '_gasPrice',
                params: [],
            })
            this.gasPrice = res as string
            this.setResult(this.gasPrice)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }

    public getEstimatedGas = async () => {
        try {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            const res = await provider.request({
                method: this.prefix + '_estimateGas',
                params: [
                    {
                        from: this.selectedAccount,
                        to: this.selectedAccount,
                        data: '0x',
                    },
                ],
            })
            this.estimateGas = (res as string)
            this.setResult(this.estimateGas)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }

    public signTransaction = async () => {
        try {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            const res = await provider.request({
                method: this.prefix + '_signTransaction',
                params: [
                    {
                        from: this.selectedAccount,
                        to: this.toAddress,
                        gas: this.estimateGas,
                        gasPrice: this.gasPrice,
                        value: this.toAmount,
                        data: this.data,
                    },
                ],
            })
            this.setResult(res)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }

    public sendLegacyTransaction = async () => {
        try {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            const res = await provider.request({
                method: this.prefix + '_sendTransaction',
                params: [
                    {
                        from: this.selectedAccount,
                        to: this.toAddress,
                        gas: this.estimateGas,
                        gasPrice: this.gasPrice,
                        value: this.toAmount,
                        data: this.data,
                    },
                ],
            })
            this.setResult(res)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }

    public sendEIP2930Transaction = async () => {
        try {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            const res = await provider.request({
                method: this.prefix + '_sendTransaction',
                params: [
                    {
                        from: this.selectedAccount,
                        to: this.toAddress,
                        gas: this.estimateGas,
                        gasPrice: this.gasPrice,
                        value: this.toAmount,
                        data: this.data,
                    },
                ],
            })
            this.setResult(res)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }

    public sendEIP1559Transaction = async () => {
        try {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            const res = await provider.request({
                method: this.prefix + '_sendTransaction',
                params: [
                    {
                        type: '0x2',
                        from: this.selectedAccount,
                        to: this.toAddress,
                        gasLimit: this.estimateGas,
                        value: this.toAmount,
                        data: this.data,
                        maxFeePerGas: '0x' + (2_000_000_000).toString(16),
                        maxPriorityFeePerGas: '0x' + (500_000_000).toString(16),
                        accessList: [
                            [
                                '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
                                [
                                    '0x0000000000000000000000000000000000000000000000000000000000000003',
                                    '0x0000000000000000000000000000000000000000000000000000000000000007',
                                ],
                            ],
                            ['0xbb9bc244d798123fde783fcc1c72d3bb8c189413', []],
                        ],
                    },
                ],
            })
            this.setResult(res)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }

    public ethCall = async () => {
        try {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            const res = await provider.request({
                method: this.prefix + '_call',
                params: [
                    {
                        from: this.selectedAccount,
                        to: this.toAddress,
                        gas: this.estimateGas,
                        gasPrice: this.gasPrice,
                        value: this.toAmount,
                        data: this.data,
                    },
                    'latest',
                ],
            })
            this.setResult(res)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }

    public ethSign = async () => {
        try {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            const res = await provider.request({
                method: this.prefix + '_sign',
                params: [this.selectedAccount, this.data],
            })
            this.setResult(res)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }

    public personalSign = async () => {
        try {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            const res = await provider.request({
                method: 'personal_sign',
                params: [this.data, this.selectedAccount],
            })
            this.setResult(res)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }
    /////////////////////////////////////////////
    private msgParamsV4 = JSON.stringify({
        domain: {
            // Defining the chain aka Rinkeby testnet or Ethereum Main Net
            chainId: 1,
            // Give a user friendly name to the specific contract you are signing for.
            name: 'Ether Mail',
            // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
            // Just let's you know the latest version. Definitely make sure the field name is correct.
            version: '1',
        },

        // Defining the message signing data content.
        message: {
            /*
               - Anything you want. Just a JSON Blob that encodes the data you want to send
               - No required fields
               - This is DApp Specific
               - Be as explicit as possible when building out the message schema.
              */
            contents: 'Hello, Bob!',
            attachedMoneyInEth: 4.2,
            from: {
                name: 'Cow',
                wallets: [
                    '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
                    '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
                ],
            },
            to: [
                {
                    name: 'Bossb',
                    wallets: [
                        '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                        '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                        '0xB0B0b0b0b0b0B000000000000000000000000000',
                    ],
                },
                {
                    name: 'Second',
                    wallets: [
                        '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                        '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                    ],
                },
            ],
        },
        // Refers to the keys of the *types* object below.
        primaryType: 'Mail',
        types: {
            // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
            // Not an EIP712Domain definition
            Group: [
                { name: 'name', type: 'string' },
                { name: 'members', type: 'Person[]' },
            ],
            // Refer to PrimaryType
            Mail: [
                { name: 'from', type: 'Person' },
                { name: 'to', type: 'Person[]' },
                { name: 'contents', type: 'string' },
            ],
            // Not an EIP712Domain definition
            Person: [
                { name: 'name', type: 'string' },
                { name: 'wallets', type: 'address[]' },
            ],
        },
    })

    private msgParamsV3 = JSON.stringify({
        types: {
            EIP712Domain: [
                {
                    name: 'name',
                    type: 'string',
                },
                {
                    name: 'version',
                    type: 'string',
                },
                {
                    name: 'chainId',
                    type: 'uint256',
                },
                {
                    name: 'verifyingContract',
                    type: 'address',
                },
            ],
            Person: [
                {
                    name: 'name',
                    type: 'string',
                },
                {
                    name: 'wallet',
                    type: 'address',
                },
            ],
            Mail: [
                {
                    name: 'from',
                    type: 'Person',
                },
                {
                    name: 'to',
                    type: 'Person',
                },
                {
                    name: 'contents',
                    type: 'string',
                },
            ],
        },
        primaryType: 'Mail',
        domain: {
            name: 'Ether Mail',
            version: '1',
            chainId: 1,
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        },
        message: {
            from: {
                name: 'Cow',
                wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            },
            to: {
                name: 'Bob',
                wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
            },
            contents: 'Hello, Bob!',
        },
    })

    private msgParamsV1 = JSON.stringify([
        {
            type: 'string',
            name: 'Message',
            value: 'Hi, Alice!',
        },
        {
            type: 'uint32',
            name: 'A number',
            value: '1337',
        },
    ])
    public signTypedDataV1 = async () => {
        try {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            const res = await provider.request({
                method: this.prefix + '_signTypedData_v1',
                params: [this.selectedAccount, this.msgParamsV1],
            })
            this.setResult(res)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }
    public signTypedDataV3 = async () => {
        try {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            const res = await provider.request({
                method: this.prefix + '_signTypedData_v3',
                params: [this.selectedAccount, this.msgParamsV3],
            })
            this.setResult(res)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }
    public signTypedDataV4 = async () => {
        try {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            const res = await provider.request({
                method: this.prefix + '_signTypedData_v4',
                params: [this.selectedAccount, this.msgParamsV4],
            })
            this.setResult(res)
        } catch (e: any) {
            console.log('error', e)
            if (e?.message) {
                this.setResult(`error-${e.message}`)
            } else {
                this.setResult('unknown error')
            }
        }
    }
}