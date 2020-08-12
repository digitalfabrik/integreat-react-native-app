// @flow

import { reduce, forEach, merge } from 'lodash'
import defaultLocales from '../../../locales/locales.json'
import malteLocales from '../../../locales/malte-locales.json'
import buildConfig from '../app/constants/buildConfig'

type LocalesType = { [namespace: string]: { [language: string]: { [key: string]: string } } }
type TransformedLocalesType = { [language: string]: { [namespace: string]: { [key: string]: string } } }

/**
 * Transform locale resources from our internal locales format to be i18next compatible.
 * @param {object} locales in our format: namespace -> languageCode -> key -> value
 * @returns {object} transformed locales in the format: languageCode -> namespace -> key -> value
 */
const transformLocales = (locales: TransformedLocalesType): TransformedLocalesType => reduce(
  locales,
  (transformedLocales, namespace, namespaceName) => {
    forEach(namespace, (language, languageCode) => {
      transformedLocales[languageCode] = {
        ...transformedLocales[languageCode],
        [namespaceName]: language
      }
    })
    return transformedLocales
  },
  {}
)

const chooseLocales = (): LocalesType => {
  if (buildConfig().localesOverride === 'Malte') {
    return merge(defaultLocales, malteLocales)
  }

  return defaultLocales
}

const loadLocales = (): TransformedLocalesType => {
  const locales = chooseLocales()
  return transformLocales(locales)
}

export default loadLocales
