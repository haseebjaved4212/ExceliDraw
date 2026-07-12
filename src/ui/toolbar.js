import { state, updateAppState } from '../core/scene.js';

export function initToolbar() {
  const toolbar = document.getElementById('toolbar');
  const buttons = toolbar.querySelectorAll('button');

  toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) {
      const tool = btn.getAttribute('data-tool');
      updateAppState({ activeTool: tool });
      
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  });

  // Handle keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    let tool = null;
    switch (e.key.toLowerCase()) {
      case 'v':
      case '1': tool = 'select'; break;
      case 'r': tool = 'rectangle'; break;
      case 'o': tool = 'ellipse'; break;
      case 'd': tool = 'diamond'; break;
      case 'a': tool = 'arrow'; break;
      case 'l': tool = 'line'; break;
      case 'k': tool = 'laser'; break;
      case 'p': tool = 'pen'; break;
      case 'e': tool = 'eraser'; break;
    }

    if (tool) {
      updateAppState({ activeTool: tool });
      buttons.forEach(btn => {
        if (btn.getAttribute('data-tool') === tool) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  });
}
