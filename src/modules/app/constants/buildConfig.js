// @flow

import type { BuildConfigType } from '../../../../build-configs/configs/BuildConfigType'

let config: ?BuildConfigType = null

const requireConfig = (): BuildConfigType => {
  const validConfigNames = ['integreat', 'integreat-test-cms', 'malte']
  const buildConfigName = __CONFIG_NAME__

  if (!buildConfigName) {
    throw new Error('You need to specify a config name!')
  } else if (!validConfigNames.includes(buildConfigName)) {
    throw new Error(`Invalid config name! Allowed configs: ${validConfigNames.join()}`)
  }
  // $FlowFixMe Ignore 'The parameter passed to `require()` must be a string literal'
  return require(`../../../../build-configs/configs/${__CONFIG_NAME__}`)
}

const buildConfig = (): BuildConfigType => {
  if (!config) {
    config = requireConfig()
    console.warn(config)
    return config
  }
  return config
}

export default buildConfig
