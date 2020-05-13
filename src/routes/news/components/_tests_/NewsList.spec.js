// @flow

import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import configureMockStore from 'redux-mock-store'
import CityModelBuilder from '../../../../testing/builder/CityModelBuilder'
import LanguageModelBuilder from '../../../../testing/builder/LanguageModelBuilder'
import createNavigationScreenPropMock from '../../../../modules/test-utils/createNavigationScreenPropMock'
import LocalNewsModelBuilder from '../../../../testing/builder/NewsModelBuilder'
import type {
  NewsRouteStateType,
  StateType,
  LanguagesStateType,
  CitiesStateType
} from '../../../../modules/app/StateType'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react-native'
import ErrorCodes from '../../../../modules/error/ErrorCodes'
import { Text, ActivityIndicator } from 'react-native'
import { LOADING_TIMEOUT } from '../../../../modules/common/constants'

const mockStore = configureMockStore()
jest.mock('react-i18next')
jest.useFakeTimers()

class MockNewsList extends React.Component<{}> {
  render () {
    return <Text>News List</Text>
  }
}

describe('News', () => {
  const [city] = new CityModelBuilder(1).build()
  const cities = new CityModelBuilder(1).build()
  const languages = new LanguageModelBuilder(1).build()
  const language = languages[0]
  const newsList = new LocalNewsModelBuilder(
    'NewsList-Component',
    1,
    cities[0].cityCode,
    languages[0].code
  ).build()

  const prepareState = (
    routeState: ?NewsRouteStateType,
    {
      switchingLanguage,
      cities,
      languages
    }: {|
      switchingLanguage?: boolean,
      cities?: CitiesStateType,
      languages?: LanguagesStateType
    |} = {}
  ): StateType => {
    return {
      darkMode: false,
      cityContent: {
        city: city.code,
        switchingLanguage:
          switchingLanguage !== undefined ? switchingLanguage : false,
        languages: languages || { status: 'ready', models: [language] },
        eventsRouteMapping: {},
        categoriesRouteMapping: {},
        newsRouteMapping: routeState ? { 'route-id-0': routeState } : {},
        searchRoute: null,
        resourceCache: { status: 'ready', value: { file: {} } }
      },
      contentLanguage: 'de',
      cities: cities || { status: 'ready', models: [city] }
    }
  }

  const successfulRouteState: NewsRouteStateType = {
    status: 'ready',
    language: language.code,
    path: null,
    type: 'local',
    page: 1,
    city: city.code,
    models: newsList,
    hasMoreNews: true,
    allAvailableLanguages: new Map()
  }

  it('should display null if the route is not initialized', () => {
    const state: StateType = prepareState()
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    jest.mock('../NewsList', () => {
      const Text = require('react-native').Text
      return () => <Text>News List</Text>
    })
    const NewsContainer = require('../../containers/NewsContainer').default

    const result = TestRenderer.create(
      <Provider store={store}>
        <NewsContainer navigation={navigation} />
      </Provider>
    )
    expect(result.toJSON()).toBeNull()
  })

  const expectError = (state: StateType, message: string) => {
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    jest.mock('../NewsList', () => {
      const Text = require('react-native').Text
      return () => <Text>News List</Text>
    })
    const NewsContainer = require('../../containers/NewsContainer').default

    const { getByText } = render(
      <Provider store={store}>
        <NewsContainer navigation={navigation} />
      </Provider>
    )
    expect(getByText(message)).toBeTruthy()
  }

  it('should display error if the route has the status error', () => {
    const state: StateType = prepareState({
      status: 'error',
      language: language.code,
      city: city.code,
      path: null,
      type: 'local',
      message: 'Something went wrong with the route',
      code: ErrorCodes.UnknownError
    })
    expectError(state, ErrorCodes.UnknownError)
  })

  it('should display error if cities could not be loaded', () => {
    const state: StateType = prepareState(successfulRouteState, {
      cities: {
        status: 'error',
        message: 'Something went wrong with the cities',
        code: ErrorCodes.UnknownError
      }
    })
    expectError(state, ErrorCodes.UnknownError)
  })

  const expectLoadingIndicator = (state: StateType) => {
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    const store = mockStore(state)
    jest.doMock('../NewsList', () => MockNewsList)
    const NewsContainer = require('../../containers/NewsContainer').default
    const result = TestRenderer.create(
      <Provider store={store}><NewsContainer navigation={navigation} /></Provider>
    )
    jest.advanceTimersByTime(LOADING_TIMEOUT)
    const indicator = result.root.findByType(ActivityIndicator)
    expect(indicator).toBeTruthy()
  }

  it('should display loading indicator if the route is loading long enough', () => {
    const state: StateType = prepareState({
      path: null,
      status: 'loading',
      type: 'local',
      language,
      city
    })
    expectLoadingIndicator(state)
  })

  it('should display loading indicator if switching languages lasts long enough', () => {
    const state: StateType = prepareState(successfulRouteState, { switchingLanguage: true })
    expectLoadingIndicator(state)
  })

  it('should display loading indicator if cities are loading long enough', () => {
    const state: StateType = prepareState(successfulRouteState, { cities: { status: 'loading' } })
    expectLoadingIndicator(state)
  })

  it('should display loading indicator if languages are loading long enough', () => {
    const state: StateType = prepareState(successfulRouteState, { languages: { status: 'loading' } })
    expectLoadingIndicator(state)
  })

  it('should display NewsListItem component if the state is ready', () => {
    const state: StateType = prepareState(successfulRouteState)
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    jest.doMock('../NewsList', () => MockNewsList)
    const NewsContainer = require('../../containers/NewsContainer').default
    const result = TestRenderer.create(
      <Provider store={store}><NewsContainer navigation={navigation} /></Provider>
    )
    const newsListInstance = result.root.findByProps({ newsList: newsList })

    expect(newsListInstance).toBeTruthy()
  })
})