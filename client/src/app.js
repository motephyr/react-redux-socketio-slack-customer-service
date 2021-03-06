require('../css/app.css');

import ReactDOM from 'react-dom';

import createBrowserHistory from 'history/lib/createBrowserHistory'
const history = createBrowserHistory();

import {Component, PropTypes} from 'react';
import {Router, RouteHandler, IndexRoute, Route } from "react-router";

import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
const store = configureStore();

import MainContainer from './containers/MainContainer';
import TestContainer from './containers/TestContainer';


export default class Root extends Component {

  render() {
    const processENV = process.env.NODE_ENV || "development"
    return (
      <div className="customer_online_message">
        <Provider store={store} >
          <MainContainer />
        </Provider>
      </div>
    );
  }
}

          // <Router history={history} >
          //   <Route path="/client/index.html" component={RouteHandler}>
          //     <IndexRoute component={MainContainer}/>
          //   </Route>
          //   <Route path="/test" component={TestContainer} />
          // </Router>
        // {processENV === 'development' && <DebugPanel top right bottom >
        //   <DevTools store={store} monitor={LogMonitor} />
        // </DebugPanel>}

ReactDOM.render(
  <Root />,
  document.body
);
