// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let bubbles = [];



let cellSize;


const ROWS = 9;
const COLS = 9;

let grid = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 3, 0, 8, 5],
  [0, 0, 1, 0, 2, 0, 0, 0, 0],
  [0, 0, 0, 5, 0, 7, 0, 0, 0],
  [0, 0, 4, 0, 0, 0, 1, 0, 0],
  [0, 9, 0, 0, 0, 0, 0, 0, 0],
  [5, 0, 0, 0, 0, 0, 0, 7, 3],
  [0, 0, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 0, 0, 0, 9],
];



function setup() {
  createCanvas(windowWidth, windowHeight);
  createRandomGrid();
  noStroke();
}

function draw() {
  if (keyIsDown(32)) {
    grid = createRandomGrid(ROWS, COLS);
  }
  resizeCanvas(windowWidth,windowHeight);
  if (width < height) { 
    cellSize = width/ROWS;
  }
  else {
    cellSize = height/COLS;
  }
  background(200);
  displayGrid();
}

function displayGrid() {
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      if (grid[y][x] !== 0) {
        text(grid[y][x], x * cellSize, y * cellSize, cellSize, cellSize);
      }
      square(x * cellSize, y * cellSize, cellSize);
      
    }
  }
}

function mousePressed() {
  let x = Math.floor(mouseX/cellSize);
  let y = Math.floor(mouseY/cellSize);
  grid[y][x] = !grid[y][x];
}

function createRandomGrid(ROWS, COLS) {
  let newGrid = [];
  for (let i = 0; i < ROWS; i++) {
    newGrid.push([]);
    for (let j = 0; j < COLS; j++) {
      newGrid[i].push(round(random(0,2)));
    }
  }
  return newGrid;
}