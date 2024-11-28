import game from "../game";
import Users from "./users";
import { logger } from "../logger";

type Player = {
  id: string;
  [key: string]: any;
};

type GameState = {
  pub: any;
  [key: string]: any;
};

type ActionResult = {
  gameState?: GameState;
  playerState?: GamePlayer[];
  passTurn?: boolean;
};

/** Get the initial state of the players. */
function getInitialPlayerState(player: Player): any {
  return game.initialState.player();
}

/** Get the initial state of the game. */
function getInitialGameState(players: Player[]): GameState {
  return game.initialState.game();
}

// Apply the game action to the game state.
function takeAction(
  action: string,
  gameState: GameState,
  players: GamePlayer[],
  playerId: string,
  payload: any
): ActionResult {
  if (!(action in game.actions)) {
    logger.error(`${action} could not be taken! It's not a valid action.`);
    return { gameState };
  }

  return game.actions[action](gameState, players, playerId, payload);
}

// Determine when the game is over
function isGameOver(gameState: GameState, playerState: GamePlayer[]): boolean {
  return game.endWhen(gameState, playerState);
}

// Determine the winner of the game
function getWinners(gameState: GameState, playerState: GamePlayer[]): Player[] {
  return game.getWinners(gameState, playerState).map(({ id, ...rest }: Player) => {
    const user = Users.getUser(id);
    return { ...rest, ...user, id };
  });
}

// Represents a player who has been in the game
class GamePlayer {
  id: string;
  inGame: boolean;
  state: any;

  constructor(player: Player) {
    this.id = player.id;
    this.inGame = true;
    this.state = getInitialPlayerState(player);
  }
}

// Represents the game
class Game {
  players: GamePlayer[];
  curPlayer: number;
  gameState: GameState;
  stopped: boolean;

  constructor(players: Player[]) {
    this.players = players.map((player) => new GamePlayer(player));
    this.curPlayer = 0;
    this.gameState = getInitialGameState(players);
    this.stopped = false;
  }

  // is the game over?
  isOver(): boolean {
    return this.stopped || isGameOver(this.gameState, this.players);
  }

  // add a player to the game
  addPlayer(player: Player): void {
    this.players.push(new GamePlayer(player));
  }

  // produce the game state
  getGameState(): {
    players: GamePlayer[];
    curPlayer: string;
    game: any;
    isOver: boolean;
    winners: Player[] | false;
  } {
    return {
      players: this.players,
      curPlayer: this.players[this.curPlayer].id,
      game: this.gameState.pub,
      isOver: this.isOver(),
      winners: this.isOver() && getWinners(this.gameState, this.players),
    };
  }

  // start the game
  start(): void {
    this.stopped = false;
  }

  // stop the game
  stop(): void {
    this.stopped = true;
  }

  // determines whether the provided playerId is the current player
  isCurrentPlayer(playerId: string): boolean {
    return playerId === this.players[this.curPlayer].id;
  }

  // pass the turn from playerId to the next player in turn
  passTurn(playerId: string): GamePlayer | undefined {
    if (!this.isCurrentPlayer(playerId)) return undefined;
    this.curPlayer = (this.curPlayer + 1) % this.players.length;
    let cp = this.players[this.curPlayer];
    while (!cp.inGame) {
      this.curPlayer = (this.curPlayer + 1) % this.players.length;
      cp = this.players[this.curPlayer];
    }
    return cp;
  }

  // commit a declared game action with the provided payload as context
  takeAction(playerId: string, action: string, payload: any): GameState | undefined {
    if (!this.isCurrentPlayer(playerId)) return undefined;
    const { gameState, playerState, passTurn } = takeAction(
      action,
      this.gameState,
      this.players,
      playerId,
      payload
    );

    // in js, 0 is falsy (as is false), and those are both valid gameStates
    if (gameState != null) this.gameState = gameState;
    if (playerState != null) this.players = playerState;
    // passTurn is true or false, so we're not checking for null or undefined
    if (passTurn) this.passTurn(playerId);
    return this.gameState;
  }
}

export default Game;
