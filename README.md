# @wepin/react-native-sdk

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/WepinWallet/wepin-react-native-sdk/blob/main/LICENSE)  [![npm version](https://img.shields.io/npm/v/@wepin/react-native-sdk?style=for-the-badge)](https://www.npmjs.org/package/@wepin/react-native-sdk). [![npm downloads](https://img.shields.io/npm/dt/@wepin/react-native-sdk.svg?label=downloads&style=for-the-badge)](https://www.npmjs.org/package/@wepin/react-native-sdk)

[![platform - android](https://img.shields.io/badge/platform-Android-3ddc84.svg?logo=android&style=for-the-badge)](https://www.android.com/)  [![platform - ios](https://img.shields.io/badge/platform-iOS-000.svg?logo=apple&style=for-the-badge)](https://developer.apple.com/ios/)

Wepin React-Native SDK for Android OS and iOS

## ⏩ Get App ID and Key

Contact to wepin.contact@iotrust.kr

## ⏩ Install

### wepin react native sdk

```bash
npm install @wepin/react-native-sdk
```

or

```bash
yarn add @wepin/react-native-sdk
```

### peerDependencies

```bash
npm install react-native-device-info
npm install react-native-inappbrowser-reborn
npm install react-native-webview
npm install react-native-encrypted-storage
npm install react-native-permissions
npm install @react-native-clipboard/clipboard

# for ios
cd ios
pod install
```

or

```bash
yarn add react-native-device-info
yarn add react-native-inappbrowser-reborn
yarn add react-native-webview
yarn add react-native-encrypted-storage
yarn add react-native-permissions
yarn add @react-native-clipboard/clipboard

# for ios
cd ios
pod install
```

### Additional Installation (Version `0.0.7-alpha` and above)

To enable the web3 provider functionality in the React Native environment, you need to install and configure the rn-nodeify module.

- Install the `rn-nodeify` module in your devDependencies.

  ```bash
  npm install --save-dev rn-nodeify
  ```

  or

  ```bash
  yarn add --dev rn-nodeify
  ```
- Add the following `rn-nodeify` command to your project's `package.json` file as a `postinstall` script:

  ```json
  "scripts": {
    	...,
  	"postinstall": "rn-nodeify --install fs,crypto,https,http,stream,path,zlib,assert --hack",
  	...
  }
  ```
- After running the `postinstall` script, import the generated `shim.js` file in the root file of your application as follows:

  ```javascript
  import './shim'
  ```

## ⏩ Config Deep Link

Deep link scheme format: 'wepin.' + Your wepin app id

> ‼️ Notice of Change: Deep Link Scheme Value (From SDK Version 0.0.20-alpha) ‼️
> For developers using SDK version 0.0.20 and above, please note that the structure of the Deep Link Scheme value has been updated.
>
> * Before: `pakage name` or `bundle id` + '.wepin'
> * After: 'wepin.' + `wepin appid`
>
> This change is essential for the proper functioning of the Wepin widget. Please ensure to apply the new scheme value for the correct operation of the Wepin widget.

### For Android

Add the below line in your app's `AndroidMainfest.xml` file

```xml
<activity
	android:name=".MainActivity"
	....
>
	....
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="wepin.WEPIN_APP_ID" /> <!-- 'wepin.' + app id of your wepin app -->
        </intent-filter>
      </activity>
```

### For iOS

Add the below line in your ios app's `AppDelegate.mm` file

```objectivec
#import <React/RCTLinkingManager.h>

...

// above @end
- (BOOL)application:(UIApplication *)application
  openURL:(nonnull NSURL *)url options:(nonnull NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options: options];
}

```

Add the URL scheme as below:

1. Open your iOS project with the xcode
2. Click on Project Navigator
3. Select Target Project in Targets
4. Select Info Tab
5. Click the '+' buttons on URL Types
6. Enter Identifier and URL Schemes
   - Idenetifier: bundle id of your project
   - URL Schems: 'wepin.' + your Wepin app id

![image](./assets/ios-setup-image.png)

## ⏩ Add Permssion (Version `0.0.20-alpha` and above)

To use this SDK, camera access permission is required. The camera function is essential for recognizing addresses in QR code format. [Reference: [react-native-permission](https://github.com/zoontek/react-native-permissions)]

### For Android

Add the below line in your app's `AndroidMainfest.xml` file

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
	<uses-permission android:name="android.permission.CAMERA" />
	<!-- ... -->
<mainfest>
```

### For iOS

1. By default, no permissions are setuped. So first, require the `setup` script in your `Podfile`:

```diff
# with react-native >= 0.72
- # Resolve react_native_pods.rb with node to allow for hoisting
- require Pod::Executable.execute_command('node', ['-p',
-   'require.resolve(
-     "react-native/scripts/react_native_pods.rb",
-     {paths: [process.argv[1]]},
-   )', __dir__]).strip
+ def node_require(script)
+   # Resolve script with node to allow for hoisting
+   require Pod::Executable.execute_command('node', ['-p',
+     "require.resolve(
+       '#{script}',
+       {paths: [process.argv[1]]},
+     )", __dir__]).strip
+ end
+ node_require('react-native/scripts/react_native_pods.rb')
+ node_require('react-native-permissions/scripts/setup.rb')
```

```diff
# with react-native < 0.72
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'
+ require_relative '../node_modules/react-native-permissions/scripts/setup'
```

2. Then in the same file, add a `setup_permissions` call with the wanted permissions:

```ruby
# …
platform :ios, min_ios_version_supported
prepare_react_native_project!
# ⬇️ uncomment wanted permissions
setup_permissions([
  'Camera',
])
# …
```

3. Then execute `pod install` _(📌  Note that it must be re-executed each time you update this config)_.
4. Finally, update your `Info.plist` with the wanted permissions usage descriptions:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <!-- 🚨 Keep only the permissions used in your app 🚨 -->
  <key>NSCameraUsageDescription</key>
  <string>YOUR TEXT</string>
  <!-- … -->
</dict>
</plist>
```

## ⏩ Import SDK

```javascript
import Wepin from '@wepin/react-native-sdk
const wepin = Wepin.getInstance()
```

Add a `<Wepin.WidgetView>` component within the main compenent and nest its content inside of it:

```typescript
function App(): JSX.Element {
    ....
  return (
    <Wepin.WidgetView>
  	  ...
    </Wepin.WidgetView>
  )
}
```

## ⏩ Initialize

Methods about initializing Wepin SDK

### init

```javascript
await wepin.init(appId, appSdkKey[, attributes])
```

#### Parameters

- `appId` \<string>
- `appKey` \<string>
- `attributes` \<IAttributes> _optional_
  - Type of `attributes` is assigned at [`@wepin/types`](https://github.com/WepinWallet/wepin-js-sdk-types) as `IAttributes`
    - type: The type of display of widget as wepin is initiated (defalut: 'hide)
      - 'hide' | 'show'
    - defaultLanguage: The language to be displayed on the widget (default: 'ko')
      - Currently, only 'ko' and 'en' are supported.
    - defaultCurrency: The currency to be displayed on the widget (default: 'KRW')
    - loginProviders: An array of login providers to configure the widget. (If not provided, all available login providers will be displayed on the widget.)
      - The `loginProviders` parameter accepts values defined in the `LoginProviders` of `@wepin/types `, starting from version `v0.0.11`.

#### Example

```javascript
await wepin.init('APPID', 'APPKEY', {
  type: 'hide',
  defaultLanguage: 'en',
  defaultCurrency: 'USD',
  loginProviders: ['google', 'apple'],
})
```

### isInitialized

```javascript
wepin.isInitialized()
```

The `isInitialized()` method checks Wepin SDK is initialized.

#### Return value

- \<boolean>
  - `true` if Wepin SDK is already initialized.

## ⏩ Methods

Methods can be used after initialization of Wepin SDK.

### openWidget

```javascript
await wepin.openWidget()
```

The `openWidget()` method shows Wepin widget. If a user is not logged in, Wepin widget will show login page.

#### Return value

- `Promise` \<void>

### closeWidget

```javascript
await wepin.closeWidget()
```

The `closeWidget()` method closes Wepin widget.

#### Return value

- `Promise` \<void>

### getAccounts

```javascript
await wepin.getAccounts()
await wepin.getAccounts(networks)
```

The `getAccounts()` method returns user accounts. If user is not logged in, Wepin widget will be opened and show login page. It is recommended to use `getAccounts()` method without argument to get all user accounts.

#### Parameters

- `networks` \<Array> _optional_
  - `network` \<string> _optional_

#### Example

```javascript
const accounts = await wepin.getAccounts(['Ethereum'])
```

#### Return value

- `Promise` \<Array>
  - If user is logged in, it returns a `Promise` object resolved with array of `account` of networks.
    - Type of `account` is assigned at [`@wepin/types`](https://github.com/WepinWallet/wepin-js-sdk-types) as `IAccount`
    - `account` \<Object>
      - `address` \<string>
      - `network` \<string>
  - If networks aren't passed, it returns a `Promise` object resolved with array of `account` of all networks.
  - Example
    ```javascript
    ;[
      {
        address: '0x0000001111112222223333334444445555556666',
        network: 'Ethereum',
      },
    ]
    ```
- `Promise` \<void>
  - If user is not logged in, it returns `Promise` \<void>.

### getStatus (Support from version `0.0.6-alpha`)

```javascript
wepin.getStatus()
```

The `getStatus()` method returns lifecycle of wepin.

#### Example

```javascript
var status = wepin.getStatus()
```

#### Return value

- \<WepinLifeCycle>
  - The `WepinLifeCycle` is defined at [`@wepin/types`](https://github.com/WepinWallet/wepin-js-sdk-types) as (Support from version `0.0.7`)
    - `not_initialized`: if wepin is not initialized
    - `initializing`: if wepin is initializing
    - `initialized`: if wepin is initialized
    - `before_login`: if wepin is initialized but the user is not logged in
    - `login`: if the user is logged in

### login(Support from version `0.0.6-alpha`)

```javascript
await wepin.login()
```

The `login()` method returns information of the logged-in user. If a user is not logged in, Wepin widget will show login page.

#### Parameters(Support from version `0.0.14-alpha`)

- `email` \<string> _optional_
  - The `email` parameter allows users to log in using the specified email address, providing access to the login service.

#### Example

```javascript
var userInfo = await wepin.login()
// Use specified Email
var userInfo = await wepin.login('wepin@wepin.io')
```

#### Return value

- `Promise` \<IWepinUser>

  - Type of `IWepinUser` is defined in [`@wepin/types`](https://github.com/WepinWallet/wepin-js-sdk-types) (Support from version `0.0.7`)

    - `status` \<'success'|'fail'>
    - `userInfo` \<object> _optional_
      - `userId` \<string>
      - `email` \<string>
      - `provider` \<'google'|'apple'|'email'|'naver'|'discord'|'external_token'>
  - Example

    ```js
    {
    	status: 'success',
    	userInfo: {
    		userID: '123455',
    		email: 'abc@test.com',
    		provider: 'google'
            }
    }
    ```

### logout (Support from version `0.0.6-alpha`)

```javascript
await wepin.logout()
```

The `logout()` method performs a wepin logout .

#### Return value

- `Promise` \<void>

Example

```javascript
await wepin.logout()
```

### signUpWithEmailAndPassword (Support from version `0.0.9-alpha`)

It signs up on the wepin with your email and password.

```javascript
wepin.signUpWithEmailAndPassword(email, password)
```

#### Parameters

- `email` \<string> - User email
- `password` \<string> - User password

#### Return value

- `Promise` \<boolean>

  - Returns true if the signup is successful.

#### Exception message

- [Admin Error Message](#admin-error-message)

#### Example

```javascript
const result = await wepin.signUpWithEmailAndPassword('test@test.com', 'abcd12345')
```

### loginWithEmailAndPassword(Support from version `0.0.9-alpha`)

It logs in to the Wepin with your email and password.

```javascript
wepin.loginWithEmailAndPassword(email, password)
```

#### Parameters

- `email` \<string> - User email
- `password` \<string> - User password

#### Return value

- `Promise` \<IWepinUser>

  - Type of `IWepinUser` is defined in [`@wepin/types`](https://github.com/WepinWallet/wepin-js-sdk-types) (Support from version `0.0.8`)

    - `status` \<'success'|'fail'>
    - `userInfo` \<object> _optional_
      - `userId` \<string>
      - `email` \<string>
      - `provider` \<'email'>
  - Example

    ```js
    {
    	status: 'success',
    	userInfo: {
    		userID: '123455',
    		email: 'test@test.com',
    		provider: 'email'
            }
    }
    ```

#### Exception message

- [Admin Error Message](#admin-error-message)
  - `require/wepin-register` : If this error occurs, you have to perform the `wepin.register(pin)` method.

#### Example

```javascript
const result = await wepin.loginWithEmailAndPassword('test@test.com', 'abcd12345')
```

### register(Support from version `0.0.9-alpha`)

It registers in the Wepin with a wallet pin.

After the signup and login are completed, the Wepin service registration (wallet and account creation) will proceed.

```javascript
wepin.register(pin)
```

#### Parameters

- `pin` \<string> - Wallet PIN

#### Return value

- `Promise` \<boolean>

  - Returns true if the registeration is successful.
  - After register success, the `wepin.login(email, password)` method have to be performed again.

#### Exception message

- [Admin Error Message](#admin-error-message)

#### Example

```javascript
const result = await wepin.register('123456')
```

### getBalance(Support from version `0.0.9-alpha`)

It returns the account's balance information. It can be only usable after widget login.

```javascript
wepin.getBalance(account)
```

#### Parameters

- `account` \<`IAccount`> - Object specifying the account details.
  - Type of `IAccount` is defined in [`@wepin/types`](https://github.com/WepinWallet/wepin-js-sdk-types)

#### Return value

- `Promise` \<`IAccountBalance`>

  - Type of `IAccountBalance` and `ITokenBalance` is defined in [`@wepin/types`](https://github.com/WepinWallet/wepin-js-sdk-types) (Support from version `0.0.8`)

    - `symbol` \<string> - symbol of account
    - `balance` \<string> - balance of account
    - `tokens` \<Array<`ITokenBalance`>> - token balance information for account
      - `name` \<string> - token name
      - `contract` \<string> - token contract address
      - `symbol` \<string> - token symbol
      - `balance` \<string> - token balance
  - Example

    ```js
    {
    	symbol: 'ETH',
            balance: '1.1',
    	tokens:[
    		{
    			name: 'test',
    			contract: '0x123...213',
    			symbol: 'TEST',
    			balance: '10'
    		},
    	]
    }
    ```

#### Exception message

- [Admin Error Message](#admin-error-message)

#### Example

```javascript
const result = wepin.getBalance({
  address: '0x0000001111112222223333334444445555556666',
  network: 'Ethereum',
})
```

### **loginWithExternalToken**(Support from **version** `0.0.19-alpha`)

```javascript
await wepin.loginWithExternalToken(token, sign, withUI?)
```

It logs in to the Wepin with external token(e.g., idToken). The **`loginWithExternalToken()`** method returns information of the logged-in user.

If the user is not registered on Wepin, and the **`withUI`** value is set to true, the registration page will be displayed in the widget. However, if the **`withUI`** value is set to false or not defined, a **`require/wepin-register`** exception will be triggered.

#### Parameters

* `token` `<string>`
  * External token value to be used for login (e.g., idToken).
* `sign` `<string>`
  * Signature value for the token provided as the first parameter. ([Signature Generation Methods](https://github.com/WepinWallet/wepin-widget-js-sdk/blob/main/doc/SignatureGenerationMethods.md))
* `withUI` `<boolean>` *optional*
  * Indicates whether to display the Wepin widget screen if registration is required.

#### Example

```js
var userInfo = await wepin.loginWithExternalToken(idToken, sign)

// Use register UI
var userInfo = await wepin.loginWithExternalToken(idToken, sign, true)
```

#### Return value

* `Promise` `<IWepinUser>`
  * Type of `IWepinUser` is defined in [`@wepin/types`](https://github.com/WepinWallet/wepin-js-sdk-types) (Support from version `0.0.7`)
    * `status` <'success'|'fail'>
    * `userInfo` `<object>` *optional*
      * `userId` `<string>`
      * `email` `<string>`
      * `provider` <'external_token'>
  * Example
    ```js
    {
    	status: 'success',
    	userInfo: {
    		userID: '123455',
    		email: 'abc@test.com',
    		provider: 'external_token'
            }
    }
    ```

#### Exception message

* [Admin Error Message](#admin-error-message)
  * `require/wepin-register` : If this error occurs, you have to perform the `wepin.register(pin)` method.

### **send**(Support from **version** `0.0.20-alpha`)

```javascript
await wepin.send(account, options?)
```

It returns the sent transaction id information. It can be only usable after widget login.

#### Parameters

- `account` \<`IAccount`> - Object specifying the account details.

  - The structure and specifications for `IAccount` are available in the[`@wepin/types`](https://github.com/WepinWallet/wepin-js-sdk-types)package. It typically includes necessary account details such as the address and network.
- `options` \<`ISendOptions`> - (__optional__) Additional transaction options.

  - The `ISendOptions` type, detailed in the[`@wepin/types`](https://github.com/WepinWallet/wepin-js-sdk-types)from version `0.0.12` onwards, encompasses various transaction modifiers such as the amount to send and the recipient address.

#### Example

```js
// without options
const result = wepin.send({
  address: '0x0000001111112222223333334444445555556666',
  network: 'Ethereum',
})

// with options
const result = wepin.send(
  {
    address: '0x0000001111112222223333334444445555556666',
    network: 'Ethereum',
  },
  { amount: '0.1', toAddress: '0x777777888888999999000000111111222222333333' }
)
```

#### Return value

- `Promise` \<`string`>

  - Returns tx id if the send transaction is successful.

  - Example

    ```js
    '0x0000001111112222223333334444445555556666.............aaaaaabbbbbbccccccddddddeeeeeeffffff'
    ```

#### Exception message

* [Admin Error Message](#admin-error-message)

### Admin Error Message

The error message types of the admin method are as follows.

| Error Message           | Description                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| invalid/email-format    | invalid email format                                                                                          |
| invalid/password-format | invalid password format (A minimum of 8 characters consisting of letters, numbers and special characters. ) |
| invalid/pin-format      | invalid PIN format (6-8 digit number) (\*Do not use the same number more than four times when registering)   |
| invalid/firebase-token  | invalid firebase token                                                                                        |
| invalid/wepin-api-key   | invalid wepin api key                                                                                         |
| invalid/account         | invalid account                                                                                               |
| invalid/email-domain    | invalid email domain                                                                                          |
| invalid/to-address      | invalid to address                                                                                            |
| auth/existed-email      | existed email                                                                                                 |
| auth/too-many-requests  | too mandy firebase requests                                                                                   |
| auth/wrong-password     | wrong password                                                                                                |
| auth/expired-token      | expired login session                                                                                         |
| auth/unknown/${string}  | unknown auth error                                                                                            |
| fail/send-email         | failed to sent validation email                                                                              |
| fail/reset-password     | failed to set password                                                                                        |
| fail/email-verified     | failed to verify email                                                                                        |
| fail/wepin-login        | login wepin failed                                                                                            |
| fail/wepin-register     | failed to register with wepin                                                                                 |
| fail/get-balance        | failed to get balance                                                                                         |
| fail/check-email        | failed to check email                                                                                         |
| fail/requireFee         | Insufficient fee                                                                                              |
| fail/requireNetworkFee  | Insufficient network fee(only token transaction request)                                                      |
| require/email-verified  | email verification required                                                                                   |
| require/signup          | wepin sign-up required                                                                                        |
| require/wepin-register  | wepin registration required                                                                                   |
| require/login           | wepin login required                                                                                          |
| unknown/${string}       | unknown error                                                                                                 |

## ⏩ Provider(Support from version `0.0.7-alpha`)

Wepin supports providers that return JSON-RPC request responses to connect with blockchain networks in webs. With Wepin Provider, you can easily connect to various networks supported by Wepin.

The providers supported by Wepin are as follows.

- EVM compatible Networks
- Klaytn Network

### EVM compatible Networks

`ethers.js` or `web3.js` can be used with Wepin Provider to interoperate with EVM compatible blockchains.

#### Support Networks

| Chain ID    | Network Name            | Network Variable         |
| ----------- | ----------------------- | ------------------------ |
| 1           | Ethereum Mainnet        | ethereum                 |
| 5           | Ethereum Goerli Testnet | evmeth-goerli            |
| 19          | Songbird Canary Network | evmsongbird              |
| 137         | Polygon Mainnet         | evmpolygon               |
| ~~80001~~ | ~~Polygon Mumbai~~    | ~~evmpolygon-testnet~~ |
|             | ~~Time~~(Coming soon)  | ~~evmtime~~             |
| 2731        | Time Testnet           | evmtime-elizabeth        |
| 8217        | Klaytn                  | klaytn                   |
| 1001        | Klaytn Testnet          | klaytn-testnet           |
| 11155111    | Ethereum Sepolia        | evmeth-sepolia           |
| 80002       | Polygon Amoy            | evmpolygon-amoy          |

### getProvider

It returns a Provider by given network.

```javascript
wepin.getProvider({ network })
```

#### Parameters

- `networt` \<string> - Available chains Wepin helps provide.(Network Variable)

#### Return value

- EIP-1193 provider.

#### Example

```javascript
const provider = wepin.getProvider({ network: 'ethereum' })
```

### initializeWeb3

- `web3.js`

  ```javascript
  import Web3 from 'web3'
  const provider = wepin.getProvider({ network: 'ethereum' })
  const web3 = new Web3(provider)
  ```
- `ethers.js` (Document: [ethers.js for React native](https://docs.ethers.org/v5/cookbook/react-native/))

  ```javascript
  import 'react-native-get-random-values'
  // Import the the ethers shims (**BEFORE** ethers)
  import '@ethersproject/shims'
  // Import the ethers library
  import { ethers } from 'ethers'

  const provider = wepin.getProvider({ network: 'ethereum' })
  const web3 = new ethers.providers.Web3Provider(provider)
  ```

### Method

- **Get Accounts**
  You can receive account information through the initialized web3.

  - `web3.js`

  ```javascript
  const accounts = await web3.eth.getAccounts()
  ```

  - `ethers.js`

  ```javascript
  const signer = web3.getSigner()
  const address = await signer.getAddress()
  ```
- **Get Balance**
  You can check the account balance using the account information.

  - `web3.js`

    ```javascript
    const balance = await web3.eth.getBalance(accounts[0])
    ```
  - `ethers.js`

    ```javascript
    const balance = await web3.getBalance(address)
    ```

> Please refer to the document below for instructions on how to check the balance, fee details, block numbers, etc.
>
> - web3.js : [web3.js 1.0.0 documentation](https://web3js-kr.readthedocs.io/ko/latest/getting-started.html)
> - ethers.js: [ethers.js 5.7 documentaion](https://docs.ethers.org/v5/getting-started/)

- **Send Transaction**
  Transaction can be sent.

  - `web3.js`

    ```javascript
    const accounts = await web3.eth.getAccounts()
    const tx = {
      from: accounts[0],
      gasPrice: '2000000000',
      gas: '21000',
      to: '0x11f4d0A3c1......13F7E19D048276DAe',
      value: '10000000000000000',
    }
    const response = await web3.eth.sendTransaction(tx)
    ```
  - `ethers.js`

    ```javascript
    const signer = web3.getSigner()
    const address = await signer.getAddress()
    const tx = {
      from: address,
      gasPrice: '2000000000',
      gasLimit: '21000',
      to: '0x11f4d0A3c1......13F7E19D048276DAe',
      value: '10000000000000000',
    }
    const response = await signer.sendTransaction(tx)
    ```
- **Contract Call**
  A contract call can be performed.

  - `web3.js`

    ```javascript
    const callObject = {
      to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', //contract address
      data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003',
    }
    const response = await web3.eth.call(callObject)
    ```
  - `ethers.js`

    ```javascript
    const callObject = {
      to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', //contract address
      data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003',
    }
    const response = await web3.call(callObject)
    ```

For details of Ethereum compatible network providers, please refer to the link below.

[EIP-1193: Ethereum Provider Javascript API](https://eips.ethereum.org/EIPS/eip-1193)
