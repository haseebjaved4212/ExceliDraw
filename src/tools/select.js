import { state, updateAppState } from '../core/scene.js';
import { getBoundingBox, isPointInElement, rotatePoint } from '../utils/geometry.js';

let mode = 'none'; // 'none', 'move', 'resize', 'rotate'
let targetId = null;
let targetHandle = null;
let startCoords = null;
let initialElements = null;

function getHandleAt(px, py, element) {
  if (!state.appState.selectedElementIds.includes(element.id)) return null;

  const box = getBoundingBox(element);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const angle = element.angle || 0;
  
  const unrotated = rotatePoint(px, py, cx, cy, -angle);
  
  const z = state.appState.zoom || 1;
  const hs = 8 / z;
  const hitRange = hs * 1.5;
  
  const handles = {
    'nw': { x: box.x, y: box.y },
    'n': { x: box.x + box.width / 2, y: box.y },
    'ne': { x: box.x + box.width, y: box.y },
    'e': { x: box.x + box.width, y: box.y + box.height / 2 },
    'se': { x: box.x + box.width, y: box.y + box.height },
    's': { x: box.x + box.width / 2, y: box.y + box.height },
    'sw': { x: box.x, y: box.y + box.height },
    'w': { x: box.x, y: box.y + box.height / 2 },
    'rotate': { x: box.x + box.width / 2, y: box.y - 20 / z - hs/2 }
  };

  for (const [key, pos] of Object.entries(handles)) {
    if (Math.abs(unrotated.x - pos.x) <= hitRange && Math.abs(unrotated.y - pos.y) <= hitRange) {
      return key;
    }
  }
  return null;
}

export function onPointerDown(e, canvasCoords) {
  for (const id of state.appState.selectedElementIds) {
    const el = state.elements.find(e => e.id === id);
    if (!el) continue;
    const handle = getHandleAt(canvasCoords.x, canvasCoords.y, el);
    if (handle) {
      mode = handle === 'rotate' ? 'rotate' : 'resize';
      targetId = id;
      targetHandle = handle;
      startCoords = canvasCoords;
      initialElements = JSON.parse(JSON.stringify(state.elements));
      return;
    }
  }

  for (let i = state.elements.length - 1; i >= 0; i--) {
    const el = state.elements[i];
    if (isPointInElement(canvasCoords.x, canvasCoords.y, el)) {
      if (!state.appState.selectedElementIds.includes(el.id)) {
        updateAppState({ selectedElementIds: [el.id] });
      }
      mode = 'move';
      targetId = el.id;
      startCoords = canvasCoords;
      initialElements = JSON.parse(JSON.stringify(state.elements));
      return;
    }
  }

  updateAppState({ selectedElementIds: [] });
  mode = 'none';
}

export function onPointerMove(e, canvasCoords) {
  if (mode === 'none') return;

  const dx = canvasCoords.x - startCoords.x;
  const dy = canvasCoords.y - startCoords.y;

  const initialEl = initialElements.find(el => el.id === targetId);
  const el = state.elements.find(e => e.id === targetId);
  if (!initialEl || !el) return;

  if (mode === 'move') {
    if (el.type === 'freedraw') {
      for (let i = 0; i < el.points.length; i++) {
        el.points[i][0] = initialEl.points[i][0] + dx;
        el.points[i][1] = initialEl.points[i][1] + dy;
      }
    } else {
      el.x = initialEl.x + dx;
      el.y = initialEl.y + dy;
    }
    updateAppState({});
  } else if (mode === 'resize') {
    if (el.type === 'freedraw') return; // Scaling freedraw is complex, skipping for now

    const angle = initialEl.angle || 0;
    const localDx = dx * Math.cos(-angle) - dy * Math.sin(-angle);
    const localDy = dx * Math.sin(-angle) + dy * Math.cos(-angle);

    let newX = initialEl.x;
    let newY = initialEl.y;
    let newW = initialEl.width;
    let newH = initialEl.height;

    if (targetHandle.includes('w')) {
      newX += localDx;
      newW -= localDx;
    }
    if (targetHandle.includes('e')) {
      newW += localDx;
    }
    if (targetHandle.includes('n')) {
      newY += localDy;
      newH -= localDy;
    }
    if (targetHandle.includes('s')) {
      newH += localDy;
    }

    // Fix negative width/height by swapping coordinates (like Excalidraw)
    // but for simplicity, we just allow negative, canvas handles it.
    el.x = newX;
    el.y = newY;
    el.width = newW;
    el.height = newH;
    
    updateAppState({});
  } else if (mode === 'rotate') {
    const box = getBoundingBox(initialEl);
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    
    const currentAngle = Math.atan2(canvasCoords.y - cy, canvasCoords.x - cx);
    const startAngle = Math.atan2(startCoords.y - cy, startCoords.x - cx);
    
    el.angle = (initialEl.angle || 0) + (currentAngle - startAngle);
    updateAppState({});
  }
}

export function onPointerUp(e, canvasCoords) {
  mode = 'none';
  targetId = null;
  targetHandle = null;
  initialElements = null;
}
