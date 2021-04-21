const Rooms = require("../engine/rooms");

class Game {
  static startGame(name, modId) {
    return Rooms.getRoom(name)?.startGame(modId);
  }

  static stopGame(name, modId) {
    return Rooms.getRoom(name)?.getGame(modId)?.stop(modId);
  }

  static takeAction(name, playerId, { type, ...payload }) {
    console.log(
      `${name}: ${playerId}: takeAction ${type} ${JSON.stringify(
        payload,
        null,
        2
      )}`
    );
    return Rooms.getRoom(name)?.getGame()?.takeAction(playerId, type, payload);
  }

  static passTurn(name, playerId) {
    return Rooms.getRoom(name)?.getGame()?.passTurn(playerId);
  }

  static getGameState(name) {
    return Rooms.getRoom(name)?.getGameState();
  }
}

module.exports = Game;
