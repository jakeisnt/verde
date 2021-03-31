import { useEffect, useState } from "react";
import useStyles from "../styles";
import BackButton from "../../components/BackButton";
import { useSocket } from "../../context/socketContext";

function Room() {
  const { error, lastMessage, roomName, sendMessage } = useSocket("users");
  const classes = useStyles();
  const [room, setRoom] = useState(null);
  const [roomError, setRoomError] = useState(null);

  useEffect(() => {
    fetch(`/room/get?${new URLSearchParams({ name: roomName })}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(`Room ${roomName} does not exist.`);
      })
      .then((res) => setRoom(res))
      .catch((err) => setRoomError(err.message));
  }, [roomName, setRoom, setRoomError]);

  useEffect(() => {
    console.log(JSON.stringify(lastMessage));
  }, [lastMessage]);

  return (
    <>
      <div className={classes.room}>
        <BackButton text="Exit" />
        <div className={classes.box}>
          {roomError || error || `This is room ${roomName}.`}
        </div>
        {!roomError && !error && lastMessage && (
          <>
            Players ({lastMessage.players && lastMessage.players.length}/
            {room && (room.capacity >= 0 ? room.capacity : "∞")})
            <div className={classes.box}>
              {lastMessage.players &&
                lastMessage.players.map(
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
            Inactive Users
            <div className={classes.box}>
              {lastMessage.inactives &&
                lastMessage.inactives.map(
                  (user) => user && <p key={user.id}>{user.name}</p>
                )}
            </div>
            <button
              type="button"
              className={classes.box}
              onClick={() => sendMessage && sendMessage({ type: "spectate" })}
            >
              Spectate
            </button>
            <button
              type="button"
              className={classes.box}
              onClick={() => sendMessage && sendMessage({ type: "unspectate" })}
            >
              Unspectate
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default Room;
