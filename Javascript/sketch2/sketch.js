// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let boxes = [];
let boxLength = 5;


function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  colorMode(HSB,255);
  angleMode(DEGREES);
  for (let x = boxLength; x < (windowWidth/boxLength - 1) * boxLength; x += boxLength) {
    for (let y = boxLength; y < (windowHeight/boxLength - 1) * boxLength; y += boxLength) {
      boxes.push(new Box(x,y,boxLength,random(-y/boxLength,y/boxLength)/5, color((x*y)/100 % 255, 255,255)));
    }
  }
  for (box of boxes) {
    push();
    translate(box.x, box.y);
    rotate(box.rot);
    stroke(box.c);
    square(0, 0, box.l);
    pop();
  }
}

function draw() {


}

class Box {
  constructor(x, y, l, r, c) {
    this.x = x;
    this.y = y;
    this.l = l;
    this.rot = r;
    this.c = c;
  }
}