// render.js
const DOT = 10;  // px
const GAP = 34;  // px: distance between dots, also a box's side length

function buildTemplate(count) {
  const parts = [];
  for (let i = 0; i < count; i++) { parts.push(DOT + "px"); parts.push(GAP + "px"); }
  parts.push(DOT + "px");
  return parts.join(" ");
}
function placeAt(el, gridRow, gridCol) {
  el.style.gridRow = String(gridRow);
  el.style.gridColumn = String(gridCol);
}

function renderBoard(state, elements) {
  renderGrid(state, elements.boardEl);
  renderTurnIndicator(state, elements.turnLeft, elements.turnRight);
}

function renderGrid(state, boardEl) {
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = buildTemplate(state.cols);
  boardEl.style.gridTemplateRows = buildTemplate(state.rows);

  for (let r = 0; r <= state.rows; r++) {
    for (let c = 0; c <= state.cols; c++) {
      const dot = document.createElement("div");
      dot.className = "dab-dot";
      placeAt(dot, 2 * r + 1, 2 * c + 1);
      boardEl.appendChild(dot);
    }
  }

  for (let r = 0; r <= state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "dab-line dab-line-h";
      if (state.horizontalLines[r][c]) { el.classList.add("dab-line-drawn"); el.disabled = true; }
      el.setAttribute("data-type", "h");
      el.setAttribute("data-r", String(r));
      el.setAttribute("data-c", String(c));
      placeAt(el, 2 * r + 1, 2 * c + 2);
      boardEl.appendChild(el);
    }
  }

  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c <= state.cols; c++) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "dab-line dab-line-v";
      if (state.verticalLines[r][c]) { el.classList.add("dab-line-drawn"); el.disabled = true; }
      el.setAttribute("data-type", "v");
      el.setAttribute("data-r", String(r));
      el.setAttribute("data-c", String(c));
      placeAt(el, 2 * r + 2, 2 * c + 1);
      boardEl.appendChild(el);
    }
  }

  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const el = document.createElement("div");
      el.className = "dab-box";
      const owner = state.boxOwner[r][c];
      if (owner !== null) el.classList.add("dab-box-owned", "player" + (owner + 1));
      placeAt(el, 2 * r + 2, 2 * c + 2);
      boardEl.appendChild(el);
    }
  }
}

function renderTurnIndicator(state, leftEl, rightEl) {
  const slots = [leftEl, rightEl];
  slots.forEach(function (el, i) {
    el.textContent = state.playerNames[i] + ": " + state.scores[i];
    el.className = "turn-slot";
  });
  if (state.isOver) {
    if (state.winner === null) {
      slots[0].textContent += " (Unentschieden)";
      slots[1].textContent += " (Unentschieden)";
    } else {
      slots[state.winner].textContent += " (gewinnt!)";
      slots[state.winner].className = "turn-slot turn-slot-winner player" + (state.winner + 1);
      slots[1 - state.winner].className = "turn-slot turn-slot-loser";
    }
  } else {
    slots[state.currentPlayer].className = "turn-slot player" + (state.currentPlayer + 1);
  }
}
