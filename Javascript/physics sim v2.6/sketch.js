// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let saveImage = false;
let balls = [];


let grid = [];
let gridBoxSize = 11;
let boundCenter;
let boundRadius = 270;
let xGrids, yGrids, mamun;

let ballColours = [];


function preload() {
  mamun = loadImage("mamun.jpg");
  if (!saveImage) {
    ballColours = loadJSON("image.json");
  }
  
}

function setup() {

  createCanvas(1920/2, 1080/2);
  noStroke();
  imageMode(CENTER);
  boundCenter = createVector(width/2,height/2);

  xGrids = ceil(width/gridBoxSize);
  yGrids = ceil(height/gridBoxSize);

  for (let y = 0; y < yGrids; y++) {
    grid.push([]);
    for (let x = 0; x < xGrids; x++) {
      grid[y].push([]);
    }
  }
}

function draw() {
  if (balls.length < 2600 && frameCount % 3 === 0) {
    for (let i = 0; i < 8; i++) {
      if (saveImage) {
        balls.push(new particle(width/2 - 50,height/2 - 200 + i * (gridBoxSize - 1), balls.length, 0));
      }
      else {
        balls.push(new particle(width/2 - 50,height/2 - 200 + i * (gridBoxSize - 1), balls.length, ballColours[balls.length]));
      }

    }
  }
  else if (balls.length === 2600 && saveImage) {
    for (let ball of balls) {
      let c = mamun.get(
        map(ball.pos.x, width/2 - boundRadius, width/2 + boundRadius, 0, mamun.width),
        map(ball.pos.y, height/2 - boundRadius, height/2 + boundRadius, 0, mamun.height));
      ball.colour = c;
      ballColours.push(c);
    }
    saveJSON(ballColours, "mamun");
  }

  background(0);
  
  // push();
  // stroke("white");
  // noFill();
  // for (let y = 0; y < grid.length; y++) {
  //   for (let x = 0; x < grid[y].length; x++) {
  //     push();
  //     if (x === floor(grid[y].length - 1)) {
  //       stroke("orange");
  //     }
  //     rect(x * gridBoxSize, y * gridBoxSize, gridBoxSize, gridBoxSize);
  //     pop();
  //   }
  // }
  // pop();


  push();
  fill("white");
  text(str(round(frameRate())), 10, 10);
  text(str(round(balls.length)), 10, 20);
  pop();

  push();
  fill("grey");
  circle(boundCenter.x, boundCenter.y, boundRadius * 2);
  pop();

  let subdt = 8;
  for (let i = 0; i < subdt; i++) {
    solveCollisons();
    for (let ball of balls) {
      ball.accelerate();
      ball.update(1/subdt);
      
      ball.constrain();
      
      if (i === subdt - 1) {
        ball.draw();
      }
    }
  }
    

  if (keyIsDown(67)) {
    let ratio = boundRadius/mamun.width;
    image(mamun, width/2,height/2);

    for (let ball of balls) {
      let c = mamun.get(ball.pos.x - width/2 + mamun.width/2, ball.pos.y - height/2 + mamun.height/2);
      ball.colour = c;
      ballColours.push(c);
    }
  }
}

function solveCollisons() {
  for (let y = 0; y < yGrids; y++) {
    for (let x = 0; x < xGrids; x++) {
      for (let ballIndex of grid[y][x]) {
        let ball = balls[ballIndex];

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            

            for (let otherBallIndex of grid[constrain(y + dy, 0, yGrids - 1)][constrain(x + dx, 0, xGrids - 1)]) {
              let otherball = balls[otherBallIndex];
              if (otherball !== ball) {
                if (ball.pos.dist(otherball.pos) < ball.radius * 2) {
                  let collisionAxis = p5.Vector.sub(ball.pos, otherball.pos);
                  let delta = ball.radius - collisionAxis.mag()/2;
                  
                  ball.pos.add(collisionAxis.setMag(delta));
                  otherball.pos.sub(collisionAxis.setMag(delta));
        
                }
              }
            }
          }
        }

      }
    }
  }
}

class particle {
  constructor(xCor, yCor, i, col) {
    this.pos = createVector(xCor, yCor);
    this.oldpos = p5.Vector.sub(this.pos, createVector(1,0));


    this.friction = 0.99;
    this.groundFriction = 1;
    this.gravity = createVector(0, 0.2);
    this.radius = 5;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.colour = col;
    this.mass = 1;
    this.acceleration = createVector(0, 0);
    this.gridX = floor(this.pos.x / gridBoxSize) + 1;
    this.gridY = floor(this.pos.y / gridBoxSize) + 1;
    
    this.index = i;
    grid[this.gridY][this.gridX].push(this.index);
  }


  update(dt) {
    let vel = p5.Vector.sub(this.pos, this.oldpos);
    // vel.mult(this.friction);

    this.oldpos.set(this.pos.x, this.pos.y);
    this.pos.add(vel).add(p5.Vector.mult(this.acceleration, dt * dt));
    this.acceleration.set(0,0);

    // this.gridLocation.set(floor(this.pos.x / gridBoxSize), floor(this.pos.y / gridBoxSize));

    if (floor(this.pos.x / gridBoxSize) !== this.gridX || floor(this.pos.y / gridBoxSize) !== this.gridY) {
      let gridIndex = grid[this.gridY][this.gridX].indexOf(this.index);
      
      grid[this.gridY][this.gridX].splice(gridIndex, 1);
      
      this.gridX = floor(this.pos.x / gridBoxSize);
      this.gridY = floor(this.pos.y / gridBoxSize);
      try {
        grid[this.gridY][this.gridX].push(this.index);
      }
      catch(err) {
        console.log(grid[this.gridY][this.gridX], this.gridX, this.gridY);
      }
    }


  }

  accelerate(dt) {
    this.acceleration.add(this.gravity);
  }
  constrain() {
    // if (this.pos.x + this.radius > width - 20) {
    //   this.pos.x = width - this.radius - 20;

    // }
    // if (this.pos.x - this.radius < 20) {
    //   this.pos.x = this.radius + 20;

    // }
    // if (this.pos.y + this.radius > height  - 20) {
    //   this.pos.y = height - this.radius - 20;

    // }
    // if (this.pos.y - this.radius < 20) {
    //   this.pos.y = this.radius + 20;

    // }
    
    let distance = p5.Vector.sub(boundCenter, this.pos).limit(boundRadius - this.radius);
    this.pos.set(p5.Vector.sub(boundCenter, distance));

  }

  applyFriction() {
    if (this.vel.magSq() > 0.000001) {
      let m = this.vel.mag();
      this.vel.x /= m;
      this.vel.y /= m;
      this.vel.mult(m * this.friction);  
    }
  }
    
  draw() {
    push();
    fill(this.colour);

    circle(this.pos.x, this.pos.y, this.radius * 2);
    pop();
  }
}

