const WebSocket = require("ws");
const Rooms = require("../engine/rooms");
const Users = require("../engine/users");
const { spec, classes } = require("../api");

/**  Effectively the standard library. */
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

// name of function/endpoint: names of arguments expected in socket payload
function generateEndpoints(config) {
  return Object.keys(config).reduce((allfuncs, type) => {
    const newFuncs = Object.keys(config[type]).reduce((funcs, funcName) => {
      return {
        ...funcs,
        [funcName]: (wss, message, { roomName, userId }) => {
          // if the payload doesn't have all of the arguments required by the config, abort!
          if (
            !config[type][funcName].every(
              (elem) => elem in Object.keys(message.payload)
            )
          )
            return undefined;
          // call the appropriate function off of the appropriate class
          classes[type][funcName](roomName, userId, message.payload);
          // call the corresponding broadcasting function
          return [type](wss, message, { roomName });
        },
      };
    });
    return { ...allfuncs, newFuncs };
  }, {});
}

const socketActions = generateEndpoints(spec);

module.exports = socketActions;
