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

/*
 * On every connection:
 * - See if an existing connection with that user id already exists
 *   - if it's live, add that connection to the list of connection that user has
 *   - if it's dead, move the user to being live, add a connection, and notify the room
 *
 * On every disconnect:
 * - Find the user who had that connection
 * - Remove the connection from the user
 * - If the user has no more connections:
 *   - Move the user to a 'disconnected' array
 *   - Notify every client of this disconnect
 */

const PING_INTERVAL = 30000;

function broadcast(ws, message, roomName, userId) {
  if (ws.clients) {
    ws.clients.forEach((cli) => {
      if (cli.readyState === ws.OPEN) {
        cli.send(JSON.stringify(socketActions[message.type](message, name)));
      }
    });
  } else {
    console.log(
      `The websocket for room ${roomName} requested by ${userId} doesn't seem to have any clients. That's probably bad`
    );
  }
}

// Given a room name, make a socket for the room and add listeners.
function makeRoomSocket(name) {
  const socket = new WebSocket.Server({ noServer: true });
  socket.on("connection", (ws, request, client) => {
    const { room, userId } = querystring.parse(url.parse(request.url).query);

    ws.isAlive = true;
    ws.on("pong", () => {
      this.isAlive = true;
    });

    ws.interval = setInterval(() => {
      if (ws.clients) {
        ws.clients.forEach((client) => {
          if (client.isAlive === false) {
            broadcast(ws, { type: "disconnect" }, room, userId);
            return client.terminate();
          }
          client.isAlive = false;
          client.ping(() => {});
        });
      }
    }, PING_INTERVAL);

    ws.on("close", () => {
      clearInterval(ws.interval);
    });

    ws.on("message", (msg) => {
      if (isJSON(msg)) {
        const message = JSON.parse(msg);
        if (message.type && message.type in socketActions) {
          console.log(
            `Sending socket message associated with type "${message.type}"`
          );
        } else {
          console.log(`"${message.type}" is not a valid socket message type.`);
        }
        console.log(`${msg} is not valid JSON.`);
      }
    });
  });
  return socket;
}

// Called when an HTTP request is elevated to a WebSocket connection.
function onUpgrade(request, socket, head) {
  const { room, userId } = querystring.parse(url.parse(request.url).query);

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
