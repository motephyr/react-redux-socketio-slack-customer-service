import * as types from '../actions/message'

export default function message(state = {}, action) {
  //state是指先前的狀能
  //action是指action傳來的值
  console.log(state);
  switch (action.type) {
  case types.INPUT_MESSAGE:
    return {...state,
      email: action.message.email,
      text: action.message.text
    }

  default:
    return state
  }
}
