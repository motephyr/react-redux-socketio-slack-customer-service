export const INPUT_MESSAGE = 'INPUT_MESSAGE'


export function input(messages) {
  return {
    type: INPUT_MESSAGE,
    messages
  }
}


export const FILL_EMAIL = 'FILL_EMAIL'

export function fill(email) {
  return {
    type: FILL_EMAIL,
    email
  }
}



export const CHANGE_ISPANELSHOW = 'CHANGE_ISPANELSHOW'

export function change(is_panel_show) {
  return {
    type: CHANGE_ISPANELSHOW,
    is_panel_show
  }
}