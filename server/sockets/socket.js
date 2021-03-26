/* All of the machinery required to work our websockets. */
const WebSocket = require("ws");
const url = require("url");
const querystring = require("querystring");
const socketActions = require("./socketActions");

const socketServers = {};

// WebSocket status indicators
const Status = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const KEEP_ALIVE_INTERVAL = 5000; // 5 seconds

// Given a room name, make a socket for the room and add listeners.
function makeRoomSocket(name) {
  const socket = new WebSocket.Server({ noServer: true });
  socket.on("connection", (ws, request, client) => {
    function ping(client) {
      if (ws.readyState === Status.OPEN) {
        ws.send("__ping__");
      } else {
        console.log(`Connection has been closed for client ${client}`);
        ws.send(socketActions.disconnect(client, name));
      }
    }

    function pong(client) {
      console.log(`Server ${client} is still active`);
      clearTimeout(keepAlive);
      setTimeout(() => {
        ping(client), KEEP_ALIVE_INTERVAL;
      });
    }

    ws.on("message", (msg) => {
      if (isJSON(msg)) {
        const message = JSON.parse(msg);
        if (message.keepAlive !== undefined) {
          pong(message.keepAlive.toLowerCase());
        }
        if (message.type && message.type in socketActions) {
          console.log(
            `Sending socket message associated with type "${message.type}"`
          );
          clients.forEach((cli) => {
            if (cli.readyState === ws.OPEN) {
              cli.send(
                JSON.stringify(socketActions[message.type](message, name))
              );
            }
          });
        } else {
          console.log(`"${message.type}" is not a valid socket message type.`);
        }
      }
    });
  });
  return socket;
}

// Called when an HTTP request is elevated to a WebSocket connection.
function onUpgrade(request, socket, head) {
  const { room } = querystring.parse(url.parse(request.url).query);

  if (!socketServers[room]) {
    socketServers[room] = {
      socket: makeRoomSocket(room),
      users: [],
      keepAlive: null,
    };
    console.log(`Created socket for room ${room}`);
  } else {
    console.log(`Using socket for room ${room}`);
  }

  const currentSocket = socketServers[room];

  currentSocket.handleUpgrade(request, socket, head, (ws) => {
    currentSocket.emit("connection", ws, request);
  });
}

module.exports = onUpgrade;
