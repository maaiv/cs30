// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let balls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 5000; i++) {
    balls.push(new ball(random(0, width), random(30, height)));
  }

}

function draw() {

  background(20);

  push();
  fill("white");
  text(str(round(frameRate())), 10, 10);
  text(str(round(balls.length)), 10, 20);
  pop();


  for (let ball of balls) {
    ball.draw();
  }

}
    

class ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    circle(this.x, this.y, 10);
  }
}