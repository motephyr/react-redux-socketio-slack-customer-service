import {Component, PropTypes} from 'react';

import HomePage from '../containers/HomePage'
import UserListPage from '../containers/UserListPage'
import SettingPage from '../containers/SettingPage'
import UserConversationPage from '../containers/UserConversationPage'


import * as MessageBoxActions from '../actions/messagebox';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import style from '../../css/app.scss';
import Navigation from 'react-toolbox/lib/navigation';

//help you create dispatch
@connect(state => ({
  is_panel_show: state.messagebox.ui.is_panel_show,
  is_email_column_show: state.messagebox.ui.is_email_column_show,
  page: state.messagebox.ui.page,
  currentUser: state.messagebox.currentUser,
  messages: state.messagebox.messages,
  users: state.messagebox.users,
  room: state.messagebox.room
}), dispatch => ({
  messageBoxActions: bindActionCreators(MessageBoxActions, dispatch)
}))
export default class ChatNavigation extends Component {
  state = {
    focused: ''
  }

  componentWillMount(){
    var action = this.props.messageBoxActions;
    window.socketInstance.on('initial_list', function(data){
      //alert('init')
      action.initial_list(data);
    });
    window.socketInstance.on('user_joined', function(data){
      //alert('join');
      action.join_user(data);
    });
    window.socketInstance.on('user_left', function(data){
      //alert('left');
      action.left_user(data);
    });

    window.socketInstance.on('change_name', function(data){

      action.change_name(data);
    });

    window.socketInstance.on('change_username_cookie', function(data){
      var p = window.parent;
      if(p){
        var o = {
          args: [data.username],
          fn: (function(n){
            createCookie('_ce_id', n, 365);
          }).toString()
        };
        p.postMessage(JSON.stringify(o),'*');
      }
      action.change_username(data.username);

    });

    window.socketInstance.on('room_ready', function(data){
      action.change_current_room(data.room);
    });



  }

  poweron() {
    this.props.messageBoxActions.change_panel(true)
    if (this.props.page === '') {
      this.props.messageBoxActions.change('UserList');
    }
    if (window.parent) window.parent.postMessage("onButtonClick", "*");
    // parent._changeIframeSize(370,parent.document.body.clientHeight)
  }

  poweroff() {
    this.props.messageBoxActions.change_panel(false)
  }

  transUserListPage() {
    this.props.messageBoxActions.change('UserList');
  }

  transSettingPage(){
    this.props.messageBoxActions.change('Setting');
  }


  render() {
    var initActions = [{
      raised: true,
      icon: 'power',
      onClick: this.poweroff.bind(this)
    }, {
      label: 'Enter name',
      raised: false
    }, {
      raised: false,
      icon: 'settings',
      disable: true
    }];
    var normalActions = [{
      raised: true,
      icon: 'power',
      onClick: this.poweroff.bind(this)
    }, {
      label: (this.props.currentUser) ? this.props.currentUser.username + '列表' : '列表',
      raised: false
    }, {
      raised: true,
      icon: 'settings',
      onClick: this.transSettingPage.bind(this)
    }];

    var backActions = [{
      raised: true,
      icon: 'power',
      onClick: this.poweroff.bind(this)
    }, {
      label: (this.props.currentUser) ? this.props.currentUser.username + '設定' : '設定',
      raised: false
    }, {
      raised: true,
      icon: 'backspace',
      onClick: this.transUserListPage.bind(this)
    }];

    var userActions = [{
      raised: true,
      icon: 'power',
      onClick: this.poweroff.bind(this)
    }, {
      label: (this.props.room) ? this.props.room : 'UserConversation',
      raised: false
    }, {
      raised: true,
      icon: 'backspace',
      onClick: this.transUserListPage.bind(this)
    }];
    return (
      <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300} >
        {(this.props.is_panel_show)
          ? ({ 'Home':  (<div className={style.app}>
            <Navigation type='horizontal' actions={initActions} />
            <HomePage key='a' actions={this.props.messageBoxActions} messages={this.props.messages} is_email_column_show={this.props.is_email_column_show} onClick={::this.transUserListPage} />
            </div>),
              'UserList':  (<div className={style.app}>
            <Navigation type='horizontal' actions={normalActions} />
            <UserListPage key='b' users={this.props.users} actions={this.props.messageBoxActions} messages={this.props.messages} is_email_column_show={this.props.is_email_column_show} actions={this.props.messageBoxActions} />
            </div>),
              'Setting':  (<div className={style.app}>
            <Navigation type='horizontal' actions={backActions} />
            <SettingPage key='c' actions={this.props.messageBoxActions} messages={this.props.messages} is_email_column_show={this.props.is_email_column_show} onClick={::this.transUserListPage}  />
            </div>),
              'UserConversation':  (<div className={style.app}>
            <Navigation type='horizontal' actions={userActions} />
            <UserConversationPage key='d' actions={this.props.messageBoxActions} messages={this.props.messages} is_email_column_show={this.props.is_email_column_show} />
            </div>),
            }[this.props.page]
          )
        : (<button key='d' onClick={::this.poweron}>線上客服</button>)}
      </ReactCSSTransitionGroup>
    );
  }
}

//        <Counter actions={counterActions} />
// <CommentBoxComponent />
