import { addElement, state } from '../core/scene.js';
import { commitToHistory } from '../core/history.js';

export function onPointerDown(e, canvasCoords) {
  // Do nothing on pointer down for text, wait for up to avoid dragging
}

export function onPointerMove(e, canvasCoords) {
}

export function onPointerUp(e, canvasCoords) {
  if (e.button !== 0) return;
  if (state.appState.isEditingText) return;
  
  state.appState.isEditingText = true;
  
  const z = state.appState.zoom || 1;
  const sx = canvasCoords.x * z + state.appState.scrollX;
  const sy = canvasCoords.y * z + state.appState.scrollY;

  const textarea = document.createElement('textarea');
  textarea.className = 'text-editor-overlay';
  textarea.style.left = `${sx}px`;
  textarea.style.top = `${sy}px`;
  textarea.style.transform = `scale(${z})`;
  
  const color = state.appState.currentColor === 'transparent' ? '#000' : state.appState.currentColor;
  textarea.style.color = state.appState.theme === 'dark' && color === '#1e1e1e' ? '#e9ecef' : color;
  
  document.getElementById('ui-layer').appendChild(textarea);
  
  textarea.focus();
  
  let isCommitted = false;
  
  const commitText = () => {
    if (isCommitted) return;
    isCommitted = true;
    
    const text = textarea.value.trimEnd();
    if (text) {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      ctx.font = '20px sans-serif';
      
      const lines = text.split('\n');
      let maxWidth = 0;
      const lineHeight = 24; // 1.2 * 20px
      const totalHeight = lines.length * lineHeight;
      
      for (const line of lines) {
        const metrics = ctx.measureText(line);
        if (metrics.width > maxWidth) {
          maxWidth = metrics.width;
        }
      }
      
      addElement({
        id: crypto.randomUUID(),
        type: 'text',
        x: canvasCoords.x,
        y: canvasCoords.y,
        text: text,
        width: maxWidth || 10,
        height: totalHeight,
        strokeColor: state.appState.currentColor,
        font: '20px sans-serif',
        lineHeight: lineHeight
      });
      commitToHistory();
    }
    
    textarea.remove();
    state.appState.isEditingText = false;
    
    // Switch to select tool after text is committed
    const selectBtn = document.querySelector('[data-tool="select"]');
    if (selectBtn) {
      selectBtn.click();
    }
  };
  
  textarea.addEventListener('blur', commitText);
  textarea.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      commitText();
    }
  });
  
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    textarea.style.width = 'auto';
    textarea.style.width = Math.max(10, textarea.scrollWidth) + 'px';
  });
}
