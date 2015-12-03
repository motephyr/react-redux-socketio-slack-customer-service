import {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import ReactDOM from 'react-dom'
import Cookie from 'cookies-js'
import uuid from 'node-uuid'
import io from 'socket.io-client'
import Button from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import Navigation from 'react-toolbox/lib/navigation';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox';
import TimePicker from 'react-toolbox/lib/time_picker';
import style from '../../css/app.scss';


var suid = Cookie.get('uuid');
if (!suid) {
  suid = Cookie.set('uuid', uuid.v4())
}


export default class ChatComponent extends Component {
  static defaultProps = {
    socket: io.connect('?_rtUserId=' + suid + '&_rtToken=test')
  }
  render() {
    const {is_email_column_show, messages, socket} = this.props


var actions = [
  { raised: true, icon: 'power'},
  { label: 'OurChat', raised: false},
  { raised: true, icon: 'settings'}
];

    return (
      <div className={style.app}>
        <Navigation type='horizontal' actions={actions} />
        <MessageTextarea actions={actions} messages={messages} socket={socket}/>
        <MessageInput actions={actions}  socket={socket} />
      </div>
    )
  }
}


class MessageHeader extends Component {

  handleClick(e) {
    this.props.actions.change_panel(false)
      // parent._changeIframeSize(60,22)
    if (window.parent) window.parent.postMessage("onPanelHeaderClick", "*");
  }

  componentDidMount() {
    if (Cookie.get('email_value')) {
      this.props.actions.change_email_column(true)
      this.props.socket.emit('new_email_on_suid', {
        email: Cookie.get('email_value')
      });
    }
  }
  componentDidUpdate() {
    if (this.refs.email) {
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
      this.props.socket.emit('new_email_on_suid', {
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

    this.props.socket.on('new_message', (msg) => {
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
        <List ripple>
    <ListDivider />
    <ListSubHeader caption={nowTime} />
    <ListItem
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/m.jpg'
      caption='Dr. Manhattan'
      rightIcon='star' />
    <ListItem
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/o.jpg'
      caption='Ozymandias'
      rightIcon='star' />
    <ListItem
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/r.jpg'
      caption='Rorschach'
      rightIcon='star'/>
  </List>
      </div>
    )
  }
}



class MessageInput extends Component {


  handleClick(e) {
    const {actions} = this.props

    this.props.socket.emit('new_message', {
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
        <Input  type="text" ref="text" onKeyPress={::this.handleKeyPress}  />
        <Button label="送出" onClick={::this.handleClick} raised accent />
    </div>
    )
  }
}
