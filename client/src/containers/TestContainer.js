import { Component, PropTypes } from 'react';
import Counter from '../components/Counter';
import MessageComponent from '../components/MessageComponent';
import CommentBoxComponent from '../components/CommentBoxComponent'
import FilterableProductTable from '../components/FilterableProductTable'

import * as CounterActions from '../actions/counter';
import * as MessageActions from '../actions/message';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

@connect()
export default class TestContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const { dispatch } = this.props;
    const counterActions = bindActionCreators(CounterActions, dispatch);
    const messageActions = bindActionCreators(MessageActions, dispatch);


    return (
      <div>
        <MessageComponent actions={messageActions} />
      </div>
    );
  }
}

//        <Counter actions={counterActions} />
        // <CommentBoxComponent />
        // <FilterableProductTable />