import { useEffect, useState, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import useStyles from "../styles";
import BackButton from "../../components/BackButton";
import { useSocket } from "../../context/socketContext";
import { useUser } from "../../context/userContext";
import UserList from "./UserList";
import SpectatorList from "./SpectatorList";
import PlayerList from "./PlayerList";
import Button from "../../components/Button";

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

  const gameStarted = lastMessage;

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

  function takeGameAction(type) {
    return (
      sendMessage && sendMessage({ type: "takeAction", payload: { type } })
    );
  }

  function passTurn() {
    return sendMessage && sendMessage({ type: "passTurn" });
  }

  function stopGame() {
    return sendMessage && sendMessage({ type: "stopGame" });
  }

  function startGame() {
    return sendMessage && sendMessage({ type: "startGame" });
  }

  if (!gameStarted) {
    if (userIsMod) {
      return <Button title="Start Game" onClick={startGame} />;
    }
    return <div>Waiting for game to start...</div>;
  }

  console.log(lastMessage);

  return (
    <div className={classes.box}>
      <div>Game State: {lastMessage.game}</div>
      {userIsPlayer && isUserTurn && (
        <>
          <Button title="-1" onClick={() => takeGameAction("-1")} />
          <Button title="+1" onClick={() => takeGameAction("+1")} />
          <Button title="Pass Turn" onClick={passTurn} />
        </>
      )}
      {userIsMod && <Button title="End Game" onClick={stopGame} />}
    </div>
  );
}

export default Game;
