// @flow

import { LocalNewsModel } from '@integreat-app/integreat-api-client'
import seedrandom from 'seedrandom'
import { difference } from 'lodash'

const MAX_PREDICTABLE_VALUE = 6
const LANGUAGES = ['de', 'en', 'ar']

class LocalNewsModelBuilder {
  _newsCount: number
  _seed: string
  _city: string
  _language: string

  constructor (seed: string, newsCount: number, city: string, language: string) {
    this._seed = seed
    this._newsCount = newsCount
    this._city = city
    this._language = language
  }

  _predictableNumber (index: number, max: number = MAX_PREDICTABLE_VALUE): number {
    return seedrandom(index + this._seed)() * max
  }

  build (): Array<LocalNewsModel> {
    return this.buildAll().map(all => all.newsItem)
  }

  /**
   * Builds the requested amount of news. Two builds with an identical seed will yield equal news.
   * Note that they are not identical. Furthermore instances of external classes like `moment` or `LocalNewsModel` maybe are
   * not equal when comparing all the properties.
   *
   * @returns The news and the corresponding resource cache
   */
  buildAll (): Array<{ path: ?string, newsItem: LocalNewsModel }> {
    return Array.from({ length: this._newsCount }, (x, index) => {
      return {
        path: null,
        newsItem: new LocalNewsModel({
          id: 12,
          title: 'first news item',
          availableLanguages: new Map(difference(LANGUAGES, [this._language]).map(
            lng => [lng, null]
          )),
          timestamp: new Date(),
          message: 'This is a sample news'
        })

      }
    })
  }
}

export default LocalNewsModelBuilder