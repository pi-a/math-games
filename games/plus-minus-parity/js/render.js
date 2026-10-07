// render.js
function renderBoard(state, elements) {
  renderExpression(state, elements.expressionRow);
  renderTurnIndicator(state, elements.turnLeft, elements.turnRight);
}

function renderExpression(state, row) {
  row.innerHTML = "";
  for (let i = 1; i <= state.n; i++) {
    const chip = document.createElement("span");
    chip.className = "number-chip";
    chip.textContent = String(i);
    row.appendChild(chip);

    if (i < state.n) {
      const slotIndex = i - 1;
      const sign = state.signs[slotIndex];
      const slot = document.createElement("span");
      slot.className = "sign-slot";

      if (sign) {
        slot.textContent = sign === "+" ? "+" : "\u2212";
        slot.classList.add("sign-slot-filled", "player" + (state.signOwner[slotIndex] + 1));
      } else if (!state.isOver) {
        const plusBtn = document.createElement("button");
        plusBtn.type = "button";
        plusBtn.className = "sign-button";
        plusBtn.textContent = "+";
        plusBtn.setAttribute("data-slot", String(slotIndex));
        plusBtn.setAttribute("data-sign", "+");

        const minusBtn = document.createElement("button");
        minusBtn.type = "button";
        minusBtn.className = "sign-button";
        minusBtn.textContent = "\u2212";
        minusBtn.setAttribute("data-slot", String(slotIndex));
        minusBtn.setAttribute("data-sign", "-");

        slot.appendChild(plusBtn);
        slot.appendChild(minusBtn);
      }
      row.appendChild(slot);
    }
  }
}

function renderTurnIndicator(state, leftEl, rightEl) {
  const slots = [leftEl, rightEl];
  slots.forEach(function (el) { el.textContent = ""; el.className = "turn-slot"; });
  if (state.isOver) {
    const winnerEl = slots[state.winner];
    const loserEl = slots[1 - state.winner];
    const parity = state.result % 2 === 0 ? "gerade" : "ungerade";
    winnerEl.textContent = state.playerNames[state.winner] + " gewinnt! Die Summe ist " + state.result + " (" + parity + ").";
    winnerEl.className = "turn-slot turn-slot-winner player" + (state.winner + 1);
    loserEl.textContent = state.playerNames[1 - state.winner] + " verliert diese Runde.";
    loserEl.className = "turn-slot turn-slot-loser";
  } else {
    const activeEl = slots[state.currentPlayer];
    activeEl.textContent = state.playerNames[state.currentPlayer] + " ist am Zug";
    activeEl.className = "turn-slot player" + (state.currentPlayer + 1);
  }
}
