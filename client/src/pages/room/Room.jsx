import { useEffect, useState, useMemo, useCallback } from "react";
import useStyles from "../styles";
import BackButton from "../../components/BackButton";
import { useSocket } from "../../context/socketContext";

function Room() {
  const [error, setError] = useState(null);
  const [users, setUsers] = useState(null);
  const [inactives, setInactives] = useState(null);
  const { lastMessage, roomName } = useSocket();
  const classes = useStyles();

  useEffect(() => {
    if (lastMessage && setUsers) {
      console.log(`lastMessage: ${JSON.stringify(lastMessage)}`);
      if ("users" in lastMessage) {
        setUsers(lastMessage.users);
      }
      if ("inactives" in lastMessage) {
        setInactives(lastMessage.inactives);
      }
    }
  }, [lastMessage, setUsers, setInactives]);

  return (
    <>
      <div className={classes.room}>
        <BackButton text="Exit" />
        <div className={classes.box}>{`This is room ${roomName}.`}</div>
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
    </>
  );
}

export default Room;
