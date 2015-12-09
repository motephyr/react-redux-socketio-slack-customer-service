
import ReactDOM from 'react-dom';

import createBrowserHistory from 'history/lib/createBrowserHistory'
const history = createBrowserHistory();

import {Component, PropTypes} from 'react';
import {Router, RouteHandler, IndexRoute, Route } from "react-router";

import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
const store = configureStore();

import ChatContainer from './containers/ChatContainer';


export default class App extends Component {

  render() {
    const processENV = process.env.NODE_ENV || "development"
    return (
      <div>
        <Provider store={store} >
          <ChatContainer items={ ['Home', 'UserList', 'Setting'] }/>
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
  <App />,
  document.getElementById('app')
);
