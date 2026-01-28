// Generates a perfect maze using DFS backtracking
function generateMaze(width, height) {
  // Maze grid: 1 = wall, 0 = path
  const maze = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 1)
  );

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function carve(x, y) {
    const directions = shuffle([
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ]);

    for (const [dx, dy] of directions) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;

      if (
        ny > 0 &&
        ny < height - 1 &&
        nx > 0 &&
        nx < width - 1 &&
        maze[ny][nx] === 1
      ) {
        maze[y + dy][x + dx] = 0;
        maze[ny][nx] = 0;
        carve(nx, ny);
      }
    }
  }

  // Start carving from (1,1)
  maze[1][1] = 0;
  carve(1, 1);

  return maze;
}

// Converts numeric maze to your string format
function mazeToStringGrid(maze) {
  return maze.map(row =>
    row.map(cell => (cell === 1 ? "#" : ".")).join("")
  );
}

// Creates a full maze object compatible with your MAZES array
function createMazeObject(id, width, height) {
  const raw = generateMaze(width, height);
  const grid = mazeToStringGrid(raw);

  return {
    id,
    width,
    height,
    start: { x: 1, y: 1 },
    end: { x: width - 2, y: height - 2 },
    grid
  };
}

// Example: generate and log a 21×21 maze
// console.log(createMazeObject(99, 21, 21));
