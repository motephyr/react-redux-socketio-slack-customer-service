import _ from 'lodash'
import * as types from '../actions/messagebox'

const initialState = {
  ui: {
    email: '',
  },
  messages: [{
    id: 0,
    name: '@customerService',
    text: "hello,may i help you?",
    time: new Date().toString()
  }]
}

export default function messagebox(state = initialState, action) {
  //state是指先前的狀能
  //action是指action傳來的值
  switch (action.type) {
  case types.INPUT_MESSAGE:
    return {...state, messages: [...state.messages, {
          id: state.messages.reduce((maxId, messages) => Math.max(messages.id, maxId), -1) + 1,
          name: action.messages.name,
          text: action.messages.text,
          time: new Date().toString()
        }]
      };

    case types.FILL_EMAIL:
      return {...state, ui:{email: action.email}}

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
