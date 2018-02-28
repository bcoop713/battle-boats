import {
  fromSocketHandler,
  serializer,
  actionMapper
} from '../../src/adapters/from-socket.js';
import { union, derivations } from 'folktale/adt/union';
import ServerActions from '../../../server/src/actions.js';
import actions from '../../src/actions.js';
import Result from 'folktale/result';

const serverActions = union('ServerAction', {
  Action1(value) {
    return { value };
  },
  Action2() {
    return {};
  }
}).derive(derivations.serialization);

describe('serializer', () => {
  test('deserialized union instance', () => {
    const testData = JSON.stringify(serverActions.Action2());
    const event = { data: testData };
    const expectedResult = Result.Ok(serverActions.Action2());
    const result = serializer(event, serverActions);
    expect(expectedResult).toEqual(result);
  });

  test('deserialized garbage data', () => {
    const testData = 'l;kasjdflkjasdlfkjasldfkjas';
    const event = { data: testData };
    const result = serializer(event, serverActions);
    expect(Result.Error.hasInstance(result)).toBeTruthy();
  });

  test('deserialized garbage event', () => {
    const event = { notData: 'stuff' };
    const result = serializer(event, serverActions);
    expect(Result.Error.hasInstance(result)).toBeTruthy();
  });
});

describe('actionMapper', () => {
  test('Initial to Initial mapping', () => {
    const player = { id: 'asdf', number: 1 };
    const serverAction = Result.Ok(ServerActions.Initial(5, [], player));
    const mappedAction = actions.Initial(player, 5, []);
    expect(mappedAction).toEqual(actionMapper(serverAction));
  });
  test('garbage to NoOp mapping', () => {
    const serverAction = Result.Error();
    const mappedAction = actions.NoOp();
    expect(mappedAction).toEqual(actionMapper(serverAction));
  });
});
