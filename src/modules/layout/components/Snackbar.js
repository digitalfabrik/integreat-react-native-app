// @flow

import React from 'react'
import { Animated, Linking } from 'react-native'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'

const Container: StyledComponent<{}, ThemeType, *> = styled(Animated.View)`
  background-color: ${props => props.theme.colors.textSecondaryColor};
  flex-direction: column;
  align-items: center;
  padding: 10px;
`

const Title: StyledComponent<{}, ThemeType, *> = styled.Text`
  padding: 0 10px;
  color: ${props => props.theme.colors.backgroundColor};
  font-size: 25px;
  font-weight: bold;
  text-align: center;
`

const Message: StyledComponent<{}, ThemeType, *> = styled.Text`
  padding: 0 10px;
  color: ${props => props.theme.colors.backgroundColor};
  font-size: 18px;
  text-align: center;
`

const ActionContainer: StyledComponent<{}, ThemeType, *> = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`

const Action: StyledComponent<{}, ThemeType, *> = styled.Text`
  flex: 1;
  color: ${props => props.theme.colors.themeColor};
  font-size: 18px;
  justify-content: center;
  text-align: center;
  padding: 10px;
  font-weight: bold;
`

export type SnackbarActionType = {|
  label: string,
  onPress: () => void | Promise<void>
|} | {|
  label: string,
  href: string
|}

export type PropsType = {|
  title?: string,
  message: string,
  positiveAction: SnackbarActionType,
  negativeAction: SnackbarActionType,
  theme: ThemeType
|}

class Snackbar extends React.Component<PropsType> {
  onPositive = () => {
    const { positiveAction } = this.props
    positiveAction.onPress ? positiveAction.onPress() : Linking.openURL(positiveAction.href)
  }

  onNegative = () => {
    const { negativeAction } = this.props
    negativeAction.onPress ? negativeAction.onPress() : Linking.openURL(negativeAction.href)
  }

  render () {
    const { theme, title, message, positiveAction, negativeAction } = this.props

    return (
      <Container theme={theme}>
        {title && <Title theme={theme}>{title}</Title>}
        <Message theme={theme}>{message}</Message>
        <ActionContainer>
          <Action theme={theme} onPress={this.onNegative}>{negativeAction.label}</Action>
          <Action theme={theme} onPress={this.onPositive}>{positiveAction.label}</Action>
        </ActionContainer>
      </Container>
    )
  }
}

export default Snackbar
