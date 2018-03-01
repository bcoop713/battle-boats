import { nextInstruction, instructions } from '../src/instructions.js';

describe('nextInstruction', () => {
  it('should return Place Boats at the proper time', () => {
    const state = {
      sentHits: [],
      sentMisses: [],
      receivedHits: [],
      receivedMisses: [],
      player: 1,
      allBoatsPlaced: false,
      boatsWaiting: 1
    };
    const nextIns = nextInstruction(state);
    expect(nextIns).toBe(instructions.PlaceBoats(1));
  });
  it('should return Waiting when enemy hasnt placed all boats', () => {
    const state = {
      sentHits: [],
      sentMisses: [],
      receivedHits: [],
      receivedMisses: [],
      player: 1,
      allBoatsPlaced: false,
      boatsWaiting: 0
    };
    const nextIns = nextInstruction(state);
    expect(nextIns).toBe(instructions.Waiting());
  });
  it('should return Your Turn after all boats placed and are player 1', () => {
    const state = {
      sentHits: [],
      sentMisses: [],
      receivedHits: [],
      receivedMisses: [],
      player: { number: 1 },
      allBoatsPlaced: true,
      boatsWaiting: 0
    };
    const nextIns = nextInstruction(state);
    expect(nextIns).toBe(instructions.YourTurn());
  });
  it('should return Waiting after all boats placed and are player 2', () => {
    const state = {
      sentHits: [],
      sentMisses: [],
      receivedHits: [],
      receivedMisses: [],
      player: { number: 2 },
      allBoatsPlaced: true,
      boatsWaiting: 0
    };
    const nextIns = nextInstruction(state);
    expect(nextIns).toBe(instructions.Waiting());
  });
  it('should return Your Turn with even attacks and are player 1', () => {
    const state = {
      sentHits: [1],
      sentMisses: [],
      receivedHits: [1],
      receivedMisses: [],
      player: { number: 1 },
      allBoatsPlaced: true,
      boatsWaiting: 0
    };
    const nextIns = nextInstruction(state);
    expect(nextIns).toBe(instructions.YourTurn());
  });
  it('should return Waiting with even attacks and are player 2', () => {
    const state = {
      sentHits: [1],
      sentMisses: [],
      receivedHits: [1],
      receivedMisses: [],
      player: { number: 2 },
      allBoatsPlaced: true,
      boatsWaiting: 0
    };
    const nextIns = nextInstruction(state);
    expect(nextIns).toBe(instructions.Waiting());
  });
});
