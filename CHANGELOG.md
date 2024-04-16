## [Version 0.0.20-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.20-alpha) (2024-04-17)

#### New Features:

* Added `send` method for send transaction.

  * Added camera permission setting.
* New Network Support: Ethereum Sepolia

  * Added support for the Polygon Amoy testnet network with the following details:| Chain ID | Network Name | Network Variable |
    | -------- | ------------ | ---------------- |
    | 80002    | Polygon Amoy | evmpolygon-amoy  |

#### Updates:

* Modified Deep Link Scheme Value:

  * Previously: `package name` or `bundle id` + '.wepin'
  * Updated to: 'wepin.' + `wepin appid`
* Added exception handling in the `init` method.
* Renamed the evmeth sepolia to evmeth-sepolia.

  * Before: evmeth sepolia
  * After: evmeth-sepolia
* Removed the PolygonMumbai network

## [Version 0.0.19-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.19-alpha) (2024-01-18)

#### New Features:

* Implemented `loginWithExternalToken` method for external token login.
* **New Network Support: Ethereum Sepolia**
  * Added support for the Ethereum Sepolia testnet network with the following details:

| Chain ID  | Network Name     | Network Variable |
| --------- | ---------------- | ---------------- |
| 111555111 | Ethereum Sepolia | evmeth sepolia   |

## [Version 0.0.18-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.18-alpha) (2023-01-05)

#### Bug Fixes:

* Resolved nested issues in event emitter.

## [Version 0.0.17-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.17-alpha) (2023-12-26)

#### Bug Fixes:

* Resolved issue with in-app browser closing.

## [Version 0.0.16-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.16-alpha) (2023-12-18)

#### Updates:

* Added `login provider list` parameter to the `init` method.

## [Version 0.0.15-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.15-alpha) (2023-12-07)

#### Updates:

* Added logic to check login session status.

## [Version 0.0.14-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.14-alpha) (2023-11-28)

#### Updates:

* Added designated email login feature.

## [Version 0.0.13-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.13-alpha) (2023-11-21)

#### Updates:

* Renamed the anttime testnet to timenetwork-testnet.
  * Before: anttime-testnet
  * After: timenetwork-testnet

## [Version 0.0.12-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.12-alpha) (2023-11-17)

#### Updates:

* Opened external browser for email registration functionality.

## [Version 0.0.11-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.11-alpha) (2023-11-08)

#### Updates:

* Added support for the `wallet_switchEthereumChain` method within the provider functionality.

## [Version 0.0.10-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.10-alpha) (2023-11-03)

### Updates:

* Changed widget open method to dialog-based.

## [Version 0.0.9-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.9-alpha) (2023-10-30)

#### New Features:

* Added admin functionalities: `signWithEmailAndPassword`, `loginWithEmailAndPassword`, `register`, `getBalance`.

## [Version 0.0.8-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.8-alpha) (2023-10-19)

#### Bug Fixes:

* Resolved issues related to provider exceptions handling.

## [Version 0.0.7-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.7-alpha) (2023-10-11)

#### New Features:

* Added `getProvider` method within provider functionalities.

## [Version 0.0.6-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.6-alpha) (2023-09-15)

#### Updates:

* Separated SDK method init and login.

#### New Features:

* Added `getStatus` and `logout` methods.

## ~~[Version 0.0.5-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.5-alpha) (2023-09-15)~~ - deprecated

## ~~[Version 0.0.4-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.4-alpha) (2023-09-15)~~- deprecated

## [Version 0.0.3-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.3-alpha) (2023-09-01)

#### Updates:

* Changed minimum required React Native version.

  * before: 0.72.3
  * after: 0.71.8

## [Version 0.0.2-alpha](https://github.com/WepinWallet/wepin-react-native-sdk/releases/tag/v0.0.2-alpha) (2023-08-18)

#### Updates:

* Optimized package.json in sample App.
