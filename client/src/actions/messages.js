export const INPUT_MESSAGE = 'INPUT_MESSAGE'

export function input(messages) {
  return {
    type: INPUT_MESSAGE,
    messages
  }
}
