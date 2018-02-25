const initialState: State = {
  player: {
    id: '',
    number: 1
  }
};

function reducers(state = initialState, action: any) {
  switch (action.type) {
    case 'INITIAL':
      return { ...state, player: action.player };
    case 'NOOP':
      return state;
    default:
      return state;
  }
}

export default reducers;
