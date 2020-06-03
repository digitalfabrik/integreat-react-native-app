// @flow

import { LocationModel, PoiModel } from '@integreat-app/integreat-api-client'
import moment from 'moment'

const map = {}
map.ID1 = 'Farm1'
map.ID2 = 'Farm2'

const pois = [
  new PoiModel({
    path: 'test',
    title: 'test',
    content: 'test',
    thumbnail: 'test',
    availableLanguages: map,
    excerpt: 'test',
    location: new LocationModel('name', 'address', 'town', '123456', '15', '15'),
    lastUpdate: moment.tz('GMT'),
    hash: 'test'
  }),
  new PoiModel({
    path: 'test',
    title: 'test',
    content: 'test',
    thumbnail: 'test',
    availableLanguages: map,
    excerpt: 'test',
    location: new LocationModel('name', 'address', 'town', '123456', '15', '15'),
    lastUpdate: moment.tz('GMT'),
    hash: 'test'
  })
]

class PoiModelBuilder {
  _poisCount: number

  constructor (poisCount: number) {
    if (this._poisCount > pois.length) {
      throw new Error(`Only ${pois.length} poi models can be created`)
    }
    this._poisCount = poisCount
  }

  build (): Array<PoiModel> {
    return pois.slice(0, this._poisCount)
  }
}

export default PoiModelBuilder