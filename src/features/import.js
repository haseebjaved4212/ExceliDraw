import { state, updateAppState } from '../core/scene.js';

export function initImport() {
  const btn = document.getElementById('btn-import-json');
  const input = document.getElementById('input-import-json');

  btn.addEventListener('click', () => {
    input.click();
  });

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const elements = JSON.parse(e.target.result);
        state.elements = elements;
        updateAppState({}); // trigger render
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    input.value = ''; // Reset
  });
}
