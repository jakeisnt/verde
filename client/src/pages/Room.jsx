import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState, useMemo } from "react";
import useStyles from "./styles";

function Room() {
  const [users, setUsers] = useState([]);
  const { name } = useParams();
  const classes = useStyles();
  //
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `ws://localhost:4000/?${new URLSearchParams({ room: name })}`,
    {
      onOpen: () => console.log(`WebSocket connection to room ${name} opened`),
      shouldReconnect: (closeEvent) => true,
    }
  );

  useMemo(() => setUsers((u) => u.concat(lastMessage)), [lastMessage]);

  useEffect(() => {
    fetch(`/room/get?${new URLSearchParams({ name })}`)
      .then((res) => res.json())
      .then((res) => setUsers((u) => res.users));
    if (readyState === ReadyState.OPEN) {
      sendMessage("jake");
    }
  }, [users, name, sendMessage, readyState]);

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
