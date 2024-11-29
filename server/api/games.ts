import Rooms from "../engine/rooms";
import { logger } from "../logger";

/** presents all of the actions that can be taken during a game.
 * include a static method here that accepts a name, playerid and an optional payload (js object)
 * to make it available for the client to call and send a message with. */
class Game {
  static startGame(name: string, modId: string) {
    return Rooms.getRoom(name)?.startGame(modId);
  }

  static stopGame(name: string) {
    // SHORTCUT: getGame() had modId as a parameter, but it was always the same.
    return Rooms.getRoom(name)?.getGame()?.stop();
  }

  static takeAction(
    name: string,
    playerId: string,
    { type, ...payload }: { type: string; [key: string]: any }
  ) {
    logger.info(
      `${name}: ${playerId}: takeAction ${type} ${JSON.stringify(
        payload,
        null,
        2
      )}`
    );
    return Rooms.getRoom(name)?.getGame()?.takeAction(playerId, type, payload);
  }

  static passTurn(name: string, playerId: string) {
    return Rooms.getRoom(name)?.getGame()?.passTurn(playerId);
  }

  static getGameState(name: string): any | undefined {
    return Rooms.getRoom(name)?.getGameState();
  }
}

export default Game;
