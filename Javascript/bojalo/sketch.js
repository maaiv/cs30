// 3D Amongst Us
// Johnson Ji
// March 19th, 2023
//
// Controls: 


// Extra for Experts:



// Instantiating variables
let camYaw = 0; //x
let camPitch = 0; //y
let camDistance = 1;

let my, guests, shared, killSFX, cam, collideVisualCanvas, lightpos;


// Create environment objects
let hostTerrain = [
  {type: "box", x: 0, y: 50, z: 0, width: 3600, height: 100, length: 3600},
];



// Connect to the server and shared data, and load sounds
function preload() {
  partyConnect("wss://demoserver.p5party.org", "jalo");
  my = partyLoadMyShared();
  guests = partyLoadGuestShareds();
  shared = partyLoadShared("shared", {
    ambientLevel: 100, 
    debugState: false, 
    terrain: hostTerrain, 
    lightSize: 10,
    playerAcceleration: 1,
    playerDeceleration: 0.9,
    playerMaxVelocity: 6,
    playerJumpPower: 5,
    worldGravity: 0.15,
  });
  killSFX = loadSound("assets/killSFX.mp3");
  partySubscribe("die", die);
}

// Set sketch modes, canvas, and subscribe to die message
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  colorMode(HSB, 255);
  cam = createCamera();


  // instantiate player object and hitbox visual
  my.player = new Crewmate(0,0,0,0,0);
  
  collideVisualCanvas = createGraphics(180,180);


  // log shared data
  console.log("me", JSON.stringify(my));
  console.log("guests", JSON.stringify(guests));
  console.log("am i host?", partyIsHost());
} 


// Game update loop
function draw() {
  drawInit();

  collideVisual();

  updateMyPlayer();

  updateCam();

  createLights();

  drawPlayers();

  drawBullets();

  drawEnvironment();
}

// Set background and lock pointer light
function drawInit() {
  background(150, 100, 255);
 
  // create a global light so WEBGL doesn't just break when there are no lights
  pointLight(
    0, 0, shared.ambientLevel,
    0, -1900, 0
  );
  ambientLight(shared.ambientLevel/2);

  if (mouseIsPressed) {
    requestPointerLock();
  }
}



// Creates a visualizer for the different hitboxes and colliders above the player if in debug mode
function collideVisual() {
  if (shared.debugState) {
    collideVisualCanvas.background(255);
    // draw environment hitboxes
    for (let terrainObject of shared.terrain) {
      push();
      if (terrainObject.type === "box") {
        let boxMiniX = (terrainObject.x - terrainObject.width/2)/10 + 90;
        let boxMiniZ = (terrainObject.z - terrainObject.length/2)/10 + 90;
        collideVisualCanvas.rect(boxMiniX, boxMiniZ, terrainObject.width/10, terrainObject.length/10);
      }
      if (terrainObject.type === "cylinder") {
        let cylinderMiniX = terrainObject.x/10 + 90;
        let cylinderMiniZ = terrainObject.z/10 + 90;
        collideVisualCanvas.circle(cylinderMiniX,cylinderMiniZ,terrainObject.radius/5);
      }
      pop();
    }

    // draw character hitboxes
    for (let guest of guests) {
      collideVisualCanvas.circle(guest.player.x/10 + 90,guest.player.z/10 + 90, 6);
      collideVisualCanvas.circle(guest.player.x/10 + 90 + sin(guest.player.dir) * 3, guest.player.z/10 + 90 + cos(guest.player.dir) * 3, 2);
    }

    //draw visualizer above the player model
    push();
    translate(my.player.x - 50,my.player.y-65 - 100,my.player.z);
    image(collideVisualCanvas,0,0,100,100);
    pop();
  }
}

// Update local player
function updateMyPlayer() {
  my.player.update();
}

// Move camera
function updateCam() {

  cam.setPosition(
    my.player.x + cos(camYaw) * cos(camPitch),
    my.player.y - 60 + sin(camPitch),
    my.player.z + sin(camYaw) * cos(camPitch),
  );
  camYaw += movedX/10;
  camPitch -= movedY/10;

  cam.lookAt(my.player.x,my.player.y - 60,my.player.z);

  if (camPitch > 89) {
    camPitch = 89;
  }
  else if (camPitch < -89) {
    camPitch = -89;
  }

}

// Create and store xy coordinate of each player light
function createLights() {
  lightpos = [];

  // for (let guest of guests) {
  //   if (guest.player.hold === 1) {
  //     spotLight(
  //       0,0,255,
  //       guest.player.x,guest.player.y - 400,guest.player.z,
  //       0,1,0,
  //       85,40/shared.lightSize
  //     );
  //     lightpos.push([guest.player.x,guest.player.z]);
  //   }
  // }
}

