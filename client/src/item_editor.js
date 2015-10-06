import Root from "./containers/Root";

import React from 'react';
import ReactDOM from 'react-dom';

import createBrowserHistory from 'history/lib/createBrowserHistory'

const history = createBrowserHistory();

ReactDOM.render(
  <Root history={history} />,
  document.getElementById('app')
);
