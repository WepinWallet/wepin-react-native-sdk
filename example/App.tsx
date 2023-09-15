/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Sample Wepin React Native Test App
 *
 * @format
 */

import React, { useState } from 'react'
import {
  Alert,
  Button,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Wepin from '@wepin/react-native-sdk'
import { getBundleId } from 'react-native-device-info'
import { AttributesType } from '@wepin/types'
import { Text } from 'react-native'

const deviceHeight = Dimensions.get('window').height

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'
  const appKey = 'test_app_key'

  const [result, setResult] = useState('')
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  const wepin = Wepin.getInstance()
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
      const accounts = await wepin.getAccounts()
      if (accounts?.length) {
        setResult('accountList: ' + JSON.stringify(accounts))
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
  return (
    <SafeAreaView style={backgroundStyle}>
      <View
        style={{
          height:deviceHeight,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection:'column'
        }}>
        <Text style={{ fontSize: 25, marginTop: 30, textAlign: 'center', color: 'black' }}>
          Test Menu
        </Text>
        {testItemListView}
        <Text style={{ fontSize: 25, marginTop: 20, textAlign: 'center', color: 'black' }}>
          Test Result
        </Text>
        <ScrollView style={{flex:0.5, paddingStart: 10, paddingEnd: 10, width: '80%', backgroundColor: '#E0E0E0', borderRadius: 10 }}>
          <Text style={{ marginTop: 10 ,fontSize: 20, textAlign: 'left', color:'black'}}>
            {result}
          </Text>
        </ScrollView>
      </View>
      <Wepin.WidgetView>
      </Wepin.WidgetView>
    </SafeAreaView>
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
})

export default App