// Calculate ambient lighting and draw player models
function drawPlayers() {
  for (let guest of guests) {
    if (guest.player !== my.player) {
      push();
      // calculate ambient lighting depending on the closest distance to another light before rendering
      // let minimumDistance = min(lightpos.map(v => dist(guest.player.x,guest.player.z,v[0], v[1])));
      // ambientLight(map(minimumDistance,0,125 + 50*shared.lightSize,105,5,true));
      ambientLight(100);
      drawCrewMateModel(guest.player.x,guest.player.y,guest.player.z,guest.player.dir,guest.player.h,guest.player.hold,guest.player.alive);
      pop();
    }
  }

  // draw demo player model if in debug mode
  if (shared.debugState) {
    push();
    // let minimumDistance = min(lightpos.map(v => dist(0, 0, v[0], v[1])));
    // ambientLight(map(minimumDistance, 0, 125 + 50 * shared.lightSize, 105, 5, true));
    ambientLight(100);
    drawCrewMateModel(0,0,0,0,180,2,false);
    pop();
  }
}

function drawBullets() {
  for (let guest of guests) {
    for (let bullet of guest.player.bullets) {
      push();

      translate(bullet.startx, bullet.starty, bullet.startz);

      line(0, 0, 0, bullet.endx - bullet.startx, bullet.endy - bullet.starty, bullet.endz - bullet.startz);
      bullet.update();
      pop();
        
    }
  }
}

// Draw player model
function drawCrewMateModel(x,y,z,dir,h,hold,alive) {
  
  push();
  
  
  // inititalize materials and position
  noStroke();
  specularMaterial(25);
  shininess(10000);
  ambientMaterial(h, 255, 255);
  translate(x,y-36,z);
  rotateY(dir);
  if (alive) {
    // draw main body

    ellipsoid(25,30,20);
    
    // draw helmet
    push();
    specularMaterial(300);
    shininess(20);
    ambientMaterial(0,0,0);

    translate(0,-10,14);
    ellipsoid(15,10,13);
    pop();

    // draw legs
    push();
    translate(12,18,0);
    ellipsoid(8,18,8);
    translate(-24,0,0);
    ellipsoid(8,18,8);
    pop();
    // draw oxygen tank
    push();
    translate(0,0,-18);
    box(24,35,8);
    pop();

    if (hold === 2) {
      // draw knife
      push();
      ambientMaterial(0,120,255);
      translate(16,8,15);
      rotateY(-90);

      box(20,6,2);
      translate(22,0,0);
      rotateZ(-90);

      ambientMaterial(0,120,60);
      scale(1,1,0.3);
      cone(8,30,5,0);
      pop();
    }
  
  }
  else {
    // draw main body
    push();
    translate(0,15,0);
    ellipsoid(20,15,15);
    scale(1, 1, 0.75);
    translate(0,-9,0);
    cylinder(20,16);
    pop();
    push();
    translate(12,18,0);
    ellipsoid(8,18,8);
    translate(-24,0,0);
    ellipsoid(8,18,8);
    pop();

    // draw bone sticking out
    push();
    specularMaterial(30000);
    shininess(100);
    ambientMaterial(0,0,255);
    translate(0,-5,0);
    cylinder(4,20);

    translate(3,-9,0);
    sphere(5);
    translate(-6,0,0);
    sphere(5);
    pop();

    // draw oxygen tank
    push();
    translate(0,8,-14);
    box(24,20,10);
    pop();
  }
  pop();
}

// Draw terrain
function drawEnvironment() {

  for (let terrainObject of shared.terrain) {
    push();
    if (!shared.debugState) {
      noStroke();
    }
    translate(terrainObject.x,terrainObject.y,terrainObject.z);
    if (terrainObject.type === "box") {
      box(terrainObject.width,terrainObject.height,terrainObject.length);
    }
    else if (terrainObject.type === "cylinder") {
      cylinder(terrainObject.radius,terrainObject.height);
    }
    pop();
  }

  // create axes if in debug mode
  if (shared.debugState) {
    push();
    stroke("red"); // x
    line(-900,0,0,900,0,0);
    stroke("blue"); // y
    line(0,-900,0,0,900,0);
    stroke("yellow"); // z
    line(0,0,-900,0,0,900);
    pop();
  }
}

