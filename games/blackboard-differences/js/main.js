// main.js
(function () {
  const viewSetup = document.getElementById("view-setup");
  const viewGame = document.getElementById("view-game");
  const setupForm = document.getElementById("setup-form");
  const player1Input = document.getElementById("player1-name");
  const player2Input = document.getElementById("player2-name");
  const backButton = document.getElementById("back-button");
  const numberRow = document.getElementById("number-row");
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

  numberRow.addEventListener("click", function (evt) {
    if (!state || state.isOver) return;
    const chip = evt.target.closest(".number-chip");
    if (!chip) return;
    const index = parseInt(chip.getAttribute("data-index"), 10);

    if (state.selected === null) {
      state = Object.assign({}, state, { selected: index });
      draw();
      return;
    }
    if (state.selected === index) {
      state = Object.assign({}, state, { selected: null });
      draw();
      return;
    }
    const result = attemptMove(state, state.selected, index);
    if (!result.ok) {
      showMessage(messageFor(result.reason));
      return;
    }
    state = result.state;
    clearMessage();
    draw();
  });

  document.querySelectorAll(".corner-image").forEach(function (img) {
    loadImageAsset(img, img.getAttribute("data-asset"));
  });

  function startGame(names) {
    state = createGameState(CONFIG.startingNumbers, names);
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
    renderBoard(state, { numberRow: numberRow, turnLeft: turnLeft, turnRight: turnRight });
  }

  function messageFor(reason) {
    if (reason === "not-new") return "Diese Differenz steht schon an der Tafel. Wähle ein anderes Paar.";
    if (reason === "same-number") return "Wähle zwei verschiedene Zahlen.";
    return "Dieser Zug ist nicht erlaubt.";
  }
  function showMessage(text) { messageBanner.textContent = text; }
  function clearMessage() { messageBanner.textContent = ""; }
  function nameOrDefault(value, fallback) {
    const trimmed = (value || "").trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
})();
