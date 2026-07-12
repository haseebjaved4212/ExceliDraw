import { state, updateAppState } from '../core/scene.js';

export function initStylePanel() {
  const strokeSwatches = document.querySelectorAll('#stroke-swatches .color-swatch');
  const fillSwatches = document.querySelectorAll('#fill-swatches .color-swatch');

  strokeSwatches.forEach(swatch => {
    swatch.addEventListener('click', (e) => {
      const color = e.currentTarget.getAttribute('data-color');
      updateAppState({ currentColor: color });
      strokeSwatches.forEach(s => s.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });

  fillSwatches.forEach(swatch => {
    swatch.addEventListener('click', (e) => {
      const color = e.currentTarget.getAttribute('data-color');
      updateAppState({ currentFill: color });
      fillSwatches.forEach(s => s.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });
}
