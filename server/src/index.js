// @flow
import WebSocket from 'ws';
import uuid from 'uuid/v1';
import R from 'ramda';

const wss = new WebSocket.Server({ port: 9000 });

let appState = {
  players: []
};

// Start the server
wss.on('connection', function connection(ws) {
  const { newState, messageOut } = handleConnection(ws, appState);
  ws.on('message', function incoming(message) {
    handleMessage(message, ws);
  });
  updateState(newState);
  ws.send(messageOut);
  ws.on('error', () => console.log('errored'));
});

function handleConnection(ws, state) {
  const newPlayer = { id: uuid(), number: state.players.length + 1 };
  const newPlayerList = R.append(newPlayer, state.players);
  const newState = R.assoc('players', newPlayerList, state);
  const messageOut = JSON.stringify({ type: 'INITIAL', player: newPlayer });
  return { messageOut, newState };
}

function updateState(newState) {
  appState = newState;
}

function handleMessage(message, ws) {
  ws.send(message);
}
