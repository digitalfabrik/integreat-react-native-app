// @flow

import { darkTheme, lightTheme } from '../../themes/malte'
import type { BuildConfigType } from '../BuildConfigType'
import malteOverrideLocales from '../../../locales/malte-locales.json'
export const MALTE_ICONS = 'MALTE'

const MalteBuildConfig: BuildConfigType = {
  appName: 'Malte',
  lightTheme,
  darkTheme,
  localesOverride: malteOverrideLocales,
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
