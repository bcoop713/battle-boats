const flMiddleware = store => next => action => {
  // TODO add better type check
  if (!action.type) {
    const type = action[Symbol.for('@@folktale:adt:tag')].toUpperCase();
    next({ type: type, payload: action });
  } else {
    next(action);
  }
};

const flReducer = reducers => {
  return (state, action) => {
    if (action.payload) {
      return reducers(state, action.payload);
    } else {
      return reducers(state, action);
    }
  };
};

export { flMiddleware, flReducer };
