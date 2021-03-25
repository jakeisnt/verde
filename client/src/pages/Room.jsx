import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState, useMemo } from "react";
import useUser from "../api/users";
import useStyles from "./styles";

function Room() {
  const { name: room } = useParams();
  const { user: myUser } = useUser();
  const [{ users, creator }, setRoom] = useState({});
  const classes = useStyles();

  const { sendMessage, lastJsonMessage: roomObj, readyState } = useWebSocket(
    `ws://localhost:4000/?${new URLSearchParams({ room })}`,
    {
      onOpen: () => console.log(`WebSocket connection to room ${room} opened`),
      shouldReconnect: () => true,
    }
  );

  useMemo(() => roomObj && setRoom(roomObj), [roomObj]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && myUser) {
      sendMessage(JSON.stringify({ type: "new-user" }));
    }
  }, [myUser, sendMessage, readyState]);

  return (
    <div className={classes.room}>
      <div className={classes.box}>
        This is room {room}
        <br />
        <br />
        Created by {creator && creator.name}
      </div>
      <div className={classes.box}>
        {users &&
          Object.entries(users).map(([userId, user]) => (
            <p key={userId}>{user.name}</p>
          ))}
      </div>
    </div>
  );
}

export default Room;
