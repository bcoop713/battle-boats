import { loop, Cmd } from 'redux-loop';
import { storeLocally } from './commands.js';

const initialState = {
  loading: true
};

function reducers(state, action) {
  if (!action.matchWith) {
    return state;
  }
  return action.matchWith({
    Initial: ({ player }) => {
      return loop(
        { ...state, loading: false, player },
        Cmd.run(storeLocally, { args: ['playerNumber', player.number] })
      );
    },
    NoOp: () => state
  });
}

export { reducers, initialState };
