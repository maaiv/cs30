// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let bubbles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  bubbles.push(new Bubble());
  noStroke();
}



function draw() {
  background(0);
  push();
  fill("white")
  text(str(round(frameRate())), 10, 10);
  text(str(round(bubbles.length)), 10, 20);
  pop();
  for (let bubble of bubbles) {
    bubble.draw(time);
  }
  time += 0.01;
  bubbles.push(new Bubble());
}


class Bubble {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(5,50);
    this.colour = color(random(255), 255, 255, random(255));
    this.time = 0;
    this.seedX = random(0,100000)/5000;
    this.seedY = random(0,100000)/5000;
    
  }
  update() {
    this.x = noise(this.time + this.seedX) * width;
    this.y = noise(this.time + this.seedY) * height;
    this.time += 0.01;
    
  }

  draw(time){
    push();
    fill(this.colour);
    circle(noise(time + this.seedX) * width,noise(time + this.seedY) * height,this.size);
    pop();
  }
}