// Check if a player is intersecting with the terrain
function checkCollisions(playerX,playerY,playerZ,PlayerRadius, PlayerHeight, terrainObject) {
  if (terrainObject.type === "box") {
    if (collideRectCircle(
      terrainObject.x - terrainObject.width/2, 
      terrainObject.z - terrainObject.length/2,
      terrainObject.width,
      terrainObject.length,
      playerX,
      playerZ,
      PlayerRadius
    )) {
      return playerY > terrainObject.y - terrainObject.height/2 && playerY - PlayerHeight < terrainObject.y + terrainObject.height/2;
    }
  }
  else if (terrainObject.type === "cylinder") {
    if (collideCircleCircle(
      terrainObject.x,
      terrainObject.z,
      terrainObject.radius * 2,
      playerX,
      playerZ,
      PlayerRadius
    )) {
      return playerY > terrainObject.y - terrainObject.height/2 && playerY - PlayerHeight < terrainObject.y + terrainObject.height/2;
    }
  }
  return false;
}

// Calculate the normal angle between the player and the collided object
function findNormal(playerX,playerZ,playerDir,terrainObject) {
  let normalCollide;

  // set collide type
  if (terrainObject.type === "box") {
    normalCollide = (x, z, dir, terrainObject) => collidePointRect(
      x + sin(dir) * 40,
      z + cos(dir) * 40,
      terrainObject.x - terrainObject.width/2, 
      terrainObject.z - terrainObject.length/2,
      terrainObject.width,
      terrainObject.length,
    );
  }
  else if (terrainObject.type === "cylinder") {
    normalCollide = (x, z, dir, terrainObject) => collidePointCircle(
      x + sin(dir) * 40,
      z + cos(dir) * 40,
      terrainObject.x, 
      terrainObject.z,
      terrainObject.radius * 2,
    );
  }

  let tempDir = playerDir;
  let dir1;
  let dir2;
  if (normalCollide(playerX,playerZ,tempDir,terrainObject)) {

    // find right-most point
    while (normalCollide(playerX,playerZ,tempDir,terrainObject)) {
      tempDir += 1;
    }
    dir1 = tempDir;

    // find left-most point
    tempDir = playerDir;
    while (normalCollide(playerX,playerZ,tempDir,terrainObject)) {
      tempDir -= 1;
    }
    dir2 = tempDir;
  }

  else {
    // find right-most point
    while (!normalCollide(playerX,playerZ,tempDir,terrainObject)) {
      tempDir += 1;
    }
    dir1 = tempDir;

    // find left-most point
    tempDir = playerDir;
    while (!normalCollide(playerX,playerZ,tempDir,terrainObject)) {
      tempDir -= 1;
    }
    dir2 = tempDir + 360;
  }

  return round((dir1 + dir2)/2,2);
}

// Update player if killed
function die(data) {
  if (data.id === my.player.id) {
    killSFX.play();
    my.player.alive = false;
    my.player.dx = data.dx;
    my.player.dy = data.dy;
    my.player.dz = data.dz;
    my.player.hold = 0;
  }
}

// Toggle debug mode
function keyPressed() {
  if (keyCode === 80) {
    shared.debugState = !shared.debugState;
  } 
}

class Bullet {
  constructor(x, y, z, pitch, yaw) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.startx = this.x, this.starty = this.y, this.startz = this.z;
    this.endx = this.x, this.endy = this.y, this.endz = this.z;

    
    this.pitch = pitch;
    this.yaw = yaw;
    this.vel = 10;
    this.life = 100;

    this.hitscan();
  }

  hitscan() {
    for (let i = 0; i < 50; i++) {
      this.x -= cos(this.yaw) * this.vel * cos(this.pitch);
      this.y -= sin(this.pitch) * this.vel;
      this.z -= sin(this.yaw) * this.vel * cos(this.pitch);
      for (let terrainObject of shared.terrain) {
        if (checkCollisions(this.x, this.y, this.z, 1, 1, terrainObject)) {
          this.endx = this.x;
          this.endy = this.y;
          this.endz = this.z;
        }
      }
      if (this.endx !== this.startx && this.endy !== this.starty && this.endz !== this.startz) {
        break;
      }
    }

    if (this.endx === this.startx && this.endy === this.starty && this.endz === this.startz) {
      this.endx = this.x;
      this.endy = this.y;
      this.endz = this.z;
    }
  }

  update() {
    this.life -= 1;


  }
}

