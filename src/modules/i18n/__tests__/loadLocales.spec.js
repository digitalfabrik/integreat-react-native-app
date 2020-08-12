// @flow

import loadLocales from '../loadLocales'

jest.mock(
  '../../../../locales/locales.json',
  () => require('../__mocks__/locales.js'),
  { virtual: true }
)
jest.mock(
  '../../../../locales/malte-locales.json',
  () => require('../__mocks__/malte-locales.js'),
  { virtual: true }
)

let mockBuildConfig
jest.mock('../../app/constants/buildConfig', () => {
  mockBuildConfig = jest.fn()
  return mockBuildConfig
})

describe('loadLocales', () => {
  it('should correctly transform locales', () => {
    mockBuildConfig.mockImplementation(() => ({}))
    expect(loadLocales()).toMatchSnapshot()
  })

  it('should correctly merge and transform locales', () => {
    mockBuildConfig.mockImplementation(() => ({ localesOverride: 'Malte' }))
    expect(loadLocales()).toMatchSnapshot()
  })
})
