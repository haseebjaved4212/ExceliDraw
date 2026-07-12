import { state } from './scene.js';
import * as toolManager from './toolManager.js';
import { getStroke } from 'perfect-freehand';
import { getBoundingBox } from '../utils/geometry.js';

function getSvgPathFromStroke(stroke) {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
}

let canvas;
let ctx;
let dpr = window.devicePixelRatio || 1;

export function initCanvas(canvasElement) {
  canvas = canvasElement;
  ctx = canvas.getContext('2d');
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  setupEvents();
  
  render();
}

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  render();
}

export function screenToCanvas(clientX, clientY) {
  return {
    x: (clientX - state.appState.scrollX) / state.appState.zoom,
    y: (clientY - state.appState.scrollY) / state.appState.zoom
  };
}

export function canvasToScreen(canvasX, canvasY) {
  return {
    x: canvasX * state.appState.zoom + state.appState.scrollX,
    y: canvasY * state.appState.zoom + state.appState.scrollY
  };
}

function setupEvents() {
  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let isSpacePressed = false;

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isSpacePressed) {
      isSpacePressed = true;
      canvas.style.cursor = 'grab';
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      isSpacePressed = false;
      canvas.style.cursor = isPanning ? 'grabbing' : 'default';
    }
  });

  canvas.addEventListener('pointerdown', (e) => {
    if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      canvas.style.cursor = 'grabbing';
      e.preventDefault();
      return;
    }
    
    if (e.button === 0) {
      toolManager.handlePointerDown(e, screenToCanvas(e.clientX, e.clientY));
      // Capture pointer so we get move events outside canvas
      canvas.setPointerCapture(e.pointerId);
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (isPanning) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      state.appState.scrollX += dx;
      state.appState.scrollY += dy;
      startX = e.clientX;
      startY = e.clientY;
      render();
      return;
    }
    
    toolManager.handlePointerMove(e, screenToCanvas(e.clientX, e.clientY));
  });

  window.addEventListener('pointerup', (e) => {
    if (isPanning) {
      if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
        isPanning = false;
        canvas.style.cursor = isSpacePressed ? 'grab' : 'default';
      }
      return;
    }
    
    toolManager.handlePointerUp(e, screenToCanvas(e.clientX, e.clientY));
    if (canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
  });

  // Wheel zoom / pan
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const zoomStep = 0.01;
      const delta = -e.deltaY;
      const zoomMultiplier = Math.exp(delta * zoomStep);
      
      const prevZoom = state.appState.zoom;
      let newZoom = prevZoom * zoomMultiplier;
      newZoom = Math.min(Math.max(newZoom, 0.1), 10);
      
      const pointerX = e.clientX;
      const pointerY = e.clientY;
      
      const zoomRatio = newZoom / prevZoom;
      state.appState.scrollX = pointerX - (pointerX - state.appState.scrollX) * zoomRatio;
      state.appState.scrollY = pointerY - (pointerY - state.appState.scrollY) * zoomRatio;
      
      state.appState.zoom = newZoom;
    } else {
      // Pan
      state.appState.scrollX -= e.deltaX;
      state.appState.scrollY -= e.deltaY;
    }
    render();
  }, { passive: false });
}

export function render() {
  if (!ctx) return;
  
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = state.appState.theme === 'dark' ? '#121212' : '#f8f9fa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.scale(dpr, dpr);
  ctx.translate(state.appState.scrollX, state.appState.scrollY);
  ctx.scale(state.appState.zoom, state.appState.zoom);
  
  for (const element of state.elements) {
    renderElement(ctx, element);
  }
  
  renderLaser(ctx);
  
  ctx.restore();
}

let isLaserActive = false;

