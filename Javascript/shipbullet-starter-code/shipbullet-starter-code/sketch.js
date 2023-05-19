// OOP Pair Programming Starter Code
// Johnson & Kevin <3
// May 5 2022


// ------------------------------------------------------------------------- //
// You don't need to edit this section...

let enterprise;
let shipImage, bulletImage;
let bullets = [];
let asteroids = [];

function preload() {
  shipImage = loadImage("assets/enterprise.png");
  bulletImage = loadImage("assets/laser-shot.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  enterprise = new Ship(width/2, height/2, shipImage);
}

function draw() {
  background("black");
  for (let asteroid of asteroids) {
    asteroid.update();
    asteroid.display();
  }

  for (let bullet of bullets) {
    bullet.update();
    bullet.display();

    for (let asteroid of asteroids) {
      if (dist(bullet.x, bullet.y, asteroid.x, asteroid.y) < 15 * asteroid.size) {
        bullet.y = -1;
        asteroid.explode();
      }



    }
  }

  

  bullets = bullets.filter(bullet => bullet.y > 0);

  enterprise.update();
  enterprise.display();

  if (frameCount % 120 === 0) {
    asteroids.push(new Asteroid(random(0, width), 0, random(-1,1), random(0.5,1.5), round(random(2,4))));

  }
}

function keyPressed() {
  enterprise.handleKeyPress();
}

// ------------------------------------------------------------------------- //
// Start editing here!

class Ship {
  constructor(x, y, theImage) {
    // define the variables needed for this ship
    this.x = x;
    this.y = y;
    this.shipImage = theImage;
  }

  update() {
    // move ship -- you might want to use the keyIsDown() function here
    
    this.x += (keyIsDown(RIGHT_ARROW) - keyIsDown(LEFT_ARROW)) * 5;
    
    if (this.x + this.shipImage.width/2 <= 0) {
      this.x = windowWidth + this.shipImage.width/2 - 1;
    }
    if (this.x - this.shipImage.width/2 >= windowWidth) {
      this.x = -this.shipImage.width/2 + 1;
    }

    this.y += ((this.y + this.shipImage.height/2 < windowHeight ? keyIsDown(DOWN_ARROW) : 0) - (this.y - this.shipImage.height/2 > 0 ? keyIsDown(UP_ARROW) : 0)) * 5;

    this.x += (keyIsDown(68) - keyIsDown(65)) * 5;
    this.y += ((this.y + this.shipImage.height/2 < windowHeight ? keyIsDown(83) : 0) - (this.y - this.shipImage.height/2 > 0 ? keyIsDown(87) : 0)) * 5;

    // if doing extra for experts, show bullet(s)
  }

  display() {
    // show the ship
    image(this.shipImage, this.x, this.y);
  }

  handleKeyPress() {
    if (key === "j") {
      bullets.push(new Bullet(this.x, this.y - this.shipImage.height/2, 0, -6, bulletImage));
      bullets.push(new Bullet(this.x, this.y - this.shipImage.height/2, 2, -6, bulletImage));
      bullets.push(new Bullet(this.x, this.y - this.shipImage.height/2, -2, -6, bulletImage));
    } 
    // you only need to use this if you are doing the extra for experts...
    // if you are, you should make a bullet if the space key was pressed
  }
}

// ------------------------------------------------------------------------- //

// Extra for Experts 
//  - you can instantiate a bullet (or a bullet array) within the Ship class,
//    and call the display and update functions in the logical location of the 
//    Ship class. If you create an array of bullets, you might want to think about
//    when the bullets should be removed from the array...

class Bullet {
  constructor(x, y, dx, dy, theImage) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.bulletImage = theImage;
    // define the variables needed for the bullet here
  }

  update() {
    // what does the bullet need to do during each frame? how do we know if it is off screen?
    this.x += this.dx;
    this.y += this.dy;
  
  }

  display() {
    // show the bullet
    image(this.bulletImage, this.x, this.y);
  }

  isOnScreen() {
    // check if the bullet is still on the screen
    
  }
}

class Asteroid {
  constructor(x, y, dx, dy, size) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  display() {
    circle(this.x, this.y, 30 * this.size);
  }

  explode() {
    if (this.size > 2) {
      asteroids.push(new Asteroid(this.x, this.y, this.dx + 0.5, this.dy, this.size - 1));
      asteroids.push(new Asteroid(this.x, this.y, this.dx - 0.5, this.dy, this.size - 1));

    }

    this.y = 10000;

    
  }
}
