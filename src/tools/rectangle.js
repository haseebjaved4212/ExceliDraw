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
    type: 'rectangle',
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
  
  // Re-normalize so width and height are positive and x,y is top-left
  const el = state.elements.find(el => el.id === currentElementId);
  if (el) {
    if (el.width < 0) { el.x += el.width; el.width = Math.abs(el.width); }
    if (el.height < 0) { el.y += el.height; el.height = Math.abs(el.height); }
    updateElement(currentElementId, { x: el.x, y: el.y, width: el.width, height: el.height });
  }

  currentElementId = null;
}
