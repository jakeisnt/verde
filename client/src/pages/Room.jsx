import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState, useMemo } from "react";
import useStyles from "./styles";

function Room() {
  const { name: room, username } = useParams();
  const [{ users, creator }, setRoom] = useState({});
  const classes = useStyles();

  const { sendMessage, lastJsonMessage, readyState } = useWebSocket(
    `ws://localhost:4000/?${new URLSearchParams({ room })}`,
    {
      onOpen: () => console.log(`WebSocket connection to room ${room} opened`),
      shouldReconnect: () => true,
    }
  );

  useMemo(() => lastJsonMessage && setRoom(lastJsonMessage), [lastJsonMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ type: "new-user", username }));
    }
  }, [username, sendMessage, readyState]);

  return (
    <div className={classes.room}>
      <div className={classes.box}>
        This is room {room}
        <br />
        <br />
        Created by {creator}
      </div>
      <div className={classes.box}>
        {users && users.length
          ? users.map((user) => <p key={user}>{user}</p>)
          : null}
      </div>
    </div>
  );
}

export default Room;
