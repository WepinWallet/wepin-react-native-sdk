import { Platform } from 'react-native'

export type ItestMode = 'dev' | 'stage' | 'prod'

export const getApiKey = (mode: ItestMode, emailVerify?: boolean) => {
  return 'test_app_key'
}
