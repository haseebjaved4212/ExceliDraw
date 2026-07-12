import { state, updateAppState } from './scene.js';

let undoStack = [];
let redoStack = [];

export function commitToHistory() {
  const currentSnapshot = JSON.stringify(state.elements);
  
  // Don't push if it's the exact same state as the last one
  if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== currentSnapshot) {
    undoStack.push(currentSnapshot);
    redoStack = []; // Any new action invalidates future redos
  }
}

export function undo() {
  if (undoStack.length > 1) {
    // Pop current state
    const currentSnapshot = undoStack.pop();
    redoStack.push(currentSnapshot);
    
    // Peek previous state
    const previousSnapshot = undoStack[undoStack.length - 1];
    state.elements = JSON.parse(previousSnapshot);
    
    updateAppState({ selectedElementIds: [] }); // Clear selection on undo
  }
}

export function redo() {
  if (redoStack.length > 0) {
    const nextSnapshot = redoStack.pop();
    undoStack.push(nextSnapshot);
    
    state.elements = JSON.parse(nextSnapshot);
    updateAppState({ selectedElementIds: [] });
  }
}
