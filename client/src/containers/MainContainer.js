import {Component, PropTypes} from 'react';
import MessageBoxComponent from '../components/MessageBoxComponent'
import CommentBoxComponent from '../components/CommentBoxComponent'
import FilterableProductTable from '../components/FilterableProductTable'

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
  // constructor(props){
  //   super(props);
  //   // Manually bind this method to the component instance...
  // }
  static defaultProps = {
    // socket: io.connect('?_rtUserId=' + uuid.v4() + '&_rtToken=test')
  }

  static propTypes = {
    // You can declare that a prop is a specific JS primitive. By default, these
    // are all optional.
  }

  clicked() {
    this.props.messageBoxActions.change_panel(true)
    if(window.parent) window.parent.postMessage("onButtonClick","*");
    // parent._changeIframeSize(370,parent.document.body.clientHeight)
  }



  render() {
    const { is_panel_show,messageBoxActions,is_email_column_show,messages} = this.props;
    const child = is_panel_show ?
      <MessageBoxComponent key='a' actions={messageBoxActions} messages={messages} is_email_column_show={is_email_column_show}/> : <button key='b' onClick={::this.clicked}>線上客服</button>;

    return (
      <div>
        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300} >
          {child}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

//        <Counter actions={counterActions} />
// <CommentBoxComponent />
// <FilterableProductTable />
