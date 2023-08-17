# wepin-react-native-sdk

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
npm install react-native-safe-area-context
npm install react-native-webview

# for ios
cd ios
pod install
```

or

```bash
yarn add react-native-device-info
yarn add react-native-inappbrowser-reborn
yarn add react-native-safe-area-context
yarn add react-native-webview

# for ios
cd ios 
pod install
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

![image](https://github.com/IotrustGitHub/wepin-react-native-sdk/assets/96401185/379d7128-e4b9-40a7-b0a3-af0d1a9bbc18)


## ⏩ Import SDK

```javascript
import Wepin from '@wepin/react-native-sdk
const wepin = Wepin.getInstance()
```

Add a  `<Wepin.WidgetView>` component within the main compenent and nest its content inside of it:

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
wepin.closeWidget()
```

The `closeWidget()` method closes Wepin widget.

#### Return value

- `undefined`

### getAccounts

```javascript
await wepin.getAccounts()
await wepin.getAccounts(networks)
```

The `getAccounts()` method returns user accounts. If user is not logged in, Wepin widget will be opened and show login page. It is recommended to use `getAccounts()` method without argument to get all user accounts.

#### Parameters

- `networks` \<Array> *optional*
  - `network` \<string> *optional*

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
    [
        {
    	    address: "0x0000001111112222223333334444445555556666",
    	    network: "Ethereum"
        },
    ]
    ```
- `Promise` \<void>
  - If user is not logged in, it returns `Promise` \<void>.
