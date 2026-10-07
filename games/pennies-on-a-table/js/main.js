// main.js
(function () {
  const viewSetup = document.getElementById("view-setup");
  const viewGame = document.getElementById("view-game");
  const setupForm = document.getElementById("setup-form");
  const player1Input = document.getElementById("player1-name");
  const player2Input = document.getElementById("player2-name");
  const backButton = document.getElementById("back-button");
  const board = document.getElementById("board");
  const penniesLayer = document.getElementById("pennies-layer");
  const previewPenny = document.getElementById("preview-penny");
  const turnLeft = document.getElementById("turn-indicator-left");
  const turnRight = document.getElementById("turn-indicator-right");
  const messageBanner = document.getElementById("message-banner");

  const tableCenter = { x: CONFIG.viewBoxSize / 2, y: CONFIG.viewBoxSize / 2 };
  previewPenny.setAttribute("r", CONFIG.pennyRadius);

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
    hidePreview();
    showView(viewSetup);
  });

  board.addEventListener("click", function (evt) {
    if (!state || state.isOver) return;
    const p = toBoardPoint(evt);
    const result = attemptPlace(state, p.x, p.y, tableCenter, CONFIG.tableRadius, CONFIG.pennyRadius, CONFIG.gridStep);
    if (!result.ok) {
      showMessage(messageFor(result.reason));
      return;
    }
    state = result.state;
    clearMessage();
    draw();

    updatePreviewAt(evt.clientX, evt.clientY);
  });

  board.addEventListener("mousemove", function (evt) {
    updatePreviewAt(evt.clientX, evt.clientY);
  });

  board.addEventListener("mouseleave", function () {
    hidePreview();
  });

  document.querySelectorAll(".corner-image").forEach(function (img) {
    loadImageAsset(img, img.getAttribute("data-asset"));
  });

  function updatePreviewAt(clientX, clientY) {
    if (!state || state.isOver) {
      hidePreview();
      return;
    }
    const p = toBoardPoint({ clientX: clientX, clientY: clientY });
    const dx = p.x - tableCenter.x;
    const dy = p.y - tableCenter.y;
    const withinTable = Math.sqrt(dx * dx + dy * dy) <= CONFIG.tableRadius;
    if (!withinTable) {
      hidePreview();
      return;
    }
    previewPenny.setAttribute("cx", p.x);
    previewPenny.setAttribute("cy", p.y);
    previewPenny.setAttribute("class", "preview-penny player" + (state.currentPlayer + 1));
  }

  function hidePreview() {
    previewPenny.setAttribute("class", "preview-penny hidden");
  }

  function toBoardPoint(evt) {
    const pt = board.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const ctm = board.getScreenCTM().inverse();
    return pt.matrixTransform(ctm);
  }

  function startGame(names) {
    state = createGameState(names);
    clearMessage();
    showView(viewGame);
    draw();
    hidePreview();
  }

  function showView(view) {
    viewSetup.classList.add("hidden");
    viewGame.classList.add("hidden");
    view.classList.remove("hidden");
  }

  function draw() {
    renderBoard(state, { penniesLayer: penniesLayer, turnLeft: turnLeft, turnRight: turnRight });
    if (state.isOver) hidePreview();
  }

  function messageFor(reason) {
    if (reason === "off-table") return "Die Münze liegt nicht ganz auf dem Tisch. Wähle eine andere Stelle.";
    if (reason === "overlap") return "Die Münze würde auf einer anderen Münze liegen. Wähle eine andere Stelle.";
    return "Dieser Zug ist nicht erlaubt.";
  }
  function showMessage(text) { messageBanner.textContent = text; }
  function clearMessage() { messageBanner.textContent = ""; }
  function nameOrDefault(value, fallback) {
    const trimmed = (value || "").trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
})();
