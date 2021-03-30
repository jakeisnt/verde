import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useUser, getUser } from "../context/userContext";
import useStyles from "./styles";
import BackButton from "../components/BackButton";
import WSConnectionStatus from "../components/WSConnectionStatus";
import BackButton from "../components/BackButton";

function makeUrl(room, userId) {
  return `ws://localhost:4000/?${new URLSearchParams({ userId, room })}`;
}

function Room() {
  const [error, setError] = useState(null);
  const { name: roomName } = useParams();
  const [users, setUsers] = useState(null);
  const [inactives, setInactives] = useState(null);
  const classes = useStyles();

  console.log("roomName", roomName);

  const getSocketUrl = useMemo(
    () => getUser().then((user) => makeUrl(roomName, user.id)),
    [roomName]
  );

  const {
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
  } = useWebSocket(getSocketUrl, {
    onOpen: () =>
      console.log(`WebSocket connection to room ${roomName} opened`),
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastJsonMessage && setUsers) {
      console.log(`lastJsonMessage: ${JSON.stringify(lastJsonMessage)}`);
      if ("users" in lastJsonMessage) {
        setUsers(lastJsonMessage.users);
      }
      if ("inactives" in lastJsonMessage) {
        setInactives(lastJsonMessage.inactives);
      }
    }
  }, [lastJsonMessage, setUsers, setInactives]);

  return (
    <>
      <div className={classes.room}>
        <BackButton text="Exit" />
        <div className={classes.box}>{`This is room ${roomName}.`}</div>
        Active Users
        <div className={classes.box}>
          {users &&
            users.map((user) => user && <p key={user.id}>{user.name}</p>)}
        </div>
        Inactive Users
        <div className={classes.box}>
          {inactives &&
            inactives.map((user) => user && <p key={user.id}>{user.name}</p>)}
        </div>
      </div>
      <WSConnectionStatus state={readyState} />
    </>
  );
}

export default Room;
