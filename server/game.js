/** This is where the user describes the game! */
/* eslint-disable */

const game = {
  /* Specifies the initial state for the game and each player. */
  initialState: {
    game: () => 0,
    player: () => 0,
  },

  /* Specifies the different actions that players can take during the game. */
  actions: {
    "+1": (gameState) => gameState + 1,
    "-1": (gameState) => gameState - 1,
  },

  /* Determines when the game ends. */
  endWhen: (gameState, playerStates) => gameState === 10,
  /* Determines the winner(s) at the end of the game. */
  getWinners: (gameState, players) => [players[0]],
};

module.exports = game;
