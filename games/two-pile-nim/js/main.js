// main.js
(function () {
  const viewSetup = document.getElementById("view-setup");
  const viewGame = document.getElementById("view-game");
  const setupForm = document.getElementById("setup-form");
  const player1Input = document.getElementById("player1-name");
  const player2Input = document.getElementById("player2-name");
  const backButton = document.getElementById("back-button");
  const pilesContainer = document.getElementById("piles-container");
  const pileARow = document.getElementById("pile-a-row");
  const pileBRow = document.getElementById("pile-b-row");
  const turnLeft = document.getElementById("turn-indicator-left");
  const turnRight = document.getElementById("turn-indicator-right");
  const messageBanner = document.getElementById("message-banner");

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
    clearMessage();
    showView(viewSetup);
  });

  [pileARow, pileBRow].forEach(function (row) {
    row.addEventListener("click", function (evt) {
      if (!state || state.isOver) return;
      const stone = evt.target.closest(".stone");
      if (!stone) return;
      const pileIndex = parseInt(stone.getAttribute("data-pile"), 10);
      const keep = parseInt(stone.getAttribute("data-keep"), 10);
      const result = attemptRemove(state, pileIndex, keep);
      if (!result.ok) {
        showMessage("Dieser Zug ist nicht erlaubt.");
        return;
      }
      state = result.state;
      clearMessage();
      draw();
    });
  });

  document.querySelectorAll(".corner-image").forEach(function (img) {
    loadImageAsset(img, img.getAttribute("data-asset"));
  });

  function startGame(names) {
    state = createGameState(CONFIG.pileASize, CONFIG.pileBSize, names);
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
    renderBoard(state, { pileARow: pileARow, pileBRow: pileBRow, turnLeft: turnLeft, turnRight: turnRight });
    pilesContainer.className = "piles-container turn-player" + (state.currentPlayer + 1);
  }

  function showMessage(text) { messageBanner.textContent = text; }
  function clearMessage() { messageBanner.textContent = ""; }
  function nameOrDefault(value, fallback) {
    const trimmed = (value || "").trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
})();