// Crewmate class for holding data and taking user input
class Crewmate {
  constructor(x, y, z, dir, h) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.dir = dir;
    this.dx = 0;
    this.dy = 0;
    this.dz = 0;
    this.h = random(255);
    this.hold = 1;
    this.alive = true;
    this.id = noise(random(1,10));
    this.bullets = [];
  }

  update() {
    // player state if alive
    if (this.alive) {
      // select item
      if (keyIsDown(49)) {
        this.hold = 0;
      }
      else if (keyIsDown(50)) {
        this.hold = 1;
      }
      else if (keyIsDown(51)) {
        this.hold = 2;
      }

      // use knife
      if (this.hold === 2) {
        if (mouseIsPressed) {
          this.bullets.push(new Bullet(this.x, this.y, this.z, camPitch, camYaw));

        }
      }

      // apply x velocity and check collisions
      this.x += this.dx;
      this.z += this.dz;

      for (let terrainObject of shared.terrain) {
        if (checkCollisions(this.x, this.y, this.z, 60, 65, terrainObject)) {
          let n = findNormal(this.x, this.z, this.dir, terrainObject);
          while (checkCollisions(this.x, this.y, this.z, 60, 65, terrainObject)) {
            this.x -= sin(n);
            this.z -= cos(n);
          }
        }
      }

      // point in direction of motion

      this.dir = -camYaw - 90;


      // apply y velocity and check collisions
      this.y += this.dy;

      let touchingGround = false;

      for (let terrainObject of shared.terrain) {
        if (checkCollisions(this.x, this.y, this.z, 60, 65, terrainObject)) {
          if (this.dy >= 0) {
            while (checkCollisions(this.x, this.y, this.z, 60, 65, terrainObject)) {
              this.y -= 0.1;
            }
            this.dy = 0;
            if (keyIsDown(32)) {
              this.dy = -shared.playerJumpPower;
            }
            
          }
          else if (this.dy < 0) {
            while (checkCollisions(this.x, this.y, this.z, 60, 65, terrainObject)) {
              this.y += 0.1;
            }
            this.dy = 0;
          }
          touchingGround = true;
        } 
      }

      // apply gravity
      if (!touchingGround) {
        this.dy += shared.worldGravity;
      }

      // detect keyboard input
      if (keyIsDown(83) + keyIsDown(87) === 1 || keyIsDown(65) + keyIsDown(68) === 1) {

        // perform math stuff to condense movement controls into a "single line" (this was a terrible idea)
        let magnitude = !keyIsDown(83) * 2 - 1;
        let dir = 
        (keyIsDown(68) * 0 + 
        keyIsDown(87) * 90 +
        keyIsDown(65) * 180 + 
        keyIsDown(83) * 90) / 
        (keyIsDown(68) + 
        keyIsDown(87) + 
        keyIsDown(65) + 
        keyIsDown(83)) * magnitude;

        // accelerate player
        this.dx -= shared.playerAcceleration * sin(dir - camYaw);
        this.dz -= shared.playerAcceleration * cos(dir - camYaw);

        // cap player velocity
        if (Math.sqrt(this.dx**2 + this.dz**2) > shared.playerMaxVelocity) {
          let ratio = shared.playerMaxVelocity/Math.sqrt(this.dx**2 + this.dz**2);
          this.dx = lerp(0,this.dx,ratio);
          this.dz = lerp(0,this.dz,ratio);
        }
      }
      else {
        // decelerate player
        this.dx = this.dx * shared.playerDeceleration;
        this.dz = this.dz * shared.playerDeceleration;
      }
      
      // change world ambient level
      shared.ambientLevel += keyIsDown(UP_ARROW) - keyIsDown(DOWN_ARROW);
    }

    // player state if not alive
    else {

      // apply x velocity and check collisions
      this.x += this.dx;
      this.z += this.dz;

      for (let terrainObject of shared.terrain) {
        if (checkCollisions(this.x, this.y, this.z, 60, 65, terrainObject)) {
          let n = findNormal(this.x, this.z, this.dir, terrainObject);
          while (checkCollisions(this.x, this.y, this.z, 60, 65, terrainObject)) {
            this.x -= sin(n);
            this.z -= cos(n);
          }
          let mag = sqrt(this.dx * this.dx + this.dz * this.dz);
          this.dx = mag * -sin(n);
          this.dz = mag * -cos(n);
        }
      }


      // apply y velocity and check collisions
      this.y += this.dy;
      let touchingGround = false;
      
      for (let terrainObject of shared.terrain) {
        if (checkCollisions(this.x, this.y, this.z, 60, 65, terrainObject)) {
          if (this.dy >= 0) {
            while (checkCollisions(this.x, this.y, this.z, 60, 65, terrainObject)) {
              this.y -= 0.1;
            }
          }
          else if (this.dy < 0) {
            while (checkCollisions(this.x, this.y, this.z, 60, 65, terrainObject)) {
              this.y += 0.1;
            }
          }

          this.dy = -this.dy;
          touchingGround = true;
        }
      }

      // apply gravity
      if (!touchingGround) {
        this.dy += shared.worldGravity;
      }
    }
  }
}