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
  [0, 0, 2, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 0, 0, 0, 9],
];



function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

}

function draw() {

  resizeCanvas(windowWidth,windowHeight);
  if (width < height) { 
    cellSize = width/ROWS;
  }
  else {
    cellSize = height/COLS;
  }
  background(200);
  displayGrid();
  getPossibilities()
}

function displayGrid() {
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      square(x * cellSize, y * cellSize, cellSize);
      if (grid[y][x] !== 0) {
        push();

        fill("black");
        textSize(cellSize * 0.6);
        text(String(grid[y][x]), x * cellSize, y * cellSize + cellSize/20,  cellSize,  cellSize);
        pop();
      }
    }
  }
}

function getPossibilities(xPos, yPos, value) {
  if (grid[yPos].includes(value)) {
    return false;
  }

  else if (grid.map(x => x[xPos])) {
    return false;
  }
}

