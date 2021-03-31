import { useEffect, useState, useMemo, useCallback } from "react";
import useStyles from "../styles";
import BackButton from "../../components/BackButton";
import { useSocket } from "../../context/socketContext";

function Room() {
  const [error, setError] = useState(null);
  const { lastMessage, roomName } = useSocket("users");
  const classes = useStyles();

  return (
    <>
      <div className={classes.room}>
        <BackButton text="Exit" />
        <div className={classes.box}>{`This is room ${roomName}.`}</div>
        Active Users
        {lastMessage && (
          <>
            <div className={classes.box}>
              {lastMessage.users &&
                lastMessage.users.map(
                  (user) => user && <p key={user.id}>{user.name}</p>
                )}
            </div>
            Inactive Users
            <div className={classes.box}>
              {lastMessage.inactives &&
                lastMessage.inactives.map(
                  (user) => user && <p key={user.id}>{user.name}</p>
                )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Room;
