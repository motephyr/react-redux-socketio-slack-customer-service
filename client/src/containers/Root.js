import {Component, PropTypes} from 'react';
import {Router, RouteHandler, IndexRoute, Route } from "react-router";
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import {Provider} from 'react-redux';
import configureStore from '../store/configureStore';
import TestContainer from './TestContainer';
const store = configureStore();


export default class Root extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  render() {
    const processENV = process.env.NODE_ENV || "development"
    const {history} = this.props;
    return (
      <div>
        <Provider store={store} >
          <Router>
            <Route path="/" component={RouteHandler}>
              <IndexRoute component={TestContainer}/>
            </Route>
          </Router>
        </Provider>

        {processENV === 'development' && <DebugPanel top right bottom >
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>}
      </div>
    );
  }
}

//        <Router history={history}>
