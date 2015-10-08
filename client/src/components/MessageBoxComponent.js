import {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'

@connect(state => ({
  messages: state.messages
}))

export default class MessageBoxComponent extends Component {

  //保證物件有從外部傳來
  static propTypes = {
    actions: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired
  }

  render() {
    const {messages,actions} = this.props
    return (
      <div>
      <MessageTextarea messages={messages} />
      <ControllerPanel actions={actions} />
      </div>
    )
  }
}



class MessageTextarea extends Component {
  render() {
    var messages = this.props.messages
    var textareaValue = _.map(messages, (x) => `${x.name}:\n         ${x.text} \n`).join(' ')
    let divStyle = {
      WebkitTransition: 'all', // note the capital 'W' here
      msTransition: 'all', // 'ms' is the only lowercase vendor prefix
      height: 500,
      width: 400
    };
    return (
      <textarea style={divStyle} name="description" value={textareaValue} />
    )
  }
}

class ControllerPanel extends Component {


  handleSubmit(e) {
    const {actions} = this.props
    actions.input({
      name:  React.findDOMNode(this.refs.email).value.trim(),
      text:  React.findDOMNode(this.refs.text).value.trim()
    })
  }

  render() {
    const {actions} = this.props
    return (
      <form onSubmit={::this.handleSubmit}>
        <input type="text" placeholder="Email" ref="email" />
        <br />
        <input type="text"  ref="text" />
        <br />
        <button>送出</button>
      </form>
    )
  }
}
