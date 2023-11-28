# wepin-react-native-sdk

<div>
  <!-- NPM Version -->
  <a href="https://www.npmjs.org/package/@wepin/react-native-sdk">
    <img src="http://img.shields.io/npm/v/@wepin/react-native-sdk.svg"
    alt="NPM version" />
  </a>
</div>

<br />

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

# for ios
cd ios
pod install
```

or

```bash
yarn add react-native-device-info
yarn add react-native-inappbrowser-reborn
yarn add react-native-webview

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

Deep link scheme format: Your app package name or bundle id + '.wepin'

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
            <data android:scheme="PACKAGE_NAME.wepin" /> <!-- package name of your android app + '.wepin' -->
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
   - URL Schems: bundle id of your project + '.wepin'

![image](./assets/ios-setup-image.png)

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

#### Example

```javascript
await wepin.init('APPID', 'APPKEY', {
  type: 'hide',
  defaultLanguage: 'en',
  defaultCurrency: 'USD',
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
      - `provider` \<'google'|'apple'|'email'>

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

#### Exception message

- [Admin Error Message](#admin-error-message)

#### Example

```javascript
const result = await wepin.register('test@test.com', 'abcd1234@')
```

### getBalance(Support from version `0.0.9-alpha`)

It returns the account's balance information. It can be only usable after widget login.

```javascript
wepin.getBalance(account)
```

#### Parameters

- `account` \<`IAccount`> - User email
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
const result = wepin.signUpWithEmailAndPassword('test@test.com', 'abcd1234@')
```

### Admin Error Message

The error message types of the admin method are as follows.

| Error Message           | Description                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| invalid/email-format    | invalid email format                                                                                        |
| invalid/password-format | invalid password format (A minimum of 8 characters consisting of letters, numbers and special characters. ) |
| invalid/pin-format      | invalid PIN format (6-8 digit number) (\*Do not use the same number more than four times when registering)  |
| invalid/firebase-token  | invalid firebase token                                                                                      |
| invalid/wepin-api-key   | invalid wepin api key                                                                                       |
| invalid/account         | invalid account                                                                                             |
| invalid/email-domain    | invalid email domain                                                                                        |
| auth/existed-email      | existed email                                                                                               |
| auth/too-many-requests  | too mandy firebase requests                                                                                 |
| auth/wrong-password     | wrong password                                                                                              |
| auth/expired-token      | expired login session                                                                                       |
| auth/unknown/${string}  | unknown auth error                                                                                          |
| fail/send-email         | failed to sent validation email                                                                             |
| fail/reset-password     | failed to set password                                                                                      |
| fail/email-verified     | failed to verify email                                                                                      |
| fail/wepin-login        | login wepin failed                                                                                          |
| fail/wepin-register     | failed to register with wepin                                                                               |
| fail/get-balance        | failed to get balance                                                                                       |
| fail/check-email        | failed to check email                                                                                       |
| require/email-verified  | email verification required                                                                                 |
| require/signup          | wepin sign-up required                                                                                      |
| require/wepin-register  | wepin registration required                                                                                 |
| require/login           | wepin login required                                                                                        |
| unknown/${string}       | unknown error                                                                                               |

## ⏩ Provider(Support from version `0.0.7-alpha`)

Wepin supports providers that return JSON-RPC request responses to connect with blockchain networks in webs. With Wepin Provider, you can easily connect to various networks supported by Wepin.

The providers supported by Wepin are as follows.

- EVM compatible Networks
- Klaytn Network

### EVM compatible Networks

`ethers.js` or `web3.js` can be used with Wepin Provider to interoperate with EVM compatible blockchains.

#### Support Networks

| Chain ID | Network Name            | Network Variable   |
| -------- | ----------------------- | ------------------ |
| 1        | Ethereum Mainnet        | ethereum           |
| 5        | Ethereum Goerli Testnet | evmeth-goerli      |
| 19       | Songbird Canary Network | evmsongbird        |
| 137      | Polygon Mainnet         | evmpolygon         |
| 80001    | Polygon Mumbai          | evmpolygon-testnet |
|          | ~~Time~~(Coming soon)   | ~~evmtime~~        |
| 2731     | Time Testnet            | evmtime-elizabeth  |
| 8217     | Klaytn                  | klaytn             |
| 1001     | Klaytn Testnet          | klaytn-testnet     |

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
