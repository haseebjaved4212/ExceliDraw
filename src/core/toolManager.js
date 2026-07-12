import { state } from './scene.js';
import * as rectangleTool from '../tools/rectangle.js';
import * as ellipseTool from '../tools/ellipse.js';
import * as diamondTool from '../tools/diamond.js';
import * as arrowTool from '../tools/arrow.js';
import * as lineTool from '../tools/line.js';
import * as penTool from '../tools/freedraw.js';

const tools = {
  rectangle: rectangleTool,
  ellipse: ellipseTool,
  diamond: diamondTool,
  arrow: arrowTool,
  line: lineTool,
  pen: penTool
};

export function handlePointerDown(e, canvasCoords) {
  const tool = tools[state.appState.activeTool];
  if (tool && tool.onPointerDown) {
    tool.onPointerDown(e, canvasCoords);
  }
}

export function handlePointerMove(e, canvasCoords) {
  const tool = tools[state.appState.activeTool];
  if (tool && tool.onPointerMove) {
    tool.onPointerMove(e, canvasCoords);
  }
}

export function handlePointerUp(e, canvasCoords) {
  const tool = tools[state.appState.activeTool];
  if (tool && tool.onPointerUp) {
    tool.onPointerUp(e, canvasCoords);
  }
}
