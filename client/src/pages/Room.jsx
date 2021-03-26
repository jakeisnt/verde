import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState, useMemo } from "react";
import { useUser } from "../context/userContext";
import useStyles from "./styles";
import BackButton from "../components/BackButton";
import WSConnectionStatus from "../components/WSConnectionStatus";

function Room() {
  const [error, setError] = useState(null);
  const { name: roomName } = useParams();
  const { user: myUser } = useUser();
  const [room, setRoom] = useState(null);
  const classes = useStyles();

  console.log(myUser);
  console.log(room);

  const {
    sendJsonMessage,
    lastMessage,
    lastJsonMessage: lastRoom,
    readyState,
  } = useWebSocket(`ws://localhost:4000/`, {
    queryParams: { room: roomName, userId: myUser.id },
    onOpen: () =>
      console.log(`WebSocket connection to room ${roomName} opened`),
    shouldReconnect: () => true,
  });
  console.log(lastMessage);
  console.log(lastRoom);

  useMemo(() => lastRoom && setRoom(lastRoom), [lastRoom]);

  // useEffect(() => {
  //   if (readyState === ReadyState.OPEN && myUser && room) {
  //     sendJsonMessage({ type: "update-users", userId: myUser.id, roomName });
  //   }
  // }, [myUser, roomName, sendJsonMessage, readyState]);

  return (
    <>
      <div className={classes.room}>
        <BackButton text="Exit" />
        <div className={classes.box}>
          {error || (room && `This is room ${room.name}.`)}
        </div>
        Active Users
        <div className={classes.box}>
          {room &&
            room.users &&
            room.users.map((user) => user && <p key={user.id}>{user.name}</p>)}
        </div>
        Inactive Users
        <div className={classes.box}>
          {room &&
            room.inactives &&
            room.inactives.map(
              (user) => user && <p key={user.id}>{user.name}</p>
            )}
        </div>
      </div>
      <WSConnectionStatus state={readyState} />
    </>
  );
}

export default Room;
