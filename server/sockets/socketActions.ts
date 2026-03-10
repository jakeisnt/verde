import { WebSocket, WebSocketServer } from "ws";
import Rooms from "../engine/rooms";
import { spec, classes } from "../api";
import { logger } from "../logger";

type Message = {
  type: string;
  payload?: any;
};

type SocketArgs = {
  roomName: string;
  userId: string;
};

/**  Broadcasts a JS Object message to each client of the websocket. */
function broadcast(wss: WebSocketServer, message: Message): void {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

/** Broadcast a 'users' message to the websocket. */
function users(
  wss: WebSocketServer,
  message: Message,
  { roomName }: SocketArgs
): void {
  logger.debug("Broadcasting users message");
  broadcast(wss, { type: "users", payload: Rooms.getUsers(roomName) });
}

/** Broadcast a 'game' message - typically a game action - to the socket. */
function game(
  wss: WebSocketServer,
  message: Message,
  { roomName }: SocketArgs
): void {
  logger.debug("Broadcasting game message");
  broadcast(wss, { type: "game", payload: Rooms.getGameState(roomName) });
}

/** Broadcast a 'game' message - typically a game action - to the socket. */
function connectDisconnect(
  wss: WebSocketServer,
  message: Message,
  { roomName }: SocketArgs
): void {
  logger.debug(
    "Broadcasting 'users' and 'game' messages: user has connected or disconnected"
  );
  broadcast(wss, { type: "users", payload: Rooms.getUsers(roomName) });
  broadcast(wss, { type: "game", payload: Rooms.getGameState(roomName) });
}

// The two functions must belong to an object to index into them with a string.
const Actions: Record<
  string,
  (wss: WebSocketServer, message: Message, args: SocketArgs) => void
> = {
  users,
  game,
  connect_disconnect: connectDisconnect,
};

/** Generate various websocket endpoints from API class methods. */

// For each API class, generate a socket action handler that calls the actual
// class method and then broadcasts the appropriate response.
function generateEndpoints(
  apiClasses: Record<string, any>,
  apiSpec: Record<string, Record<string, any>>
) {
  return Object.keys(apiClasses).reduce((allfuncs, type) => {
    const newFuncs = Object.keys(apiSpec[type]).reduce((funcs, funcName) => {
      return {
        ...funcs,
        [funcName]: (
          wss: WebSocketServer,
          message: Message,
          { roomName, userId }: SocketArgs
        ) => {
          logger.info(`${roomName}: ${userId}: ${funcName}`);
          (apiClasses[type][funcName] as any)(
            roomName,
            userId,
            (message && message.payload) || undefined
          );

          // call the corresponding broadcasting function
          return Actions[type](wss, message, { roomName, userId });
        },
      };
    }, {});
    return { ...allfuncs, ...newFuncs };
  }, {});
}
const socketActions = generateEndpoints(classes, spec) as Record<
  string,
  (wss: WebSocketServer, message: Message, args: SocketArgs) => void
>;

export default socketActions;
