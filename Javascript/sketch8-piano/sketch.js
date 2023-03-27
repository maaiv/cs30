// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let keys = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 2; i++) {
    keys.push("white");
    keys.push("black");
  }
  keys.push("white");
  for (let i = 0; i < 3; i++) {
    keys.push("white");
    keys.push("black");
  }
  keys.push("white");
}

function draw() {
  background(220);
  for (let i = 0; i < keys.length; i++) {
    drawKey(keys[i]);
  }
}

function drawKey(type) {
  if (type === "black") {
    drawBlackKey();
    translate(50,0);
  }
  else if (type === "white") {
    drawWhiteKey();
    translate(70,0);
  }
}

function drawWhiteKey() {
  fill(255);
  rect(0, 0, 70, 340);
}

function drawBlackKey() {
  fill(0);
  rect(0, 0, 50, 220);
}