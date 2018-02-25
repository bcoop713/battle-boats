import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { flMiddleware, flReducer } from './adapters/folktale.js';
import reducers from './reducers.js';
import App from './components/App.js';
import action from './actions.js';
import Styles from './styles.scss';
require('bulma/bulma.sass');

let store = createStore(flReducer(reducers), applyMiddleware(flMiddleware));

const socket = new WebSocket('ws://localhost:9000');
socket.addEventListener('message', event => {
  const action = messageMapper(event);
  console.log('action being sent', action);
  store.dispatch(action);
});

function messageMapper(event) {
  const rawData = event.data;
  if (typeof rawData !== 'string') {
    return noOp();
  }
  const message = JSON.parse(rawData);
  console.log(message);
  switch (message.type) {
    case 'INITIAL':
      console.log('cumong', action.Initial(message.player));
      return action.Initial(message.player);
    default:
      return action.NoOp();
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
