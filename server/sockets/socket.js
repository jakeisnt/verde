/* All of the machinery required to work our websockets. */
const WebSocket = require("ws");
const url = require("url");
const querystring = require("querystring");
const socketActions = require("./socketActions");

const socketServers = {};

function makeRoomSocket(name) {
  const socket = new WebSocket.Server({ noServer: true });
  socket.on("connection", (ws, request, client) => {
    ws.on("message", (msg) => {
      const message = JSON.parse(msg);
      if (message.type && message.type in socketActions) {
        console.log(
          `Sending socket message associated with type "${message.type}"`
        );
        socket.clients.forEach((cli) => {
          if (cli.readyState === ws.OPEN) {
            cli.send(
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
<<<<<<< HEAD
  const { room } = querystring.parse(url.parse(request.url).query);
=======
  const room = querystring.parse(url.parse(request.url).query).room;
>>>>>>> 24162ca (make socket folder and add docs)

  if (!socketServers[room]) {
    socketServers[room] = makeRoomSocket(room);
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
