const Users = require("./users");

// apply a transformation to the state of the player
function applyTransform(state, transform) {
  return {
    ...state,
  };
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
  constructor({ id }) {
    this.id = id;
    this.inGame = true;
    this.state = {
      points: 100,
    };
  }

  changeState(transform) {
    this.state = applyTransform(this.state, transform);
  }
}

class Game {
  constructor(players) {
    this.players = players.map((player) => new GamePlayer(player));
    this.curPlayer = 0;
    this.gameState = {};
  }

  isOver() {
    return true;
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

  start() {
    return this.getGameState();
  }

  stop() {}

  passTurn(playerId) {
    if (playerId !== this.players[this.curPlayer].id) return undefined;
    this.curPlayer = (this.curPlayer + 1) % this.players.length;
    let cp = this.players[this.curPlayer];
    while (!cp.inGame) {
      this.curPlayer = (this.curPlayer + 1) % this.players.length;
      cp = this.players[this.curPlayer];
    }
    return cp;
  }

  takeAction(action) {
    // transform the game state based on the action
    return this.gameState.transform(action);
  }
}

module.exports = Game;
