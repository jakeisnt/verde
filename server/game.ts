/** This is where the user describes the game! */
/* eslint-disable */

/* stdlib: helper functions for working with the game! */
// Make a copy of an object or array so you don't mutate it!
const deepcopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

interface GameState {
  pub: number;
  priv: boolean;
}

interface PlayerState {
  clickedLast: boolean;
}

interface Player {
  id: string;
  inGame: boolean;
  state: PlayerState;
}

interface ActionResult {
  gameState?: GameState;
  playerState?: Player[];
  passTurn?: boolean;
}

// the definition of the game.
const game = {
  /* Specifies the initial state for the game and each player. */
  initialState: {
    // pub (public): state visible to everyone;
    // priv (private): state hidden from clients but visible to the server
    game: (): GameState => ({ pub: 0, priv: false }),
    player: (): PlayerState => ({
      clickedLast: false,
    }),
  },

  /* Specifies the different actions that players can take during the game. */
  actions: {
    // With an action, the user can:
    "+1": (
      gameState: GameState,
      players: Player[],
      playerId: string,
      payload: any
    ): ActionResult => ({
      // change the game state,
      gameState: { ...gameState, pub: gameState.pub + 1 },
      // the player state,
      playerState: players.map(({ id, ...player }) => ({
        ...player,
        id,
        state: { clickedLast: id === playerId },
      })),
      // and determine whether to pass the turn after the action is taken.
      passTurn: true,
      // They aren't required to provide any of these parameters,
      // as if they are not defined they just won't be used.
    }),
    "-1": (
      gameState: GameState,
      players: Player[],
      playerId: string,
      payload: any
    ): ActionResult => ({
      // The payload argument contains all of the data passed with the call.
      // Currently, `payload.data` contains all of the arguments passed to the function 'takeAction',
      // so this should be good enough to pass any arbitrary data. I'd recommend the following:
      // function call from client: takeAction("+1", { userId: 123 })
      // retrieve userId here: payload.data[1].userId (0 is going to be the "+1")
      // you could also call takeAction("+1", userId) and you would have the id at payload.data[1],
      // but that may be a bit more difficult to keep track of.
      gameState: { ...gameState, pub: gameState.pub - 1 },
      // Currently, anything you get from the state object should be
      // provided when returning.
      // If you mess with the playerId, things will get scary.
      playerState: players.map(({ id, ...player }) => ({
        ...player,
        id,
        state: { clickedLast: id === playerId },
      })),
      passTurn: true,
      // Please don't mutate things, either... that wouldn't be very nice.
    }),
  },

  /* Determines when the game ends. */
  endWhen: (gameState: GameState, playerStates: Player[]): boolean =>
    gameState.pub === 10,
  /* Determines the winner(s) at the end of the game. */
  getWinners: (gameState: GameState, players: Player[]): Player[] =>
    players.filter(({ state }) => state.clickedLast),
};

export default game;