function renderLaser(ctx) {
  const now = Date.now();
  const maxAge = 500;
  
  if (!state.laserTrails) state.laserTrails = [];
  state.laserTrails = state.laserTrails.filter(pt => now - pt.timestamp < maxAge);
  
  if (state.laserTrails.length > 0) {
    if (!isLaserActive) {
      isLaserActive = true;
      requestAnimationFrame(renderLoop);
    }
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'red';
    ctx.shadowBlur = 10;

    for (let i = 1; i < state.laserTrails.length; i++) {
      const p1 = state.laserTrails[i - 1];
      const p2 = state.laserTrails[i];
      if (p2.timestamp - p1.timestamp > 100) continue; // Gap
      
      const age = now - p2.timestamp;
      const alpha = Math.max(0, 1 - (age / maxAge));
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  } else {
    isLaserActive = false;
  }
}

function renderLoop() {
  if (isLaserActive) {
    render();
    requestAnimationFrame(renderLoop);
  }
}

export function renderElement(ctx, element) {
  ctx.save();
  
  const box = getBoundingBox(element);
  if (element.angle) {
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    ctx.translate(cx, cy);
    ctx.rotate(element.angle);
    ctx.translate(-cx, -cy);
  }

  let strokeColor = element.strokeColor || 'black';
  let fillStyle = element.fillStyle || 'transparent';

  if (state.appState.theme === 'dark') {
    if (strokeColor === '#1e1e1e') strokeColor = '#e9ecef';
    if (fillStyle === '#1e1e1e') fillStyle = '#e9ecef';
  }
  
  if (element.type === 'freedraw') {
    const stroke = getStroke(element.points, {
      size: element.strokeWidth * 2,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5
    });
    const pathData = getSvgPathFromStroke(stroke);
    const path = new Path2D(pathData);
    ctx.fillStyle = strokeColor;
    ctx.fill(path);
    ctx.restore();
    return;
  }

  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = element.strokeWidth || 1;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.beginPath();
  
  if (element.type === 'rectangle') {
    ctx.rect(element.x, element.y, element.width, element.height);
  } else if (element.type === 'ellipse') {
    const cx = element.x + element.width / 2;
    const cy = element.y + element.height / 2;
    ctx.ellipse(cx, cy, Math.abs(element.width / 2), Math.abs(element.height / 2), 0, 0, 2 * Math.PI);
  } else if (element.type === 'diamond') {
    ctx.moveTo(element.x + element.width / 2, element.y);
    ctx.lineTo(element.x + element.width, element.y + element.height / 2);
    ctx.lineTo(element.x + element.width / 2, element.y + element.height);
    ctx.lineTo(element.x, element.y + element.height / 2);
    ctx.closePath();
  } else if (element.type === 'line' || element.type === 'arrow') {
    ctx.moveTo(element.x, element.y);
    ctx.lineTo(element.x + element.width, element.y + element.height);
  }

  if (element.fillStyle !== 'transparent' && ['rectangle', 'ellipse', 'diamond'].includes(element.type)) {
    ctx.fill();
  }
  ctx.stroke();

  // Draw arrowhead if arrow
  if (element.type === 'arrow') {
    const x1 = element.x;
    const y1 = element.y;
    const x2 = element.x + element.width;
    const y2 = element.y + element.height;
    
    // Calculate angle of line
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLen = 15;
    
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  }

  if (state.appState.selectedElementIds && state.appState.selectedElementIds.includes(element.id)) {
    const z = state.appState.zoom || 1;
    ctx.strokeStyle = '#a5b4fc';
    ctx.lineWidth = 1 / z;
    ctx.setLineDash([5 / z, 5 / z]);
    ctx.strokeRect(box.x - 2, box.y - 2, box.width + 4, box.height + 4);
    ctx.setLineDash([]);
    
    const hs = 8 / z;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#4c6ef5';
    ctx.lineWidth = 1 / z;
    
    const drawHandle = (hx, hy) => {
      ctx.fillRect(hx - hs/2, hy - hs/2, hs, hs);
      ctx.strokeRect(hx - hs/2, hy - hs/2, hs, hs);
    };
    
    drawHandle(box.x - 2, box.y - 2);
    drawHandle(box.x + box.width/2, box.y - 2);
    drawHandle(box.x + box.width + 2, box.y - 2);
    drawHandle(box.x + box.width + 2, box.y + box.height/2);
    drawHandle(box.x + box.width + 2, box.y + box.height + 2);
    drawHandle(box.x + box.width/2, box.y + box.height + 2);
    drawHandle(box.x - 2, box.y + box.height + 2);
    drawHandle(box.x - 2, box.y + box.height/2);
    
    const rd = 20 / z;
    ctx.beginPath();
    ctx.moveTo(box.x + box.width/2, box.y - 2);
    ctx.lineTo(box.x + box.width/2, box.y - 2 - rd);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(box.x + box.width/2, box.y - 2 - rd - hs/2, hs/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}
