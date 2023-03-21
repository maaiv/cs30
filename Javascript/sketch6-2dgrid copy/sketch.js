// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let grid = [];

const ROWS = 4;
const COLS = 4;
let cellSize = 50; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (width < height) { 
    cellSize = width/COLS;
  }
  else {
    cellSize = height/ROWS;
  }
  grid = createEmpty2dArray(ROWS, COLS);
}

function draw() {

  background(200);

  displayGrid(grid);
}

function displayGrid(grid) {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[x][y]) {
        fill(40,180,255);
      }
      else {
        fill(150,60,205);
      }
      square(x*cellSize, y*cellSize, cellSize);
    }
  }
}

function createEmpty2dArray(ROWS, COLS) {
  let newGrid = [];
  for (let y = 0; y < ROWS; y++) {
    newGrid.push([]);
    for (let x = 0; x < COLS; x++) {
      newGrid[y].push(0);
    }
  }
  return newGrid;
}


function mousePressed() {
  let x = Math.floor(mouseX/cellSize);
  let y = Math.floor(mouseY/cellSize);
  swapSquare(x, y);
  swapSquare(x-1, y);
  swapSquare(x+1, y);
  swapSquare(x, y-1);
  swapSquare(x, y+1);

}

function swapSquare(x, y) {
  if (x < COLS && x > -1 && y < ROWS && y > -1) {
    grid[x][y] = !grid[x][y];
  }
}