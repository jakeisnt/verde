/* All of the machinery required to work our websockets. */
const ws = require("ws");
const url = require("url");
const querystring = require("querystring");
const socketActions = require("./socketActions");

const socketServers = {};

function makeSocket(name) {
  const socket = new ws.Server({ noServer: true });
  socket.on("connection", (ws, request, client) => {
    ws.on("message", (msg) => {
      const message = JSON.parse(msg);
      if (message.type && message.type in socketActions) {
        socket.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(
              JSON.stringify(socketActions[message.type](message, name))
            );
          }
        });
      } else {
        console.log(`"${message.type}" is not a valid socket message type.`);
      }
    });
  });
  return socket;
}

// Called when an HTTP request is elevated to a WebSocket connection.
function onUpgrade(request, socket, head) {
  const room = querystring.parse(url.parse(request.url).query).room;

  if (!socketServers[room]) {
    socketServers[room] = makeSocket(room);
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
