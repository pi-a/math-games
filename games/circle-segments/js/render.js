// render.js
// -----------------------------------------------------------------------

const SVG_NS = "http://www.w3.org/2000/svg";

function renderBoard(state, points, elements) {
  renderSegments(state, points, elements.segmentsLayer);
  renderPoints(state, points, elements.pointsLayer);
  renderTurnIndicator(state, elements.turnLeft, elements.turnRight);
}

function renderPoints(state, points, pointsLayer) {
  pointsLayer.innerHTML = "";
  points.forEach(function (p, index) {
    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("class", "point-group");
    group.setAttribute("data-index", String(index));

    const hit = document.createElementNS(SVG_NS, "circle");
    hit.setAttribute("cx", p.x);
    hit.setAttribute("cy", p.y);
    hit.setAttribute("r", CONFIG.pointHitRadius);
    hit.setAttribute("class", "point-hit");

    const dot = document.createElementNS(SVG_NS, "circle");
    dot.setAttribute("cx", p.x);
    dot.setAttribute("cy", p.y);
    dot.setAttribute("r", CONFIG.pointRadius);
    dot.setAttribute(
      "class",
      "point-dot" + (state.selectedPoint === index ? " point-dot-selected" : "")
    );

    const label = document.createElementNS(SVG_NS, "text");
    label.setAttribute("x", p.x + CONFIG.labelOffset * Math.cos(p.angle));
    label.setAttribute("y", p.y + CONFIG.labelOffset * Math.sin(p.angle));
    label.setAttribute("class", "point-label");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "middle");
    label.textContent = String(index + 1);

    group.appendChild(hit);
    group.appendChild(dot);
    group.appendChild(label);
    pointsLayer.appendChild(group);
  });
}

function renderSegments(state, points, segmentsLayer) {
  segmentsLayer.innerHTML = "";
  state.drawnSegments.forEach(function (playerIndex, key) {
    const parts = key.split("-");
    const a = Number(parts[0]);
    const b = Number(parts[1]);
    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", points[a].x);
    line.setAttribute("y1", points[a].y);
    line.setAttribute("x2", points[b].x);
    line.setAttribute("y2", points[b].y);
    line.setAttribute("class", "segment segment-player" + (playerIndex + 1));
    segmentsLayer.appendChild(line);
  });
}

function renderTurnIndicator(state, leftEl, rightEl) {
  const slots = [leftEl, rightEl];
  slots.forEach(function (el) {
    el.textContent = "";
    el.className = "turn-slot";
  });

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
