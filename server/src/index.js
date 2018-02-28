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
  clientState: [initialClientState, initialClientState],
  hits: [],
  misses: []
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
    handleMessageOut(ws, wss, { responseMsg, broadcastMsg });
  });
  const updatedState = getUpdatedState(appState, newState);
  setState(updatedState);
  ws.send(messageOut);
  ws.on('error', () => console.log('errored'));
});

function handleMessageOut(ws, wss, { responseMsg, broadcastMsg }) {
  ws.send(JSON.stringify(responseMsg));
  if (broadcastMsg) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(broadcastMsg));
      }
    });
  }
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
        newPlayer,
        hits,
        misses
      )
    );
    return { messageOut, newState };
  }
}

function handleReturingPlayer(playerNumber, state) {
  const returningPlayer = { number: playerNumber };
  const myState = state.clientState[playerNumber - 1];
  const boatsWaiting =
    state.clientState[1].boatsWaiting + state.clientState[1].boatsWaiting;
  const messageOut = JSON.stringify(
    actions.Initial(
      myState.boatsWaiting,
      myState.boatCoords,
      returningPlayer,
      state.hits,
      state.misses,
      boatsWaiting === 0
    )
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

      // If all boats are placed, broadcast start attack phase
      const broadcastMsg =
        newState.clientState[0].boatsWaiting +
          newState.clientState[1].boatsWaiting ===
        0
          ? actions.StartAttackPhase()
          : null;
      return { newState, responseMsg, broadcastMsg };
    },
    SendAttack: ({ enemyNumber, coord }) => {
      const enemyBoatCoords = state.clientState[enemyNumber - 1].boatCoords;
      const hit = R.any(
        boatCoord => R.equals(boatCoord, coord),
        R.flatten(enemyBoatCoords)
      );
      const broadcastMsg = hit
        ? actions.AttackHit(enemyNumber, coord)
        : actions.AttackMissed(enemyNumber, coord);
      const newState = hit
        ? { ...state, hits: R.append({ enemyNumber, coord }, state.hits) }
        : { ...state, misses: R.append({ enemyNumber, coord }, state.misses) };
      return { newState, broadcastMsg };
    }
  });
}

function getPlayerNumber(url) {
  const re = /\?playerNumber=(\d)/;
  const result = Result.try(() => Number(re.exec(url)[1]));
  return resultToMaybe(result);
}

export { getPlayerNumber, handleNewPlayer, getUpdatedState };
