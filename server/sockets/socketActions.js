const WebSocket = require("ws");
const Rooms = require("../engine/rooms");

function broadcast(wss, message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function updateUsers(wss, message, { roomName }) {
  broadcast(wss, { type: "users", payload: Rooms.getUsers(roomName) });
}

function connect(wss, message, { roomName, userId }) {
  Rooms.joinRoom(roomName, userId);
  updateUsers(wss, message, { roomName });
}

function disconnect(wss, message, { roomName, userId }) {
  Rooms.leaveRoom(roomName, userId);
  updateUsers(wss, message, { roomName });
}

function spectate(wss, message, { roomName, userId }) {
  Rooms.setSpectate(roomName, userId, true);
  updateUsers(wss, message, { roomName });
}

function unspectate(wss, message, { roomName, userId }) {
  Rooms.setSpectate(roomName, userId, false);
  updateUsers(wss, message, { roomName });
}

function banUser(wss, message, { roomName, userId }) {
  Rooms.banUser(roomName, userId, message.payload.toBanId);
  updateUsers(wss, message, { roomName });
}

const socketActions = {
  connect,
  disconnect,
  updateUsers,
  spectate,
  unspectate,
  banUser,
};

module.exports = socketActions;
