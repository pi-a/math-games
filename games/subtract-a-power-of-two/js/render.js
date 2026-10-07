// render.js
function renderBoard(state, pending, maxExponent, elements) {
  elements.currentNumber.textContent = String(state.current);
  renderPowerReference(state, pending, maxExponent, elements.powerReference);
  renderSubmitButton(pending, elements.amountSubmit);
  elements.amountForm.classList.toggle("hidden", state.isOver);
  renderTurnIndicator(state, elements.turnLeft, elements.turnRight);
}

function renderPowerReference(state, pending, maxExponent, container) {
  container.innerHTML = "";
  for (let k = 0; k <= maxExponent; k++) {
    const block = document.createElement("div");
    block.className = "power-block";
    if (pending && pending.exponent === k) {
      block.classList.add("power-block-matched", "player" + (state.currentPlayer + 1));
    }
    const base = document.createElement("span");
    base.textContent = "2";
    const sup = document.createElement("sup");
    sup.textContent = String(k);
    block.appendChild(base);
    block.appendChild(sup);
    container.appendChild(block);
  }
}

function renderSubmitButton(pending, button) {
  button.textContent = pending ? "Abziehen" : "Prüfen";
}

function renderTurnIndicator(state, leftEl, rightEl) {
  const slots = [leftEl, rightEl];
  slots.forEach(function (el) { el.textContent = ""; el.className = "turn-slot"; });
  if (state.isOver) {
    const winnerEl = slots[state.winner];
    const loserEl = slots[1 - state.winner];
    winnerEl.textContent = state.playerNames[state.winner] + " gewinnt! Die Zahl ist jetzt 0.";
    winnerEl.className = "turn-slot turn-slot-winner player" + (state.winner + 1);
    loserEl.textContent = state.playerNames[1 - state.winner] + " hat 0 nicht zuerst erreicht.";
    loserEl.className = "turn-slot turn-slot-loser";
  } else {
    const activeEl = slots[state.currentPlayer];
    activeEl.textContent = state.playerNames[state.currentPlayer] + " ist am Zug";
    activeEl.className = "turn-slot player" + (state.currentPlayer + 1);
  }
}
