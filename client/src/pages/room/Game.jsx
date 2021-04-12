import { useEffect, useState, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import useStyles from "../styles";
import BackButton from "../../components/BackButton";
import { useSocket } from "../../context/socketContext";
import { useUser } from "../../context/userContext";
import UserList from "./UserList";
import SpectatorList from "./SpectatorList";
import PlayerList from "./PlayerList";

function hasPlayer(userId, players) {
  const meHopefully = players.filter(({ id }) => id === userId);
  return meHopefully && meHopefully[0] && !meHopefully.spectate;
}

function Game({ userIsMod }) {
  const { lastMessage, sendMessage } = useSocket("game");
  const { user: me } = useUser();
  const classes = useStyles();
  const [room, setGame] = useState(null);
  const history = useHistory();

  if (!gameStarted) {
    if (userIsMod) {
      return (
        <button
          type="button"
          className={classes.box}
          onClick={() => sendMessage({ type: "startGame" })}
        >
          Start Game
        </button>
      );
    }
    return <div>Waiting for game to start...</div>;
  }

  const userIsPlayer = useMemo(
    () =>
      me &&
      me.id &&
      lastMessage &&
      lastMessage.players &&
      hasPlayer(me.id, lastMessage.players),
    [me, lastMessage]
  );

  const isUserTurn =
    me &&
    me.id &&
    lastMessage &&
    lastMessage.curPlayer &&
    lastMessage.curPlayer === me.id;

  return (
    <div className={classes.box}>
      Game State: {lastMessage.global}
      Player state: {lastMessage.local}
      {userIsPlayer && isUserTurn && (
        <button
          type="button"
          className={classes.box}
          onClick={() => sendMessage({ type: "passTurn" })}
        >
          Pass Turn
        </button>
      )}
      {userIsMod && (
        <button
          type="button"
          className={classes.box}
          onClick={() => sendMessage({ type: "endGame" })}
        >
          End Game
        </button>
      )}
    </div>
  );
}

export default Game;
