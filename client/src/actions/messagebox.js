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