// game.js
// -----------------------------------------------------------------------

function createGameState(rows, cols, playerNames) {
  return {
    playerNames: playerNames,
    rows: rows,
    cols: cols,
    visitedBy: {}, // "r-c" -> index of the player who moved the king there
    kingPosition: null, // {r, c} once placed
    currentPlayer: 0,
    isOver: false,
    winner: null,
  };
}

function isAdjacent(r1, c1, r2, c2) {
  return Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2)) === 1;
}

function isLegalTarget(state, r, c) {
  if (state.visitedBy[r + "-" + c] !== undefined) return false;
  if (state.kingPosition === null) return true; // not placed yet -- anywhere is fine
  return isAdjacent(r, c, state.kingPosition.r, state.kingPosition.c);
}

function hasAnyLegalTarget(state, r, c) {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= state.rows || nc < 0 || nc >= state.cols) continue;
      if (state.visitedBy[nr + "-" + nc] === undefined) return true;
    }
  }
  return false;
}

function attemptMove(state, r, c) {
  if (state.isOver) return { ok: false, reason: "game-over" };
  if (r < 0 || r >= state.rows || c < 0 || c >= state.cols) return { ok: false, reason: "bad-cell" };
  if (!isLegalTarget(state, r, c)) return { ok: false, reason: "illegal-target" };

  const newVisitedBy = Object.assign({}, state.visitedBy);
  newVisitedBy[r + "-" + c] = state.currentPlayer;
  const movedState = Object.assign({}, state, { visitedBy: newVisitedBy, kingPosition: { r: r, c: c } });
  const nextCanMove = hasAnyLegalTarget(movedState, r, c);

  return {
    ok: true,
    state: Object.assign({}, movedState, {
      currentPlayer: nextCanMove ? 1 - state.currentPlayer : state.currentPlayer,
      isOver: !nextCanMove,
      winner: !nextCanMove ? state.currentPlayer : null,
    }),
  };
}
