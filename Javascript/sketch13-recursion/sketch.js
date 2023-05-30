// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let recursions = 1;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  push();
  translate(0,0.5,0);
  sphere(10);
  pop();
  background(200);
  orbitControl();
  drawTriangles(2, 0, 0, 0, 0, createVector(1,0,0), height/2) ;
}

function drawTriangles(depth, x, y, z, rot, axis, size) {
  push();
  scale(size);
  translate(x, y, z);
  rotate(rot, axis);
  triangle(-0.5, -Math.sqrt(3)/4, 0.5, -Math.sqrt(3)/4, 0, Math.sqrt(3)/4);
  pop();

  if (depth === 1) {
    push();

    translate(x, y, z);
    rotate(rot, axis);
    scale(size);
    triangle(-0.5, -Math.sqrt(3)/4, 0.5, -Math.sqrt(3)/4, 0, Math.sqrt(3)/4);
    pop();
  }
  else {
    drawTriangles(depth - 1, x, y + size * Math.sqrt(3)/3, z, rot, axis, size/2);
  }
  

}
