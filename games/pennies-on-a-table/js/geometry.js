// geometry.js
// -----------------------------------------------------------------------

function distance(p, q) {
  const dx = p.x - q.x;
  const dy = p.y - q.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function isInsideTable(p, tableCenter, tableRadius, pennyRadius) {
  return distance(p, tableCenter) <= tableRadius - pennyRadius;
}

function overlapsAny(p, pennies, pennyRadius) {
  for (let i = 0; i < pennies.length; i++) {
    if (distance(p, pennies[i]) < 2 * pennyRadius) return true;
  }
  return false;
}

function isLegalPlacement(p, tableCenter, tableRadius, pennyRadius, pennies) {
  return isInsideTable(p, tableCenter, tableRadius, pennyRadius) && !overlapsAny(p, pennies, pennyRadius);
}

function hasAnyLegalPlacement(tableCenter, tableRadius, pennyRadius, pennies, gridStep) {
  const usableRadius = tableRadius - pennyRadius;
  if (usableRadius < 0) return false;
  for (let x = tableCenter.x - usableRadius; x <= tableCenter.x + usableRadius; x += gridStep) {
    for (let y = tableCenter.y - usableRadius; y <= tableCenter.y + usableRadius; y += gridStep) {
      const p = { x: x, y: y };
      if (isLegalPlacement(p, tableCenter, tableRadius, pennyRadius, pennies)) return true;
    }
  }
  return false;
}
