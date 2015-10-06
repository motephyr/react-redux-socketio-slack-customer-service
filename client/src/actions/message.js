export const INPUT_MESSAGE = 'INPUT_MESSAGE'

export function input(message) {
  return {
    type: INPUT_MESSAGE,
    message
  }
}
