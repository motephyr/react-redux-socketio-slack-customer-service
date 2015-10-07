import _ from 'lodash'
import * as types from '../actions/message'

export default function message(state = {}, action) {
  //state是指先前的狀能
  //action是指action傳來的值

  switch (action.type) {
  case types.INPUT_MESSAGE:
    return _.merge({}, {...state}, action.message)

  default:
    return state
  }
}

// mergeInto = { a: 1}
// toMerge = {a : undefined, b:undefined}
// lodash.extend({}, mergeInto, toMerge) // => {a: undefined, b:undefined}
// lodash.merge({}, mergeInto, toMerge)  // => {a: 1, b:undefined}