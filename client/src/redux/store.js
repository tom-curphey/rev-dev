import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
// import { loadState, saveState } from './localStorage';

// const initialState = {};
const middleware = [thunk];

// const persistedState = loadState();

// const store = createStore(
//   rootReducer,
//   // persistedState,
//   compose(
//     window.__REDUX_DEVTOOLS_EXTENSION__ &&
//       window.__REDUX_DEVTOOLS_EXTENSION__()
//     applyMiddleware(...middleware),
//   )
// );

const store = createStore(
  rootReducer,
  composeWithDevTools(
    /* logger must be the last middleware in chain to log actions */
    applyMiddleware(...middleware)
  )
);

// store.subscribe(() => {
//   saveState(store.getState());
// });

export default store;
