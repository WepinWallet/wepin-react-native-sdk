import Wepin from "@wepin/react-native-sdk"
import { Dispatch } from "react"

// https://docs.ethers.org/v5/cookbook/react-native/#cookbook-reactnative-shims
// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"
// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"
// Import the ethers library
import { ethers } from "ethers"

// with rn-nodeify
import Web3 from 'web3'

export class web3Test {
    private static _instance: web3Test
    private wepin: Wepin
    public toAddress: string
    public toAmount: string
    public data: string
    public gasPrice: string
    public estimateGas: string
    public selectedAccount: string
    public fromAddress: string
    public suspectedNetwork: any
    public setResult: Dispatch<any>
    public setSelectedAddress: Dispatch<any>

    public static getInstance(wepin: Wepin) {
        if (this._instance) return this._instance
        this._instance = new web3Test(wepin)
        return this._instance
    }
    constructor(wepin: Wepin) {
        this.wepin = wepin
        this.toAddress = ''
        this.toAmount = '0x0'
        this.data = ''
        this.gasPrice = '0x0'
        this.estimateGas = '0x0'
        this.selectedAccount = ''
        this.fromAddress = ''
        this.setResult = (param: any) => { }
        this.setSelectedAddress = (param: any) => { }
    }

    public setConfig = (suspectedNetwork: any, setResult: Dispatch<any>, setSelectedAddress: Dispatch<any>) => {
        console.log('setConfig suspectedNetwork: ', suspectedNetwork)
        this.suspectedNetwork = suspectedNetwork
        this.setResult = setResult
        this.setSelectedAddress = setSelectedAddress
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
            case 'web3_call':
                this.web3_call()
                break
            case 'web3_sendTransaction':
                this.web3_sendTransaction()
                break
            default:
                return
        }
    }
    //////////////////////////////////////
    // Web3 methods
    //////////////////////////////////////

    public web3: ethers.providers.Web3Provider | Web3 | undefined

    public initializeWeb3 = async () => {
        // accountList.value = await Wepin.getAccounts()
        console.log('suspectedNetwork', this.suspectedNetwork)
        if (this.suspectedNetwork) {
            const provider = this.wepin.getProvider({ network: this.suspectedNetwork })
            console.log('provider', provider)
            // console.log('web3', web3)
            let web3Provider
            if (this.suspectedNetwork.includes('klaytn')) {
                web3Provider = new Web3(provider)
            } else {
                web3Provider = new ethers.providers.Web3Provider(provider)
            }
            console.log('web3Provider', web3Provider)

            this.web3 = web3Provider
            this.setResult('Web3 initialized')
        }
    }

    public web3_getAccounts = async () => {
        let result
        if (this.web3 instanceof Web3) {
            const address = await this.web3.eth.getAccounts()
            result = address[0]
        } else {
            const signer = this.web3?.getSigner()
            result = await signer?.getAddress()
        }

        this.setResult(result)
        this.setSelectedAddress(result!)
        // setWeb3From(selectedAddress)
        this.fromAddress = result!
        this.toAddress = result!
    }
    public web3_getBalance = async () => {
        let result
        console.log('Web3 get balance from ', this.fromAddress)
        if (this.web3 instanceof Web3) {
            result = await this.web3.eth.getBalance(this.fromAddress)
        } else {
            result = await this.web3?.getBalance(
                this.fromAddress!.toLowerCase()
            )
        }

        this.setResult(result?.toString())
    }
    public web3_estimateGas = async () => {
        try {
            // if (!this.toAddress) {
            //     this.setResult(`'to address' is required.`)
            //     return
            // }
            let result
            if (this.web3 instanceof Web3) {
                result = await this.web3.eth.estimateGas({ to: this.toAddress })
            } else {
                result = await this.web3?.estimateGas({
                    to: this.toAddress
                })
            }
            this.setResult(result?.toString())
        } catch (error: any) {
            console.error('error', error)
            // this.setResult(error)
        }
    }
    public web3_sendTransaction = async () => {
        if (this.web3 instanceof Web3) {
            const res = await this.web3.eth.sendTransaction({ from: this.fromAddress, to: this.toAddress, gasPrice: this.gasPrice, gas: this.estimateGas, value: this.toAmount, data: this.data })
            this.setResult(JSON.stringify(res))
        } else {
            const signer = this.web3?.getSigner()
            const res = await signer?.sendTransaction({ from: this.fromAddress, to: this.toAddress, gasPrice: this.gasPrice, gasLimit: this.estimateGas, value: this.toAmount, data: this.data })
            this.setResult(JSON.stringify(res))
        }

    }
    public web3_getGasPrice = async () => {
        if (this.web3 instanceof Web3) {
            const res = await this.web3.eth.getGasPrice()
            this.setResult(res)
        } else {
            const res = await this.web3?.getGasPrice()
            this.setResult(res?.toString())
        }
    }
    public web3_call = async () => {
        if (this.web3 instanceof Web3) {
            const res = await this.web3.eth.call({ from: this.fromAddress, to: this.toAddress, gasPrice: this.gasPrice, gas: this.estimateGas, value: this.toAmount, data: this.data })
            this.setResult(res)
        } else {
            const res = await this.web3?.call({ from: this.fromAddress, to: this.toAddress, gasPrice: this.gasPrice, gasLimit: this.estimateGas, value: this.toAmount, data: this.data })
            this.setResult(res)
        }
    }
}