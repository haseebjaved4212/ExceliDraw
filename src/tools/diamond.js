import { addElement, updateElement, updateAppState, state } from '../core/scene.js';

let currentElementId = null;
let startX = 0;
let startY = 0;

export function onPointerDown(e, canvasCoords) {
  currentElementId = crypto.randomUUID();
  startX = canvasCoords.x;
  startY = canvasCoords.y;
  
  addElement({
    id: currentElementId,
    type: 'diamond',
    x: startX,
    y: startY,
    width: 0,
    height: 0,
    strokeColor: state.appState.currentColor,
    strokeWidth: 2,
    fillStyle: state.appState.currentFill
  });
}

export function onPointerMove(e, canvasCoords) {
  if (!currentElementId) return;
  
  let width = canvasCoords.x - startX;
  let height = canvasCoords.y - startY;
  
  if (e.shiftKey) {
    const size = Math.max(Math.abs(width), Math.abs(height));
    width = size * Math.sign(width || 1);
    height = size * Math.sign(height || 1);
  }
  
  updateElement(currentElementId, { width, height });
}

export function onPointerUp(e, canvasCoords) {
  if (!currentElementId) return;
  
  currentElementId = null;
}
