import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState, useMemo } from "react";
import { useUser } from "../context/userContext";
import useStyles from "./styles";
import BackButton from "../components/BackButton";
import WSConnectionStatus from "../components/WSConnectionStatus";

function Room() {
  const [error, setError] = useState(null);
  const { name: roomName } = useParams();
  const { user: myUser } = useUser();
  const [room, setRoom] = useState(null);
  const [users, setUsers] = useState(null);
  const classes = useStyles();

  const {
    sendJsonMessage,
    lastJsonMessage: lastUsers,
    readyState,
  } = useWebSocket(
    `ws://localhost:4000/?${new URLSearchParams({ room: roomName })}`,
    {
      onOpen: () =>
        console.log(`WebSocket connection to room ${roomName} opened`),
      shouldReconnect: () => true,
    }
  );

  useMemo(() => lastUsers && setUsers(lastUsers), [lastUsers]);

  useEffect(() => {
    if (myUser) {
      const params = new URLSearchParams({ name: roomName, userId: myUser.id });
      fetch(`/room/join?${params}`, { method: "PUT" })
        .then((res) => res.json())
        .then((res) => setRoom(res))
        .then(() => setError(null))
        .catch(() => setError(`Room "${roomName}" does not exist`));
    }
  }, [myUser, roomName]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && myUser && room) {
      sendJsonMessage({ type: "update-users" });
    }
  }, [myUser, room, sendJsonMessage, readyState]);

  return (
    <>
      <div className={classes.room}>
        <BackButton text="Exit" />
        <div className={classes.box}>
          {error || (room && `This is room ${room.name}.`)}
        </div>
        <div className={classes.box}>
          {users &&
            users.map((user) => user && <p key={user.id}>{user.name}</p>)}
        </div>
      </div>
      <WSConnectionStatus state={readyState} />
    </>
  );
}

export default Room;
