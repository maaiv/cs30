// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let balls = [];

let grid = [];
let gridBoxSize = 10;
let boundCenter;
let boundRadius = 270;
let xGrids, yGrids;

function setup() {


  createCanvas(windowWidth, windowHeight);
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
  if (balls.length < 1600 && frameCount % 3 === 0) {
    balls.push(new particle(width/2 - 50,height/2 - 30 - 200, balls.length));
    balls.push(new particle(width/2 - 50,height/2 - 20 - 200, balls.length));

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
  fill("black");
  // circle(boundCenter.x, boundCenter.y, boundRadius * 2);
  pop();

  let subdt = 8;
  for (let i = 0; i < subdt; i++) {
    for (let ball of balls) {
      ball.accelerate();
      ball.update(1/subdt);
      ball.collide();
      ball.constrain();
      
      if (i === subdt - 1) {
        ball.draw();
      }
    }
  }
    
}




class particle {
  constructor(xCor, yCor, i) {
    this.pos = createVector(xCor, yCor);
    this.oldpos = createVector(xCor-0.5, yCor);

    this.friction = 0.99;
    this.groundFriction = 1;
    this.gravity = createVector(0, 0.2);
    this.radius = 5;
    this.colour = "grey";
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
  collide() {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {

        for (let otherBallIndex of grid[constrain(this.gridY + dy, 0, yGrids - 1)][constrain(this.gridX + dx, 0, xGrids - 1)]) {
          let otherball = balls[otherBallIndex];
          if (otherball !== this) {
            if (this.pos.dist(otherball.pos) < this.radius * 2) {
              let collisionAxis = p5.Vector.sub(this.pos, otherball.pos);
              let delta = this.radius - collisionAxis.mag()/2;
              
              this.pos.add(collisionAxis.setMag(delta));
              otherball.pos.sub(collisionAxis.setMag(delta));
    
            }
          }
        }
      }
    }
    // for (let otherball of balls) {
    //   if (otherball !== this) {
    //     if (this.pos.dist(otherball.pos) < this.radius * 2) {
    //       let collisionAxis = p5.Vector.sub(this.pos, otherball.pos);
    //       let delta = this.radius - collisionAxis.mag()/2;

          
    //       this.pos.add(collisionAxis.setMag(delta));
    //       otherball.pos.sub(collisionAxis.setMag(delta));

    //     }
    //   }
    // }
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
    circle(this.pos.x, this.pos.y, this.radius * 2);
  }
}

