import _ from 'lodash'
import * as types from '../actions/messagebox'

const initialState = {
  ui: {
    page: '',
    is_panel_show: false,
    is_email_column_show: false
  },
  messages: [{
    id: 0,
    name: '@customerService',
    text: "hello,may i help you?",
    time: new Date().toString()
  },{
    id: 1,
    name: '@customerService',
    text: "hello,may i help you?",
    time: new Date().toString()
  },{
    id: 2,
    name: 'customerService',
    text: "hello,may i help you?ajsoidfjaosidjfpoaisjdpfoiajsdpoijgqeproijgqoepirjgpoi/noajsdfoiasjdofi",
    time: new Date().toString()
  }]
}

export default function messagebox(state = initialState, action) {
  //state是指先前的狀能
  //action是指action傳來的值
  switch (action.type) {

  case types.CHANGE_PAGE:
    return {...state, ui: {...state.ui,
          page: action.page,
          user_id: action.user_id
      }
    };

  case types.INPUT_MESSAGE:
    return {...state, messages: [...state.messages, {
        id: state.messages.reduce((maxId, messages) => Math.max(messages.id, maxId), -1) + 1,
        name: action.messages.name,
        text: action.messages.text,
        time: new Date().toString()
      }]
    };

  case types.CHANGEPANEL_ISSHOW:
    return {...state, ui: {...state.ui,
          is_panel_show: action.is_show
      }
    }

  case types.CHANGEEMAILCOLUMN_ISSHOW:
    return {...state, ui: {...state.ui,
          is_email_column_show: action.is_show
      }
    }

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
