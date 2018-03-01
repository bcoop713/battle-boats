import { concat } from 'ramda';

function nextInstruction({
  sentHits,
  sentMisses,
  receivedHits,
  receivedMisses,
  player,
  allBoatsPlaced,
  boatsWaiting
}) {
  const myTurn =
    concat(concat(sentHits, sentMisses), concat(receivedHits, receivedMisses))
      .length %
      2 ===
    player.number - 1;
  if (boatsWaiting > 0) {
    return instructions.PlaceBoats(boatsWaiting);
  } else if (allBoatsPlaced && !myTurn) {
    return instructions.Waiting();
  } else if (myTurn && allBoatsPlaced) {
    return instructions.YourTurn();
  } else {
    return instructions.Waiting();
  }
}

const instructions = {
  PlaceBoats(boats) {
    return `Place all your boats to start playing: ${boats} Boats Remaining`;
  },
  Waiting() {
    return 'Waiting for your opponent';
  },
  YourTurn() {
    return "Hurry up, it's your turn";
  }
};

export { nextInstruction, instructions };
