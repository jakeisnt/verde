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
  const [lastMessages, setLastMessages] = useState({});
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

  useEffect(() => {
    if (lastMessage)
      setLastMessages((prev) => ({
        ...prev,
        [lastMessage.type]: lastMessage.payload,
      }));
  }, [lastMessage]);

  return (
    <SocketContext.Provider
      value={{ sendMessage, lastMessage, lastMessages, socketState, roomName }}
    >
      {children}
    </SocketContext.Provider>
  );
}

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
  roomName: PropTypes.string.isRequired,
};

function useSocket(messageTypes) {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  if (messageTypes) {
    const { lastMessage, lastMessages } = context;
    const newLastMessage = (() => {
      // If the argument is a string, lastMessage will only contain messages of that type.
      if (typeof messageTypes === "string") {
        return lastMessages[messageTypes] ? lastMessages[messageTypes] : null;
      }

      // Otherwise, lastMessage will default to being the last message overall.
      // Future work: if messageTypes is an array, the last message will only be
      // the last message received by something of one of those message types.
      //
      // Not implementing this now because this can be achieved by deconstructing
      // 'lastMessages' and is fairly computationally intensive
      // (must order lastMessages in list and enforce invariants on it rather than using dictionary).
      return lastMessage;
    })();
    return { ...context, lastMessage: newLastMessage };
  }

  return context;
}

export { useSocket, SocketProvider };
