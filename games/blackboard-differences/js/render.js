// render.js
function renderBoard(state, pendingPair, elements) {
  renderNumbers(state, pendingPair, elements.numberRow);
  renderGuessForm(state, pendingPair, elements.diffForm, elements.diffLabel, elements.diffInput);
  renderTurnIndicator(state, elements.turnLeft, elements.turnRight);
}

function renderNumbers(state, pendingPair, row) {
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
    const isPicked = state.selected === index || (pendingPair && (pendingPair.i === index || pendingPair.j === index));
    if (isPicked) chip.classList.add("number-chip-selected");
    chip.textContent = String(value);
    chip.setAttribute("data-index", String(index));
    row.appendChild(chip);
  });
}

function renderGuessForm(state, pendingPair, formEl, labelEl, inputEl) {
  if (!pendingPair || state.isOver) {
    formEl.classList.add("hidden");
    return;
  }
  const a = state.board[pendingPair.i];
  const b = state.board[pendingPair.j];
  labelEl.textContent = "Was ist die Differenz von " + Math.max(a, b) + " und " + Math.min(a, b) + "?";
  formEl.classList.remove("hidden");
  inputEl.focus();
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
