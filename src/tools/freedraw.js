import { addElement, updateElement, state } from '../core/scene.js';
import { commitToHistory } from '../core/history.js';

let currentElementId = null;

export function onPointerDown(e, canvasCoords) {
  currentElementId = crypto.randomUUID();
  
  addElement({
    id: currentElementId,
    type: 'freedraw',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    points: [[canvasCoords.x, canvasCoords.y, e.pressure || 0.5]],
    strokeColor: state.appState.currentColor,
    strokeWidth: 3
  });
}

export function onPointerMove(e, canvasCoords) {
  if (!currentElementId) return;
  
  const el = state.elements.find(el => el.id === currentElementId);
  if (el) {
    const newPoints = [...el.points, [canvasCoords.x, canvasCoords.y, e.pressure || 0.5]];
    updateElement(currentElementId, { points: newPoints });
  }
}

export function onPointerUp(e, canvasCoords) {
  if (currentElementId) {
    commitToHistory();
  }
  currentElementId = null;
}
