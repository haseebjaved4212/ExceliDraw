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
    type: 'arrow',
    x: startX,
    y: startY,
    width: 0,
    height: 0,
    strokeColor: state.appState.currentColor,
    strokeWidth: 2
  });
}

export function onPointerMove(e, canvasCoords) {
  if (!currentElementId) return;
  
  let width = canvasCoords.x - startX;
  let height = canvasCoords.y - startY;
  
  if (e.shiftKey) {
    // Snap angle to 15 degrees
    const angle = Math.atan2(height, width);
    const length = Math.sqrt(width * width + height * height);
    const snappedAngle = Math.round(angle / (Math.PI / 12)) * (Math.PI / 12);
    width = length * Math.cos(snappedAngle);
    height = length * Math.sin(snappedAngle);
  }
  
  updateElement(currentElementId, { width, height });
}

export function onPointerUp(e, canvasCoords) {
  if (!currentElementId) return;
  
  currentElementId = null;
}
