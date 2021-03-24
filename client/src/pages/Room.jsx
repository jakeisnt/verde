import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState, useMemo } from "react";
import useStyles from "./styles";

function Room() {
  const [users, setUsers] = useState([]);
  const { name } = useParams();
  const classes = useStyles();
  //
  const { sendMessage, lastJsonMessage, readyState } = useWebSocket(
    `ws://localhost:4000/?${new URLSearchParams({ name })}`,
    {
      onOpen: () => console.log("socket opened"),
      shouldReconnect: (closeEvent) => true,
    }
  );

  useEffect(
    () =>
      fetch(`/room/get?${new URLSearchParams({ name })}`)
        .then((res) => res.json())
        .then((res) => setUsers(res.users)),
    [name]
  );

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
