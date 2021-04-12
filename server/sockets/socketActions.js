const WebSocket = require("ws");
const Rooms = require("../engine/rooms");
const Users = require("../engine/users");

function broadcast(wss, message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function users(wss, message, { roomName }) {
  broadcast(wss, { type: "users", payload: Rooms.getUsers(roomName) });
}

function game(wss, message, { roomName }) {
  broadcast(wss, { type: "game", payload: Rooms.getGameState(roomName) });
}

/* TODO
 * spec:
 * */

const Broadcast = {
  users,
  game,
};

const spec = {
  // name of function/endpoint: names of arguments expected in socket message
  game: {
    unspectateUser: ["id"],
    banUser: ["toBanId"],
    nominateMod: ["id"],
    changeName: ["name"],
    unspectateAll: [],
    spectate: [],
  },
  users: {
    passTurn: [],
    stopGame: [],
    startGame: [],
    takeAction: ["type"],
  },
};

// maps from spec to the functions that bake the right broadcasts
function andmap(arr, cond) {
  return arr.reduce((b, elem) => b && cond(elem), true);
}

function generateEndpoints(spec, sendMessage) {
  return Object.keys(spec).reduce((allfuncs, type) => {
    const newFuncs = reduce((funcs, funcName) => {
      return {
        ...funcs,
        [funcName]: (wss, message, { roomName, userId }) => {
          // if the payload doesn't have all of the arguments required by the spec, abort!
          if (
            !andmap(
              spec[type][funcName],
              (elem) => elem in Object.keys(message.payload)
            )
          )
            return undefined;
          // otherwise, call the appropriate function of Rooms, then of Broadcast
          Rooms[funcName](roomName, userId, message.payload);
          Broadcast[type](wss, message, { roomName });
        },
      };
      return { ...allfuncs, newFuncs };
    }, {});
  });
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

function changeName(wss, message, { roomName, userId }) {
  Users.setName(userId, message.payload.name);
  updateUsers(wss, message, { roomName });
}

function modUnspectate(wss, message, { roomName, userId }) {
  Rooms.modSetSpectate(roomName, userId, message.payload.id, false);
  updateUsers(wss, message, { roomName });
}

function unspectateAll(wss, message, { roomName, userId }) {
  Rooms.unspectateAllUsers(roomName, userId);
  updateUsers(wss, message, { roomName });
}

function nominateMod(wss, message, { roomName, userId }) {
  Rooms.nominateMod(roomName, userId, message.payload.id);
  updateUsers(wss, message, { roomName });
}

function startGame(wss, message, { roomName, userId }) {
  Rooms.startGame(roomName, userId);
  updateGameState(wss, message, { roomName });
}

function stopGame(wss, message, { roomName, userId }) {
  Rooms.stopGame(roomName, userId);
  updateGameState(wss, message, { roomName });
}

function passTurn(wss, message, { roomName, userId }) {
  Rooms.passTurn(roomName, userId);
  updateGameState(wss, message, { roomName });
}

function takeAction(wss, message, { roomName, userId }) {
  Rooms.takeAction(roomName, userId, message.payload.type);
  updateGameState(wss, message, { roomName });
}

const socketActions = {
  connect,
  disconnect,
  updateUsers,
  spectate,
  unspectate,
  banUser,
  changeName,
  modUnspectate,
  unspectateAll,
  nominateMod,
  startGame,
  stopGame,
  passTurn,
  takeAction,
};

module.exports = socketActions;
