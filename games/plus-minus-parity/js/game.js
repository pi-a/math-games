// game.js
// -----------------------------------------------------------------------

function createGameState(n, playerNames) {
  return {
    n: n,
    playerNames: playerNames,
    signs: new Array(n - 1).fill(null),      // '+' | '-' | null, one per slot
    signOwner: new Array(n - 1).fill(null),  // which player (0/1) placed it
    currentPlayer: 0,
    isOver: false,
    winner: null,
    result: null, // final evaluated total, once isOver
  };
}

function attemptPlaceSign(state, slotIndex, sign) {
  if (state.isOver) return { ok: false, reason: "game-over" };
  if (slotIndex < 0 || slotIndex >= state.signs.length) return { ok: false, reason: "bad-slot" };
  if (state.signs[slotIndex] !== null) return { ok: false, reason: "slot-filled" };
  if (sign !== "+" && sign !== "-") return { ok: false, reason: "bad-sign" };

  const newSigns = state.signs.slice();
  const newOwner = state.signOwner.slice();
  newSigns[slotIndex] = sign;
  newOwner[slotIndex] = state.currentPlayer;

  const allFilled = newSigns.every(function (s) { return s !== null; });

  if (allFilled) {
    let value = 1; // number 1 always starts the expression, unsigned
    for (let i = 0; i < newSigns.length; i++) {
      const num = i + 2; // slot i sits just before number (i + 2)
      value += newSigns[i] === "+" ? num : -num;
    }
    const winner = value % 2 === 0 ? 0 : 1;
    return {
      ok: true,
      state: Object.assign({}, state, {
        signs: newSigns,
        signOwner: newOwner,
        isOver: true,
        winner: winner,
        result: value,
      }),
    };
  }

  return {
    ok: true,
    state: Object.assign({}, state, {
      signs: newSigns,
      signOwner: newOwner,
      currentPlayer: 1 - state.currentPlayer,
    }),
  };
}
