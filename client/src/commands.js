import { union, derivations } from 'folktale/adt/union';

function storeLocally(key, value) {
  localStorage.setItem(key, value);
}

// Sends messages to the provided socket
function sendToServer(socket, message) {
  socket.send(JSON.stringify(message));
}

// Union types of messages that get sent to the server
const msgToServer = union('MessagesOut', {
  PlaceBoat(playerNumber, boatCoords) {
    return { playerNumber, boatCoords };
  },
  SendAttack(enemyNumber, coord) {
    return { enemyNumber, coord };
  }
}).derive(derivations.serialization);

export { storeLocally, sendToServer, msgToServer };
