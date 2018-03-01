import { union } from 'folktale/adt/union';

const action = union('Action', {
  Initial(player, boatsWaiting, boatCoords, hits, misses, allBoatsPlaced) {
    return { player, boatsWaiting, boatCoords, hits, misses, allBoatsPlaced };
  },
  BoatPlacementStart(coord) {
    return { coord };
  },
  BoatPlacementEnd(coord) {
    return { coord };
  },
  BoatPlacementSuccess(coord) {
    return { coord };
  },
  SendAttack(coord) {
    return { coord };
  },
  AttackMissed(enemyNumber, coord) {
    return { enemyNumber, coord };
  },
  AttackHit(enemyNumber, coord) {
    return { enemyNumber, coord };
  },
  StartAttackPhase() {
    return {};
  },
  CloseError() {
    return {};
  },
  NoOp() {
    return {};
  }
});

export default action;
