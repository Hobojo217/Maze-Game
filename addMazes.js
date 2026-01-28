// addMazes.js
const fs = require("fs");
const path = require("path");

const MAZES = require("./mazes.js");
const { createMazeObject } = require("./mazeGenerator.js");

const FILE_PATH = path.join(__dirname, "mazes.js");

// How many new mazes to generate
const COUNT = 10;

// Maze size
const WIDTH = 21;
const HEIGHT = 21;

// Find the next available ID
let nextId = Math.max(...MAZES.map(m => m.id)) + 1;

// Generate new mazes
for (let i = 0; i < COUNT; i++) {
  const maze = createMazeObject(nextId++, WIDTH, HEIGHT);
  MAZES.push(maze);
}

console.log(`Generated ${COUNT} new mazes.`);

// Write updated file
const output =
  "const MAZES = " +
  JSON.stringify(MAZES, null, 2) +
  ";\n\nmodule.exports = MAZES;\n";

fs.writeFileSync(FILE_PATH, output);

console.log("mazes.js updated successfully.");
