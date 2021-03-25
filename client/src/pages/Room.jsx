import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState, useMemo } from "react";
import useStyles from "./styles";

function Room() {
  const { name, username } = useParams();
  const [users, setUsers] = useState([name]);
  const classes = useStyles();

  const { sendMessage, lastJsonMessage, readyState } = useWebSocket(
    `ws://localhost:4000/?${new URLSearchParams({ room: name })}`,
    {
      onOpen: () => console.log(`WebSocket connection to room ${name} opened`),
      shouldReconnect: () => true,
    }
  );

  useMemo(() => lastJsonMessage && setUsers(lastJsonMessage.users), [
    lastJsonMessage,
  ]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ type: "new-user", username }));
      console.log("message has been sent");
    }
  }, [username, sendMessage, readyState]);

  return (
    <div className={classes.room}>
      <div className={classes.box}>This is room {name}</div>
      <div className={classes.box}>
        {users && users.length && users.map((user) => <p key={user}>{user}</p>)}
      </div>
    </div>
  );
}

export default Room;
