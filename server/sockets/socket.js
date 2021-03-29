/* All of the machinery required to work our websockets. */
const WebSocket = require("ws");
const url = require("url");
const querystring = require("querystring");
const socketActions = require("./socketActions");
const rooms = require("../engine/rooms");

// function ping() {
//   ws.send(JSON.stringify({ type: "ping" }));
//   tm = setTImeout(function () {}, 5000);
// }

// function pong() {
//   clearTimeout(tm);
// }

// socket.onopen = () => {
//   setInterval(ping, 30000);
// };

// socket.onmessage = (e) => {
//   let msg = e.data;
//   if (msg.type === "pong") {
//     pong();
//     return;
//   }
// };

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

// Broadcast a message to every client of the provided socket
function broadcast(ws, message, roomName, userId) {
  if (message.type && message.type in socketActions) {
    console.log(
      `Sending socket message after receiving "${JSON.stringify(
        message
      )}" from userId ${userId}`
    );
    if (ws.clients) {
      ws.clients.forEach((cli) => {
        // cli.readyState === ws.OPEN
        if (true) {
          console.log("Sending info to an open socket");
          cli.send(
            JSON.stringify(
              socketActions[message.type](message, roomName, userId)
            )
          );
        } else {
          console.log("A socket is not ready yet. Message not sending.");
        }
      });
    } else {
      console.log(
        `The websocket for room ${roomName} requested by ${userId} doesn't seem to have any clients. That's probably bad`
      );
    }
  } else {
    console.log(`"${message.type}" is not a valid socket message type.`);
  }
}

// Given a room name, make a socket for the room and add listeners.
function makeRoomSocket(room) {
  const socket = new WebSocket.Server({ noServer: true });
  socket.on("connection", (ws, request, client) => {
    ws.userId = querystring.parse(url.parse(request.url).query).userId;

    // We know that this socket is initially alive
    ws.isAlive = true;

    // When a heartbeat is received, we know that this connection is still alive
    ws.on("pong", () => {
      console.log(`User with id ${userId} ponged room ${name}.`);
      ws.isAlive = true;
    });

    // When the socket receives a message, perform the right operation and broadcast the result!
    ws.on("message", (msg) => {
      if (isJSON(msg)) {
        broadcast(socket, JSON.parse(msg), room, ws.userId);
      } else {
        console.log(`Received message "${msg}" that isn't valid JSON.`);
      }
    });

    // When the socket connects, broadcast to everyone that a new user has connected.
    broadcast(socket, { type: "connect" }, room, ws.userId);
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
