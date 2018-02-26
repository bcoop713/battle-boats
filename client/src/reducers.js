const initialState = {
  player: {
    id: '',
    number: 1
  }
};

function reducers(state, action) {
  if (!action.matchWith) {
    return state;
  }
  return action.matchWith({
    Initial: ({ player }) => ({ ...state, player }),
    NoOp: () => state
  });
}

export { reducers, initialState };
