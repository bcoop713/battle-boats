// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers.js';
import type { State } from './reducers.js';
import App from './components/App.js';
import { initial, noOp } from './actions.js';
import Styles from './styles.scss';
require('bulma/bulma.sass');

let store = createStore(reducers);

const socket = new WebSocket('ws://localhost:9000');
socket.addEventListener('message', (event: MessageEvent) => {
  const action = messageMapper(event);
  console.log('action', action);
  store.dispatch(action);
});

function messageMapper(event: MessageEvent) {
  const rawData = event.data;
  if (typeof rawData !== 'string') {
    return;
  }
  const message = JSON.parse(rawData);
  console.log(message);
  switch (message.type) {
    case 'INITIAL':
      return initial(message.player);
    default:
      return noOp();
  }
}

const appElement = document.getElementById('app');
if (appElement) {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    appElement
  );
}

export { messageMapper };
