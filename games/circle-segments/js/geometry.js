// geometry.js
// -----------------------------------------------------------------------

function computePointPositions(n, cx, cy, radius) {
  const points = [];
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      angle: angle,
    });
  }
  return points;
}

function segmentKey(i, j) {
  const a = Math.min(i, j);
  const b = Math.max(i, j);
  return a + "-" + b;
}

function segmentsCross(a, b, c, d) {
  if (a === c || a === d || b === c || b === d) return false;
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const cInside = c > lo && c < hi;
  const dInside = d > lo && d < hi;
  return cInside !== dInside;
}

function isLegalMove(n, drawnSegments, i, j) {
  if (i === j) return false;
  if (drawnSegments.has(segmentKey(i, j))) return false;
  for (const existingKey of drawnSegments.keys()) {
    const parts = existingKey.split("-");
    const a = Number(parts[0]);
    const b = Number(parts[1]);
    if (segmentsCross(a, b, i, j)) return false;
  }
  return true;
}

function findAnyLegalMove(n, drawnSegments) {
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isLegalMove(n, drawnSegments, i, j)) return [i, j];
    }
  }
  return null;
}
