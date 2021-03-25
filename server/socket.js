const ws = require("ws");
const url = require("url");
const querystring = require("querystring");
const wss = new ws.Server({ noServer: true });

// {roomName: server}
const socketServers = {};

function makeSocket() {
  const socket = new ws.Server({ noServer: true });
  socket.on("connection", (ws) => {});
  socket.on("message", (msg) => {
    console.log(`received ${msg}`);
    socket.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
  return socket;
}

// Called when an HTTP request is elevated to a WebSocket connection.
function onUpgrade(request, socket, head) {
  const room = querystring.parse(url.parse(request.url).query).room;

  if (!socketServers[room]) {
    socketServers[room] = makeSocket();
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
