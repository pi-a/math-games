// game.js
// -----------------------------------------------------------------------

function powersOfTwoUpTo(n) {
  const powers = [];
  let p = 1;
  while (p <= n) {
    powers.push(p);
    p *= 2;
  }
  return powers;
}

function createGameState(startingNumber, playerNames) {
  return {
    playerNames: playerNames,
    current: startingNumber,
    currentPlayer: 0,
    isOver: false,
    winner: null,
  };
}

function attemptSubtract(state, amount) {
  if (state.isOver) return { ok: false, reason: "game-over" };
  const validAmounts = powersOfTwoUpTo(state.current);
  if (validAmounts.indexOf(amount) === -1) return { ok: false, reason: "bad-amount" };

  const next = state.current - amount;
  const reachedZero = next === 0;

  return {
    ok: true,
    state: Object.assign({}, state, {
      current: next,
      currentPlayer: reachedZero ? state.currentPlayer : 1 - state.currentPlayer,
      isOver: reachedZero,
      winner: reachedZero ? state.currentPlayer : null,
    }),
  };
}
