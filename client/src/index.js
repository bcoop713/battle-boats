// @flow;
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers.js';
import App from './components/App.js';
import Styles from './styles.scss';
require('bulma/bulma');

function onLoad() {
  const socket = new WebSocket('ws://localhost:9000');
  socket.addEventListener('message', event => {
    console.log(event.data);
  });
}

const initialState = {
  player: {
    playerNumber: 1
  }
};
let store = createStore(reducers, initialState);
console.log(store.getState());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

onLoad();
