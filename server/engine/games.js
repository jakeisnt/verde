const game = require("../game");
const Users = require("./users");

function getInitialPlayerState(player) {
  return game.initialState.player(player);
}

function getInitialGameState(players) {
  return game.initialState.game(players);
}

// Apply the game action to the game state.
function takeAction(action, gameState, players, playerId, payload) {
  if (!(action in game.actions)) return gameState;
  return game.actions[action](gameState, players, playerId, payload);
}

// Determine when the game is over
function isGameOver(gameState, playerState) {
  return game.endWhen(gameState, playerState);
}

// Determine the winner of the game
function getWinners(gameState, playerState) {
  return game.getWinners(gameState, playerState).map(({ id, ...rest }) => {
    const user = Users.getUser(id);
    return { ...rest, ...user, id };
  });
}

class GamePlayer {
  constructor(player) {
    this.id = player.id;
    this.inGame = true;
    this.state = getInitialPlayerState(player);
  }
}

class Game {
  constructor(players) {
    this.players = players.map((player) => new GamePlayer(player));
    this.curPlayer = 0;
    this.gameState = getInitialGameState(players);
    this.stopped = false;
  }

  isOver() {
    return this.stopped || isGameOver(this.gameState, this.players);
  }

  addPlayer(player) {
    this.players.push(new GamePlayer(player));
  }

  getGameState() {
    return {
      players: this.players,
      curPlayer: this.players[this.curPlayer].id,
      game: this.gameState,
      isOver: this.isOver(),
      winners: this.isOver() && getWinners(this.gameState, this.players),
    };
  }

  start() {
    this.stopped = false;
  }

  stop() {
    this.stopped = true;
  }

  isCurrentPlayer(playerId) {
    return playerId === this.players[this.curPlayer].id;
  }

  passTurn(playerId) {
    if (!this.isCurrentPlayer(playerId)) return undefined;
    this.curPlayer = (this.curPlayer + 1) % this.players.length;
    let cp = this.players[this.curPlayer];
    while (!cp.inGame) {
      this.curPlayer = (this.curPlayer + 1) % this.players.length;
      cp = this.players[this.curPlayer];
    }
    return cp;
  }

  takeAction(playerId, action, payload) {
    if (!this.isCurrentPlayer(playerId)) return undefined;
    const { gameState, playerState, passTurn } = takeAction(
      action,
      this.gameState,
      this.players,
      playerId,
      payload
    );
    if (gameState) this.gameState = gameState;
    if (playerState) this.players = playerState;
    if (passTurn) this.passTurn(playerId);
    return this.gameState;
  }
}

module.exports = Game;
