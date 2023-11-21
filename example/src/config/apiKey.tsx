import { Platform } from 'react-native'

export type ItestMode = 'dev' | 'stage' | 'prod'

export const getApiKey = (mode: ItestMode, emailVerify?: boolean) => {
  //return 'ak_dev_Ch5a8a2ylJ1lz0Bb5aGqlxAGoGJ7nMUuHWOVDb8Z6yy'
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