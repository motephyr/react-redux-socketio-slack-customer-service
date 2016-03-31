import {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import ReactDOM from 'react-dom'
import Cookie from 'cookies-js'
// import uuid from 'node-uuid'
// import io from 'socket.io-client'
import Button from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input'
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox';
import style from '../../css/app.scss';




export default class UserConversationPage extends Component {
  static defaultProps = {
    // socket: io.connect('?_rtUserId=' + suid + '&_rtToken=test')
  }
  render() {
    const {actions,is_email_column_show,messages,socket} = this.props
    return (
      <div>
        <MessageTextarea actions={actions} messages={messages} />
        <MessageInput actions={actions} room={this.props.room}  />
      </div>
    )
  }
}


class MessageHeader extends Component {

  handleClick(e) {
    this.props.actions.change_panel(false)
    // parent._changeIframeSize(60,22)
    if(window.parent) window.parent.postMessage("onPanelHeaderClick","*");
  }

  componentDidMount() {
    if (Cookie.get('email_value')) {
      this.props.actions.change_email_column(true)
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

  componentDidUpdate() {
    var node = ReactDOM.findDOMNode(this);
    node.scrollTop = node.scrollHeight;
  }

  render() {
    const {messages} = this.props
    var textareaValue = _.map(messages, (x) => `${x.name}:\n         ${x.text} \n`).join(' ')
    var messageNodes = messages.map(function (message, index) {
      console.log(message.name)
      if (message.name[0] == '@') {
        var leftOrRight = (<div className={style.message_left}>
            <div className={style.message_block}>
              <span>{message.text}</span>
            </div>
            <div className={style.message_time}>
              <span>{message.time}</span>
            </div>
          </div>);
      } else {
        var leftOrRight = (<div className={style.message_right}>
            <div className={style.message_block}>
              <span>{message.text}</span>
            </div>
            <div className={style.message_time}>
              <span>{message.time}</span>
            </div>
          </div>);
      }
      return (
        <div className={style.message} key={index}>
          {leftOrRight}
        </div>
      )
    })
    var nowTime = new Date().toString();
    return (
      <div>
        <div className={style.time}>
          {nowTime}
        </div>
        <div className={style.textArea}>
          {messageNodes}
        </div>
      </div>
    )
  }
}



class MessageInput extends Component {
  state = { text: '' };

  handleChange(name, value) {
    this.setState({...this.state, [name]: value});
  };

  handleClick(e) {
    const {actions} = this.props

    // this.props.socket.emit('new_message', {
    //   name: Cookie.get('email_value'),
    //   text: ReactDOM.findDOMNode(this.refs.text).value.trim()
    // });

    window.socketInstance.emit('new_message', { message: this.state.text, room: this.props.room  });

    actions.input({
      name: "@",
      text: this.state.text,
      time: new Date().toString()
    })
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleClick(e);
    }
  }

  render() {
    const {actions} = this.props
    return (
      <div className={style.inputArea}>
        <Input className={style.text} type="text" onChange={this.handleChange.bind(this, 'text')} onKeyPress={::this.handleKeyPress}  />
        <Button className={style.button} icon="send" onClick={::this.handleClick} accent floating  />
      </div>
    )
  }
}
