import { loop, Cmd } from 'redux-loop';
import { storeLocally, msgToServer, sendToServer } from './commands.js';
import { nextInstruction, instructions } from './instructions.js';
import Maybe from 'folktale/maybe';
import { Success, Failure } from 'folktale/validation';
import {
  map,
  concat,
  partition,
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

const initialLoadedState = (storedState, socket) => {
  const partitionedHits = partition(
    hit => hit.enemyNumber === storedState.player.number,
    storedState.hits
  );
  const partitionedMisses = partition(
    miss => miss.enemyNumber === storedState.player.number,
    storedState.misses
  );
  const receivedHits = map(hit => hit.coord, partitionedHits[0]);
  const sentHits = map(hit => hit.coord, partitionedHits[1]);
  const receivedMisses = map(miss => miss.coord, partitionedMisses[0]);
  const sentMisses = map(miss => miss.coord, partitionedMisses[1]);
  return {
    loading: false,
    player: storedState.player,
    socket: socket,
    boatsWaiting: storedState.boatsWaiting,
    boatPlacementCoords: [],
    boatCoords: storedState.boatCoords,
    errors: Success(),
    instructions: nextInstruction({
      sentHits,
      sentMisses,
      receivedMisses,
      receivedHits,
      player: storedState.player,
      allBoatsPlaced: storedState.allBoatsPlaced,
      boatsWaiting: storedState.boatsWaiting
    }),
    sentHits: sentHits,
    sentMisses: sentMisses,
    receivedHits: receivedHits,
    receivedMisses: receivedMisses,
    allBoatsPlaced: storedState.allBoatsPlaced
  };
};

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
        : Failure(['Boat must be placed horizontally or vertically']);
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
  playerNumber,
  allBoatsPlaced
) {
  const allAttacksSent = concat(sentHits, sentMisses);
  const uniqueAttack = () => {
    return !contains(coord, allAttacksSent)
      ? Success()
      : Failure(['You already attacked this spot']);
  };
  const attackPhase = () => {
    return allBoatsPlaced
      ? Success()
      : Failure([
          'You have to wait for all players to place all of their boats before you attack'
        ]);
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
    .concat(myTurn())
    .concat(attackPhase());
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
      const player = storedState.player || state.player;
      const initialState = {
        ...storedState,
        player
      };
      return loop(
        initialLoadedState(initialState, state.socket),
        Cmd.run(storeLocally, {
          args: ['playerNumber', player.number]
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
      const nextIns = nextInstruction({
        ...state,
        boatsWaiting: state.boatsWaiting - 1
      });
      return loop(
        {
          ...state,
          boatPlacementCoords: [],
          boatsWaiting: state.boatsWaiting - 1,
          boatCoords: concat(state.boatCoords, [coord]),
          instructions: nextIns
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
        state.receivedHits,
        state.receivedMisses,
        state.player.number,
        state.allBoatsPlaced
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
          ? {
              ...state,
              receivedHits: append(coord, state.receivedHits),
              instructions: instructions.YourTurn()
            }
          : {
              ...state,
              sentHits: append(coord, state.sentHits),
              instructions: instructions.Waiting()
            };

      return loop(newState, Cmd.none);
    },
    AttackMissed: ({ enemyNumber, coord }) => {
      const newState =
        enemyNumber === state.player.number
          ? {
              ...state,
              receivedMisses: append(coord, state.receivedMisses),
              instructions: instructions.YourTurn()
            }
          : {
              ...state,
              sentMisses: append(coord, state.sentMisses),
              instructions: instructions.Waiting()
            };

      return loop(newState, Cmd.none);
    },
    StartAttackPhase: () => {
      const nextInstruction =
        state.player.number === 1
          ? instructions.YourTurn()
          : instructions.Waiting();
      return loop({ ...state, allBoatsPlaced: true }, Cmd.none);
    },
    CloseError: () => {
      return loop({ ...state, errors: Success() }, Cmd.none);
    },
    SendRestart: () => {
      const messageOut = msgToServer.SendRestart();
      return loop(
        state,
        Cmd.run(sendToServer, { args: [state.socket, messageOut] })
      );
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
