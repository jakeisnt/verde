import { useEffect, useState, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import useStyles from "../styles";
import BackButton from "../../components/BackButton";
import { useSocket } from "../../context/socketContext";
import { useUser } from "../../context/userContext";
import UserList from "./UserList";
import SpectatorList from "./SpectatorList";
import PlayerList from "./PlayerList";
import Game from "./Game";

function hasSpectator(userId, players) {
  const meHopefully = players.filter(({ id }) => id === userId);
  return meHopefully && meHopefully[0] && !meHopefully.spectate;
}

function Room() {
  const { error, lastMessage, roomName, sendMessage } = useSocket("users");
  const { user: me } = useUser();
  const classes = useStyles();
  const [room, setRoom] = useState(null);
  const history = useHistory();

  useEffect(() => {
    fetch(`/room/get?${new URLSearchParams({ name: roomName })}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(`Room ${roomName} does not exist.`);
      })
      .then((res) => setRoom(res))
      .catch((err) => history.push(`/home/${err.message}`));
  }, [roomName, setRoom, history]);

  useEffect(() => {
    if (
      lastMessage &&
      lastMessage.banned &&
      lastMessage.banned.map(({ id }) => id).includes(me.id) // better than object comparison
    )
      history.push(
        // eslint-disable-next-line prefer-template
        "/home/" +
          encodeURIComponent(`You have been banned from room ${roomName}.`)
      );
  }, [lastMessage, roomName, history, me]);

  useEffect(() => {
    console.log(JSON.stringify(lastMessage));
  }, [lastMessage]);

  // This might be better served in some sort of global state solution (a provider?),
  // but to avoid redundant computation it's best to handle here for now.
  const userIsMod = useMemo(
    () =>
      me &&
      me.id &&
      lastMessage &&
      lastMessage.players &&
      lastMessage.players[0] &&
      lastMessage.players[0].id === me.id,
    [me, lastMessage]
  );

  const userIsSpectator = useMemo(
    () =>
      me &&
      me.id &&
      lastMessage &&
      lastMessage.players &&
      hasSpectator(me.id, lastMessage.players),
    [me, lastMessage]
  );

  const sendSpectateMessage = useCallback(
    () =>
      sendMessage &&
      sendMessage({
        type: "spectate",
      }),
    [sendMessage]
  );

  return (
    <div className={classes.room}>
      <BackButton text="Exit" />
      <div className={classes.box}>{error || `This is room ${roomName}.`}</div>
      {!error && lastMessage && (
        <>
          <PlayerList
            users={lastMessage.players}
            capacity={room && room.capacity}
            userIsMod={userIsMod}
            myId={me.id}
          />
          <SpectatorList
            users={lastMessage.spectators}
            userIsMod={userIsMod}
            myId={me.id}
          />
          <UserList
            users={lastMessage.inactives}
            title="Inactive Users"
            userIsMod={userIsMod}
            myId={me.id}
          />
          {userIsSpectator && (
            <button
              type="button"
              className={classes.box}
              onClick={sendSpectateMessage}
            >
              Spectate
            </button>
          )}
        </>
      )}
      <Game userIsMod={userIsMod} />
    </div>
  );
}

export default Room;
