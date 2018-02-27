import WebSocket from 'ws';
import actions from './actions.js';
import R from 'ramda';
import resultToMaybe from 'folktale/conversions/result-to-maybe';
import Result from 'folktale/result';

const wss = new WebSocket.Server({ port: 9000 });

let appState = {
  players: []
};

// Start the server
wss.on('connection', function connection(ws, req) {
  const { newState, messageOut } = handleConnection(ws, req, appState);
  ws.on('message', function incoming(message) {
    handleMessage(message, ws);
  });
  const updatedState = getUpdatedState(appState, newState);
  setState(updatedState);
  ws.send(messageOut);
  ws.on('error', () => console.log('errored'));
});

function handleConnection(ws, req, state) {
  const playerNumber = getPlayerNumber(req.url);
  return playerNumber.matchWith({
    Just: ({ value }) => handleReturingPlayer(value, state),
    Nothing: () => handleNewPlayer(state)
  });
}

function handleNewPlayer(state) {
  if (state.players.length >= 2) {
    const messageOut = JSON.stringify(Result.Error('Room Full'));
    return { messageOut, newState: state };
  } else {
    const newPlayer = { number: state.players.length + 1 };
    const newPlayerList = R.append(newPlayer, state.players);
    const newState = R.assoc('players', newPlayerList, state);
    const messageOut = JSON.stringify(actions.Initial(newPlayer));
    return { messageOut, newState };
  }
}

function handleReturingPlayer(playerNumber, state) {
  const returningPlayer = { number: playerNumber };
  const messageOut = JSON.stringify(actions.Initial(returningPlayer));
  return { messageOut, newState: state };
}

function getUpdatedState(oldState, newState) {
  if (newState) {
    return newState;
  } else {
    return oldState;
  }
}

function setState(newState) {
  appState = newState;
}

function handleMessage(message, ws) {
  ws.send(message);
}

function getPlayerNumber(url) {
  const re = /\?playerNumber=(\d)/;
  const result = Result.try(() => Number(re.exec(url)[1]));
  return resultToMaybe(result);
}

export { getPlayerNumber, handleNewPlayer, getUpdatedState };
