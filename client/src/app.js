
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
import uuid from 'node-uuid'

// var suid = Cookie.get('uuid');
// if (!suid) {
//   suid = Cookies.set('_', 'value', { expires: 31536000 });
// }

function getValidJSON (str) {
    try {
        var o = JSON.parse(str);
        return o;
    } catch (e) {
        return null;
    }
}

window.socketInstance = null;

function socket_init(id, domainName){
  socketInstance = io.connect('?_rtUserId=' + id + '&_rtToken=test' + '&_rtDom=' + domainName);
  socketInstance.on('change_name', function(data){
    // data.old_name
    // data.new_name
    var p = window.parent;
    if(p){
      var o = {
        args: [data.old_name, data.new_name],
        fn: (function(o, n){
          createCookie('_ce_id', n, 365);
        }).toString()
      };
      p.postMessage(JSON.stringify(o),'*');
    }
  });

  // these may be in components.
  socketInstance.on('initial_list', function(data){
    alert('List: ' + JSON.stringify(data));
  });

  socketInstance.on('user_joined', function(data){
    alert('Joined User: ' + data.username);
  });

  socketInstance.on('new_message', function(data){
    // maybe
    alert('Message to: ' + data.room + " content:" + data.message);
  });

  socketInstance.on('user_left', function(data){
    alert('Left User: ' + data.username);
  });

  socketInstance.on('room_ready', function(data){
    console.log('created room: ' + data.room);

    // Here should send a message back to main page for knowing the user states,
    // like add iframe, highlight the box, pop up chat window, and so on....
  });

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

// Define event handlers between main page and chatting iframe(s).
window.addEventListener('message', function(e){
  // e.data
  var o = getValidJSON(e.data);
  if(o){
    if(o.event == 'get_mainpage_info'){
      // prepare socket
      socket_init(o.id || "", o.domain);
    }
  }
  //alert(e.data);™
  //var o = JSON.parse(e.data);

});


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
