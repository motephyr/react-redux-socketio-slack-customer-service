import {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

@connect(state => ({
  message: state.message
}))

export default class MessageComponent extends Component {

  //保證物件有從外部傳來
  static propTypes = {
    actions: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired
  }

  handleChangeEmail(e) {
    const {actions,message} = this.props
    actions.input({ email:e.target.value, text: message.text})
  }

  handleChangeText(e) {
    const {actions,message} = this.props
    actions.input({ email:message.email, text: e.target.value})
  }

  handleSubmit(e) {
    console.log(e);
  }

  render() {
    const { message } = this.props

    return (
      <p>
        <input onChange={::this.handleChangeEmail} value={ message.email } />{message.email}
        <input onChange={::this.handleChangeText} value={ message.text } />{message.text}
        <button onKeyDown={::this.handleSubmit} >送出</button>
      </p>
    )
  }
}

