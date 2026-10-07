// render.js
function renderBoard(state, elements) {
  renderPile(state, 0, elements.pileARow);
  renderPile(state, 1, elements.pileBRow);
  renderTurnIndicator(state, elements.turnLeft, elements.turnRight);
}

function renderPile(state, pileIndex, row) {
  row.innerHTML = "";
  const count = state.piles[pileIndex];
  for (let i = 0; i < count; i++) {
    const stone = document.createElement("button");
    stone.type = "button";
    stone.className = "stone";
    stone.setAttribute("data-pile", String(pileIndex));
    stone.setAttribute("data-keep", String(i));
    row.appendChild(stone);
  }
  if (count === 0) {
    const empty = document.createElement("span");
    empty.className = "pile-empty";
    empty.textContent = "leer";
    row.appendChild(empty);
  }
}

function renderTurnIndicator(state, leftEl, rightEl) {
  const slots = [leftEl, rightEl];
  slots.forEach(function (el) { el.textContent = ""; el.className = "turn-slot"; });
  if (state.isOver) {
    const winnerEl = slots[state.winner];
    const loserEl = slots[1 - state.winner];
    winnerEl.textContent = state.playerNames[state.winner] + " gewinnt! Das war der letzte Stein.";
    winnerEl.className = "turn-slot turn-slot-winner player" + (state.winner + 1);
    loserEl.textContent = state.playerNames[1 - state.winner] + " hat den letzten Stein nicht genommen.";
    loserEl.className = "turn-slot turn-slot-loser";
  } else {
    const activeEl = slots[state.currentPlayer];
    activeEl.textContent = state.playerNames[state.currentPlayer] + " ist am Zug";
    activeEl.className = "turn-slot player" + (state.currentPlayer + 1);
  }
}
