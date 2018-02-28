import { validateCoords, getAllSegments } from '../src/reducers.js';
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
