import {Component, PropTypes} from 'react';

import HomeComponent from '../components/HomeComponent'
import UserListComponent from '../components/UserListComponent'

import * as MessageBoxActions from '../actions/messagebox';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

//help you create dispatch
@connect(state => ({
  is_panel_show: state.messagebox.ui.is_panel_show,
  is_email_column_show: state.messagebox.ui.is_email_column_show,
  messages: state.messagebox.messages
}), dispatch => ({
  messageBoxActions: bindActionCreators(MessageBoxActions, dispatch)
}))
export default class MainContainer extends Component {
  state = {
    focused: ''
  }

  clicked() {
    this.props.messageBoxActions.change_panel(true)
    this.setState({
      focused: 'Home'
    });
    if (window.parent) window.parent.postMessage("onButtonClick", "*");
    // parent._changeIframeSize(370,parent.document.body.clientHeight)
  }

  handleInputName(){
    this.setState({
      focused: 'UserList'
    });
  }


  render() {
    return (
      <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300} >
        {(this.props.is_panel_show)
          ? {
            'Home':  (<HomeComponent key='a' actions={this.props.messageBoxActions} messages={this.props.messages} is_email_column_show={this.props.is_email_column_show} onClick={::this.handleInputName} />),
            'UserList':  (<UserListComponent key='b' actions={this.props.messageBoxActions} messages={this.props.messages} is_email_column_show={this.props.is_email_column_show}/>),
            'Setting':  (<UserListComponent key='c' actions={this.props.messageBoxActions} messages={this.props.messages} is_email_column_show={this.props.is_email_column_show}/>),
          }[this.state.focused]
        : (<button key='d' onClick={::this.clicked}>線上客服</button>)}
      </ReactCSSTransitionGroup>
    );
  }
}

//        <Counter actions={counterActions} />
// <CommentBoxComponent />
