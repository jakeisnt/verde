const ws = require("ws");
const url = require("url");
const querystring = require("querystring");
const wss = new ws.Server({ noServer: true });
const rooms = require("./engine/rooms");

const socketServers = {};

function makeSocket(name) {
  const socket = new ws.Server({ noServer: true });
  socket.on("connection", (ws) => {
    console.log("received a new connection!");
  });
  socket.on("message", (msg) => {
    console.log(`received ${msg}`);
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new-user":
        console.log("Received a new user", message);
        socket.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(rooms.getRoom(name));
          }
        });
        break;
      default:
        console.log(`"${message.type}" is not a valid socket message type.`);
    }
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
