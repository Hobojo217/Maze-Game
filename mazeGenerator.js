function generateMaze(width, height) {
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

  maze[1][1] = 0;
  carve(1, 1);

  return maze;
}

function mazeToStringGrid(maze) {
  return maze.map(row =>
    row.map(cell => (cell === 1 ? "#" : ".")).join("")
  );
}

function createGeneratedMaze(width = 21, height = 21) {
  const raw = generateMaze(width, height);
  const grid = mazeToStringGrid(raw);

  return {
    width,
    height,
    start: { x: 1, y: 1 },
    end: { x: width - 2, y: height - 2 },
    grid
  };
}
