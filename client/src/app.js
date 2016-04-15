
import ReactDOM from 'react-dom';

import createBrowserHistory from 'history/lib/createBrowserHistory'
const history = createBrowserHistory();

import {Component, PropTypes} from 'react';
import {Router, RouteHandler, IndexRoute, Route } from "react-router";

import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
const store = configureStore();

import ChatNavigation from './containers/ChatNavigation';

import io from 'socket.io-client';


function getValidJSON (str) {
    try {
        var o = JSON.parse(str);
        return o;
    } catch (e) {
        return null;
    }
}

export default class App extends Component {

  render() {
    const processENV = process.env.NODE_ENV || "development"
    return (
        <Provider store={store} >
          <ChatNavigation />
        </Provider>
    );
  }
}

window.socketInstance = null;

function socket_init(id, domainName){
  socketInstance = io.connect('?_rtUserId=' + id + '&_rtToken=test' + '&_rtDom=' + domainName);


  // these may be in components.




  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );

}

// when double click the user at list
// socketInstance.emit('create_room', { targetUsers:['anonymous_1449764383330'] });

// when sending a message
// socketInstance.emit('new_message', { message: 'hahaha', room: 'localhost%3A5000-public' });

window.addEventListener('load', function(e){
  if(window.parent){
    var p = window.parent;
    var o = {
      args: [],
      fn: (function(){
        var domain = location.host;
        var c = getCookie('_ce_id');
        window._ceWin.postMessage(JSON.stringify({
          event: 'get_mainpage_info',
          domain: domain,
          id: c
        }),'*');
      }).toString()
    };
    p.postMessage(JSON.stringify(o),'*');
  }
});

window._collectActions = [];
window._collectInterval = null;
// Define event handlers between main page and chatting iframe(s).
window.addEventListener('message', function(e){
  // e.data
  var o = getValidJSON(e.data);
  if(o){
    if(o.event == 'get_mainpage_info'){
      // prepare socket
      socket_init(o.id || "", o.domain);
    }
    if(o.event == 'debug'){
      // alert(JSON.stringify(o));
      eval("(" + o.fn + ").call(this);");
    }
    if(o.event == 'update_user_action'){
      // TEST OK
      window._collectActions.push(JSON.parse(o.actionInfo));
      // if(window._collectActions.length > 200){
      //   window._collectActions.shift();
      // }
      // alert(o.actionInfo);
    }
  }
});

window.enableCollectAction = function(millisecond){
  var p = window.parent;
  if(p){
    if(window._ceCollectEnabled !== true){
      var o = {
        fn: (function(){
          window._ceEnableCollect = true;
        }).toString()
      };
      p.postMessage(JSON.stringify(o),'*');
      window._ceCollectEnabled = true;
    }
    // millisecond
    if(window._collectInterval) clearInterval(window._collectInterval);
    window._collectInterval = setInterval(function(){
      if(socketInstance && window._collectActions.length){
        socketInstance.emit("update_user_action", window._collectActions);
        window._collectActions = [];
      }
    }, Math.max(millisecond || 100, 100) );
  }
};

window.disableCollectAction = function(){
  var p = window.parent;
  if(p){
    if(window._ceCollectEnabled === true){
      var o = {
        fn: (function(){
          window._ceEnableCollect = false;
        }).toString()
      };
      p.postMessage(JSON.stringify(o),'*');
      window._ceCollectEnabled = false;
    }
    if(window._collectInterval){
      clearInterval(window._collectInterval);
      window._collectInterval = null;
      window._collectActions = [];
    }
  }
};



          // <Router history={history} >
          //   <Route path="/client/index.html" component={RouteHandler}>
          //     <IndexRoute component={MainContainer}/>
          //   </Route>
          //   <Route path="/test" component={TestContainer} />
          // </Router>
        // {processENV === 'development' && <DebugPanel top right bottom >
        //   <DevTools store={store} monitor={LogMonitor} />
        // </DebugPanel>}


