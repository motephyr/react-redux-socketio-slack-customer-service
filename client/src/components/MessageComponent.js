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

  handleChange(e) {
    const {actions} = this.props
    actions.input({ email:e.target.value})
  }

  render() {
    const { message } = this.props

    return (
      <p>
        <input onChange={::this.handleChange} value={ message.email } />{ message.email }
      </p>
    )
  }
}

