import { state, updateAppState } from '../core/scene.js';

export function initTheme() {
  const btn = document.getElementById('btn-toggle-theme');
  btn.addEventListener('click', () => {
    const newTheme = state.appState.theme === 'light' ? 'dark' : 'light';
    updateAppState({ theme: newTheme });
    document.documentElement.setAttribute('data-theme', newTheme);
  });
  
  // Initialize
  document.documentElement.setAttribute('data-theme', state.appState.theme);
}
