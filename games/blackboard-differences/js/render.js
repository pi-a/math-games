// render.js
function renderBoard(state, elements) {
  renderNumbers(state, elements.numberRow);
  renderTurnIndicator(state, elements.turnLeft, elements.turnRight);
}

function renderNumbers(state, row) {
  row.innerHTML = "";
  state.board.forEach(function (value, index) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "number-chip";
    if (state.owner[index] === null) {
      chip.classList.add("number-chip-start");
    } else {
      chip.classList.add("player" + (state.owner[index] + 1));
    }
    if (state.selected === index) chip.classList.add("number-chip-selected");
    chip.textContent = String(value);
    chip.setAttribute("data-index", String(index));
    row.appendChild(chip);
  });
}

function renderTurnIndicator(state, leftEl, rightEl) {
  const slots = [leftEl, rightEl];
  slots.forEach(function (el) { el.textContent = ""; el.className = "turn-slot"; });
  if (state.isOver) {
    const winnerEl = slots[state.winner];
    const loserEl = slots[1 - state.winner];
    winnerEl.textContent = state.playerNames[state.winner] + " gewinnt!";
    winnerEl.className = "turn-slot turn-slot-winner player" + (state.winner + 1);
    loserEl.textContent = state.playerNames[1 - state.winner] + " kann keinen Zug mehr machen.";
    loserEl.className = "turn-slot turn-slot-loser";
  } else {
    const activeEl = slots[state.currentPlayer];
    activeEl.textContent = state.playerNames[state.currentPlayer] + " ist am Zug";
    activeEl.className = "turn-slot player" + (state.currentPlayer + 1);
  }
}
