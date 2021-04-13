import PropTypes from "prop-types";
import { useMemo } from "react";
import useStyles from "../styles";
import { useSocket, useGameActions } from "../../context/socketContext";
import { useUser } from "../../context/userContext";
import { Button } from "../../components";

function hasPlayer(userId, players) {
  const meHopefully = players.filter(({ id }) => id === userId);
  return meHopefully && meHopefully[0] && !meHopefully.spectate;
}

function Game({ userIsMod }) {
  const { lastMessage } = useSocket("game");
  const { passTurn, stopGame, startGame, takeAction } = useGameActions();
  const { user: me } = useUser();
  const classes = useStyles();

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

  if (!gameStarted) {
    if (userIsMod) {
      return <Button title="Start Game" onClick={startGame} />;
    }
    return <div>Waiting for game to start...</div>;
  }

  return (
    <div className={classes.box}>
      <div>Game State: {lastMessage.game}</div>
      {userIsPlayer && isUserTurn && (
        <>
          <Button title="-1" onClick={() => takeAction("-1")} />
          <Button title="+1" onClick={() => takeAction("+1")} />
          <Button title="Pass Turn" onClick={passTurn} />
        </>
      )}
      {userIsMod && <Button title="End Game" onClick={stopGame} />}
    </div>
  );
}

Game.propTypes = {
  userIsMod: PropTypes.bool.isRequired,
};

export default Game;
