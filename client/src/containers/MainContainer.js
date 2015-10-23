import {Component, PropTypes} from 'react';
import Counter from '../components/Counter';
import {Header, MessageTextarea, ControllerPanel} from '../components/MessageBoxComponent'
import CommentBoxComponent from '../components/CommentBoxComponent'
import FilterableProductTable from '../components/FilterableProductTable'

import * as CounterActions from '../actions/counter';
import * as MessageBoxActions from '../actions/messagebox';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import uuid from 'node-uuid'

//help you create dispatch
@connect(state => ({
  is_panel_show: state.messagebox.ui.is_panel_show
}), dispatch => ({
  messageBoxActions: bindActionCreators(MessageBoxActions, dispatch)
}))
export default class MainContainer extends Component {
  // constructor(props){
  //   super(props);
  //   // Manually bind this method to the component instance...
  // }
  static defaultProps = {
    socket: io.connect('?_rtUserId=' + uuid.v4() + '&_rtToken=test')
  }

  static propTypes = {
    // You can declare that a prop is a specific JS primitive. By default, these
    // are all optional.
  }

  clicked() {
    this.props.messageBoxActions.change(true)
  }



  render() {
    const { socket, is_panel_show,messageBoxActions} = this.props;
    const child = is_panel_show ?
      <div className="app">
        <Header actions={messageBoxActions} socket={socket} />
        <MessageTextarea actions={messageBoxActions} socket={socket} />
        <ControllerPanel actions={messageBoxActions} socket={socket} />
      </div>
      : <button key='b' onClick={::this.clicked}>線上客服</button>;

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
