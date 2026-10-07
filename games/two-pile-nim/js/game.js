// game.js
// -----------------------------------------------------------------------

function createGameState(pileA, pileB, playerNames) {
  return {
    playerNames: playerNames,
    piles: [pileA, pileB],
    currentPlayer: 0,
    isOver: false,
    winner: null,
  };
}

function attemptRemove(state, pileIndex, keep) {
  if (state.isOver) return { ok: false, reason: "game-over" };
  const current = state.piles[pileIndex];
  if (keep < 0 || keep >= current) return { ok: false, reason: "bad-amount" };

  const newPiles = state.piles.slice();
  newPiles[pileIndex] = keep;
  const bothEmpty = newPiles[0] === 0 && newPiles[1] === 0;

  return {
    ok: true,
    state: Object.assign({}, state, {
      piles: newPiles,
      currentPlayer: bothEmpty ? state.currentPlayer : 1 - state.currentPlayer,
      isOver: bothEmpty,
      winner: bothEmpty ? state.currentPlayer : null,
    }),
  };
}
