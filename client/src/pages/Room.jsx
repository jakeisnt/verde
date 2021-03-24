import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useStyles from "./styles";

function Room() {
  const [users, setUsers] = useState([]);
  const { name } = useParams();
  const classes = useStyles();

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
