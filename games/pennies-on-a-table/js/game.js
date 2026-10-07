// game.js
// -----------------------------------------------------------------------

function createGameState(playerNames) {
  return {
    playerNames: playerNames,
    pennies: [], // {x, y, player}
    currentPlayer: 0,
    isOver: false,
    winner: null,
  };
}

function attemptPlace(state, x, y, tableCenter, tableRadius, pennyRadius, gridStep) {
  if (state.isOver) return { ok: false, reason: "game-over" };
  const p = { x: x, y: y };

  if (!isInsideTable(p, tableCenter, tableRadius, pennyRadius)) {
    return { ok: false, reason: "off-table" };
  }
  if (overlapsAny(p, state.pennies, pennyRadius)) {
    return { ok: false, reason: "overlap" };
  }

  const newPennies = state.pennies.concat([{ x: x, y: y, player: state.currentPlayer }]);
  const opponentCanMove = hasAnyLegalPlacement(tableCenter, tableRadius, pennyRadius, newPennies, gridStep);

  return {
    ok: true,
    state: Object.assign({}, state, {
      pennies: newPennies,
      currentPlayer: opponentCanMove ? 1 - state.currentPlayer : state.currentPlayer,
      isOver: !opponentCanMove,
      winner: !opponentCanMove ? state.currentPlayer : null,
    }),
  };
}
