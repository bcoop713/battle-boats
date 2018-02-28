import ServerActions from '../../../server/src/actions.js';
import actions from './../actions.js';
import Result from 'folktale/result';
import { pipe } from 'ramda';

function fromSocketHandler(event, store) {
  pipe(event => serializer(event, ServerActions), actionMapper, action =>
    dispatchAction(action, store)
  )(event);
}

function serializer(event, union) {
  return Result.try(() => union.fromJSON(JSON.parse(event.data)));
}

function actionMapper(ServerActionResult) {
  // Handle default action incase of error from websocket
  const serverAction = ServerActionResult.matchWith({
    Ok: ({ value }) => value,
    Error: () => ServerActions.NoOp()
  });

  // map server actions to client actions
  return serverAction.matchWith({
    Initial: ({
      player,
      boatsWaiting,
      boatCoords,
      hits,
      misses,
      allBoatsPlaced
    }) =>
      actions.Initial(
        player,
        boatsWaiting,
        boatCoords,
        hits,
        misses,
        allBoatsPlaced
      ),
    BoatPlacementSuccess: ({ coords }) => actions.BoatPlacementSuccess(coords),
    AttackMissed: ({ enemyNumber, coord }) =>
      actions.AttackMissed(enemyNumber, coord),
    AttackHit: ({ enemyNumber, coord }) =>
      actions.AttackHit(enemyNumber, coord),
    StartAttackPhase: () => actions.StartAttackPhase(),
    NoOp: () => actions.NoOp()
  });
}

function dispatchAction(action, store) {
  store.dispatch(action);
}

export { serializer, actionMapper, fromSocketHandler };
