import { union } from "folktale/adt/union";

const action = union("Action", {
  Initial(player) {
    return { player };
  },
  BoatPlacementStart(coord) {
    return coord;
  },
  BoatPlacementEnd(coord) {
    return coord;
  },
  NoOp() {
    return {};
  }
});

export default action;
