import {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import ReactDOM from 'react-dom'
import Cookie from 'cookies-js'
import uuid from 'node-uuid'
// import io from 'socket.io-client'
import Button from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox';
import style from '../../css/app.scss';


var suid = Cookie.get('uuid');
if (!suid) {
  suid = Cookie.set('uuid', uuid.v4())
}


export default class UserListPage extends Component {
  static defaultProps = {
    // socket: io.connect('?_rtUserId=' + suid + '&_rtToken=test')
  }
  render() {
    const {actions,is_email_column_show, messages, socket,users} = this.props

    return (
        <MessageTextarea actions={actions} messages={messages} users={users}/>
    )
  }
}
        // <MessageInput actions={actions}  socket={socket} />


class MessageTextarea extends Component {

  componentDidMount() {
    const {actions} = this.props;

    // this.props.socket.on('new_message', (msg) => {
    //   actions.input(msg)
    // })

  }

  handleClickPeople(people){
    this.props.actions.change('UserConversation',people);
  }

  componentDidUpdate() {
    var node = ReactDOM.findDOMNode(this);
    node.scrollTop = node.scrollHeight;
  }

  render() {
    var {users} = this.props;
    return (
      <div>
        <List ripple>
    <ListDivider />
    {_.map(users,(user) => {return (
<ListItem key={user.id}
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/m.jpg'
      caption={user.username}
      leftIcon='empty'
      onClick={this.handleClickPeople.bind(this, 'DrAAMan')} />
      )})}
{/*    <ListItem
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/m.jpg'
      caption='Dr. Manhattan'
      leftIcon='empty'
      onClick={this.handleClickPeople.bind(this, 'DrAAMan')} />
    <ListItem
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/o.jpg'
      caption='Ozymandias'
      leftIcon='message'
      onClick={this.handleClickPeople.bind(this, '大隻老三三')} />

    <ListItem
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/r.jpg'
      caption='Rorschach'
      leftIcon='face' />
    <ListItem
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/r.jpg'
      caption='Rorschach'
      leftIcon='star' />
    <ListItem
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/r.jpg'
      caption='Rorschach'
      leftIcon='favorite' />
    <ListItem
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/r.jpg'
      caption='Rorschach'
      leftIcon='done' />
    <ListItem
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/r.jpg'
      caption='Rorschach'
      leftIcon='face' />*/}
  </List>
      </div>
    )
  }
}



class MessageInput extends Component {


  handleClick(e) {
    const {actions} = this.props

    // this.props.socket.emit('new_message', {
    //   name: Cookie.get('email_value'),
    //   text: ReactDOM.findDOMNode(this.refs.text).value.trim()
    // });
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
        <Input className={style.text} type="text" ref="text" onKeyPress={::this.handleKeyPress}  />
        <Button className={style.button} icon="send" onClick={::this.handleClick} accent floating  />
      </div>
    )
  }
}
