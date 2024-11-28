import React, { ReactNode } from "react";
import useWebSocket, { ReadyState, SendJsonMessage } from "react-use-websocket";
import clientConfig from "../api_schema.json";
import { useUser } from "./userContext";

const { createContext, useEffect, useState, useCallback, useContext, useMemo } =
  React;
const spec = clientConfig;

interface SocketContextType {
  error: string | null;
  sendMessage: SendJsonMessage;
  lastMessage: any;
  lastMessages: Record<string, any>;
  socketState: ReadyState;
  roomName: string;
}

const SocketContext = createContext<SocketContextType | null>(null);

/** Generate the server-side websocket URL from a room and userId. */
function makeUrl(room: string, userId: string): string {
  return `ws://localhost:4000/?${new URLSearchParams({ userId, room })}`;
}

/**
 * Provides a WebSocket connection to the server when mounted.
 * Required to use the `useSocket` hook.
 */
function SocketProvider({
  children,
  roomName,
}: {
  children: ReactNode;
  roomName: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [lastMessages, setLastMessages] = useState<Record<string, any>>({});
  const { userId } = useUser();

  const getSocketUrl = useCallback(() => {
    return new Promise<string>((resolve) => {
      if (userId) resolve(makeUrl(roomName, userId));
    });
  }, [roomName, userId]);

  const {
    sendJsonMessage: sendMessage,
    lastJsonMessage: lastMessage,
    readyState: socketState,
  } = useWebSocket(getSocketUrl, {
    onOpen: () =>
      console.log(`WebSocket connection to room ${roomName} opened`),
    shouldReconnect: () => true,
    onError: () => setError(`Room ${roomName} does not exist.`),
    retryOnError: false,
  });

  useEffect(() => {
    if (lastMessage)
      setLastMessages((prev) => ({
        ...prev,
        [lastMessage.type]: lastMessage.payload,
      }));
  }, [lastMessage]);

  return (
    <SocketContext.Provider
      value={{
        error,
        sendMessage,
        lastMessage,
        lastMessages,
        socketState,
        roomName,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

/**
 * Provides messages, status and a dispatching function for the websocket.
 */
function useSocket(messageTypes?: string | string[]) {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  if (messageTypes) {
    const { lastMessage, lastMessages } = context;
    const newLastMessage = (() => {
      if (typeof messageTypes === "string") {
        return lastMessages[messageTypes] ? lastMessages[messageTypes] : null;
      }
      return lastMessage;
    })();
    return { ...context, lastMessage: newLastMessage };
  }

  return context;
}

interface EndpointConfig {
  [key: string]: string[];
}

/**
 * Generates endpoint functions for common game actions from a configuration.
 */
function generateEndpoints(
  config: EndpointConfig,
  sendMessage: SendJsonMessage
) {
  return Object.keys(config).reduce(
    (funcs: Record<string, Function>, funcName: string) => {
      return {
        ...funcs,
        [funcName]: (...args: any[]) => {
          const message = {
            type: funcName,
            payload: config[funcName].reduce(
              (pload: Record<string, any>, argname: string, i: number) => {
                return { ...pload, [argname]: args[i] };
              },
              {}
            ),
          };
          const finalMessage = { ...message, data: args[1] };
          console.log(
            `Sending message ${JSON.stringify(finalMessage, null, 2)}`
          );
          return sendMessage && sendMessage(finalMessage);
        },
      };
    },
    {}
  );
}

/** Provides a standard library of game action functions to use, as imported from the server. */
function useGameActions(messageTypes?: string | string[]) {
  const { sendMessage } = useSocket(messageTypes);

  const stdlib = useMemo(
    () => generateEndpoints(spec, sendMessage),
    [sendMessage]
  );

  return stdlib;
}

export { useSocket, SocketProvider, useGameActions };
