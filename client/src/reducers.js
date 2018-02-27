import { loop, Cmd } from "redux-loop";
import { storeLocally } from "./commands.js";
import Maybe from "folktale/maybe";
import { map, concat, head } from "ramda";

const initialState = {
  loading: true
};

const initialLoadedState = player => ({
  loading: false,
  player: player,
  boatsWaiting: 5,
  boatPlacementCoords: [Maybe.Nothing(), Maybe.Nothing()]
});
function reducers(state, action) {
  if (!action.matchWith) {
    return state;
  }
  return action.matchWith({
    Initial: ({ player }) => {
      return loop(
        initialLoadedState(player),
        Cmd.run(storeLocally, { args: ["playerNumber", player.number] })
      );
    },
    BoatPlacementStart: coord => {
      return loop(
        { ...state, boatPlacementCoords: [Maybe.Just(coord), Maybe.Nothing()] },
        Cmd.none
      );
    },
    BoatPlacementEnd: coord => {
      const updatedCoords = concat(
        [head(state.boatPlacementCoords)],
        [Maybe.Just(coord)]
      );
      return loop({ ...state, boatPlacementCoords: updatedCoords }, Cmd.none);
    },
    NoOp: () => state
  });
}

export { reducers, initialState };
