import { state, updateAppState } from '../core/scene.js';
import { commitToHistory } from '../core/history.js';

export function initShare() {
  const shareBtn = document.getElementById('btn-share');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', () => {
    try {
      const data = {
        elements: state.elements,
        appState: {
          theme: state.appState.theme
        }
      };
      
      const json = JSON.stringify(data);
      const base64 = btoa(encodeURIComponent(json));
      
      const url = new URL(window.location.href);
      url.hash = `state=${base64}`;
      
      navigator.clipboard.writeText(url.toString()).then(() => {
        const originalText = shareBtn.textContent;
        shareBtn.textContent = 'Copied!';
        setTimeout(() => {
          shareBtn.textContent = originalText;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy to clipboard', err);
        alert('Failed to copy share link to clipboard.');
      });
    } catch (e) {
      console.error('Failed to generate share link', e);
      alert('Failed to generate share link. Drawing might be too large.');
    }
  });
}

export function loadFromHash() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#state=')) {
    try {
      const base64 = hash.substring(7);
      const json = decodeURIComponent(atob(base64));
      const data = JSON.parse(json);
      
      if (data && Array.isArray(data.elements)) {
        state.elements = data.elements;
        if (data.appState && data.appState.theme) {
          state.appState.theme = data.appState.theme;
          document.documentElement.setAttribute('data-theme', data.appState.theme);
        }
        
        // Trigger render
        updateAppState({});
        
        // Commit to initial history state
        commitToHistory();
      }
    } catch (e) {
      console.error('Failed to load from hash', e);
      // Clean up invalid hash
      window.history.replaceState(null, '', window.location.pathname);
    }
  }
}
