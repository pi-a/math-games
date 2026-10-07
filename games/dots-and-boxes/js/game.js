// game.js
// -----------------------------------------------------------------------

function createGameState(rows, cols, playerNames) {
  const horizontalLines = [];
  for (let r = 0; r <= rows; r++) horizontalLines.push(new Array(cols).fill(false));
  const verticalLines = [];
  for (let r = 0; r < rows; r++) verticalLines.push(new Array(cols + 1).fill(false));
  const boxOwner = [];
  for (let r = 0; r < rows; r++) boxOwner.push(new Array(cols).fill(null));

  return {
    playerNames: playerNames,
    rows: rows,
    cols: cols,
    horizontalLines: horizontalLines,
    verticalLines: verticalLines,
    boxOwner: boxOwner,
    scores: [0, 0],
    currentPlayer: 0,
    isOver: false,
    winner: null, // player index, or null for a tie
  };
}

function totalLines(rows, cols) {
  return (rows + 1) * cols + rows * (cols + 1);
}

function countDrawnLines(state) {
  let count = 0;
  state.horizontalLines.forEach(function (row) { row.forEach(function (v) { if (v) count++; }); });
  state.verticalLines.forEach(function (row) { row.forEach(function (v) { if (v) count++; }); });
  return count;
}

function isBoxComplete(h, v, rows, cols, r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
  return h[r][c] && h[r + 1][c] && v[r][c] && v[r][c + 1];
}

function attemptMove(state, type, r, c) {
  if (state.isOver) return { ok: false, reason: "game-over" };

  const newH = state.horizontalLines.map(function (row) { return row.slice(); });
  const newV = state.verticalLines.map(function (row) { return row.slice(); });

  if (type === "h") {
    if (r < 0 || r > state.rows || c < 0 || c >= state.cols) return { ok: false, reason: "bad-line" };
    if (newH[r][c]) return { ok: false, reason: "already-drawn" };
    newH[r][c] = true;
  } else if (type === "v") {
    if (r < 0 || r >= state.rows || c < 0 || c > state.cols) return { ok: false, reason: "bad-line" };
    if (newV[r][c]) return { ok: false, reason: "already-drawn" };
    newV[r][c] = true;
  } else {
    return { ok: false, reason: "bad-line" };
  }

  const newBoxOwner = state.boxOwner.map(function (row) { return row.slice(); });
  const candidates = type === "h" ? [[r - 1, c], [r, c]] : [[r, c - 1], [r, c]];
  let completedCount = 0;
  candidates.forEach(function (pair) {
    const br = pair[0], bc = pair[1];
    if (br < 0 || br >= state.rows || bc < 0 || bc >= state.cols) return;
    if (newBoxOwner[br][bc] !== null) return;
    if (isBoxComplete(newH, newV, state.rows, state.cols, br, bc)) {
      newBoxOwner[br][bc] = state.currentPlayer;
      completedCount++;
    }
  });

  const newScores = state.scores.slice();
  newScores[state.currentPlayer] += completedCount;

  const allDrawn = countDrawnLines({ horizontalLines: newH, verticalLines: newV }) === totalLines(state.rows, state.cols);
  let winner = null;
  if (allDrawn) {
    if (newScores[0] > newScores[1]) winner = 0;
    else if (newScores[1] > newScores[0]) winner = 1;
  }

  return {
    ok: true,
    state: Object.assign({}, state, {
      horizontalLines: newH,
      verticalLines: newV,
      boxOwner: newBoxOwner,
      scores: newScores,
      currentPlayer: completedCount > 0 ? state.currentPlayer : 1 - state.currentPlayer,
      isOver: allDrawn,
      winner: winner,
    }),
  };
}
