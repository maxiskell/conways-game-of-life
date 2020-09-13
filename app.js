const create2dArray = (rows, cols) =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));

const setupGrid = (rows, cols) => {
  const grid = create2dArray(rows, cols);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = Math.floor(Math.random() * 2);
    }
  }

  return grid;
};

const countAliveNeighbors = (grid, rows, cols) => (row, col) => {
  let sum = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      sum += grid[(row + i + rows) % rows][(col + j + cols) % cols];
    }
  }

  return sum - grid[row][col];
};

const nextGeneration = (rows, cols) => (state) => {
  let next = create2dArray(rows, cols);
  const countNeighbors = countAliveNeighbors(state, rows, cols);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let neighbors = countNeighbors(row, col);

      if (state[row][col] === 0 && neighbors === 3) {
        next[row][col] = 1;
      } else if (state[row][col] === 1 && (neighbors < 2 || neighbors > 3)) {
        next[row][col] = 0;
      } else {
        next[row][col] = state[row][col];
      }
    }
  }

  return next;
};

const createCanvas = (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);

  return canvas;
};

const showState = (ctx, rows, cols, cellSize) => (state) => {
  const color = { alive: "#9ba0f0", dead: "#444" };

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.fillStyle = state[y][x] === 1 ? color.alive : color.dead;
      ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
    }
  }
};

const main = (width, height, cellSize, fps) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const restartButton = document.querySelector("#restart");

  const rows = Math.floor(height / cellSize);
  const cols = Math.floor(width / cellSize);

  const next = nextGeneration(rows, cols);
  const show = showState(ctx, rows, cols, cellSize);

  const speed = 1000 / fps;

  let state = setupGrid(rows, cols);

  const life = () => {
    show(state);
    state = next(state);
  };

  let interval = setInterval(life, speed);

  const restart = () => {
    clearInterval(interval);
    state = setupGrid(rows, cols);
    interval = setInterval(life, speed);
  };

  restartButton.addEventListener("click", restart);
};

main(800, 600, 10, 10);
