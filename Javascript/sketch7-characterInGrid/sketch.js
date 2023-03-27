// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let bubbles = [];
let grid;
let cellSize;
let characterX = 0, characterY = 0;
let mamun, guest, baba;
const ROWS = 10;
const COLS = 10;

function preload() {
  mamun = loadImage("mamun.jpg");
  guest = loadImage("photo.jpg");  
  baba = loadImage("baba.jpg");
}


function setup() {

  createCanvas(windowWidth, windowHeight);
  if (width < height) { 
    cellSize = width/ROWS;
  }
  else {
    cellSize = height/COLS;
  }
  createRandomGrid();
  noStroke();
  grid = createRandomGrid(ROWS, COLS);

  grid[characterY][characterX] = 9;
  
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
      if (grid[y][x] === 1) {
        image(mamun, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if (grid[y][x] === 0) {
        fill(255);
        image(guest, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if (grid[y][x] === 9) {
        fill("red");
        image(baba, x * cellSize, y * cellSize, cellSize, cellSize);
      }

      
    }
  }
}

function mousePressed() {
  let x = Math.floor(mouseX/cellSize);
  let y = Math.floor(mouseY/cellSize);
  if (grid[y][x] === 1) {
    grid[y][x] = 0;
  }
  else {
    grid[y][x] = 1;
  }
}


function keyTyped() {
  moveCharacter((key === "d") - (key === "a"), (key === "s") - (key === "w"));
  // if (key === "s") {
  //   moveCharacter(0, 1);
  // }
}

function moveCharacter(x, y) {
  if (characterX + x >= 0 && characterX + x <= COLS && characterY + y >= 0 && characterY + y <= ROWS) {
    if (grid[characterY + y][characterX + x] === 0) {
      grid[characterY][characterX] = 0;
      characterX += x;
      characterY += y;
      grid[characterY][characterX] = 9; 
    }
  }
}



function createRandomGrid(ROWS, COLS) {
  let newGrid = [];
  for (let i = 0; i < ROWS; i++) {
    newGrid.push([]);
    for (let j = 0; j < COLS; j++) {
      newGrid[i].push(round(random(0,1)));
    }
  }
  return newGrid;
}