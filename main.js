const canvas = document.getElementById("maze-canvas");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");
const infoEl = document.getElementById("maze-info");
const nextBtn = document.getElementById("next-maze");

const CELL_COLOR_WALL = "#1f2833";
const CELL_COLOR_PATH = "#0b0c10";
const CELL_COLOR_PLAYER = "#66fcf1";
const CELL_COLOR_EXIT = "#ffb347";

let currentMaze = null;
let player = { x: 0, y: 0 };
let cellSize = 0;

function getSolvedMazeIds() {
  const raw = localStorage.getItem("solvedMazes");
  return raw ? JSON.parse(raw) : [];
}

function setSolvedMazeIds(ids) {
  localStorage.setItem("solvedMazes", JSON.stringify(ids));
}

function pickRandomUnsolvedMaze() {
  const solved = new Set(getSolvedMazeIds());
  const unsolved = MAZES.filter(m => !solved.has(m.id));
  if (unsolved.length === 0) return null;
  const idx = Math.floor(Math.random() * unsolved.length);
  return unsolved[idx];
}

function loadMaze() {
  currentMaze = pickRandomUnsolvedMaze();
  if (!currentMaze) {
    statusEl.textContent = "You’ve solved all available mazes!";
    infoEl.textContent = "Add more mazes to mazes.js to continue.";
    nextBtn.disabled = true;
    return;
  }

  player = { ...currentMaze.start };
  cellSize = Math.min(
    canvas.width / currentMaze.width,
    canvas.height / currentMaze.height
  );

  infoEl.textContent = `Maze #${currentMaze.id} — ${currentMaze.width}×${currentMaze.height}`;
  statusEl.textContent = "Use arrow keys or WASD to move.";
  nextBtn.disabled = true;

  drawMaze();
}

function drawMaze() {
  if (!currentMaze) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < currentMaze.height; y++) {
    for (let x = 0; x < currentMaze.width; x++) {
      const ch = currentMaze.grid[y][x];
      const isWall = ch === "#";
      ctx.fillStyle = isWall ? CELL_COLOR_WALL : CELL_COLOR_PATH;
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // Exit
  ctx.fillStyle = CELL_COLOR_EXIT;
  ctx.fillRect(
    currentMaze.end.x * cellSize,
    currentMaze.end.y * cellSize,
    cellSize,
    cellSize
  );

  // Player
  ctx.fillStyle = CELL_COLOR_PLAYER;
  ctx.beginPath();
  ctx.arc(
    player.x * cellSize + cellSize / 2,
    player.y * cellSize + cellSize / 2,
    cellSize * 0.35,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function canMoveTo(x, y) {
  if (!currentMaze) return false;
  if (x < 0 || y < 0 || x >= currentMaze.width || y >= currentMaze.height) {
    return false;
  }
  return currentMaze.grid[y][x] !== "#";
}

function handleMove(dx, dy) {
  if (!currentMaze) return;

  const nx = player.x + dx;
  const ny = player.y + dy;

  if (!canMoveTo(nx, ny)) return;

  player.x = nx;
  player.y = ny;
  drawMaze();

  if (player.x === currentMaze.end.x && player.y === currentMaze.end.y) {
    onMazeSolved();
  }
}

function onMazeSolved() {
  statusEl.textContent = "Maze solved! 🎉";
  const solved = getSolvedMazeIds();
  if (!solved.includes(currentMaze.id)) {
    solved.push(currentMaze.id);
    setSolvedMazeIds(solved);
  }
  nextBtn.disabled = false;
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (["arrowup", "w"].includes(key)) {
    handleMove(0, -1);
  } else if (["arrowdown", "s"].includes(key)) {
    handleMove(0, 1);
  } else if (["arrowleft", "a"].includes(key)) {
    handleMove(-1, 0);
  } else if (["arrowright", "d"].includes(key)) {
    handleMove(1, 0);
  }
});

nextBtn.addEventListener("click", () => {
  loadMaze();
});

loadMaze();
