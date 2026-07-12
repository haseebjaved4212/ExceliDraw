#  Whiteboard App 

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
- **Selection & Manipulation:**
  - Robust hit-detection for all shapes (including precise point-to-segment math for lines and arrows).
  - Move, scale, and freely rotate any element on the canvas.
- **Eraser Tool:**
  - Instantly delete shapes by dragging over them.
- **Undo & Redo:**
  - Comprehensive history stack mapping every state change.
- **Dark Mode Support:**
  - Instantly toggle between Light and Dark themes. Black strokes automatically invert to remain visible on the dark background.
- **Export & Import:**
  -  **Export as JSON:** Save your entire canvas state to a file.
  -  **Import from JSON:** Load previous sketches effortlessly.
  -  **Export as PNG:** Export a cleanly cropped, high-quality PNG of your current drawing.
- **Keyboard Shortcuts:**
  - `V` or `1` for Select
  - `P` for Pen
  - `E` for Eraser
  - `K` for Laser
  - `R` for Rectangle
  - `O` for Ellipse
  - `D` for Diamond
  - `A` for Arrow
  - `L` for Line
  - `Space` for Panning
  - `Ctrl + Z` for Undo
  - `Ctrl + Y` for Redo

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


## Licence 
- MIT License

--- 

<h3 align="center">
    <img src="https://readme-typing-svg.herokuapp.com?key=1&width=400&height=40&lines=Made+with+%E2%9D%A4%EF%B8%8F+by+Haseeb+Javed" alt="Typing SVG" />
</h3>

