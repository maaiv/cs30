// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let balls = [];

let boundCenter;
let boundRadius = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  boundCenter = createVector(width/2, height/2);
  for (let i = 0; i < 10; i++) {
    balls.push(new particle(width/2 + random(-150,150),height/2));
  }
  
}

function draw() {
  
  background(220);
  push();
  fill("black");
  circle(boundCenter.x, boundCenter.y, boundRadius * 2);
  pop();
  for (let ball of balls) {
    ball.update();
    ball.constrain();
    ball.draw();
  }
}




class particle {
  constructor(xCor, yCor) {
    this.pos = createVector(xCor, yCor);
    this.oldpos = createVector(xCor, yCor);

    this.friction = 1;
    this.groundFriction = 1;
    this.gravity = createVector(0, 0.1);
    this.radius = 5;
    this.colour = "grey";
    this.mass = 1;
  }


  update() {
    let vel = p5.Vector.sub(this.pos, this.oldpos);
    vel.mult(this.friction);


    if (this.pos.y + this.radius >= height && vel.magSq() > 0.000001) {
      let m = vel.mag();
      vel.x /= m;
      vel.y /= m;
      vel.mult(m * this.groundFriction);  
    }

    this.oldpos.set(this.pos.x, this.pos.y);
    this.pos.add(vel);
    this.pos.add(this.gravity);
  }
  constrain() {
    // if (this.pos.x + this.radius > width) {
    //   this.pos.x = width - this.radius;
    // }
    // if (this.pos.x - this.radius < 0) {
    //   this.pos.x = this.radius;
    // }
    // if (this.pos.y + this.radius > height) {
    //   this.pos.y = height - this.radius;
    // }
    // if (this.pos.y - this.radius < 0) {
    //   this.pos.y = this.radius;
    // }

    let distance = p5.Vector.sub(boundCenter, this.pos).limit(boundRadius - this.radius);
    this.pos.set(p5.Vector.sub(boundCenter, distance));

    // collide() {
    //   this.pos
    // }
    
  }
  draw() {
    circle(this.pos.x, this.pos.y, this.radius * 2);
  }
}

