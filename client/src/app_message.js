
import ReactDOM from 'react-dom';

import createBrowserHistory from 'history/lib/createBrowserHistory'
const history = createBrowserHistory();

import {Component, PropTypes} from 'react';
import {Router, RouteHandler, IndexRoute, Route } from "react-router";

import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
const store = configureStore();

import UserConversationPage from './containers/UserConversationPage';
import style from '../css/app.scss';


export default class App extends Component {

  render() {
    const processENV = process.env.NODE_ENV || "development"
    return (
        <Provider store={store} >
          <div className={style.app}>
        <UserConversationPage key='d' user_id="asdfasdf" actions={this.props.messageBoxActions} messages={[{
          id: 0,
          name: '@customerService',
          text: "hello,may i help you?",
          time: new Date().toString()
        },{
          id: 1,
          name: '@customerService',
          text: "hello,may i help you?",
          time: new Date().toString()
        },{
          id: 2,
          name: 'customerService',
          text: "hello,may i help you?ajsoidfjaosidjfpoaisjdpfoiajsdpoijgqeproijgqoepirjgpoi/noajsdfoiasjdofi",
          time: new Date().toString()
        }]}  />
        </div>
        </Provider>
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
  document.getElementById('app_message')
);
