import _ from 'lodash'
import * as types from '../actions/messages'

const initialState = '';

export default function email(state = initialState, action) {
  //state是指先前的狀能
  //action是指action傳來的值
  switch (action.type) {
  case types.FILL_EMAIL:
    return action.email

  default:
    return state
  }
}

// mergeInto = { a: 1}
// toMerge = {a : undefined, b:undefined}
// lodash.extend({}, mergeInto, toMerge) // => {a: undefined, b:undefined}
// lodash.merge({}, mergeInto, toMerge)  // => {a: 1, b:undefined}
// return _.merge({}, {...state}, action.message)

//[{
    //   id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
    //   completed: false,
    //   text: action.text
    // }, ...state];