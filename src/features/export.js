import { state } from '../core/scene.js';
import { renderElement } from '../core/canvas.js';

export function initExport() {
  document.getElementById('btn-export-json').addEventListener('click', () => {
    const data = JSON.stringify(state.elements, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btn-export-png').addEventListener('click', () => {
    exportToPng();
  });
}

function exportToPng() {
  if (state.elements.length === 0) return;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const el of state.elements) {
    let ex = el.x, ey = el.y, ew = el.width || 0, eh = el.height || 0;
    if (el.type === 'freedraw') {
      for (const pt of el.points) {
        if (pt[0] < minX) minX = pt[0];
        if (pt[0] > maxX) maxX = pt[0];
        if (pt[1] < minY) minY = pt[1];
        if (pt[1] > maxY) maxY = pt[1];
      }
      continue;
    }
    
    const x1 = Math.min(ex, ex + ew);
    const x2 = Math.max(ex, ex + ew);
    const y1 = Math.min(ey, ey + eh);
    const y2 = Math.max(ey, ey + eh);
    
    if (x1 < minX) minX = x1;
    if (y1 < minY) minY = y1;
    if (x2 > maxX) maxX = x2;
    if (y2 > maxY) maxY = y2;
  }

  const padding = 40;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  const width = maxX - minX;
  const height = maxY - minY;

  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(-minX, -minY);
  for (const el of state.elements) {
    renderElement(ctx, el);
  }
  ctx.restore();

  offscreen.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.png';
    a.click();
    URL.revokeObjectURL(url);
  });
}
