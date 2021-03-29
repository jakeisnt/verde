/* All of the machinery required to work our websockets. */
const WebSocket = require("ws");
const url = require("url");
const querystring = require("querystring");
const socketActions = require("./socketActions");
const rooms = require("../engine/rooms");

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

const PING_INTERVAL = 10000;

const MAX_INACTIVE_PINGS = 2;

function broadcast(ws, message, roomName, userId) {
  ws.clients.forEach((cli) => {
    if (cli.readyState === ws.OPEN) {
      cli.send(JSON.stringify(socketActions[message.type](message, name)));
    }
  });
}

// Given a room name, make a socket for the room and add listeners.
function makeRoomSocket(name) {
  console.log(`Opening WebSocket server for room ${name}.`);

  const wss = new WebSocket.Server({ noServer: true });
  wss.on("connection", (ws, request, client) => {
    const { userId } = querystring.parse(url.parse(request.url).query);

    socketActions.connect(wss, null, { roomName: name, userId });

    ws.userId = userId;
    ws.isAlive = true;
    ws.on("pong", () => {
      console.log(`User with id ${userId} ponged room ${name}.`);
      ws.isAlive = true;
    });

    ws.on("close", () => {
      console.log(`User with id ${userId} left room ${name}.`);
      socketActions.disconnect(wss, null, { roomName: name, userId });
    });

    ws.on("message", (msg) => {
      if (isJSON(msg)) {
        const message = JSON.parse(msg);
        const args = { roomName: name, userId };
        if (message.type && message.type in socketActions) {
          console.log(
            `Sending socket message associated with type "${message.type}"`
          );
          socketActions[message.type](wss, message, args);
        } else {
          console.log(`"${message.type}" is not a valid socket message type.`);
        }
        console.log(`${msg} is not valid JSON.`);
      }
    });
  });

  var inactivePings = 0;

  wss.interval = setInterval(() => {
    console.log(`Pinging clients of room ${name}...`);
    var hasActive = false;
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log(`User with id ${ws.userId} dropped from room ${name}.`);
        return ws.terminate();
      }
      hasActive = true;
      ws.isAlive = false;
      ws.ping(() => {});
    });
    if (hasActive) {
      inactivePings = 0;
    } else {
      console.log(`Room ${name} has no active users.`);
      inactivePings++;
    }
    if (inactivePings >= MAX_INACTIVE_PINGS) {
      console.log(`Room ${name} has had no active users for too long.`);
      wss.close();
    }
  }, PING_INTERVAL);

  wss.on("close", () => {
    console.log(`Closing WebSocket server for room ${name}.`);
    clearInterval(wss.interval);
  });

  return wss;
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
