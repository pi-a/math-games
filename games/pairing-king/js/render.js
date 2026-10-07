// render.js
function renderBoard(state, elements) {
  renderGrid(state, elements.boardEl);
  renderHint(state, elements.hintEl);
  renderTurnIndicator(state, elements.turnLeft, elements.turnRight);
}

function renderGrid(state, boardEl) {
  boardEl.innerHTML = "";
  for (let r = 0; r < state.rows; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "king-row";
    for (let c = 0; c < state.cols; c++) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "king-cell";
      cell.setAttribute("data-row", String(r));
      cell.setAttribute("data-col", String(c));

      const visitor = state.visitedBy[r + "-" + c];
      const isCurrent = state.kingPosition && state.kingPosition.r === r && state.kingPosition.c === c;

      if (visitor !== undefined) {
        cell.classList.add("king-cell-visited", "player" + (visitor + 1));
        cell.disabled = true;
        if (isCurrent) {
          cell.classList.add("king-cell-current");
          cell.textContent = "\u265A";
        }
      } else if (!state.isOver && isLegalTarget(state, r, c)) {
        cell.classList.add("king-cell-legal", "player" + (state.currentPlayer + 1));
      } else {
        cell.disabled = true;
      }
      rowEl.appendChild(cell);
    }
    boardEl.appendChild(rowEl);
  }
}

function renderHint(state, hintEl) {
  if (state.isOver) {
    hintEl.textContent = "";
  } else if (state.kingPosition === null) {
    hintEl.textContent = "Klicke auf ein beliebiges Feld, um den König zu setzen.";
  } else {
    hintEl.textContent = "Klicke auf ein markiertes Feld, um den König zu bewegen. Besuchte Felder sind gesperrt.";
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
    loserEl.textContent = state.playerNames[1 - state.winner] + " kann den König nicht mehr bewegen.";
    loserEl.className = "turn-slot turn-slot-loser";
  } else {
    const activeEl = slots[state.currentPlayer];
    activeEl.textContent = state.playerNames[state.currentPlayer] + " ist am Zug";
    activeEl.className = "turn-slot player" + (state.currentPlayer + 1);
  }
}
