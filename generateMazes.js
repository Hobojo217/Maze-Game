// Import your generator
// If using <script> tags, just include both files in HTML instead

const NEW_MAZES = [];

// Generate 10 new mazes
for (let i = 0; i < 10; i++) {
  const maze = createMazeObject(1000 + i, 21, 21);
  NEW_MAZES.push(maze);
}

console.log(JSON.stringify(NEW_MAZES, null, 2));
