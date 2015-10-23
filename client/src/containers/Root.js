import {Component, PropTypes} from 'react';
import {Router, RouteHandler, IndexRoute, Route } from "react-router";
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import {Provider} from 'react-redux';
import configureStore from '../store/configureStore';
import MainContainer from './MainContainer';
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
          <Router history={history} >
            <Route path="/" component={RouteHandler}>
              <IndexRoute component={MainContainer}/>
            </Route>
            <Route path="/test" component={TestContainer} />
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
        // {processENV === 'development' && <DebugPanel top right bottom >
        //   <DevTools store={store} monitor={LogMonitor} />
        // </DebugPanel>}