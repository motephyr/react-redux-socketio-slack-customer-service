import {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import ReactDOM from 'react-dom'



@connect(state => ({
  messages: state.messagebox.messages
}))

export default class MessageBoxComponent extends Component {

  render() {
    const {actions, socket} = this.props
    return (
      <div className="app">
        <Header actions={actions} />
        <MessageTextarea actions={actions} socket={socket} />
        <ControllerPanel actions={actions} socket={socket} />
      </div>
    )
  }
}

@connect(state => ({
  email: state.messagebox.ui.email,
}))
class Header extends Component {

  handleClick(e) {
    this.props.actions.change(false)
  }

  handleChange(e) {
    const {actions} = this.props
    actions.fill(ReactDOM.findDOMNode(this.refs.email).value.trim())
  }

  render() {
    const {actions, email} = this.props
    return (
      <div className="header">
      <a className="power" onClick={::this.handleClick}></a>
      <span>Online Service</span>
      <img className="right-img" src="image/head.png" />
      <input placeholder="輸入您的Email" ref="email" onChange={::this.handleChange} value={email} />
    </div>
    )
  }
}


@connect(state => ({
  messages: state.messagebox.messages
}))
class MessageTextarea extends Component {

  componentDidMount() {
    const {actions, socket} = this.props;

    socket.on('new_message', (msg) => {
      actions.input(msg)
    })

  }

  componentDidUpdate() {
    var node = ReactDOM.findDOMNode(this);
    node.scrollTop = node.scrollHeight;
  }

  render() {
    const {messages} = this.props
    var textareaValue = _.map(messages, (x) => `${x.name}:\n         ${x.text} \n`).join(' ')
    var nowTime = new Date().toString()
    var messageNodes = messages.map(function (message) {
      var leftOrRight;
      if (message.name[0] == '@') {
        leftOrRight = 'message_left';
      } else {
        leftOrRight = 'message_right';
      }
      return (
        <div className="message" key={message.id}>
          <div className={leftOrRight}>
            <div className="message_block">
              <span>{message.text}</span>
            </div>
            <div className="message_time">
              <span>{message.time}</span>
            </div>
          </div>
        </div>
      )
    })
    return (
      <div className="textArea">
        <div className="time">
          <span>{nowTime}</span>
        </div>
        {messageNodes}
      </div>
    )
  }
}



@connect(state => ({
  email: state.messagebox.ui.email
}))
class ControllerPanel extends Component {


  handleClick(e) {
    const {actions, socket, email} = this.props

    socket.emit('new_message', {
      name: email,
      text: ReactDOM.findDOMNode(this.refs.text).value.trim()
    });
  }

  render() {
    const {actions} = this.props
    return (
      <div className="inputArea">
        <input className="text" type="text" ref="text" />
        <input className="button" type="button" onClick={::this.handleClick} />
    </div>
    )
  }
}
