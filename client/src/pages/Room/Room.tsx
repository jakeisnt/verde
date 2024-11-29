import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useStyles from "../styles";
import { useSocket, useUser, useGameActions } from "../../context";
import { UserList, SpectatorList, PlayerList } from "./Users";
import Game from "./Game";
import { Button, Page } from "../../components";

/** The main room of the application; also known as the lobby.
 * This component and its descendants contain most of the networking and game logic.
 */

interface Player {
  id: string;
  name: string;
  spectate?: boolean;
}

interface RoomData {
  capacity: number;
}

/** Determines whether the list of players contains a spectator with the provided userId. */
function hasPlayer(userId: string, players: Player[]): boolean {
  const meHopefully = players.filter(({ id }) => id === userId);
  return meHopefully && meHopefully[0] && !meHopefully[0].spectate;
}

function Room() {
  const { error, lastMessage, roomName } = useSocket("users");
  const { spectate } = useGameActions();
  const { user: me } = useUser();
  const classes = useStyles();
  const [room, setRoom] = useState<RoomData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/room/get?${new URLSearchParams({ name: roomName || "" })}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(`Room ${roomName} does not exist.`);
      })
      .then((res: RoomData) => setRoom(res))
      .catch((err) => navigate(`/home/${err.message}`));
  }, [roomName, setRoom, navigate]);

  useEffect(() => {
    if (
      lastMessage?.banned?.map(({ id }: Player) => id).includes(me?.id) // better than object comparison
    ) {
      navigate(
        /* eslint-disable */
        "/home/" +
          encodeURIComponent(`You have been banned from room ${roomName}.`)
      );
    }
  }, [lastMessage, roomName, navigate, me]);

  useEffect(() => {
    console.log(JSON.stringify(lastMessage));
  }, [lastMessage]);

  // This might be better served in some sort of global state solution (a provider?),
  // but to avoid redundant computation it's best to handle here for now.
  const userIsMod = useMemo(
    () => me?.id != null && lastMessage?.players?.[0]?.id === me.id,
    [me, lastMessage]
  );

  const userIsPlayer = useMemo(
    () =>
      me?.id != null &&
      lastMessage?.players != null &&
      hasPlayer(me.id, lastMessage.players),
    [me, lastMessage]
  );

  return (
    <Page backButtonName="exit">
      <div className={classes.box}>{error || `This is room ${roomName}.`}</div>
      {!error && lastMessage && (
        <>
          <PlayerList
            users={lastMessage.players}
            capacity={room?.capacity ?? null}
            userIsMod={userIsMod}
            myId={me?.id ?? ""}
          />
          <SpectatorList
            users={lastMessage.spectators}
            capacity={null}
            userIsMod={userIsMod}
            myId={me?.id ?? ""}
          />
          <UserList
            users={lastMessage.inactives}
            title="Inactive Users"
            capacity={null}
            userIsMod={userIsMod}
            myId={me?.id ?? ""}
          />
          {userIsPlayer && lastMessage.players.length > 1 && (
            <Button title="Spectate" onClick={() => spectate()} />
          )}
          <Game userIsMod={userIsMod} />
        </>
      )}
    </Page>
  );
}

export default Room;
