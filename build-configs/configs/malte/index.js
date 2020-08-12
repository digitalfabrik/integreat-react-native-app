// @flow

import { lightTheme, darkTheme } from '../../themes/malte'
import type { BuildConfigType } from '../BuildConfigType'

const APP_NAME = 'Malte'
export const MALTE_ICONS = 'MALTE'

const MalteBuildConfig: BuildConfigType = {
  appName: APP_NAME,
  lightTheme,
  darkTheme,
  localesOverride: APP_NAME,
  iconSet: MALTE_ICONS,
  cmsUrl: 'https://cms.malteapp.de',
  allowedHostNames: ['cms.malteapp.de'],
  featureFlags: {
    pois: false,
    newsStream: false,
    introSlides: true
  }
}

export default MalteBuildConfig
