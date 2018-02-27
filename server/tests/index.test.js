import { getPlayerNumber, handleNewPlayer } from '../src/index.js';
import Maybe from 'folktale/maybe';
import Result from 'folktale/result';
import actions from '../src/actions.js';

describe('getPlayerNumber', () => {
  test('if present, returns number', () => {
    const url = '/?playerNumber=1';
    expect(getPlayerNumber(url)).toEqual(Maybe.Just(1));
  });
  test('if not present, returns null', () => {
    const url = '/';
    expect(getPlayerNumber(url)).toEqual(Maybe.Nothing());
  });
});

describe('handleNewPlayer', () => {
  test('empty room', () => {
    const appState = { players: [] };
    const { messageOut, newState } = handleNewPlayer(appState);
    const newPlayer = { number: 1 };
    const expectedMessageOut = JSON.stringify(actions.Initial(newPlayer));
    const expectedState = { players: [newPlayer] };
    expect(messageOut).toBe(expectedMessageOut);
    expect(newState).toEqual(expectedState);
  });
  test('one player waiting', () => {
    const appState = { players: [{ number: 1 }] };
    const { messageOut, newState } = handleNewPlayer(appState);
    const newPlayer = { number: 2 };
    const expectedMessageOut = JSON.stringify(actions.Initial(newPlayer));
    const expectedState = { players: [{ number: 1 }, newPlayer] };
    expect(messageOut).toBe(expectedMessageOut);
    expect(newState).toEqual(expectedState);
  });
  test('two players playing, room full', () => {
    const appState = { players: [{ number: 1 }, { number: 2 }] };
    const { messageOut, newState } = handleNewPlayer(appState);
    const expectedMessageOut = JSON.stringify(Result.Error('Room Full'));
    const expectedState = appState;
    expect(messageOut).toBe(expectedMessageOut);
    expect(newState).toEqual(expectedState);
  });
});
