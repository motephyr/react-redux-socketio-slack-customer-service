export const CHANGE_PAGE = 'CHANGE_PAGE'

export function change(page,user_id) {
  return {
    type: CHANGE_PAGE,
    page,
    user_id
  }
}


export const INPUT_MESSAGE = 'INPUT_MESSAGE'

export function input(messages) {
  return {
    type: INPUT_MESSAGE,
    messages
  }
}


export const CHANGEPANEL_ISSHOW = 'CHANGEPANEL_ISSHOW'

export function change_panel(is_show) {
  return {
    type: CHANGEPANEL_ISSHOW,
    is_show
  }
}

export const CHANGEEMAILCOLUMN_ISSHOW = 'CHANGEEMAILCOLUMN_ISSHOW'

export function change_email_column(is_show) {
  return {
    type: CHANGEEMAILCOLUMN_ISSHOW,
    is_show
  }
}

export const CHANGE_LIST = 'CHANGE_LIST'

export function initial_list(data) {
  return {
    type: CHANGE_LIST,
    room: data.room,
    users: data.users,
    currentUser: data.currentUser
  }
}

export const JOIN_USER = 'JOIN_USER'

export function join_user(data) {
  return {
    type: JOIN_USER,
    user: data
  }
}

export const LEFT_USER = 'LEFT_USER'

export function left_user(data) {
  return {
    type: LEFT_USER,
    user: data
  }
}


export const CHANGE_NAME = 'CHANGE_NAME'

export function change_name(data) {
  return {
    type: CHANGE_NAME,
    user: data
  }
}

export const CHANGE_USERNAME = 'CHANGE_USERNAME'


export function change_username(username) {
  return {
    type: CHANGE_USERNAME,
    username: username
  }
}

