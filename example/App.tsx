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
} from 'react-native'
import Wepin from '@wepin/react-native-sdk'
// import Wepin from './src/wepinReactNativeSDK';
import { getApiKey, ItestMode } from './src/config/apiKey'
import { getBundleId } from 'react-native-device-info'
import { AttributesType, IAccount } from '@wepin/types'
import { Text } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { providerTest } from './src/providerTest'
import { web3Test } from './src/web3Test'
import CustomModal from './src/components/CustomModal'
import DialogManager, { DialogContent } from 'react-native-dialog-component'
import { SelectList } from 'react-native-dropdown-select-list'


const deviceHeight = Dimensions.get('window').height

function App(): JSX.Element {
  const testMode: ItestMode = getBundleId().split('.').slice(-1)[0] as ItestMode //'dev'; // 'stage' // 'prod'
  const [result, setResult] = useState<any>()
  const wepin = Wepin.getInstance()
  const provider = providerTest.getInstance(wepin)
  const web3TestInstance = web3Test.getInstance(wepin)
  const [accounts, setAccounts] = useState<{ address: string; network: string; }[] | undefined>()
  const [selectedAccount, setSelectedAccount] = useState('')
  const [suspectedNetwork, setSuspectedNetwork] = useState<any>()

  useEffect(() => {
    LogBox.ignoreLogs([
      `The provided value 'ms-stream' is not a valid 'responseType'.`,
      `The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'`,
      'Animated: `useNativeDriver`',
      'Warning: componentWillReceiveProps',
      'Warning: componentWillMount'
      // 'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`'
    ]);
  })
  console.log('App', accounts)
  const AvailableNetworks = useMemo<any>(() => {

    let id = 0
    console.log('accounts', accounts)
    if (accounts) {
      // let array = [];
      // const array = accounts?.map((account) => {
      //   return {
      //     id: (id++).toString(),
      //     label: account.network.toLowerCase(),
      //     // label: (<Text style={{ color: '#111111' }}>{account.network.toLowerCase()}</Text>),
      //     value: account.network.toLowerCase(),
      //     selected: false,
      //     size: 15
      //   }
      // })

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

  const initWepinKor = async (type: AttributesType) => {
    try {
      console.log('getApiKey(testMode): ', getApiKey(testMode))
      setResult('processing.....')
      //verify email전송 테스트 app key로 변경시
      // await wepin.init('', getApiKey(testMode, true), {
      await wepin.init('', getApiKey(testMode), {
        type,
        defaultCurrency: 'krw',
        defaultLanguage: 'ko',
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

  const initWepinEng = async (type: AttributesType) => {
    try {
      setResult('processing.....')
      //verify email전송 테스트 app key로 변경시
      // await wepin.init('', getApiKey(testMode, true), {
      await wepin.init('', getApiKey(testMode), {
        type,
        defaultCurrency: 'USD',
        defaultLanguage: 'en',
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

  const loginWepin = async () => {
    console.log('loginWepin')
    try {
      setResult('processing.....')
      const res = await wepin.login()
      setResult('loginWepin: ' + JSON.stringify(res))
    } catch (e) {
      console.error(e)
      setResult('loginWepin: fail')
    }
  }

  const logoutWepin = async () => {
    console.log('logoutWepin')
    try {
      setResult('processing.....')
      await wepin.logout()
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
                // placeholder={obj.defaultValue}
                autoCapitalize='none'
                secureTextEntry={obj.secure}
                // value={obj.defaultValue}
                onChangeText={(val) => { res[obj.text] = val }} />
            </View>)}
            {options.selectList ?
              <SelectList
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
      setAccounts([])
      setSuspectedNetwork(undefined);
      setResult('finalizeWepin success')
    } catch (e) {
      console.error(e)
      setResult('finalizeWepin exception')
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
        <Button title="Initialize(kor)-hide" onPress={() => initWepinKor('hide')} />
      </View>
      <View style={styles.button}>
        <Button title="Initialize(kor)-show" onPress={() => initWepinKor('show')} />
      </View>
      <View style={styles.button}>
        <Button title="Initialize(eng)-hide" onPress={() => initWepinEng('hide')} />
      </View>
      <View style={styles.button}>
        <Button title="Initialize(eng)-show" onPress={() => initWepinEng('show')} />
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
    provider.saveDataAndCall(data, providerMethod!)
    // }, 100)

    // setModalVisible(false)
  }
  const providerTestItemListView = (
    <>
      {
        AvailableNetworks && AvailableNetworks?.length !== 0 ?
          <>
            {/* <Text onPress={(val: any) => { setSuspectedNetwork(AvailableNetworks[0]?.value); provider.setConfig(AvailableNetworks[0]?.value, setResult, setSelectedAccount) }} style={{ fontSize: 15, marginTop: 10, textAlign: 'center', color: 'blue' }}>
              Click Here
            </Text> */}
            <SelectList
              setSelected={(key: any) => {
                console.log('key', key)
                const findeNetwork = AvailableNetworks.find((data: any) => {
                  return data.key === key
                })
                setSuspectedNetwork(findeNetwork?.value);
                provider.setConfig(findeNetwork?.value, setResult, setSelectedAccount)
              }}
              placeholder='Select Network'
              searchPlaceholder='Search Network'
              data={AvailableNetworks!}
              save='key'
            />
          </> : ''
      }
      <ScrollView
        style={{
          marginTop: 5,
          flex: 1,
          width: "80%",
          // borderColor: 'blue',
          // borderWidth: 1
        }}>

        <View style={styles.button}>
          <Button title={`${prefix}_blockNumber`} onPress={() => provider.getBlockNumber()} />
        </View>
        <View style={styles.button}>
          <Button title={`${prefix}_accounts`} onPress={() => provider.getAccountsForProvider()} />
        </View>
        <View style={styles.button}>
          <Button title={`${prefix}_requestAccounts`} onPress={() => provider.requestAccounts()} />
        </View>
        <View style={styles.button}>
          <Button title={`${prefix}_getBalance`} onPress={() => provider.getBalance()} />
        </View>

        <View style={styles.button}>
          <Button title={`${prefix}_gasPrice`} onPress={() => provider.getGasPrice()} />
        </View>
        <View style={styles.button}>
          <Button title={`${prefix}_estimateGas`} onPress={() => provider.getEstimatedGas()} />
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
                <Button title={`${prefix}_signTypedData_v1`} onPress={() => provider.signTypedDataV1()} />
              </View>
              <View style={styles.button}>
                <Button title={`${prefix}_signTypedData_v3`} onPress={() => provider.signTypedDataV3()} />
              </View>
              <View style={styles.button}>
                <Button title={`${prefix}_signTypedData_v4`} onPress={() => provider.signTypedDataV4()} />
              </View>
              <CustomModal
                visible={modalVisible}
                gas={{ price: provider.gasPrice, limit: provider.estimateGas }}
                address={provider.selectedAccount}
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
  const [selectedAddress, setSelectedAddress] = useState<string>('')
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
      {
        AvailableNetworks && AvailableNetworks?.length !== 0 ?
          <>
            {/* <Text onPress={(val: any) => { setSuspectedNetwork(AvailableNetworks[0]?.value); web3TestInstance.setConfig(AvailableNetworks[0]?.value, setResult, setSelectedAccount) }} style={{ fontSize: 15, marginTop: 10, textAlign: 'center', color: 'blue' }}>
              Click Here
            </Text> */}
            <SelectList
              setSelected={(key: any) => {
                const findeNetwork = AvailableNetworks.find((data: any) => {
                  return data.key === key
                })
                setSuspectedNetwork(findeNetwork?.value);
                web3TestInstance.setConfig(findeNetwork?.value, setResult, setSelectedAddress)
              }}
              placeholder='Select Network'
              searchPlaceholder='Search Network'
              data={AvailableNetworks!}
              save='key'
            />
          </> : ''
      }
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
          {suspectedNetwork ? <Text style={{ fontSize: 11, marginTop: 5, textAlign: 'center', color: 'blue' }}>
            SelectNetwork: {suspectedNetwork}
          </Text> : ''}
          {selectedAccount ? <Text style={{ fontSize: 11, textAlign: 'center', color: 'blue' }}>
            Address: {selectedAccount}
          </Text> : ''}
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
})

export default App
