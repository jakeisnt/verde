import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useUser, getUser } from "../context/userContext";
import useStyles from "./styles";
import WSConnectionStatus from "../components/WSConnectionStatus";

function makeUrl(room, userId) {
  return `ws://localhost:4000/?${new URLSearchParams({ room, userId })}`;
}

function Room() {
  const [error, setError] = useState(null);
  const { name: roomName } = useParams();
  // const { user: myUser } = useUser();
  const [room, setRoom] = useState(null);
  const [actives, setActives] = useState(null);
  const [inactives, setInactives] = useState(null);
  const [spectators, setSpectators] = useState(null);
  const classes = useStyles();

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
    onError: () => setError(`Room ${roomName} does not exist.`),
  });

  useEffect(() => {
    if (lastJsonMessage) {
      console.log(`lastJsonMessage: ${JSON.stringify(lastJsonMessage)}`);
      if ("users" in lastJsonMessage) {
        setActives(lastJsonMessage.users.actives);
        setInactives(lastJsonMessage.users.inactives);
        setSpectators(lastJsonMessage.users.spectators);
      }
    }
  }, [lastJsonMessage, setActives, setInactives, setSpectators]);

  return (
    <>
      <div className={classes.room}>
        <div className={classes.box}>
          {error || (room && `This is room ${room.name}.`)}
        </div>
        {!error && (
          <div>
            Active Users
            <div className={classes.box}>
              {actives &&
                actives.map((user) => user && <p key={user.id}>{user.name}</p>)}
            </div>
            Inactive Users
            <div className={classes.box}>
              {inactives &&
                inactives.map(
                  (user) => user && <p key={user.id}>{user.name}</p>
                )}
            </div>
            Spectators
            <div className={classes.box}>
              {spectators &&
                spectators.map(
                  (user) => user && <p key={user.id}>{user.name}</p>
                )}
            </div>
            {/* NOTE: Navigating away in any form should implicitly leave the room. */}
            <button
              type="button"
              className={classes.box}
              onClick={() =>
                sendJsonMessage && sendJsonMessage({ type: "spectate" })
              }
            >
              Spectate
            </button>
            <button
              type="button"
              className={classes.box}
              onClick={() =>
                sendJsonMessage && sendJsonMessage({ type: "unspectate" })
              }
            >
              Unspectate
            </button>
            <button type="button" className={classes.box}>
              Leave Room
            </button>
            <WSConnectionStatus state={readyState} />
          </div>
        )}
      </div>
    </>
  );
}

export default Room;
