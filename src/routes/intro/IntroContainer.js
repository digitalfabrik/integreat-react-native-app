// @flow

import { translate, type TFunction } from 'react-i18next'
import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import Language from './assets/Language.svg'
import Offers from './assets/Offers.svg'
import Search from './assets/Search.svg'
import Events from './assets/Events.svg'
import type { ThemeType } from '../../modules/theme/constants/theme'
import withTheme from '../../modules/theme/hocs/withTheme'
import { Switch, FlatList, Dimensions } from 'react-native'
import styled, { type StyledComponent } from 'styled-components/native'
import AppSettings from '../../modules/settings/AppSettings'
import SettingItem from '../settings/components/SettingItem'
import SlideContent, { type SlideContentType } from './SlideContent'
import SentryIntegration from '../../modules/app/SentryIntegration'
import SlideFooter from './SlideFooter'
import type { ViewToken } from 'react-native/Libraries/Lists/ViewabilityHelper'

const Container: StyledComponent<{ width: number }, {}, *> = styled.View`
  display: flex;
  flex-direction: column;
  width: ${props => props.width};
  height: 100%;
  justify-content: space-between;
`

const ImageContent = styled.Image`
  justify-content: center;
  align-self: center;
  display: flex;
  height: 100%;
  width: 60%;
  resize-mode: contain
`

type PropsType = {| t: TFunction, navigation: NavigationScreenProp<*>, theme: ThemeType |}
type StateType = {|
  slideCount: number,
  currentSlide: number,
  allowPushNotifications: boolean,
  useLocationAccess: boolean,
  allowSentry: boolean,
  width: number
|}

class Intro extends React.Component<PropsType, StateType> {
  _appSettings: AppSettings
  _flatList: {current: null | React$ElementRef<typeof FlatList>}

  constructor (props: PropsType) {
    super(props)
    this.state = {
      slideCount: this.slides().length,
      currentSlide: 0,
      allowPushNotifications: false,
      useLocationAccess: false,
      allowSentry: false,
      width: Dimensions.get('window').width
    }
    this._appSettings = new AppSettings()
    this._flatList = React.createRef()
  }

  renderImageContent = (image: number) => (): React.Node => <ImageContent source={image} />

  slides = (): Array<SlideContentType> => {
    const { t } = this.props
    return [{
      key: t('search'),
      title: t('search'),
      description: t('searchDescription'),
      renderContent: this.renderImageContent(Search)
    }, {
      key: t('events'),
      title: t('events'),
      description: t('eventsDescription'),
      renderContent: this.renderImageContent(Events)
    }, {
      key: t('offers'),
      title: t('offers'),
      description: t('offersDescription'),
      renderContent: this.renderImageContent(Offers)
    }, {
      key: t('languageChange'),
      title: t('languageChange'),
      description: t('languageChangeDescription'),
      renderContent: this.renderImageContent(Language)
    }, {
      key: t('inquiry'),
      title: t('inquiryTitle'),
      renderContent: this.renderSettings
    }]
  }

  setAllowPushNotifications = () => this.setState(prevState =>
    ({ allowPushNotifications: !prevState.allowPushNotifications }))

  setUseLocationAccess = () => this.setState(prevState => ({ useLocationAccess: !prevState.useLocationAccess }))

  setAllowSentry = () => this.setState(prevState => ({ allowSentry: !prevState.allowSentry }))

  renderSettings = (): React.Node => {
    const { t, theme } = this.props
    const themeColor = theme.colors.themeColor
    const { allowPushNotifications, useLocationAccess } = this.state

    return <>
      <SettingItem bigTitle title={t('pushNewsTitle')} description={t('pushNewsDescription')}
                   onPress={this.setAllowPushNotifications} theme={theme}>
        <Switch thumbColor={themeColor} trackColor={{ true: themeColor }}
                onValueChange={this.setAllowPushNotifications} value={allowPushNotifications} />
      </SettingItem>
      <SettingItem bigTitle title={t('locationTitle')} description={t('locationDescription')}
                   onPress={this.setUseLocationAccess} theme={theme}>
        <Switch thumbColor={themeColor} trackColor={{ true: themeColor }}
                onValueChange={this.setUseLocationAccess} value={useLocationAccess} />
      </SettingItem>
      <SettingItem bigTitle title={t('sentryTitle')} description={t('sentryDescription')}
                   onPress={this.setAllowSentry} theme={theme}>
        <Switch thumbColor={themeColor} trackColor={{ true: themeColor }}
                onValueChange={this.setAllowSentry} value={useLocationAccess} />
      </SettingItem>
    </>
  }

  onAccept = () => { this.onDone(true) }

  onContinue = () => { this.onDone(false) }

  onDone = async (accept: boolean) => {
    const allowPushNotifications = accept ? true : this.state.allowPushNotifications
    const errorTracking = accept ? true : this.state.allowSentry
    const useLocationAccess = accept ? true : this.state.useLocationAccess

    if (errorTracking) {
      const sentry = new SentryIntegration()
      await sentry.install()
    }

    if (useLocationAccess) {
      // TODO request permission, return if not granted
    }

    await this._appSettings.setSettings({ errorTracking, allowPushNotifications, useLocationAccess })
    this._appSettings.setIntroShown()
    this.props.navigation.navigate('Landing')
  }

  goToSlide = (index: number) => {
    if (!this._flatList.current) {
      throw Error('ref not correctly set')
    }
    this._flatList.current.scrollToIndex({ index })
  }

  renderSlide = ({ item }: { item: SlideContentType }) => {
    return <SlideContent item={item} theme={this.props.theme} width={this.state.width} />
  }

  onViewableItemsChanged = ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    if (viewableItems.length === 1) {
      if (viewableItems[0].index !== null) {
        this.setState({ currentSlide: viewableItems[0].index })
      }
    }
  }

  render () {
    const { theme, t } = this.props
    const { slideCount, currentSlide, width } = this.state
    return <Container width={width}>
      <FlatList ref={this._flatList} data={this.slides()} horizontal pagingEnabled
                viewabilityConfig={{ itemVisiblePercentThreshold: 51, minimumViewTime: 0.1 }}
                onViewableItemsChanged={this.onViewableItemsChanged} showsHorizontalScrollIndicator={false}
                bounces={false} renderItem={this.renderSlide} />
      <SlideFooter slideCount={slideCount} onAccept={this.onAccept} onContinue={this.onContinue}
                   currentSlide={currentSlide} goToSlide={this.goToSlide} theme={theme} t={t} />
    </Container>
  }
}

export default translate('intro')(withTheme()(Intro))