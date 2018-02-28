import WebSocket from 'ws';
import actions from './actions.js';
import R from 'ramda';
import resultToMaybe from 'folktale/conversions/result-to-maybe';
import Result from 'folktale/result';
import { msgToServer } from '../../client/src/commands.js';

const wss = new WebSocket.Server({ port: 9000 });

const initialClientState = {
  boatsWaiting: 5,
  boatCoords: []
};

let appState = {
  players: [],
  clientState: [initialClientState, initialClientState]
};

// Start the server
wss.on('connection', function connection(ws, req) {
  const { newState, messageOut } = handleConnection(ws, req, appState);
  ws.on('message', function incoming(message) {
    const { newState, broadcastMsg, responseMsg, oppMsg } = handleMessage(
      message,
      ws,
      appState
    );
    const updatedState = getUpdatedState(appState, newState);
    console.log('x', JSON.stringify(updatedState));
    setState(updatedState);
    handleMessageOut(ws, { responseMsg });
  });
  const updatedState = getUpdatedState(appState, newState);
  setState(updatedState);
  ws.send(messageOut);
  ws.on('error', () => console.log('errored'));
});

function handleMessageOut(ws, { responseMsg }) {
  ws.send(JSON.stringify(responseMsg));
}

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
    const messageOut = JSON.stringify(
      actions.Initial(
        initialClientState.boatsWaiting,
        initialClientState.boatCoords,
        newPlayer
      )
    );
    return { messageOut, newState };
  }
}

function handleReturingPlayer(playerNumber, state) {
  const returningPlayer = { number: playerNumber };
  const myState = state.clientState[playerNumber - 1];
  const messageOut = JSON.stringify(
    actions.Initial(myState.boatsWaiting, myState.boatCoords, returningPlayer)
  );
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
  console.log(newState);
  appState = newState;
}

// takes a message, and returns a new state, a broadcastMsg, a responseMsg and an oppMsg
function handleMessage(rawMessage, ws, state) {
  const message = Result.try(() =>
    msgToServer.fromJSON(JSON.parse(rawMessage))
  );
  return message.matchWith({
    Ok: ({ value }) => mapToActions(value, state),
    Error: _ => Error()
  });
}

function mapToActions(action, state) {
  return action.matchWith({
    PlaceBoat: ({ playerNumber, boatCoords }) => {
      const myState = state.clientState[playerNumber - 1];
      const myNewState = {
        ...myState,
        boatCoords: R.concat(myState.boatCoords, [boatCoords]),
        boatsWaiting: myState.boatsWaiting - 1
      };
      const newClientState = R.update(
        playerNumber - 1,
        myNewState,
        state.clientState
      );
      const newState = { ...state, clientState: newClientState };
      const responseMsg = actions.BoatPlacementSuccess(boatCoords);
      return { newState, responseMsg };
    }
  });
}

function getPlayerNumber(url) {
  const re = /\?playerNumber=(\d)/;
  const result = Result.try(() => Number(re.exec(url)[1]));
  return resultToMaybe(result);
}

export { getPlayerNumber, handleNewPlayer, getUpdatedState };
