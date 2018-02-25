export const initial = player => {
  return {
    type: 'INITIAL',
    player: player
  };
};

export const noOp = () => {
  return {
    type: 'NOOP'
  };
};
