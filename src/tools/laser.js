import { state, updateAppState } from '../core/scene.js';
// Add setRenderCallback if we need to force render
import { render } from '../core/canvas.js';

let isDrawing = false;

export function onPointerDown(e, canvasCoords) {
  isDrawing = true;
  if (!state.laserTrails) state.laserTrails = [];
  state.laserTrails.push({ x: canvasCoords.x, y: canvasCoords.y, timestamp: Date.now() });
  render(); // trigger initial render
}

export function onPointerMove(e, canvasCoords) {
  if (!isDrawing) return;
  state.laserTrails.push({ x: canvasCoords.x, y: canvasCoords.y, timestamp: Date.now() });
  // The animation loop will pick this up
}

export function onPointerUp(e, canvasCoords) {
  isDrawing = false;
}
