import { state, updateAppState } from '../core/scene.js';

export function initStylePanel() {
  const strokeColorPicker = document.getElementById('stroke-color-picker');
  const fillColorPicker = document.getElementById('fill-color-picker');
  const fillTransparent = document.getElementById('fill-transparent');

  strokeColorPicker.addEventListener('input', (e) => {
    updateAppState({ currentColor: e.target.value });
  });

  fillColorPicker.addEventListener('input', (e) => {
    fillTransparent.checked = false;
    updateAppState({ currentFill: e.target.value });
  });

  fillTransparent.addEventListener('change', (e) => {
    if (e.target.checked) {
      updateAppState({ currentFill: 'transparent' });
    } else {
      updateAppState({ currentFill: fillColorPicker.value });
    }
  });
}
