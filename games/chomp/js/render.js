// render.js
function renderBoard(state, elements) {
  renderGrid(state, elements.boardEl);
  renderTurnIndicator(state, elements.turnLeft, elements.turnRight);
}

function renderGrid(state, boardEl) {
  boardEl.innerHTML = "";
  for (let r = 0; r < state.rows; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "chomp-row";
    for (let c = 0; c < state.rowWidths[r]; c++) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "chomp-cell";
      if (r === 0 && c === 0) cell.classList.add("chomp-cell-poison");
      cell.setAttribute("data-row", String(r));
      cell.setAttribute("data-col", String(c));
      rowEl.appendChild(cell);
    }
    boardEl.appendChild(rowEl);
  }
}

function renderTurnIndicator(state, leftEl, rightEl) {
  const slots = [leftEl, rightEl];
  slots.forEach(function (el) { el.textContent = ""; el.className = "turn-slot"; });
  if (state.isOver) {
    const winnerEl = slots[state.winner];
    const loserEl = slots[1 - state.winner];
    winnerEl.textContent = state.playerNames[state.winner] + " gewinnt!";
    winnerEl.className = "turn-slot turn-slot-winner player" + (state.winner + 1);
    loserEl.textContent = state.playerNames[1 - state.winner] + " hat das vergiftete Feld gegessen.";
    loserEl.className = "turn-slot turn-slot-loser";
  } else {
    const activeEl = slots[state.currentPlayer];
    activeEl.textContent = state.playerNames[state.currentPlayer] + " ist am Zug";
    activeEl.className = "turn-slot player" + (state.currentPlayer + 1);
  }
}
