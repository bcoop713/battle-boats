import { union, derivations } from 'folktale/adt/union';

const actions = union('ServerAction', {
  Initial(player) {
    return { player };
  },
  NoOp() {
    return {};
  }
}).derive(derivations.serialization);

export default actions;
