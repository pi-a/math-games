// main.js
(function () {
  const viewSetup = document.getElementById("view-setup");
  const viewGame = document.getElementById("view-game");
  const setupForm = document.getElementById("setup-form");
  const player1Input = document.getElementById("player1-name");
  const player2Input = document.getElementById("player2-name");
  const backButton = document.getElementById("back-button");
  const boardEl = document.getElementById("king-board");
  const hintEl = document.getElementById("king-hint");
  const turnLeft = document.getElementById("turn-indicator-left");
  const turnRight = document.getElementById("turn-indicator-right");

  player1Input.value = CONFIG.defaultPlayerNames[0];
  player2Input.value = CONFIG.defaultPlayerNames[1];

  let state = null;

  setupForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const names = [
      nameOrDefault(player1Input.value, CONFIG.defaultPlayerNames[0]),
      nameOrDefault(player2Input.value, CONFIG.defaultPlayerNames[1]),
    ];
    startGame(names);
  });

  backButton.addEventListener("click", function () {
    state = null;
    showView(viewSetup);
  });

  boardEl.addEventListener("click", function (evt) {
    if (!state || state.isOver) return;
    const cell = evt.target.closest(".king-cell");
    if (!cell || cell.disabled) return;
    const r = parseInt(cell.getAttribute("data-row"), 10);
    const c = parseInt(cell.getAttribute("data-col"), 10);
    const result = attemptMove(state, r, c);
    if (!result.ok) return;
    state = result.state;
    draw();
  });

  document.querySelectorAll(".corner-image").forEach(function (img) {
    loadImageAsset(img, img.getAttribute("data-asset"));
  });

  function startGame(names) {
    state = createGameState(CONFIG.rows, CONFIG.cols, names);
    showView(viewGame);
    draw();
  }

  function showView(view) {
    viewSetup.classList.add("hidden");
    viewGame.classList.add("hidden");
    view.classList.remove("hidden");
  }

  function draw() {
    renderBoard(state, { boardEl: boardEl, hintEl: hintEl, turnLeft: turnLeft, turnRight: turnRight });
  }

  function nameOrDefault(value, fallback) {
    const trimmed = (value || "").trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
})();
