import { Platform } from 'react-native'

export type ItestMode = 'dev' | 'stage' | 'prod'

export const getApiKey = (mode: ItestMode, emailVerify?: boolean) => {
  return 'test_app_key'
}

export const getApiKeyList = () => {
  let dropdownKeyList: any[] = []
  let apiKeyList: any[] = []
  let idx = 0
    dropdownKeyList.push({
      key: (idx++).toString(),
      value: `${getApiKey('dev')}`
    })
    apiKeyList.push(getApiKey('dev'))
  return { dropdownKeyList, apiKeyList }
}