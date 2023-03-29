let arenaGrid = [];
let xBow;

function preload() {
  xBow = loadImage("assets/xbow.gif");
}

function setup() {
  createCanvas(700, 600);
  
  for (let y = 0; y < 32; y++) { 
    arenaGrid.push([]);
    for (let x = 0; x < 18; x++) {
      if (y === 15 && !(x === 3 || x === 14) || y === 16 && !(x === 14 || x === 3) || y === 0 && x < 6 || y === 0 && x > 11 || y === 31 && x < 6 || y === 31 && x > 11) {
        arenaGrid[y].push(0);
      }
      else {
        arenaGrid[y].push(1);
      }
    }
  }
  console.log(arenaGrid);
  xBow.delay(100);
}

function draw() {

  image(xBow, 100, 100, 200, 200);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 18; x++) {
      if (arenaGrid[y][x] === 1) {
        square(x * height/32,y * height/32,height/32);
      } 
    }
  }
  image(xBow, 100, 100, 200, 200);
  console.log(xBow);
}

class troop {
  constructor(x, y, character) {
    this.x = x;
    this.y = y;
  }
  update() {
    if (frameCount/30 === 0) {
      this.y += 1;
    }
  }
  draw() {

  }
}