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