// render.js
const SVG_NS = "http://www.w3.org/2000/svg";

function renderBoard(state, elements) {
  renderPennies(state, elements.penniesLayer);
  renderTurnIndicator(state, elements.turnLeft, elements.turnRight);
}

function renderPennies(state, layer) {
  layer.innerHTML = "";
  state.pennies.forEach(function (penny) {
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", penny.x);
    circle.setAttribute("cy", penny.y);
    circle.setAttribute("r", CONFIG.pennyRadius);
    circle.setAttribute("class", "penny player" + (penny.player + 1));
    layer.appendChild(circle);
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
    loserEl.textContent = state.playerNames[1 - state.winner] + " hat keinen Platz mehr für eine Münze.";
    loserEl.className = "turn-slot turn-slot-loser";
  } else {
    const activeEl = slots[state.currentPlayer];
    activeEl.textContent = state.playerNames[state.currentPlayer] + " ist am Zug";
    activeEl.className = "turn-slot player" + (state.currentPlayer + 1);
  }
}
