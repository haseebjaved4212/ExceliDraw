export const state = {
  elements: [],
  laserTrails: [],
  appState: {
    zoom: 1,
    scrollX: 0,
    scrollY: 0,
    activeTool: 'select',
    selectedElementIds: [],
    currentColor: '#1e1e1e',
    currentFill: 'transparent',
    theme: 'light'
  }
};

let renderCallback = null;

export function setRenderCallback(cb) {
  renderCallback = cb;
}

export function updateAppState(updates) {
  state.appState = { ...state.appState, ...updates };
  if (renderCallback) renderCallback();
}

export function addElement(element) {
  state.elements.push(element);
  if (renderCallback) renderCallback();
}

export function updateElement(id, updates) {
  const element = state.elements.find(el => el.id === id);
  if (element) {
    Object.assign(element, updates);
    if (renderCallback) renderCallback();
  }
}
