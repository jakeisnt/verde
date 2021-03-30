import { useEffect, useState, useMemo, useCallback } from "react";
import useStyles from "../styles";
import BackButton from "../../components/BackButton";
import { useSocket } from "../../context/socketContext";

function Room() {
  const { error, lastMessage, roomName } = useSocket("users");
  const classes = useStyles();

  useEffect(() => {
    console.log(JSON.stringify(lastMessage));
  }, [lastMessage]);

  return (
    <>
      <div className={classes.room}>
        <BackButton text="Exit" />
        <div className={classes.box}>
          {error || `This is room ${roomName}.`}
        </div>
        {!error && lastMessage && (
          <>
            Active Users
            <div className={classes.box}>
              {lastMessage.actives &&
                lastMessage.actives.map(
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
            Spectators
            <div className={classes.box}>
              {lastMessage.spectators &&
                lastMessage.spectators.map(
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
