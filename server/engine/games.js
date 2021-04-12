const Users = require("./users");

// apply a transformation to the state of the player
function applyTransform(state, transform) {
  return {
    ...state,
  };
}

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
    this.currPlayer = 0;
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
      currPlayer: this.players[this.currPlayer],
      gameState: this.gameState,
    };
  }

  start() {
    return this.getGameState();
  }

  stop() {}

  passTurn(playerId) {
    if (playerId !== this.players[currPlayer].id) return undefined;
    let cp = this.players[this.currPlayer];
    this.currPlayer = (this.currPlayer + 1) % this.players.length;
    while (!cp.inGame) {
      this.currPlayer = (this.currPlayer + 1) % this.players.length;
      cp = this.players[this.currPlayer];
    }
    return cp;
  }

  takeAction(action) {
    // transform the game state based on the action
    return this.gameState.transform(action);
  }
}
