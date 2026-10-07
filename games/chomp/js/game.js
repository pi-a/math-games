// game.js
// -----------------------------------------------------------------------

function computeInitialRowWidths(rows, cols, shape) {
  const widths = [];
  for (let r = 0; r < rows; r++) {
    if (shape === "staircase") {
      widths.push(cols - Math.floor((r * cols) / rows));
    } else {
      widths.push(cols);
    }
  }
  return widths;
}

function createGameState(rows, cols, shape, playerNames) {
  return {
    playerNames: playerNames,
    rows: rows,
    rowWidths: computeInitialRowWidths(rows, cols, shape),
    currentPlayer: 0,
    isOver: false,
    winner: null,
  };
}


function attemptEat(state, r, c) {
  if (state.isOver) return { ok: false, reason: "game-over" };
  if (r < 0 || r >= state.rows) return { ok: false, reason: "bad-cell" };
  if (c < 0 || c >= state.rowWidths[r]) return { ok: false, reason: "bad-cell" };

  const ateThePoison = r === 0 && c === 0;

  const newRowWidths = state.rowWidths.slice();
  for (let rr = r; rr < state.rows; rr++) {
    newRowWidths[rr] = Math.min(newRowWidths[rr], c);
  }

  if (ateThePoison) {
    return {
      ok: true,
      state: Object.assign({}, state, {
        rowWidths: newRowWidths,
        isOver: true,
        winner: 1 - state.currentPlayer,
      }),
    };
  }

  return {
    ok: true,
    state: Object.assign({}, state, {
      rowWidths: newRowWidths,
      currentPlayer: 1 - state.currentPlayer,
    }),
  };
}
