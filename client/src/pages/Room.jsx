import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useUser, getUser } from "../context/userContext";
import useStyles from "./styles";
import BackButton from "../components/BackButton";
import WSConnectionStatus from "../components/WSConnectionStatus";
import BackButton from "../components/BackButton";
import WSConnectionStatus from "../components/WSConnectionStatus";

function makeUrl(room, userId) {
  return `ws://localhost:4000/${new URLSearchParams({ userId, room })}`;
}

function Room() {
  const [error, setError] = useState(null);
  const { name: roomName } = useParams();
  // const { user: myUser } = useUser();
  const [room, setRoom] = useState(null);
  const [users, setUsers] = useState(null);
  const [inactives, setInactives] = useState(null);
  const classes = useStyles();

  // const getSocketUrl = useCallback(
  //   (timeout = 10000) => {
  //     if (!myUser) return null;
  //     const delay = 1000;
  //     return new Promise((resolve, reject) => {
  //       const start = Date.now();
  //       (function waitForUser() {
  //         console.log(`myUser: ${JSON.stringify(myUser)}`);
  //         if (myUser) {
  //           resolve(makeUrl(roomName, myUser.id));
  //         } else if (timeout && Date.now() - start >= timeout)
  //           reject(new Error("User lookup timed out"));
  //         else setTimeout(waitForUser, delay);
  //       })();
  //     });
  //   },
  //   [myUser, roomName]
  // );

  const getSocketUrl = useMemo(
    () => getUser().then((user) => makeUrl(roomName, user.id)),
    [roomName]
  );

  const getSocketUrl = useCallback(() => {
    const delay = 30;
    const timeout = 10000;
    return new Promise((resolve, reject) => {
      const start = Date.now();
      (function waitForUser() {
        if (myUser) resolve(makeUrl(roomName, myUser.id));
        else if (timeout && Date.now() - start >= timeout)
          reject(new Error("User lookup timed out"));
        else setTimeout(waitForUser, delay);
      })();
    });
  }, [roomName, myUser]);

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

  console.log(lastRoom);

  return (
    <>
      <div className={classes.room}>
        <BackButton text="Exit" />
        <div className={classes.box}>
          {error || (room && `This is room ${room.name}.`)}
        </div>
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
