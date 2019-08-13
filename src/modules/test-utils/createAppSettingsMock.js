// @flow

import type { AppSettingsType, SettingsType } from '../settings/AppSettings'
import { defaultSettings } from '../settings/AppSettings'

const defaultLoadSettings = () => Promise.resolve(defaultSettings)
const defaultSetSettings = (settings: $Shape<SettingsType>) => Promise.resolve()
const defaultLoadContentLanguage = () => Promise.resolve('de')
const defaultSetContentLanguage = (contentLanguage: string) => Promise.resolve()
const defaultLoadSelectedCity = () => Promise.resolve('augsburg')
const defaultSetSelectedCity = (selectedCity: string) => Promise.resolve()
const defaultClearSelectedCity = () => Promise.resolve()

const defaultImplementations: AppSettingsType = {
  loadSettings: defaultLoadSettings,
  setSettings: defaultSetSettings,
  loadContentLanguage: defaultLoadContentLanguage,
  setContentLanguage: defaultSetContentLanguage,
  loadSelectedCity: defaultLoadSelectedCity,
  setSelectedCity: defaultSetSelectedCity,
  clearSelectedCity: defaultClearSelectedCity
}

const createAppSettingsMock = (implementations: $Shape<AppSettingsType>): AppSettingsType => {
  return {
    ...defaultImplementations,
    ...implementations
  }
}

export default createAppSettingsMock