// main.js
// -----------------------------------------------------------------------

(function () {
  const viewSetup = document.getElementById("view-setup");
  const viewGame = document.getElementById("view-game");
  const setupForm = document.getElementById("setup-form");
  const player1Input = document.getElementById("player1-name");
  const player2Input = document.getElementById("player2-name");
  const pointCountInput = document.getElementById("point-count");
  const pointCountDisplay = document.getElementById("point-count-display");
  const backButton = document.getElementById("back-button");
  const board = document.getElementById("board");
  const segmentsLayer = document.getElementById("segments-layer");
  const pointsLayer = document.getElementById("points-layer");
  const turnLeft = document.getElementById("turn-indicator-left");
  const turnRight = document.getElementById("turn-indicator-right");
  const messageBanner = document.getElementById("message-banner");

  pointCountInput.min = String(CONFIG.minPoints);
  pointCountInput.max = String(CONFIG.maxPoints);
  pointCountInput.value = String(CONFIG.defaultPoints);
  pointCountDisplay.textContent = String(CONFIG.defaultPoints);
  player1Input.value = CONFIG.defaultPlayerNames[0];
  player2Input.value = CONFIG.defaultPlayerNames[1];

  let state = null;
  let points = [];

  pointCountInput.addEventListener("input", function () {
    pointCountDisplay.textContent = pointCountInput.value;
  });

  setupForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const n = clamp(
      parseInt(pointCountInput.value, 10) || CONFIG.defaultPoints,
      CONFIG.minPoints,
      CONFIG.maxPoints
    );
    const names = [
      nameOrDefault(player1Input.value, CONFIG.defaultPlayerNames[0]),
      nameOrDefault(player2Input.value, CONFIG.defaultPlayerNames[1]),
    ];
    startGame(n, names);
  });

  backButton.addEventListener("click", function () {
    state = null;
    clearMessage();
    showView(viewSetup);
  });

  board.addEventListener("click", onBoardClick);

  document.querySelectorAll(".corner-image").forEach(function (img) {
    loadImageAsset(img, img.getAttribute("data-asset"));
  });

  function startGame(n, names) {
    state = createGameState(n, names);
    const cx = CONFIG.viewBoxSize / 2;
    const cy = CONFIG.viewBoxSize / 2;
    points = computePointPositions(n, cx, cy, CONFIG.circleRadius);
    clearMessage();
    showView(viewGame);
    draw();
  }

  function showView(view) {
    viewSetup.classList.add("hidden");
    viewGame.classList.add("hidden");
    view.classList.remove("hidden");
  }

  function onBoardClick(evt) {
    if (!state || state.isOver) return;

    const group = evt.target.closest(".point-group");
    if (!group) {
      if (state.selectedPoint !== null) {
        state = Object.assign({}, state, { selectedPoint: null });
        draw();
      }
      return;
    }

    const index = parseInt(group.getAttribute("data-index"), 10);

    if (state.selectedPoint === null) {
      state = Object.assign({}, state, { selectedPoint: index });
      draw();
      return;
    }
    if (state.selectedPoint === index) {
      state = Object.assign({}, state, { selectedPoint: null });
      draw();
      return;
    }

    const result = attemptMove(state, state.selectedPoint, index);
    if (!result.ok) {
      showMessage(messageFor(result.reason));
      return;
    }
    state = result.state;
    clearMessage();
    draw();
  }

  function draw() {
    renderBoard(state, points, {
      segmentsLayer: segmentsLayer,
      pointsLayer: pointsLayer,
      turnLeft: turnLeft,
      turnRight: turnRight,
    });
  }

  function messageFor(reason) {
    if (reason === "already-drawn") return "Diese Linie ist schon gezeichnet. Wähle einen anderen Punkt.";
    if (reason === "crosses-existing") return "Diese Linie würde eine andere Linie kreuzen. Wähle einen anderen Punkt.";
    if (reason === "same-point") return "Wähle einen anderen Punkt zum Verbinden.";
    return "Dieser Zug ist nicht erlaubt.";
  }

  function showMessage(text) { messageBanner.textContent = text; }
  function clearMessage() { messageBanner.textContent = ""; }

  function nameOrDefault(value, fallback) {
    const trimmed = (value || "").trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
})();
