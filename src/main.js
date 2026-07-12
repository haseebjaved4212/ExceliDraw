import './ui/styles.css';
import { initCanvas, render } from './core/canvas.js';
import { setRenderCallback, addElement } from './core/scene.js';
import { initToolbar } from './ui/toolbar.js';
import { initStylePanel } from './ui/stylePanel.js';
import { initExport } from './features/export.js';
import { initImport } from './features/import.js';
import { undo, redo, commitToHistory } from './core/history.js';
import { initTheme } from './ui/theme.js';

const canvasElement = document.getElementById('canvas');
initCanvas(canvasElement);
setRenderCallback(render);
initToolbar();
initStylePanel();
initExport();
initImport();

// Initialize history
commitToHistory();
document.getElementById('btn-undo').addEventListener('click', undo);
document.getElementById('btn-redo').addEventListener('click', redo);

window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    if (e.shiftKey) {
      redo();
    } else {
      undo();
    }
    e.preventDefault();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
    redo();
    e.preventDefault();
  }
});

initTheme();
