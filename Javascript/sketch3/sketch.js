// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"



let rectWidth = 3;
let interval = 0.01;
let t = 0;

let terrain = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  spawnRectangles();
}

function draw() {
  background(255);

}

function spawnRectangles() {
  let t = 0;
  for (let x = 0; x < 2000; x++) {
    let h = noise(t) * height;
    let thisRect = {
      x: x,
      height: h,
    };
    terrain.push(thisRect);
    t += 0.001;
  }
}