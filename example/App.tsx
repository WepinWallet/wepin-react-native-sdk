/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Sample Wepin React Native Test App
 *
 * @format
 */

import React, { useState, useMemo } from 'react'
import {
  Alert,
  Button,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Wepin from '@wepin/react-native-sdk'
import { getBundleId } from 'react-native-device-info'
import { AttributesType } from '@wepin/types'
import { Text } from 'react-native'
import RadioGroup from 'react-native-radio-buttons-group'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { providerTest } from './src/providerTest'
import { web3Test } from './src/web3Test'
import CustomModal from './src/components/CustomModal'

const deviceHeight = Dimensions.get('window').height

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'
  const appKey = 'test_app_key'

  const [result, setResult] = useState<any>()
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  const wepin = Wepin.getInstance()
  const provider = providerTest.getInstance(wepin)
  const web3TestInstance = web3Test.getInstance(wepin)
  const [accounts, setAccounts] = useState<{ address: string; network: string; }[] | undefined>()
  const [selectedAccount, setSelectedAccount] = useState('')
  const [suspectedNetwork, setSuspectedNetwork] = useState<any>()

  const AvailableNetworks = useMemo<any>(() => {

    let id = 0
    // console.log('accounts', accounts)

    if (accounts) {
      const array = accounts?.map((account) => {
        return {
          id: (id++).toString(),
          label: (<Text style={{ color: '#111111' }}>{account.network.toLowerCase()}</Text>),
          value: account.network.toLowerCase(),
          selected: true,
          size: 15
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
      // console.log('filterArray', filterArray)
      return filterArray
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
      await wepin.init('', appKey, {
        type,
        defaultCurrency: 'krw',
        defaultLanguage: 'ko',
      })
      const isInitialized = wepin.isInitialized()
      if (type !== 'show') {
        setResult('wepin isInitialized: ' + isInitialized)
      }
    } catch (e) {
      console.error(e)
      setResult('already wepin initialized')
    }
  }

  const initWepinEng = async (type: AttributesType) => {
    try {
      await wepin.init('', appKey, {
        type,
        defaultCurrency: 'USD',
        defaultLanguage: 'en',
      })
      const isInitialized = wepin.isInitialized()
      if (type !== 'show') {
        setResult('wepin isInitialized: ' + isInitialized)
      }
    } catch (e) {
      console.error(e)
      setResult('already wepin initialized')
    }
  }

  const isInit = () => {
    console.log('isInit')
    try {
      const isInitialized = wepin.isInitialized()
      setResult('wepin isInitialized: ' + isInitialized)
    } catch (e) {
      console.error(e)
    }
  }

  const getStatus = async () => {
    console.log('getStatus')
    try {
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
      await wepin.logout()
      setResult('logoutWepin: success')
    } catch (e) {
      console.error(e)
      setResult('logoutWepin: fail')
    }
  }

  const openWepinWidget = async () => {
    console.log('openWepinWidget')
    try {
      await wepin.openWidget()
    } catch (e) {
      console.error(e)
      setResult('openWepinWidget exception')
    }
  }

  const closeWepinWidget = () => {
    console.log('closeWepinWidget')
    try {
      wepin.closeWidget()
    } catch (e) {
      console.error(e)
      setResult('closeWepinWidget exception')
    }
  }

  const getAccounts = async () => {
    console.log('getAccounts')
    try {
      const accountList = await wepin.getAccounts()
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

  const finalizeWepin = () => {
    console.log('finalizeWepin')
    console.log('queue', wepin.queue)
    try {
      // ToDo
      wepin.finalize()
    } catch (e) {
      console.error(e)
    }
  }

  const testItemListView = (
    <ScrollView 
      style={{
        marginTop: 20,
        flex:1,
        width: "80%",
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
        <Button title="Open_widget" onPress={() => openWepinWidget()} />
      </View>
      <View style={styles.button}>
        <Button title="Close_widget" onPress={() => closeWepinWidget()} />
      </View>
      <View style={styles.button}>
        <Button title="Get_Accounts" onPress={() => getAccounts()} />
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
    setTimeout(() => {
      provider.saveDataAndCall(data, providerMethod!)
    }, 100)

    // setModalVisible(false)
  }
  const providerTestItemListView = (
    <>
      {
        AvailableNetworks && AvailableNetworks?.length !== 0 ?
          <>
            <Text style={{ fontSize: 15, marginTop: 10, textAlign: 'center', color: 'blue' }}>
              Network List
            </Text>
            <ScrollView
              style={{
                marginTop: 5,
                flex: 1,
                width: "80%",
                borderColor: 'blue',
                borderWidth: 1,
              }}>
              <RadioGroup
                radioButtons={AvailableNetworks}
                onPress={(val: any) => { setSuspectedNetwork(AvailableNetworks[val]?.value); provider.setConfig(AvailableNetworks[val]?.value, setResult, setSelectedAccount) }}
                // selectedValue={suspectedNetwork}
                // selectedId={suspectedNetwork}
                layout="column" // "row" 또는 "column"을 선택하여 라디오 버튼의 배열 방향을 조절할 수 있습니다.
              />
            </ScrollView>
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
    setTimeout(() => {
      web3TestInstance.saveDataAndCall(data, web3rMethod!)
    }, 100)
    // setWeb3ModalVisible(false)
  }
  const web3TestItemListView = (
    <>
      {
        AvailableNetworks && AvailableNetworks?.length !== 0 ?
          <>
            <Text style={{ fontSize: 15, marginTop: 10, textAlign: 'center', color: 'blue' }}>
              Network List
            </Text>
            <ScrollView
              style={{
                marginTop: 5,
                flex: 1,
                width: "80%",
                borderColor: 'blue',
                borderWidth: 1,
              }}>
              <RadioGroup
                radioButtons={AvailableNetworks}
                onPress={(val: any) => { setSuspectedNetwork(AvailableNetworks[val]?.value); web3TestInstance.setConfig(AvailableNetworks[val]?.value, setResult, setSelectedAddress) }}
                // selectedValue={suspectedNetwork}
                // selectedId={suspectedNetwork}
                layout="column" // "row" 또는 "column"을 선택하여 라디오 버튼의 배열 방향을 조절할 수 있습니다.
              />
            </ScrollView>
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
    <>
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
        <Wepin.WidgetView>
        </Wepin.WidgetView>
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
        <ScrollView style={{flex:0.5, paddingStart: 10, paddingEnd: 10, width: '80%', backgroundColor: '#E0E0E0', borderRadius: 10 }}>
          <Text style={{ marginTop: 10 ,fontSize: 20, textAlign: 'left', color:'black'}}>
            {result}
          </Text>
        </ScrollView>
      </View>
    </>
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
})

export default App
