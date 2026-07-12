import { state, updateAppState } from '../core/scene.js';

let isErasing = false;

function isPointInElement(x, y, el) {
  let minX, minY, maxX, maxY;
  
  if (el.type === 'freedraw') {
    minX = Infinity; minY = Infinity; maxX = -Infinity; maxY = -Infinity;
    for (const pt of el.points) {
      if (pt[0] < minX) minX = pt[0];
      if (pt[0] > maxX) maxX = pt[0];
      if (pt[1] < minY) minY = pt[1];
      if (pt[1] > maxY) maxY = pt[1];
    }
  } else {
    const ew = el.width || 0;
    const eh = el.height || 0;
    minX = Math.min(el.x, el.x + ew);
    maxX = Math.max(el.x, el.x + ew);
    minY = Math.min(el.y, el.y + eh);
    maxY = Math.max(el.y, el.y + eh);
  }

  // Add padding for easier erasing
  const padding = 10;
  return x >= minX - padding && x <= maxX + padding && y >= minY - padding && y <= maxY + padding;
}

function eraseAt(canvasCoords) {
  const initialLength = state.elements.length;
  state.elements = state.elements.filter(el => !isPointInElement(canvasCoords.x, canvasCoords.y, el));
  if (state.elements.length !== initialLength) {
    updateAppState({}); // trigger render
  }
}

export function onPointerDown(e, canvasCoords) {
  isErasing = true;
  eraseAt(canvasCoords);
}

export function onPointerMove(e, canvasCoords) {
  if (isErasing) {
    eraseAt(canvasCoords);
  }
}

export function onPointerUp(e, canvasCoords) {
  isErasing = false;
}
