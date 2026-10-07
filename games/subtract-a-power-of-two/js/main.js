// main.js
(function () {
  const viewSetup = document.getElementById("view-setup");
  const viewGame = document.getElementById("view-game");
  const setupForm = document.getElementById("setup-form");
  const player1Input = document.getElementById("player1-name");
  const player2Input = document.getElementById("player2-name");
  const backButton = document.getElementById("back-button");
  const currentNumber = document.getElementById("current-number");
  const powerReference = document.getElementById("power-reference");
  const amountForm = document.getElementById("amount-form");
  const amountInput = document.getElementById("amount-input");
  const amountSubmit = document.getElementById("amount-submit");
  const turnLeft = document.getElementById("turn-indicator-left");
  const turnRight = document.getElementById("turn-indicator-right");
  const messageBanner = document.getElementById("message-banner");

  const maxExponent = powersOfTwoUpTo(CONFIG.startingNumber).length - 1;

  player1Input.value = CONFIG.defaultPlayerNames[0];
  player2Input.value = CONFIG.defaultPlayerNames[1];

  let state = null;
  let pending = null; // { amount, exponent }

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
    clearPending();
    clearMessage();
    showView(viewSetup);
  });

  amountForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    if (!state || state.isOver) return;
    if (pending) {
      confirmSubtract();
    } else {
      checkAmount();
    }
  });

  amountInput.addEventListener("input", function () {
    if (pending) {
      clearPending();
      clearMessage();
      draw();
    }
  });

  document.querySelectorAll(".corner-image").forEach(function (img) {
    loadImageAsset(img, img.getAttribute("data-asset"));
  });

  function checkAmount() {
    const raw = amountInput.value.trim();
    if (raw === "") {
      showMessage("Gib zuerst eine Zahl ein.");
      return;
    }
    const amount = Number(raw);
    if (!Number.isInteger(amount) || amount <= 0) {
      showMessage(raw + " ist keine positive ganze Zahl.");
      return;
    }
    const exponent = powerOfTwoExponent(amount);
    if (exponent === null) {
      showMessage(amount + " ist keine Zweierpotenz.");
      return;
    }
    if (amount > state.current) {
      showMessage(amount + " ist 2^" + exponent + ", aber es sind nur noch " + state.current + " übrig.");
      return;
    }
    pending = { amount: amount, exponent: exponent };
    clearMessage();
    draw();
  }

  function confirmSubtract() {
    const result = attemptSubtract(state, pending.amount);
    if (!result.ok) {
      showMessage("Dieser Zug ist nicht erlaubt.");
      clearPending();
      draw();
      return;
    }
    state = result.state;
    clearPending();
    amountInput.value = "";
    clearMessage();
    draw();
  }

  function clearPending() {
    pending = null;
  }

  function powerOfTwoExponent(n) {
    if (!Number.isInteger(n) || n < 1) return null;
    let k = 0;
    let p = 1;
    while (p < n) {
      p *= 2;
      k++;
    }
    return p === n ? k : null;
  }

  function startGame(names) {
    state = createGameState(CONFIG.startingNumber, names);
    clearPending();
    amountInput.value = "";
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
    renderBoard(state, pending, maxExponent, {
      currentNumber: currentNumber,
      powerReference: powerReference,
      amountForm: amountForm,
      amountSubmit: amountSubmit,
      turnLeft: turnLeft,
      turnRight: turnRight,
    });
  }

  function showMessage(text) { messageBanner.textContent = text; }
  function clearMessage() { messageBanner.textContent = ""; }
  function nameOrDefault(value, fallback) {
    const trimmed = (value || "").trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
})();
