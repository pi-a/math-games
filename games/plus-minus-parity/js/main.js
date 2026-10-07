// main.js
(function () {
  const viewSetup = document.getElementById("view-setup");
  const viewGame = document.getElementById("view-game");
  const setupForm = document.getElementById("setup-form");
  const player1Input = document.getElementById("player1-name");
  const player2Input = document.getElementById("player2-name");
  const numberCountSelect = document.getElementById("number-count");
  const backButton = document.getElementById("back-button");
  const expressionRow = document.getElementById("expression-row");
  const turnLeft = document.getElementById("turn-indicator-left");
  const turnRight = document.getElementById("turn-indicator-right");
  const messageBanner = document.getElementById("message-banner");

  CONFIG.numberOptions.forEach(function (n) {
    const opt = document.createElement("option");
    opt.value = String(n);
    opt.textContent = "1 bis " + n;
    if (n === CONFIG.defaultNumberCount) opt.selected = true;
    numberCountSelect.appendChild(opt);
  });
  player1Input.value = CONFIG.defaultPlayerNames[0];
  player2Input.value = CONFIG.defaultPlayerNames[1];

  let state = null;

  setupForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const n = parseInt(numberCountSelect.value, 10) || CONFIG.defaultNumberCount;
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

  expressionRow.addEventListener("click", function (evt) {
    if (!state || state.isOver) return;
    const btn = evt.target.closest(".sign-button");
    if (!btn) return;
    const slotIndex = parseInt(btn.getAttribute("data-slot"), 10);
    const sign = btn.getAttribute("data-sign");
    const result = attemptPlaceSign(state, slotIndex, sign);
    if (!result.ok) {
      showMessage("Dieser Zug ist nicht erlaubt.");
      return;
    }
    state = result.state;
    clearMessage();
    draw();
  });

  document.querySelectorAll(".corner-image").forEach(function (img) {
    loadImageAsset(img, img.getAttribute("data-asset"));
  });

  function startGame(n, names) {
    state = createGameState(n, names);
    clearMessage();
    showView(viewGame);
    draw();
  }

  function showView(view) {
    viewSetup.classList.add("hidden");
    viewGame.classList.add("hidden");
    view.classList.remove("hidden");
  }

  function draw() {
    renderBoard(state, { expressionRow: expressionRow, turnLeft: turnLeft, turnRight: turnRight });
  }

  function showMessage(text) { messageBanner.textContent = text; }
  function clearMessage() { messageBanner.textContent = ""; }
  function nameOrDefault(value, fallback) {
    const trimmed = (value || "").trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
})();
