import {Component, PropTypes} from 'react';
import Counter from '../components/Counter';
import CommentBoxComponent from '../components/CommentBoxComponent'
import FilterableProductTable from '../components/FilterableProductTable'

import * as CounterActions from '../actions/counter';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import uuid from 'node-uuid'

@connect()
export default class TestContainer extends Component {
  static defaultProps = {
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const {dispatch, socket} = this.props;
    const counterActions = bindActionCreators(CounterActions, dispatch);

    return (
      <div>
        <Counter actions={counterActions} />
      </div>
    );
  }
}

//        <Counter actions={counterActions} />
// <CommentBoxComponent />
// <FilterableProductTable />
