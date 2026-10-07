// game.js
// -----------------------------------------------------------------------

function createGameState(startingNumbers, playerNames) {
  return {
    playerNames: playerNames,
    board: startingNumbers.slice().sort(function (a, b) { return a - b; }),
    owner: startingNumbers.map(function () { return null; }), // null = starting number
    currentPlayer: 0,
    selected: null,
    isOver: false,
    winner: null,
  };
}

function hasAnyMove(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = i + 1; j < board.length; j++) {
      const diff = Math.abs(board[i] - board[j]);
      if (diff > 0 && board.indexOf(diff) === -1) return true;
    }
  }
  return false;
}

function attemptMove(state, i, j) {
  if (state.isOver) return { ok: false, reason: "game-over" };
  if (i === j) return { ok: false, reason: "same-number" };
  const a = state.board[i];
  const b = state.board[j];
  const diff = Math.abs(a - b);
  if (diff === 0 || state.board.indexOf(diff) !== -1) {
    return { ok: false, reason: "not-new" };
  }

  const ownerByValue = {};
  state.board.forEach(function (val, idx) { ownerByValue[val] = state.owner[idx]; });
  ownerByValue[diff] = state.currentPlayer;

  const newBoard = state.board.concat([diff]).sort(function (x, y) { return x - y; });
  const newOwner = newBoard.map(function (val) { return ownerByValue[val]; });

  const nextPlayerCanMove = hasAnyMove(newBoard);

  return {
    ok: true,
    state: {
      playerNames: state.playerNames,
      board: newBoard,
      owner: newOwner,
      currentPlayer: nextPlayerCanMove ? 1 - state.currentPlayer : state.currentPlayer,
      selected: null,
      isOver: !nextPlayerCanMove,
      winner: !nextPlayerCanMove ? state.currentPlayer : null,
    },
  };
}
