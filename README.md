#  Whiteboard App 🎨

A lightweight, high-performance, infinite canvas drawing application built entirely from scratch with **Vanilla JavaScript**, **HTML5 Canvas**, and **Vite**. Inspired by Excalidraw, this project demonstrates how to build a complex state-driven rendering loop without heavy frontend frameworks.

## ✨ Features

- **Infinite Canvas:** Middle-click and drag (or hold Space) to pan around freely. Zoom in and out infinitely using `Ctrl + Scroll`.
- **Multiple Tool Types:**
  -  Rectangle
  -  Ellipse
  -  Diamond
  -  Arrow
  -  Line
  -  Pen (with pressure sensitivity via `perfect-freehand`)
  -  Laser Pointer (with a beautifully animated, fading glowing trail)
- **Styling System:**
  - Live color picking for **Stroke** and **Background**.
  - Transparent backgrounds supported.
- **Dark Mode Support:**
  - Instantly toggle between Light and Dark themes. Black strokes automatically invert to remain visible on the dark background.
- **Export & Import:**
  -  **Export as JSON:** Save your entire canvas state to a file.
  -  **Import from JSON:** Load previous sketches effortlessly.
  -  **Export as PNG:** Export a cleanly cropped, high-quality PNG of your current drawing.
- **Keyboard Shortcuts:**
  - `P` for Pen
  - `K` for Laser
  - `R` for Rectangle
  - `E` for Ellipse
  - `D` for Diamond
  - `A` for Arrow
  - `L` for Line
  - `Space` for Panning

##  Tech Stack

- **Core:** Plain HTML, CSS, Vanilla ES Modules
- **Rendering:** HTML5 `<canvas>` API with a custom scene graph and render loop
- **Dependencies:** 
  - [`perfect-freehand`](https://www.npmjs.com/package/perfect-freehand) - For beautiful, variable-width freehand strokes.
- **Tooling:** Vite for fast local development and bundling.

##  Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository (or download the files).
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the Vite development server:
```bash
npm run dev
```

Open `http://localhost:5173/` in your browser.

##  Project Architecture

- `src/core/scene.js`: The "brain" of the app. Holds the global `state` (shapes, pan/zoom, active colors) and triggers renders.
- `src/core/canvas.js`: The rendering engine. Clears the screen and redraws everything based on `scene.js` on every frame/change. Handles zoom math and panning.
- `src/core/toolManager.js`: The router for mouse/pointer events. Delegates clicks and drags to the currently active tool.
- `src/tools/`: Individual tool logic (e.g., `rectangle.js`, `freedraw.js`, `laser.js`).
- `src/ui/`: Handles the DOM UI components (toolbar, color pickers, theme toggle).
- `src/features/`: Complex sub-features like Exporting and Importing data.

##  Roadmap (Upcoming Features)

- [ ] **Selection Tool:** Move, resize, and rotate existing elements.
- [ ] **Eraser Tool:** Easily delete shapes by drawing over them.
- [ ] **Undo / Redo:** Complete history stack.
- [ ] **Snapping:** Align shapes cleanly.
