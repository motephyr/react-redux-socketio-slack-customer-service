import {Component, PropTypes} from 'react';
import Counter from '../components/Counter';
import MessageBoxComponent from '../components/MessageBoxComponent'
import CommentBoxComponent from '../components/CommentBoxComponent'
import FilterableProductTable from '../components/FilterableProductTable'

import * as CounterActions from '../actions/counter';
import * as MessageActions from '../actions/messages';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import uuid from 'node-uuid'

@connect()
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
    dispatch: PropTypes.func.isRequired
  }
  state = {
    mounted: false
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const {dispatch, socket} = this.props;
    const counterActions = bindActionCreators(CounterActions, dispatch);
    const messageActions = bindActionCreators(MessageActions, dispatch);
    const child = this.state.mounted ?
      <div>
        <MessageBoxComponent actions={messageActions} socket={socket} />
      </div> :
      null;

    return (
      <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
        {child}
      </ReactCSSTransitionGroup>
    );
  }
}

//        <Counter actions={counterActions} />
// <CommentBoxComponent />
// <FilterableProductTable />
