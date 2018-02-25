const initialState: State = {
  player: {
    id: '',
    number: 1
  }
};

function reducers(state = initialState, action) {
  if (!action.matchWith) {
    return state;
  }
  return action.matchWith({
    Initial: ({ player }) => ({ ...state, player }),
    NoOp: () => state
  });
}

export default reducers;
