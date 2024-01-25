/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Sample Wepin React Native Test App
 *
 * @format
 */

import React, { useState, useMemo, useEffect } from 'react'
import {
  Button,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  LogBox,
  KeyboardTypeOptions,
} from 'react-native'
import Wepin, { BaseProvider, getNetworkInfoByName } from '@wepin/react-native-sdk'
// import Wepin from './src/wepinReactNativeSDK';
import { getApiKeyList, ItestMode } from './src/config/apiKey'
import { AttributesType, IAccount } from '@wepin/types'
import { Text } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { providerTest } from './src/providerTest'
import { web3Test } from './src/web3Test'
import CustomModal from './src/components/CustomModal'
import DialogManager, { DialogContent } from 'react-native-dialog-component'
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list'
import { getSignForLogin } from '@wepin/login'
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import { PRIVATE_KEY, GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env'

const deviceHeight = Dimensions.get('window').height

function App(): JSX.Element {

  const [result, setResult] = useState<any>()
  const wepin = Wepin.getInstance()
  const providerTestInstance = providerTest.getInstance(wepin)
  const web3TestInstance = web3Test.getInstance(wepin)
  const [accounts, setAccounts] = useState<{ address: string; network: string; }[] | undefined>()
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>()
  const [suspectedNetwork, setSuspectedNetwork] = useState<any>()
  //let provider: BaseProvider | undefined = undefined
  const [provider, setProvider] = useState<BaseProvider>()

  /////////api key변경하기 위한....
  const apiKeyList = getApiKeyList()
  const [apiKey, setApiKey] = useState<string>(apiKeyList.apiKeyList[0])//= getBundleId().split('.').slice(-1)[0] as ItestMode //'dev'; // 'stage' // 'prod'

  //// login provider list
  const availableLoginProviderList = [
    { key: 1, value: 'google' },
    { key: 2, value: 'apple' },
    { key: 3, value: 'naver' },
    { key: 4, value: 'discord' }]
  const [loginProviders, setLoginProviders] = React.useState([])

  const privateKey = PRIVATE_KEY
  const googleConfigureSignIn = () => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true,
    });
  };

  useEffect(() => {
    LogBox.ignoreLogs([
      `The provided value 'ms-stream' is not a valid 'responseType'.`,
      `The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'`,
      'Animated: `useNativeDriver`',
      'Warning: componentWillReceiveProps',
      'Warning: componentWillMount'
      // 'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`'
    ]);
    googleConfigureSignIn()
  })

  const LogInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      if (await GoogleSignin.isSignedIn()) await GoogleSignin.signOut()
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo: ', userInfo)
      if (userInfo.idToken) await loginWithExternalToken(userInfo.idToken)
    } catch (error: any) {
      console.error(error)
      setResult('loginWithExternalToken: fail')
    }
  }

  const setNetwork = async (network: any) => {
    console.log('switchNetwork current network: ', suspectedNetwork)
    console.log('switchNetwork switch network: ', network)
    if (network) {
      if (suspectedNetwork != network || !provider) {
        console.log('provider: ', provider)
        if (provider) {
          console.log('switchNetwork start ')
          const res = await switchNetwork(network)
          providerTestInstance.setConfig(network, provider!, setResult, setSelectedAccount)
          web3TestInstance.setConfig(network, provider!, setResult, setSelectedAddress)
          console.log('res: ', res)
          if (!res) {
            return
          }
        } else {
          const resProvider = wepin.getProvider({ network })
          setProvider(resProvider)
          providerTestInstance.setConfig(network, resProvider!, setResult, setSelectedAccount)
          web3TestInstance.setConfig(network, resProvider!, setResult, setSelectedAddress)
        }
        console.log('provider: ', provider)
      }
    }

  }
  const AvailableNetworks = useMemo<any>(() => {
    if (accounts && accounts.length) {
      const array = accounts?.map((account, idx) => {
        return {
          key: idx.toString(),
          value: account.network.toLowerCase(),
        }
      })

      const filterArray = array?.filter((val) => {
        if (
          val.value.toLowerCase().includes('evm') ||
          val.value.toLowerCase().includes('klaytn') ||
          val.value.toLowerCase().includes('ethereum')
        ) {
          return val
        }
      })
      console.log('filterArray', filterArray)
      //맨앞에 network로 세팅
      setSuspectedNetwork(filterArray[0].value);
      setNetwork(filterArray[0].value)
      return filterArray
      // return [{
      //   id: 1,
      //   label: accounts[0].network.toLowerCase(),
      //   // label: (<Text style={{ color: '#111111' }}>{accounts[0].network.toLowerCase()}</Text>),
      //   value: accounts[0].network.toLowerCase(),
      //   selected: true,
      //   size: 15
      // }]

      // return [{}]
    } else {
      return []
    }

  }, [accounts])
  const prefix = useMemo(() => {
    if (
      suspectedNetwork?.toLowerCase() === 'klaytn' ||
      suspectedNetwork?.toLowerCase() === 'klaytn-testnet'
    ) {
      return 'klay'
    } else {
      return 'eth'
    }
  }, [suspectedNetwork])

  const initWepin = async (type: AttributesType, lang: 'ko' | 'en', currency: 'krw' | 'USD') => {
    try {
      console.log('api key: ', apiKey)
      setResult('processing.....')

      await wepin.init('', apiKey, {
        type,
        defaultCurrency: currency,
        defaultLanguage: lang,
        loginProviders: loginProviders.length ? loginProviders : undefined,
      })
      const isInitialized = wepin.isInitialized()
      // if (type !== 'show') {
      setResult('wepin isInitialized: ' + isInitialized)
      // }

    } catch (e) {
      console.error(e)
      setResult('already wepin initialized')
    }
  }

  const isInit = () => {
    console.log('isInit')
    try {
      setResult('processing.....')
      const isInitialized = wepin.isInitialized()
      setResult('wepin isInitialized: ' + isInitialized)
    } catch (e) {
      console.error(e)
    }
  }

  // var id = 0;
  // var elements = [];
  const getStatus = async () => {
    console.log('getStatus')
    try {
      setResult('processing.....')
      const res = wepin.getStatus()
      setResult('wepin getStatus: ' + res)

    } catch (e) {
      console.error(e)
      setResult('getStatus exception')
    }
  }

  const loginWepin = async (option?: { setEmail: boolean }) => {
    console.log('loginWepin')
    const loginEmail = async (val: any) => {
      try {
        setResult('processing.....')
        const res = await wepin.login(val.email)
        setResult('loginWepin: ' + JSON.stringify(res))
      } catch (e: any) {
        console.error(e)
        setResult('loginWepin fail: ' + e.message)
      }
    }

    try {
      setResult('processing.....')
      if (option?.setEmail) {
        openDialog({
          title: 'Wepin Login',
          inputs: [
            {
              text: 'email'
            }]
        }, loginEmail)
      } else {
        const res = await wepin.login()
        setResult('loginWepin: ' + JSON.stringify(res))
      }

    } catch (e) {
      console.error(e)
      setResult('loginWepin: fail')
    }
  }

  const loginWithExternalToken = async (token: string) => {
    console.log('loginWithExternalToken')
    try {
      setResult('processing.....')
      const sign = getSignForLogin(privateKey, 'eth')
      const res = await wepin.loginWithExternalToken(token, sign!, true)
      setResult('loginWithExternalToken: ' + JSON.stringify(res))

    } catch (e) {
      console.error(e)
      setResult('loginWithExternalToken: fail')
    }
  }

  const initState = () => {
    setSelectedAddress(undefined)
    setSuspectedNetwork(undefined)
    setAccounts([])
    setProvider(undefined)
    setSelectedAccount(undefined)
  }
  const logoutWepin = async () => {
    console.log('logoutWepin')
    try {
      setResult('processing.....')
      await wepin.logout()
      initState()
      setResult('logoutWepin: success')
    } catch (e) {
      console.error(e)
      setResult('logoutWepin: fail')
    }
  }

  const openDialog = (options: {
    title: string;
    inputs?: Array<{
      text: string,
      secure?: boolean,
      type?: KeyboardTypeOptions,
    }>,
    selectList?: { list: Array<IAccount> }
  }, callback: (param: any) => {}) => {
    let accountForSelectAccount
    if (options.selectList) {
      accountForSelectAccount = options.selectList.list?.map((val, idx) => {
        return { key: idx.toString(), value: `${val.network}(${val.address})` }
      })
    }
    console.log('abc', DialogManager.currentDialog)

    let res: any = {}
    const getKeyboardType = (text: string) => {
      if (text.includes('email')) {
        return 'email-address'
      } else if (text === 'pin') {
        return 'number-pad'
      } else {
        return 'default'
      }
    }
    DialogManager.show({
      title: options.title,
      titleAlign: 'center',
      animationDuration: 200,
      onTouchOutside: false,
      // ScaleAnimation: new ScaleAnimation(),
      children: (
        <DialogContent contentStyle={undefined}>
          <View>
            {options.inputs?.map((obj, i) => <View key={i} style={styles.inputContainter}>
              <Text style={styles.label}>
                {obj.text}:
              </Text>
              <TextInput
                style={styles.textlInput}
                keyboardType={obj.type ?? getKeyboardType(obj.text)}
                // textContentType='emailAddress'
                // placeholder={obj.defaultValue}
                autoCapitalize='none'
                secureTextEntry={obj.secure}
                // value={obj.defaultValue}
                onChangeText={(val) => { res[obj.text] = val }} />
            </View>)}
            {options.selectList ?
              <SelectList
                boxStyles={styles.selectBoxStyles}
                inputStyles={styles.selectBoxtextStyles}
                dropdownTextStyles={styles.selectBoxtextStyles}
                setSelected={(key: any) => {
                  res['account'] = options.selectList?.list[Number(key)]
                }}
                placeholder='Select Account'
                searchPlaceholder='Search Account'
                data={accountForSelectAccount!}
                save='key' /> : <></>}

            <View style={styles.buttonContainer}>
              <Button title="CANCEL" onPress={() => {
                DialogManager.dismiss()
              }} />
              <Button title="OK" onPress={async () => {
                DialogManager.dismiss()
                console.log('res', res)
                callback(res)
              }} />
            </View>
          </View>
        </DialogContent>
      ),
    }, () => {
      console.log('callback - show');
    });
  }

  const signupWithEmail = async () => {
    console.log('signupWithEmail')
    const signup = async (val: any) => {
      setResult('processing.....')
      try {
        console.log(`email: ${val.email}`)
        const res = await wepin.signUpWithEmailAndPassword(val.email, val.password)
        setResult('signupWithEmail: ' + res)
      } catch (e: any) {
        console.error(e)
        setResult('signupWithEmail fail: ' + e.message)
      }
    }
    openDialog({
      title: 'Wepin Signup',
      inputs: [
        {
          text: 'email'
        },
        {
          text: 'password',
          secure: true,
        }]
    }, signup)
  }

  const loginWithEmail = async () => {
    console.log('loginWithEmail')
    const loginEmail = async (val: any) => {
      try {
        setResult('processing.....')
        const res = await wepin.loginWithEmailAndPassword(val.email, val.password)
        setResult('loginWithEmail: ' + JSON.stringify(res))
      } catch (e: any) {
        console.error(e)
        setResult('loginWithEmail fail: ' + e.message)
      }
    }
    openDialog({
      title: 'Wepin Login',
      inputs: [
        {
          text: 'email'
        },
        {
          text: 'password',
          secure: true,
        }]
    }, loginEmail)
  }

  const regisgterWepin = async () => {
    console.log('regisgterWepin')
    const register = async (val: any) => {
      try {
        setResult('processing.....')
        console.log('pin', val)
        const res = await wepin.register(val.pin)
        setResult('regisgterWepin: ' + res)
      } catch (e: any) {
        console.error(e)
        setResult('regisgterWepin fail: ' + e.message)
      }
    }
    openDialog({
      title: 'Wepin Regisger',
      inputs: [
        {
          text: 'pin',
          // secure: true,
        }]
    }, register)
  }

  const getBalance = async () => {
    console.log('getBalance')
    const getBalanceFunc = async (val: any) => {
      try {
        setResult('processing.....')
        if (accounts) {
          const selAccount = val.account! //accounts[0]
          const res = await wepin.getBalance(selAccount)
          setResult(`getBalance(${selAccount.network}):` + JSON.stringify(res))
        } else {
          setResult('accouts is empty')
        }
      } catch (e: any) {
        console.error(e)
        setResult('getBalance fail: ' + e.message)
      }
    }
    if (accounts) {
      openDialog({
        title: 'select network',
        selectList: {
          list: accounts!,
        }
      }, getBalanceFunc)
    } else {
      setResult('accouts is empty')
    }
  }

  const openWepinWidget = async () => {
    console.log('openWepinWidget')
    setResult('processing.....')
    try {
      await wepin.openWidget()
      setResult('openWepinWidget success')
    } catch (e) {
      console.error(e)
      setResult('openWepinWidget exception')
    }
  }

  const closeWepinWidget = async () => {
    console.log('closeWepinWidget')
    try {
      setResult('processing.....')
      await wepin.closeWidget()
      setResult('closeWepinWidge success')
    } catch (e) {
      console.error(e)
      setResult('closeWepinWidget exception')
    }
  }

  const getAccounts = async () => {
    console.log('getAccounts')
    setResult('processing.....')
    try {
      let accountList = await wepin.getAccounts()
      //accountList = [{"address": "0xeE48Ba450efE67EF6E2cBd3b59662F740FD87f6F", "network": "evmANTTIME-TESTNET"}]
      //accountList = []
      setAccounts(accountList)
      if (accountList?.length) {
        setResult('accountList: ' + JSON.stringify(accountList))
        // setSuspectedNetwork(accounts[0].network)
      } else {
        setResult('accountList: ' + '[]')
      }
    } catch (e) {
      console.error(e)
      setResult('getAccounts exception')
    }
  }

  const finalizeWepin = async () => {
    console.log('finalizeWepin')
    console.log('queue', wepin.queue)
    try {
      setResult('processing.....')
      // ToDo
      await wepin.finalize()
      initState()
      setResult('finalizeWepin success')
    } catch (e) {
      console.error(e)
      setResult('finalizeWepin exception')
    }
  }

  const adminWepin = async () => {
    await initWepin('hide', 'ko', 'krw')
    const email = 'itestrn7@naver.com'
    const password = 'abc1111!'
    let logRes = result
    try {
      let res = await wepin.signUpWithEmailAndPassword(email, password)
      if (res) {
        logRes += ' signup Success'
        setResult(logRes)
        console.log('signup success')
      }
    } catch (e: any) {
      logRes += ' signup error: ' + e.message
      setResult(logRes)
      console.error('signUpWithEmailAndPassword error', e.message)
    }
    try {

      let resLogin = await wepin.loginWithEmailAndPassword(email, password)
      if (resLogin?.status === 'success') {
        logRes += ' login Success '
        setResult(logRes)
        console.log('login success')
      } else {
        logRes += ' login fail '
        setResult(logRes)
        console.log('login fail')
      }
    } catch (e: any) {
      console.error('adminWepin error', e.message)
      logRes += ' login Error: ' + e.message
      setResult(logRes)
      if (e.message === 'required/wepin-register') {
        console.error(e.message)
        wepin.register('123456').then((resReg) => {
          if (resReg) {
            console.log('register success')
            logRes += ' register Succes '
            setResult(logRes)
          } else {
            console.log('register fail')
            logRes += ' register fail '
            setResult(logRes)
          }
        }).catch(async (e) => {
          logRes += ' register fail Error: ' + e
          setResult(logRes)
          console.log('register error' + e)
        })
      }
      logRes += ' adminWepin exception' + e.message
      setResult(logRes)
    }

  }
  const testItemListView = (

    <ScrollView
      style={{
        marginTop: 20,
        flex: 1,
        width: "80%",
        // borderColor: 'blue',
        // borderWidth: 1
      }}>
      <View style={styles.button}>
        <Button title="Admin_All" onPress={() => adminWepin()} />
      </View>
      <View style={styles.button}>
        <Button title="Initialize(kor)-hide" onPress={() => initWepin('hide', 'ko', 'krw')} />
      </View>
      <View style={styles.button}>
        <Button title="Initialize(kor)-show" onPress={() => initWepin('show', 'ko', 'krw')} />
      </View>
      <View style={styles.button}>
        <Button title="Initialize(eng)-hide" onPress={() => initWepin('hide', 'en', 'USD')} />
      </View>
      <View style={styles.button}>
        <Button title="Initialize(eng)-show" onPress={() => initWepin('show', 'en', 'USD')} />
      </View>
      <View style={styles.button}>
        <Button title="Is_initialized" onPress={() => isInit()} />
      </View>
      <View style={styles.button}>
        <Button title="Get_Status" onPress={() => getStatus()} />
      </View>
      <View style={styles.button}>
        <Button title="login" onPress={() => loginWepin()} />
      </View>
      <View style={styles.button}>
        <Button title="login(set email)" onPress={() => loginWepin({ setEmail: true })} />
      </View>
      <View style={styles.button}>
        <Button title="loginWithExternalToken(Google)" onPress={() => LogInWithGoogle()} />
      </View>
      <View style={styles.button}>
        <Button title="logout" onPress={() => logoutWepin()} />
      </View>
      <View style={styles.button}>
        <Button title="signupWithEmail" onPress={() => signupWithEmail()} />
      </View>
      <View style={styles.button}>
        <Button title="loginWithEmail" onPress={() => loginWithEmail()} />
      </View>
      <View style={styles.button}>
        <Button title="register" onPress={() => regisgterWepin()} />
      </View>
      <View style={styles.button}>
        <Button title="Open_widget" onPress={() => openWepinWidget()} />
      </View>
      <View style={styles.button}>
        <Button title="Close_widget" onPress={() => closeWepinWidget()} />
      </View>
      <View style={styles.button}>
        <Button title="Get_Accounts" onPress={() => getAccounts()} />
      </View>
      <View style={styles.button}>
        <Button title="Get_Balance" onPress={() => getBalance()} />
      </View>
      <View style={styles.button}>
        <Button title="Finalize_widget" onPress={() => finalizeWepin()} />
      </View>
    </ScrollView>
  )

  const [modalVisible, setModalVisible] = useState(false)
  const [providerMethod, setProviderMethod] = useState<string>()
  const handleSave = (data: any) => {
    console.log('data: ', data)
    setModalVisible(false)
    // setTimeout(() => {
    providerTestInstance.saveDataAndCall(data, providerMethod!)
    // }, 100)

    // setModalVisible(false)
  }

  const switchNetwork = async (switchNetwork: any) => {
    try {
      console.log('switchNetwork current network: ', suspectedNetwork)
      console.log('switchNetwork switch network: ', switchNetwork)
      const { chainId, rpcUrl } = getNetworkInfoByName(switchNetwork)
      console.log('rpcUrl: ', rpcUrl)
      const providerResult = await provider?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      })
      // provider = wepin.getProvider({ network: switchNetwork })
      setProvider(wepin.getProvider({ network: switchNetwork }))
      setResult(JSON.stringify(providerResult))
      return true
    } catch (e: any) {
      console.log('error', e)
      if (e?.message) {
        setResult(`error-${e.message}`)
      } else {
        setResult('unknown error')
      }
      return false
    }
  }
  const providerTestItemListView = (
    <>
      <ScrollView
        style={{
          marginTop: 5,
          flex: 1,
          width: "80%",
          // borderColor: 'blue',
          // borderWidth: 1
        }}>

        <View style={styles.button}>
          <Button title={`${prefix}_blockNumber`} onPress={() => providerTestInstance.getBlockNumber()} />
        </View>
        <View style={styles.button}>
          <Button title={`${prefix}_accounts`} onPress={() => providerTestInstance.getAccountsForProvider()} />
        </View>
        <View style={styles.button}>
          <Button title={`${prefix}_requestAccounts`} onPress={() => providerTestInstance.requestAccounts()} />
        </View>
        <View style={styles.button}>
          <Button title={`${prefix}_getBalance`} onPress={() => providerTestInstance.getBalance()} />
        </View>

        <View style={styles.button}>
          <Button title={`${prefix}_gasPrice`} onPress={() => providerTestInstance.getGasPrice()} />
        </View>
        <View style={styles.button}>
          <Button title={`${prefix}_estimateGas`} onPress={() => providerTestInstance.getEstimatedGas()} />
        </View>
        {
          selectedAccount ?
            <>
              <View style={styles.button}>
                <Button title={`${prefix}_signTransaction`} onPress={() => { setProviderMethod('signTransaction'); setModalVisible(true) }} />
              </View>
              <View style={styles.button}>
                <Button title={`${prefix}_sendTransaction`} onPress={() => { setProviderMethod('sendLegacyTransaction'); setModalVisible(true) }} />
              </View>
              <View style={styles.button}>
                <Button title={`${prefix}_call`} onPress={() => { setProviderMethod('ethCall'); setModalVisible(true) }} />
              </View>
              <View style={styles.button}>
                <Button title={`${prefix}_sign`} onPress={() => { setProviderMethod('ethSign'); setModalVisible(true) }} />
              </View>
              <View style={styles.button}>
                <Button title={`personal_sign`} onPress={() => { setProviderMethod('personalSign'); setModalVisible(true) }} />
              </View>
              <View style={styles.button}>
                <Button title={`${prefix}_signTypedData_v1`} onPress={() => providerTestInstance.signTypedDataV1()} />
              </View>
              <View style={styles.button}>
                <Button title={`${prefix}_signTypedData_v3`} onPress={() => providerTestInstance.signTypedDataV3()} />
              </View>
              <View style={styles.button}>
                <Button title={`${prefix}_signTypedData_v4`} onPress={() => providerTestInstance.signTypedDataV4()} />
              </View>
              <CustomModal
                visible={modalVisible}
                gas={{ price: providerTestInstance.gasPrice, limit: providerTestInstance.estimateGas }}
                address={providerTestInstance.selectedAccount}
                onClose={() => setModalVisible(false)}
                onSave={handleSave} />

            </>
            : ''
        }

      </ScrollView></>
  )

  const CommonRoute = () => (
    <View
      style={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'white'
      }}>
      {testItemListView}
    </View>
  );

  const providerRoute = () => (
    <View
      style={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'white'
      }}>
      {providerTestItemListView}
    </View>
  );

  const [web3modalVisible, setWeb3ModalVisible] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>()
  const [web3rMethod, setWeb3Method] = useState<string>()
  const handleWeb3Save = (data: any) => {
    console.log('data: ', data)
    setWeb3ModalVisible(false)
    // setTimeout(() => {
    web3TestInstance.saveDataAndCall(data, web3rMethod!)
    // }, 100)
    // setWeb3ModalVisible(false)
  }
  const web3TestItemListView = (
    <>
      <ScrollView
        style={{
          marginTop: 5,
          flex: 1,
          width: "80%",
          // borderColor: 'blue',
          // borderWidth: 1
        }}>

        <View style={styles.button}>
          <Button title={'initializeWeb3'} onPress={() => web3TestInstance.initializeWeb3()} />
        </View>
        <View style={styles.button}>
          <Button title={`web3_getAccounts`} onPress={() => web3TestInstance.web3_getAccounts()} />
        </View>
        <View style={styles.button}>
          <Button title={`web3_getBalance`} onPress={() => web3TestInstance.web3_getBalance()} />
        </View>
        <View style={styles.button}>
          <Button title={`web3_estimateGas`} onPress={() => web3TestInstance.web3_estimateGas()} />
        </View>
        <View style={styles.button}>
          <Button title={`web3_getGasPrice`} onPress={() => web3TestInstance.web3_getGasPrice()} />
        </View>
        {
          selectedAddress ?
            <>
              <View style={styles.button}>
                <Button title={`web3_sendTransaction`} onPress={() => { setWeb3Method('web3_sendTransaction'); setWeb3ModalVisible(true) }} />
              </View>
              <View style={styles.button}>
                <Button title={`web3_call`} onPress={() => { setWeb3Method('web3_call'); setWeb3ModalVisible(true) }} />
              </View>
              <CustomModal
                visible={web3modalVisible}
                gas={{ price: web3TestInstance.gasPrice, limit: web3TestInstance.estimateGas }}
                address={web3TestInstance.toAddress}
                onClose={() => setWeb3ModalVisible(false)}
                onSave={handleWeb3Save} />

            </>
            : ''
        }

      </ScrollView></>
  )

  const web3Route = () => (
    <View
      style={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'white'
      }}>
      {web3TestItemListView}
    </View>
  );

  const renderScene = SceneMap({
    common: CommonRoute,
    provider: providerRoute,
    web3: web3Route,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
    />
  );

  // const layout = useWindowDimensions()

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'common', title: 'Test List' },
    { key: 'provider', title: 'Provider Test' },
    { key: 'web3', title: 'Web3 Test' },
  ]);

  return (
    <Wepin.WidgetView>
      <SafeAreaView>
        <View
          style={{
            // height: deviceHeight / 6,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundColor: 'white',
            paddingBottom: 10,
          }}>
          <Text style={{ fontSize: 25, marginTop: 30, textAlign: 'center', color: 'black' }}>
            Wepin SDK Test
          </Text>
          <SelectList
            boxStyles={styles.selectBoxStyles}
            inputStyles={styles.selectBoxtextStyles}
            dropdownTextStyles={styles.selectBoxtextStyles}
            dropdownStyles={styles.selectBoxStyles}
            setSelected={async (key: any) => {
              console.log('key', key)
              const selApikey = apiKeyList.apiKeyList[Number(key)]

              if (apiKey !== selApikey) {
                setApiKey(selApikey)
                await finalizeWepin()
              }
            }}
            placeholder='Switch API key'
            searchPlaceholder='Search API key'
            data={apiKeyList.dropdownKeyList}
            save='key'
          />
          <MultipleSelectList
            // setSelected={(val: any) => { console.log(val, data111); data111 = val }}
            setSelected={setLoginProviders}
            data={availableLoginProviderList}
            save='value'
            // onSelect={() => { console.log(loginProviders); setLoginProviders(data111) }}
            label='LoginProviders'
            placeholder='Login provider list'
            // boxStyles={{ marginBottom: 10 }}
            boxStyles={styles.selectBoxStyles}
            dropdownStyles={styles.selectBoxStyles}
            inputStyles={styles.selectBoxtextStyles}
            dropdownTextStyles={styles.selectBoxtextStyles}
            labelStyles={styles.selectBoxtextStyles}

          />

          {suspectedNetwork ? <Text style={{ fontSize: 11, marginTop: 5, textAlign: 'center', color: 'blue' }}>
            SelectNetwork: {suspectedNetwork}
          </Text> : ''}
          {selectedAccount ? <Text style={{ fontSize: 11, textAlign: 'center', color: 'blue' }}>
            Address: {selectedAccount}
          </Text> : ''}
          {
            AvailableNetworks && AvailableNetworks?.length !== 0 ?
              <>
                {/* <Text onPress={(val: any) => { setSuspectedNetwork(AvailableNetworks[0]?.value); provider.setConfig(AvailableNetworks[0]?.value, setResult, setSelectedAccount) }} style={{ fontSize: 15, marginTop: 10, textAlign: 'center', color: 'blue' }}>
              Click Here
            </Text> */}
                <SelectList
                  boxStyles={styles.selectBoxStyles}
                  inputStyles={styles.selectBoxtextStyles}
                  dropdownTextStyles={styles.selectBoxtextStyles}
                  setSelected={async (key: any) => {
                    console.log('key', key)
                    const findeNetwork = AvailableNetworks.find((data: any) => {
                      return data.key === key
                    })
                    setSuspectedNetwork(findeNetwork?.value);
                    await setNetwork(findeNetwork?.value)
                  }}
                  placeholder='Switch Network'
                  searchPlaceholder='Search Network'
                  data={AvailableNetworks!}
                  save='key'
                />
              </> : ''
          }
        </View>
      </SafeAreaView>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: 100 }}
      />
      <View
        style={{
          height: deviceHeight / 3,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: 'white'
        }}>
        <Text style={{ fontSize: 25, marginTop: 5, textAlign: 'center', color: 'black' }}>
          Test Result
        </Text>
        <ScrollView style={{ flex: 0.5, paddingStart: 10, paddingEnd: 10, width: '80%', backgroundColor: '#E0E0E0', borderRadius: 10 }}>
          <Text style={{ marginTop: 10, fontSize: 20, textAlign: 'left', color: 'black' }}>
            {result}
          </Text>
        </ScrollView>
      </View>
    </Wepin.WidgetView>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    marginBottom: 10,
  },
  image: {
    height: 100,
    width: 100,
  },
  scene: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#111',
    color: 'blue'
  },
  indicator: {
    backgroundColor: 'blue',
  },
  inputContainter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  label: {
    flex: 1,
    marginRight: 5,
    textAlign: 'left',
    fontWeight: 'bold',
    color: 'black'
  },
  textlInput: {
    flex: 2,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    color: 'black'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  selectBoxStyles: {
    // width: '50%',
    width: 300,
    // width: '50%',
    marginHorizontal: 20,
    marginVertical: 5
  },
  selectBoxtextStyles: {
    fontSize: 11,
    textAlign: 'center',
    color: 'black'
  },
})

export default App
