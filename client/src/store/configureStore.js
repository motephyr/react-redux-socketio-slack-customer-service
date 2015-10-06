import { createStore,combineReducers, applyMiddleware,compose } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { devTools, persistState } from 'redux-devtools';
import * as reducers from '../reducers';


const createStoreWithMiddleware = compose(
  applyMiddleware(thunk,promise),
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

const rootReducer = combineReducers(reducers);


export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
