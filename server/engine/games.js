const Users = require("./users");
const game = require("../game");

function getInitialPlayerState(player) {
  return game.initialState.player();
}

function getInitialGameState() {
  return game.initialState.game();
}

// Apply the game action to the game state.
function takeAction(action, gameState) {
  if (!action in gameSettings.actions) return gameState;
  return gameSettings.actions[action](gameState);
}

// Determine when the game is over
function isGameOver(gameState, playerState) {
  return game.endWhen(gameState, playerState);
}

// Determine the winner of the game
function getWinners(gameState, playerState) {
  return game.getWinners(gameState, playerState);
}

/** TODO:
 * - End game
 * - Persist some state between games
 * - Make state changes to player state and to global state
 * - Expose nice api for configuring:
 * - - specific actions a user can take during their turn. maps to transformations
 * - - events that trigger by the room at specific points. i.e. dealing extra cards
 * - - public vs private state, for users and for players
 * */

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
  }

  isOver() {
    return isGameOver(this.gameState, this.players);
  }

  addPlayer(player) {
    this.players.push(new GamePlayer(player));
  }

  getGameState() {
    return {
      players: this.players,
      curPlayer: this.players[this.curPlayer].id,
      game: this.gameState,
    };
  }

  start() {}

  stop() {}

  isCurrentPlayer(playerId) {
    return playerId !== this.players[this.curPlayer].id;
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

  takeAction(playerId, action) {
    if (!this.isCurrentPlayer(playerId)) return undefined;
    this.gameState = takeAction(action, this.gameState);
  }
}

module.exports = Game;
