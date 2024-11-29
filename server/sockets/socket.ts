/* All of the machinery required to work our websockets. */

import { WebSocketServer, WebSocket } from "ws";

import url from "url";
import querystring from "querystring";
import socketActions from "./socketActions";
import Rooms from "../engine/rooms";
import { logger } from "../logger";

/** The websocket servers that run the application - one for each game room. */
const socketServers: Record<string, WebSocketServer> = {};

/** Determine whether a string is valid JSON. */
function isJSON(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/** Websocket frequency configuration. */
const PING_INTERVAL = 10000;
const MAX_INACTIVE_PINGS = 2;

/** Given a room name, make a socket for the room and add listeners. */
function makeRoomSocket(name: string): WebSocketServer {
  logger.info(`Opening WebSocket server for room ${name}.`);

  const wss = new WebSocketServer({ noServer: true });
  wss.on(
    "connection",
    (ws: WebSocket & { userId?: string; isAlive?: boolean }, request) => {
      const { userId } = querystring.parse(
        request.url ? (url.parse(request.url).query as string) : ""
      );

      socketActions.connect(
        wss,
        {
          type: "connect",
        },
        {
          roomName: name,
          userId: userId as string,
        }
      );

      /* eslint-disable no-param-reassign */
      ws.userId = userId as string;
      ws.isAlive = true;
      ws.on("pong", () => {
        logger.debug(`User with id ${ws.userId} ponged room ${name}.`);
        ws.isAlive = true;
      });

      /** When the websocket connection closes, the user has left the room. */
      ws.on("close", () => {
        logger.info(`User with id ${ws.userId} left room ${name}.`);
        socketActions.disconnect(
          wss,
          {
            type: "disconnect",
          },
          {
            roomName: name,
            userId: ws.userId as string,
          }
        );
      });

      /** When receiving a websocket message, call an action with the provided type. */
      ws.on("message", (msg: string) => {
        if (isJSON(msg)) {
          const message = JSON.parse(msg);
          const args = { roomName: name, userId: ws.userId };
          if (message.type && message.type in socketActions) {
            logger.debug(
              `Sending socket message associated with type "${message.type}"`
            );

            const { userId } = args;

            socketActions[message.type](wss, message, {
              ...args,
              userId: userId as string,
            });
          } else {
            logger.error(
              `"${message.type}" is not a valid socket message type.`
            );
          }
        } else {
          logger.error(`${msg} is not valid JSON.`);
        }
      });
    }
  );

  let inactivePings = 0;

  /** Set a pinging interval for each client to ensure they're still connected. */
  const interval = setInterval(() => {
    logger.debug(`Pinging clients of room ${name}...`);
    let hasActive = false;
    wss.clients.forEach(
      (ws: WebSocket & { userId?: string; isAlive?: boolean }) => {
        if (ws.isAlive === false) {
          logger.info(`User with id ${ws.userId} dropped from room ${name}.`);
          return ws.terminate();
        }
        hasActive = true;
        ws.isAlive = false;
        return ws.ping(() => {});
      }
    );
    if (hasActive) {
      inactivePings = 0;
    } else {
      logger.info(`Room ${name} has no active users.`);
      inactivePings += 1;
    }
    if (inactivePings >= MAX_INACTIVE_PINGS) {
      logger.info(`Room ${name} has had no active users for too long.`);
      wss.close();
    }
  }, PING_INTERVAL);

  /** Delete the room when the websocket server is closed entirely. */
  wss.on("close", () => {
    logger.info(`Closing WebSocket server and deleting room ${name}.`);
    wss.clients.forEach((ws) => ws.terminate());
    Rooms.deleteRoom(name);
    delete socketServers[name];
    return clearInterval(interval);
  });

  return wss;
}

// Called when an HTTP request is elevated to a WebSocket connection.
// Allows the user who's upgraded to create or join a room.
function onUpgrade(request: any, socket: any, head: any): void {
  const { room } = querystring.parse(
    request.url ? (url.parse(request.url).query as string) : ""
  );

  if (!Rooms.getRoom(room as string)) {
    socket.on("error", (err: any) => logger.error(JSON.stringify(err)));
    socket.destroy({ error: `Room ${room} not found` });
    return;
  }

  if (!socketServers[room as string]) {
    socketServers[room as string] = makeRoomSocket(room as string);
    logger.info(`Created socket for room ${room}`);
  } else {
    logger.info(`Using socket for room ${room}`);
  }

  const currentSocket = socketServers[room as string];

  currentSocket.handleUpgrade(request, socket, head, (ws) => {
    currentSocket.emit("connection", ws, request);
  });
}

export default onUpgrade;
