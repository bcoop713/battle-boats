import { union, derivations } from 'folktale/adt/union';

const actions = union('ServerAction', {
  Initial(boatsWaiting, boatCoords, player) {
    return { boatsWaiting, boatCoords, player };
  },
  BoatPlacementSuccess(coords) {
    return { coords };
  },
  NoOp() {
    return {};
  }
}).derive(derivations.serialization);

export default actions;
