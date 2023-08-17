/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Sample Wepin React Native Test App
 *
 * @format
 */

import React from 'react'
import {
  Alert,
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Wepin from '@wepin/react-native-sdk'
import { getBundleId } from 'react-native-device-info'

const deviceHeight = Dimensions.get('window').height

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'
  const appKey = 'test_app_key'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  const wepin = Wepin.getInstance()
  const initWepinKor = async () => {
    try {
      await wepin.init('', appKey, {
        type: 'show',
        defaultCurrency: 'krw',
        defaultLanguage: 'ko',
      })
    } catch (e) {
      console.error(e)
      Alert.alert('already wepin initialized')
    }
  }

  const initWepinEng = async () => {
    try {
      await wepin.init('', appKey, {
        type: 'show',
        defaultCurrency: 'USD',
        defaultLanguage: 'en',
      })
    } catch (e) {
      console.error(e)
      Alert.alert('already wepin initialized')
    }
  }

  const isInit = () => {
    console.log('isInit')
    try {
      const isInitialized = wepin.isInitialized()
      Alert.alert('wepin isInitialized: ' + isInitialized)
    } catch (e) {
      console.error(e)
    }
  }

  const openWepinWidget = async () => {
    console.log('openWepinWidget')
    try {
      await wepin.openWidget()
    } catch (e) {
      console.error(e)
      Alert.alert('openWepinWidget exception')
    }
  }

  const closeWepinWidget = () => {
    console.log('closeWepinWidget')
    try {
      wepin.closeWidget()
    } catch (e) {
      console.error(e)
      Alert.alert('closeWepinWidget exception')
    }
  }

  const getAccounts = async () => {
    console.log('getAccounts')
    try {
      const accounts = await wepin.getAccounts()
      if (accounts?.length) {
        Alert.alert('accountList', JSON.stringify(accounts))
      } else {
        Alert.alert('accountList', '[]')
      }
    } catch (e) {
      console.error(e)
      Alert.alert('getAccounts exception')
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
    <View style={styles.button}>
      <View style={styles.button}>
        <Button title="Initialize(kor)" onPress={() => initWepinKor()} />
      </View>
      <View style={styles.button}>
        <Button title="Initialize(eng)" onPress={() => initWepinEng()} />
      </View>
      <View style={styles.button}>
        <Button title="Is_initialized" onPress={() => isInit()} />
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
    </View>
  )

  return (
    <Wepin.WidgetView>
      <SafeAreaView style={backgroundStyle}>
        <View
          style={{
            height: deviceHeight,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {testItemListView}
        </View>
      </SafeAreaView>
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
})

export default App
