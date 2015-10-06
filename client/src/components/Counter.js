import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

@connect(state => ({
  counter: state.counter
}))

export default class Counter extends Component {

  //保證物件有從外部傳來
  static propTypes = {
    actions: PropTypes.object.isRequired,
    counter: PropTypes.number.isRequired
  }

  render() {
    const { counter,actions } = this.props;

    return (
      <p>
        Clicked: {counter} times
        {' '}
        <button onClick={actions.increment}>+</button>
        {' '}
        <button onClick={actions.decrement}>-</button>
        {' '}
        <button onClick={actions.incrementIfOdd}>Increment if odd</button>
        {' '}
        <button onClick={() => actions.incrementAsync()}>Increment async</button>
      </p>
    );
  }
}

