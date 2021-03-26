import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useUser } from "../context/userContext";
import useStyles from "./styles";
import WSConnectionStatus from "../components/WSConnectionStatus";

function makeUrl(room, userId) {
  return `ws://localhost:4000/${new URLSearchParams({ userId, room })}`;
}

function Room() {
  const [error, setError] = useState(null);
  const { name: roomName } = useParams();
  const { user: myUser } = useUser();
  const [room, setRoom] = useState(null);
  const classes = useStyles();

  console.log(myUser);
  console.log(room);

  function getSocketUrl() {
    const timeout = 10000;
    const delay = 30;
    return new Promise((resolve, reject) => {
      const start = Date.now();
      (function waitForUser() {
        if (myUser) resolve(makeUrl(roomName, myUser.id));
        else if (timeout && Date.now() - start >= timeout)
          reject(new Error("User lookup timed out"));
        else setTimeout(waitForUser, delay);
      })();
    });
  }

  const {
    sendJsonMessage,
    lastMessage,
    lastJsonMessage: lastRoom,
    readyState,
  } = useWebSocket(getSocketUrl, {
    // queryParams: { room: roomName, userId: myUser.id },
    onOpen: () =>
      console.log(`WebSocket connection to room ${roomName} opened`),
    shouldReconnect: () => true,
  });

  useMemo(() => lastRoom && setRoom(lastRoom), [lastRoom]);

  return (
    <>
      <div className={classes.room}>
        <div className={classes.box}>
          {error || (room && `This is room ${room.name}.`)}
        </div>
        Active Users
        <div className={classes.box}>
          {room &&
            room.users &&
            room.users.map((user) => user && <p key={user.id}>{user.name}</p>)}
        </div>
        Inactive Users
        <div className={classes.box}>
          {room &&
            room.inactives &&
            room.inactives.map(
              (user) => user && <p key={user.id}>{user.name}</p>
            )}
        </div>
      </div>
      <WSConnectionStatus state={readyState} />
    </>
  );
}

export default Room;
