// game.js
// -----------------------------------------------------------------------

function createGameState(numPoints, playerNames) {
  return {
    numPoints: numPoints,
    playerNames: playerNames, // [name1, name2]
    drawnSegments: new Map(), // "i-j" (i<j) -> player index (0/1) who drew it
    currentPlayer: 0,
    selectedPoint: null,
    isOver: false,
    winner: null, // player index, once isOver is true
  };
}

function attemptMove(state, i, j) {
  if (state.isOver) return { ok: false, reason: "game-over" };
  if (i === j) return { ok: false, reason: "same-point" };

  const key = segmentKey(i, j);
  if (state.drawnSegments.has(key)) {
    return { ok: false, reason: "already-drawn" };
  }
  for (const existingKey of state.drawnSegments.keys()) {
    const parts = existingKey.split("-");
    const a = Number(parts[0]);
    const b = Number(parts[1]);
    if (segmentsCross(a, b, i, j)) {
      return { ok: false, reason: "crosses-existing" };
    }
  }

  const newDrawn = new Map(state.drawnSegments);
  newDrawn.set(key, state.currentPlayer);

  const nextPlayer = 1 - state.currentPlayer;
  const nextPlayerCanMove = findAnyLegalMove(state.numPoints, newDrawn) !== null;

  return {
    ok: true,
    state: {
      numPoints: state.numPoints,
      playerNames: state.playerNames,
      drawnSegments: newDrawn,
      selectedPoint: null,
      currentPlayer: nextPlayerCanMove ? nextPlayer : state.currentPlayer,
      isOver: !nextPlayerCanMove,
      winner: !nextPlayerCanMove ? state.currentPlayer : null,
    },
  };
}
