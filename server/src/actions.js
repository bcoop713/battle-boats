import { union, derivations } from 'folktale/adt/union';

const actions = union('ServerAction', {
  Initial(boatsWaiting, boatCoords, player, hits, misses, allBoatsPlaced) {
    return { boatsWaiting, boatCoords, player, hits, misses, allBoatsPlaced };
  },
  BoatPlacementSuccess(coords) {
    return { coords };
  },
  AttackHit(enemyNumber, coord) {
    return { enemyNumber, coord };
  },
  AttackMissed(enemyNumber, coord) {
    return { enemyNumber, coord };
  },
  StartAttackPhase() {
    return {};
  },
  NoOp() {
    return {};
  }
}).derive(derivations.serialization);

export default actions;
