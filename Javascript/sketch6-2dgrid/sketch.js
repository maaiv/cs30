// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let bubbles = [];

let grid = [[0, 0, 1, 1],
            [1, 1, 0, 0],
            [0, 1, 0, 1],
            [1, 1, 1, 1]];

let cellSize;


const ROWS = 16;
const COLS = 16;

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
      if (grid[y][x]) {
        fill(0);
      }
      else {
        fill(255);
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