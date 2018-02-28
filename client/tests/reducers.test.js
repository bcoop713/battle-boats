import {
  validateCoords,
  getAllSegments,
  validateAttack
} from '../src/reducers.js';
import { Success, Failure } from 'folktale/validation';

describe('validateCoords', () => {
  const boatCoords = [{ x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }];
  it('should allow 3 unit long horizontal or vertical coords', () => {
    const testCoords = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const validationResult = validateCoords(testCoords, 5, boatCoords);
    expect(Success.hasInstance(validationResult)).toBeTruthy();
  });
  it('should disallow diagonally placed boats', () => {
    const testCoords = [{ x: 1, y: 1 }, { x: 3, y: 3 }];
    const validationResult = validateCoords(testCoords, 5, boatCoords);
    expect(Failure.hasInstance(validationResult)).toBeTruthy();
  });
  it('should disallow short boats', () => {
    const testCoords = [{ x: 1, y: 1 }, { x: 2, y: 1 }];
    const validationResult = validateCoords(testCoords, 5, boatCoords);
    expect(Failure.hasInstance(validationResult)).toBeTruthy();
  });
  it('should prevent placing too many boats', () => {
    const testCoords = [{ x: 1, y: 1 }, { x: 2, y: 1 }];
    const validationResult = validateCoords(testCoords, 0, boatCoords);
    expect(Failure.hasInstance(validationResult)).toBeTruthy();
  });
  it('should prevent overlapping boats', () => {
    const testCoords = [{ x: 6, y: 6 }, { x: 4, y: 6 }];
    const validationResult = validateCoords(testCoords, 5, boatCoords);
    expect(Failure.hasInstance(validationResult)).toBeTruthy();
  });
  it('should disallow bad data', () => {
    const testCoords = [{ x: 1, y: 1 }];
    const validationResult = validateCoords(testCoords, 5);
    expect(Failure.hasInstance(validationResult)).toBeTruthy();
  });
});

describe('getAllSegments', () => {
  it('should fill in the missing coord on a horizontal boat', () => {
    const testCoords = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const expectedCoords = [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }];
    expect(getAllSegments(testCoords)).toEqual(expectedCoords);
  });
});

describe('validateAttack', () => {
  it('should disalow redundant attacks', () => {
    const sentHits = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const sentMisses = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const receivedHits = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const receivedMisses = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const attackCoord = { x: 1, y: 1 };
    const validationResult = validateAttack(
      attackCoord,
      sentHits,
      sentMisses,
      receivedHits,
      receivedHits,
      1,
      true
    );
    expect(Failure.hasInstance(validationResult)).toBeTruthy();
  });
  it('should disalow out of turn attacks for player 1', () => {
    const sentHits = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const sentMisses = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const receivedHits = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const receivedMisses = [{ x: 7, y: 7 }];
    const playerNumber = 1;
    const attackCoord = { x: 8, y: 8 };
    const validationResult = validateAttack(
      attackCoord,
      sentHits,
      sentMisses,
      receivedHits,
      receivedMisses,
      playerNumber,
      true
    );
    expect(Failure.hasInstance(validationResult)).toBeTruthy();
  });
  it('should disalow out of turn attacks for player 2', () => {
    const sentHits = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const sentMisses = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const receivedHits = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const receivedMisses = [{ x: 7, y: 7 }, { x: 5, y: 5 }];
    const playerNumber = 2;
    const attackCoord = { x: 8, y: 8 };
    const validationResult = validateAttack(
      attackCoord,
      sentHits,
      sentMisses,
      receivedHits,
      receivedMisses,
      playerNumber,
      true
    );
    expect(Failure.hasInstance(validationResult)).toBeTruthy();
  });
  it('should disalow attacking before attack phase', () => {
    const sentHits = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const sentMisses = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const receivedHits = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const receivedMisses = [{ x: 7, y: 7 }, { x: 5, y: 5 }];
    const playerNumber = 1;
    const attackCoord = { x: 8, y: 8 };
    const validationResult = validateAttack(
      attackCoord,
      sentHits,
      sentMisses,
      receivedHits,
      receivedMisses,
      playerNumber,
      false
    );
    expect(Failure.hasInstance(validationResult)).toBeTruthy();
  });
  it('should allow valid attacks', () => {
    const sentHits = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const sentMisses = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const receivedHits = [{ x: 1, y: 1 }, { x: 3, y: 1 }];
    const receivedMisses = [{ x: 5, y: 5 }];
    const playerNumber = 2;
    const attackCoord = { x: 8, y: 8 };
    const validationResult = validateAttack(
      attackCoord,
      sentHits,
      sentMisses,
      receivedHits,
      receivedMisses,
      playerNumber,
      true
    );
    expect(Success.hasInstance(validationResult)).toBeTruthy();
  });
});
