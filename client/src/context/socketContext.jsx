import {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useUser, getUser } from "./userContext";

const SocketContext = createContext(null);

function makeUrl(room, userId) {
  return `ws://localhost:4000/?${new URLSearchParams({ userId, room })}`;
}

function SocketProvider({ children, roomName }) {
  const getSocketUrl = useMemo(
    () => getUser().then((user) => makeUrl(roomName, user.id)),
    [roomName]
  );

  const {
    sendJsonMessage: sendMessage,
    lastJsonMessage: lastMessage, // We don't care about non-JSON messages
    readyState: socketState,
  } = useWebSocket(getSocketUrl, {
    onOpen: () =>
      console.log(`WebSocket connection to room ${roomName} opened`),
    shouldReconnect: () => true,
  });

  return (
    <SocketContext.Provider
      value={{ sendMessage, lastMessage, socketState, roomName }}
    >
      {children}
    </SocketContext.Provider>
  );
}

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
  roomName: PropTypes.string.isRequired,
};

function useSocket() {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}

export { useSocket, SocketProvider };
