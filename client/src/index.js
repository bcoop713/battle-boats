import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { flMiddleware, flReducer } from './adapters/folktale.js';
import { fromSocketHandler } from './adapters/from-socket.js';
import { reducers, initialState } from './reducers.js';
import App from './components/App.js';
import action from './actions.js';
import Styles from './styles.scss';
require('bulma/bulma.sass');

let store = createStore(
  flReducer(reducers),
  initialState,
  applyMiddleware(flMiddleware, logger)
);

const socket = new WebSocket('ws://localhost:9000');
socket.addEventListener('message', event => {
  fromSocketHandler(event, store);
});

const appElement = document.getElementById('app');
if (appElement) {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    appElement
  );
}
