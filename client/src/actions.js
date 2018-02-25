import { union } from 'folktale/adt/union';

const action = union('Action', {
  Initial(player) {
    return { player };
  },
  NoOp() {
    return {};
  }
});

export default action;
