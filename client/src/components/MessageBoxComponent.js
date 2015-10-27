import {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import ReactDOM from 'react-dom'
import Cookie from 'cookies-js'
import uuid from 'node-uuid'
import io from 'socket.io-client'

var suid = Cookie.get('uuid');
if (!suid) {
  suid = Cookie.set('uuid', uuid.v4())
}
const socket = io.connect('?_rtUserId=' + suid + '&_rtToken=test')


export default class MessageBoxComponent extends Component {
  render() {
    const {actions,is_email_column_show,messages} = this.props
    return (
      <div className="app">
        <MessageHeader actions={actions} is_email_column_show={is_email_column_show} />
        <MessageTextarea actions={actions} messages={messages}/>
        <MessageInput actions={actions} />
      </div>
    )
  }
}


class MessageHeader extends Component {

  handleClick(e) {
    this.props.actions.change_panel(false)
    parent._changeIframeSize(60,22)
  }

  componentDidMount() {
    if (Cookie.get('email_value')) {
      this.props.actions.change_email_column(true)
      socket.emit('new_email_on_suid', {
        email: Cookie.get('email_value')
      });
    }
  }
  componentDidUpdate() {
    if(this.refs.email){
      ReactDOM.findDOMNode(this.refs.email).focus();
    }
  }

  handleEmailClick(e) {
    this.props.actions.change_email_column(false)
  }

  handleKeyPress(e) {

    if (e.key === 'Enter') {
      Cookie.set('email_value', ReactDOM.findDOMNode(this.refs.email).value.trim());
      this.props.actions.change_email_column(true)
      //此時綁定Email和它的userid
      socket.emit('new_email_on_suid', {
        email: Cookie.get('email_value')
      });
    }
  }

  render() {
    const {actions, is_email_column_show} = this.props
    var email_column;
    if (is_email_column_show) {
      email_column = <span onClick={::this.handleEmailClick}  style={{float:'right'}}>{Cookie.get('email_value')}</span>
    } else {
      email_column = <input placeholder="輸入您的Email" ref="email" onKeyPress={::this.handleKeyPress} defaultValue={Cookie.get('email_value')}/>
    }

    return (
      <div className="header">
      <a className="power" onClick={::this.handleClick}></a>
      <span onClick={::this.handleClick}>Online Service</span>
      <img className="right-img" src="/client/image/head.png" />
      {email_column}
    </div>
    )
  }
}


class MessageTextarea extends Component {

  componentDidMount() {
    const {actions} = this.props;

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



class MessageInput extends Component {


  handleClick(e) {
    const {actions} = this.props

    socket.emit('new_message', {
      name: Cookie.get('email_value'),
      text: ReactDOM.findDOMNode(this.refs.text).value.trim()
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleClick(e);
    }
  }

  render() {
    const {actions} = this.props
    return (
      <div className="inputArea">
        <input className="text" type="text" ref="text" onKeyPress={::this.handleKeyPress}  />
        <input className="button" type="button" onClick={::this.handleClick} />
    </div>
    )
  }
}
