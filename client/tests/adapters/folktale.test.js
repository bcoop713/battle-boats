import { createStore, applyMiddleware } from 'redux';
import { flMiddleware, flReducer } from '../../src/adapters/folktale.js';
import { union } from 'folktale/adt/union';

describe('middleware', () => {
  test('should passthrough native actions', () => {
    const nativeAction = { type: 'NATIVE', value: {} };
    const mockNext = jest.fn();
    flMiddleware(null)(mockNext)(nativeAction);
    expect(mockNext.mock.calls[0][0]).toEqual(nativeAction);
  });
  test('should handle flatland unions', () => {
    const flActions = union('Sample', {
      Action1() {
        return {};
      },
      Action2(thing) {
        return { thing };
      }
    });
    const expectedOutput = { type: 'ACTION1', payload: flActions.Action1() };
    const mockNext = jest.fn();
    flMiddleware(null)(mockNext)(flActions.Action1());
    expect(mockNext.mock.calls[0][0]).toEqual(expectedOutput);
  });
});

describe('reducer wrapper', () => {
  test('should allow native actions', () => {
    const nativeAction = { type: 'NATIVE', value: {} };
    const mockReducer = jest.fn();
    const mockState = {};
    flReducer(mockReducer)(mockState, nativeAction);
    expect(mockReducer.mock.calls[0][1]).toEqual(nativeAction);
  });
  test('should allow flatland actions', () => {
    const flActions = union('Sample', {
      Action1() {
        return {};
      },
      Action2(thing) {
        return { thing };
      }
    });
    const flAction1 = flActions.Action1();
    const wrappedFLAction = { type: 'ACTION1', payload: flAction1 };
    const mockReducer = jest.fn();
    const mockState = {};
    flReducer(mockReducer)(mockState, wrappedFLAction);
    expect(mockReducer.mock.calls[0][1]).toEqual(flAction1);
  });
});
