/* A simple API for adding new websocket actions.
 *
 * Assuming that the websocket message is a JSON object that has field `type`,
 * the websocket looks up the type field in the keys of this dictionary
 * and sends the return value of the function provided to the key
 * to every client connected to the socket.
 *
 * If you know that a message will have a specific field,
 * feel free to use that field on the right hand side of the object.
 *
 * The first parameter to the function is the message object received
 * and the second is the code for the room the message was sent to.
 * */
const WebSocket = require("ws");
const rooms = require("../engine/rooms");

function broadcast(wss, message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function updateUsers(wss, message, { roomName }) {
  broadcast(wss, { type: "users", payload: rooms.getUsers(roomName) });
}

function connect(wss, message, { roomName, userId }) {
  rooms.joinRoom(roomName, userId);
  updateUsers(wss, message, { roomName });
}

function disconnect(wss, message, { roomName, userId }) {
  rooms.leaveRoom(roomName, userId);
  updateUsers(wss, message, { roomName });
}

const socketActions = {
  connect,
  disconnect,
  updateUsers,
};

// const socketActions = {
//   // "update-users": (message, roomName, userId) =>
//   //   rooms.joinRoom(roomName, userId),

//   // special: called only when a client connects
//   connect: (message, roomName, userId) => rooms.joinRoom(roomName, userId),
//   // special: called only when a client disconnects
//   disconnect: (message, roomName, userId) => rooms.leaveRoom(roomName, userId),

//   "update-users": (message, roomName, userId) => ({
//     users: rooms.getUsers(roomName),
//   }),
// };

module.exports = socketActions;
