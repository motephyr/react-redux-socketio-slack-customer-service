import * as types from '../actions/message'

export default function message(state = {}, action) {
  //state是指先前的狀能
  //action是指action傳來的值
  switch (action.type) {
  case types.INPUT_MESSAGE:
    return action.message

  default:
    return state
  }
}
