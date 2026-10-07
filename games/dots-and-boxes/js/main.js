// main.js
(function () {
  const viewSetup = document.getElementById("view-setup");
  const viewGame = document.getElementById("view-game");
  const setupForm = document.getElementById("setup-form");
  const player1Input = document.getElementById("player1-name");
  const player2Input = document.getElementById("player2-name");
  const rowsInput = document.getElementById("rows-input");
  const rowsDisplay = document.getElementById("rows-display");
  const colsInput = document.getElementById("cols-input");
  const colsDisplay = document.getElementById("cols-display");
  const backButton = document.getElementById("back-button");
  const boardEl = document.getElementById("dab-board");
  const turnLeft = document.getElementById("turn-indicator-left");
  const turnRight = document.getElementById("turn-indicator-right");

  rowsInput.min = String(CONFIG.minSize);
  rowsInput.max = String(CONFIG.maxSize);
  rowsInput.value = String(CONFIG.defaultRows);
  rowsDisplay.textContent = String(CONFIG.defaultRows);
  colsInput.min = String(CONFIG.minSize);
  colsInput.max = String(CONFIG.maxSize);
  colsInput.value = String(CONFIG.defaultCols);
  colsDisplay.textContent = String(CONFIG.defaultCols);
  player1Input.value = CONFIG.defaultPlayerNames[0];
  player2Input.value = CONFIG.defaultPlayerNames[1];

  let state = null;

  rowsInput.addEventListener("input", function () { rowsDisplay.textContent = rowsInput.value; });
  colsInput.addEventListener("input", function () { colsDisplay.textContent = colsInput.value; });

  setupForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const rows = clamp(parseInt(rowsInput.value, 10) || CONFIG.defaultRows, CONFIG.minSize, CONFIG.maxSize);
    const cols = clamp(parseInt(colsInput.value, 10) || CONFIG.defaultCols, CONFIG.minSize, CONFIG.maxSize);
    const names = [
      nameOrDefault(player1Input.value, CONFIG.defaultPlayerNames[0]),
      nameOrDefault(player2Input.value, CONFIG.defaultPlayerNames[1]),
    ];
    startGame(rows, cols, names);
  });

  backButton.addEventListener("click", function () {
    state = null;
    showView(viewSetup);
  });

  boardEl.addEventListener("click", function (evt) {
    if (!state || state.isOver) return;
    const line = evt.target.closest(".dab-line");
    if (!line || line.disabled) return;
    const type = line.getAttribute("data-type");
    const r = parseInt(line.getAttribute("data-r"), 10);
    const c = parseInt(line.getAttribute("data-c"), 10);
    const result = attemptMove(state, type, r, c);
    if (!result.ok) return;
    state = result.state;
    draw();
  });

  document.querySelectorAll(".corner-image").forEach(function (img) {
    loadImageAsset(img, img.getAttribute("data-asset"));
  });

  function startGame(rows, cols, names) {
    state = createGameState(rows, cols, names);
    showView(viewGame);
    draw();
  }

  function showView(view) {
    viewSetup.classList.add("hidden");
    viewGame.classList.add("hidden");
    view.classList.remove("hidden");
  }

  function draw() {
    renderBoard(state, { boardEl: boardEl, turnLeft: turnLeft, turnRight: turnRight });
  }

  function nameOrDefault(value, fallback) {
    const trimmed = (value || "").trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
})();
