import './ui/styles.css';
import { initCanvas, render } from './core/canvas.js';
import { setRenderCallback, addElement } from './core/scene.js';
import { initToolbar } from './ui/toolbar.js';
import { initStylePanel } from './ui/stylePanel.js';

const canvasElement = document.getElementById('canvas');
initCanvas(canvasElement);
setRenderCallback(render);
initToolbar();
initStylePanel();

// Add a test rectangle to verify coordinate system and rendering
addElement({
  id: 'rect-1',
  type: 'rectangle',
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  fillStyle: 'transparent',
  strokeColor: '#333',
  strokeWidth: 2
});
