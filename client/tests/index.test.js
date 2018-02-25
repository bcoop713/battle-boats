import { messageMapper } from '../src/index.js';
import actions from '../src/actions.js';

test('message mapper', () => {
  const message = {
    type: 'INITIAL',
    player: { id: '456', player: { number: 1, id: 'asdf' } }
  };
  const event = { data: JSON.stringify(message) };
  const expectedAction = actions.Initial(message.player);
  const receivedAction = messageMapper(event);
  expect(receivedAction).toEqual(expectedAction);
});
