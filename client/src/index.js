import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { createStore, compose, applyMiddleware } from 'redux';
import { flMiddleware, flReducer } from './adapters/folktale.js';
import { fromSocketHandler } from './adapters/from-socket.js';
import { reducers, initialState } from './reducers.js';
import { install } from 'redux-loop';
import nullableToMaybe from 'folktale/conversions/nullable-to-maybe';
import App from './components/App.js';
import action from './actions.js';
import Styles from './styles.scss';
require('bulma/bulma.sass');

const enhancer = compose(applyMiddleware(flMiddleware, logger), install());

const store = createStore(flReducer(reducers), initialState, enhancer);

function socketURL() {
  const base = 'ws://localhost:9000';
  const playerID = nullableToMaybe(localStorage.getItem('playerNumber'));
  return playerID.matchWith({
    Just: ({ value }) => base + '?playerNumber=' + value,
    Nothing: () => base
  });
}

const socket = new WebSocket(socketURL());
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
