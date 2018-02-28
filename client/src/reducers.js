import { loop, Cmd } from 'redux-loop';
import { storeLocally, msgToServer, sendToServer } from './commands.js';
import Maybe from 'folktale/maybe';
import { Success, Failure } from 'folktale/validation';
import {
  map,
  concat,
  contains,
  append,
  head,
  insert,
  flatten,
  intersection
} from 'ramda';

const initialState = socket => ({
  socket,
  loading: true
});

const initialLoadedState = (storedState, socket) => ({
  loading: false,
  player: storedState.player,
  socket: socket,
  boatsWaiting: storedState.boatsWaiting,
  boatPlacementCoords: [],
  boatCoords: storedState.boatCoords,
  errors: Success(),
  instructions: Maybe.Nothing(),
  sentHits: [],
  sentMisses: [],
  recievedHits: [],
  recievedMisses: []
});

function validateCoords(coords, boatsWaiting, boatCoords) {
  if (coords && coords.length === 2) {
    const xDiff = coords[0].x - coords[1].x;
    const yDiff = coords[0].y - coords[1].y;
    const hasBoats = () => {
      return boatsWaiting > 0 ? Success() : Failure(['No boats left to place']);
    };
    const isHorOrVert = () => {
      return xDiff === 0 || yDiff === 0
        ? Success()
        : Failure(['Must be placed horizontally or vertically']);
    };
    const isLength3 = () => {
      const xDiffAbs = Math.abs(xDiff);
      const yDiffAbs = Math.abs(yDiff);
      return xDiffAbs === 2 || yDiffAbs === 2
        ? Success()
        : Failure(['Boat must be 3 units long']);
    };
    const isntOverlapping = () => {
      const fullBoat = getAllSegments(coords);
      const takenSpaces = flatten(boatCoords);
      const overlap = intersection(coords, takenSpaces);
      return overlap.length === 0
        ? Success()
        : Failure(['Boats can not overlap']);
    };
    return Success()
      .concat(isHorOrVert())
      .concat(isLength3())
      .concat(hasBoats())
      .concat(isntOverlapping());
  } else {
    return Failure(['Something horribel happened']);
  }
}

function validateAttack(
  coord,
  sentHits,
  sentMisses,
  receivedHits,
  receivedMisses,
  playerNumber
) {
  const allAttacksSent = concat(sentHits, sentMisses);
  const uniqueAttack = () => {
    return !contains(coord, allAttacksSent)
      ? Success()
      : Failure(['You already attacked this spot']);
  };
  const myTurn = () => {
    const allAttacks = concat(
      allAttacksSent,
      concat(receivedHits, receivedMisses)
    );
    return allAttacks.length % 2 === playerNumber - 1
      ? Success()
      : Failure(['It is not your turn']);
  };
  return Success()
    .concat(uniqueAttack())
    .concat(myTurn());
}

// Boat was represented as 2 points, this transforms that into 3 segments
function getAllSegments(coords) {
  const missingX = (coords[0].x + coords[1].x) / 2;
  const missingY = (coords[0].y + coords[1].y) / 2;
  const missingCoord = { x: missingX, y: missingY };
  return insert(1, missingCoord, coords);
}

function reducers(state, action) {
  if (!action.matchWith) {
    return state;
  }
  return action.matchWith({
    Initial: storedState => {
      return loop(
        initialLoadedState(storedState, state.socket),
        Cmd.run(storeLocally, {
          args: ['playerNumber', storedState.player.number]
        })
      );
    },
    BoatPlacementStart: ({ coord }) => {
      console.log(coord);
      return loop({ ...state, boatPlacementCoords: [coord] }, Cmd.none);
    },
    BoatPlacementEnd: ({ coord }) => {
      const updatedCoords = concat([head(state.boatPlacementCoords)], [coord]);
      const validCoords = validateCoords(
        updatedCoords,
        state.boatsWaiting,
        state.boatCoords
      );
      return validCoords.matchWith({
        Success: () => {
          const fullBoatCoords = getAllSegments(updatedCoords);
          const messageOut = msgToServer.PlaceBoat(
            state.player.number,
            fullBoatCoords
          );
          return loop(
            state,
            Cmd.run(sendToServer, { args: [state.socket, messageOut] })
          );
        },
        Failure: _ => loop({ ...state, errors: validCoords }, Cmd.none)
      });
    },
    BoatPlacementSuccess: ({ coord }) => {
      return loop(
        {
          ...state,
          boatPlacementCoords: [],
          boatsWaiting: state.boatsWaiting - 1,
          boatCoords: concat(state.boatCoords, [coord])
        },
        Cmd.none
      );
    },
    SendAttack: ({ coord }) => {
      const enemyNumber = state.player.number === 1 ? 2 : 1;
      const validAttack = validateAttack(
        coord,
        state.sentHits,
        state.sentMisses,
        state.recievedHits,
        state.recievedMisses
      );
      return validAttack.matchWith({
        Success: () => {
          const messageOut = msgToServer.SendAttack(enemyNumber, coord);
          return loop(
            state,
            Cmd.run(sendToServer, { args: [state.socket, messageOut] })
          );
        },
        Failure: _ => loop({ ...state, errors: validAttack }, Cmd.none)
      });
    },
    AttackHit: ({ enemyNumber, coord }) => {
      const newState =
        enemyNumber === state.player.number
          ? { ...state, recievedHits: append(coord, state.recievedHits) }
          : { ...state, sentHits: append(coord, state.sentHits) };

      return loop(newState, Cmd.none);
    },
    AttackMissed: ({ enemyNumber, coord }) => {
      const newState =
        enemyNumber === state.player.number
          ? { ...state, recievedMisses: append(coord, state.recievedMisses) }
          : { ...state, sentMisses: append(coord, state.sentMisses) };

      return loop(newState, Cmd.none);
    },
    NoOp: () => state
  });
}

export {
  reducers,
  initialState,
  validateCoords,
  getAllSegments,
  validateAttack
};
