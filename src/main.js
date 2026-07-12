import './ui/styles.css';
import { initCanvas, render } from './core/canvas.js';
import { setRenderCallback, addElement } from './core/scene.js';
import { initToolbar } from './ui/toolbar.js';
import { initStylePanel } from './ui/stylePanel.js';
import { initExport } from './features/export.js';
import { initImport } from './features/import.js';

const canvasElement = document.getElementById('canvas');
initCanvas(canvasElement);
setRenderCallback(render);
initToolbar();
initStylePanel();
initExport();
initImport();
