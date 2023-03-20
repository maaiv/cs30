// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// lol
// Checklist:
// 1. add make collisions work in all directions in the 2d plane || DONE took way too long
//    - probably just recode my normal finder thingy from scratch
// 2. add proper UI
//    - main menu last
//    - selected item
//    - global chat bruh fml
//    - name tags?
//    - working minimap idk
//      - would that give too much power?
// 3. add method to kill crewmate
//    - add ragdoll physics maybe
//    - change sprite
//    - impostor class
//    - create red outline
//    - I need to learn blender
// 4. add true 3d collisions (maybe?) || DONE
//    - not gonna work with the current lighting system
//    - tbh I just wanna make this to see if I can
//    - funny parkour challenge
//    - assign y/height value to objects
//    - if collide, check y intersection
// 5. add SFX
//    - bg music
//    - kill sfx funny
//    - among us trap remix
//    - walking sfx
// 6. spruce up guest movement
//    - add velocity variables to shared (gravity too maybe)
//    - move figure in between server updates
// 7. clean up code || DONE
//    - I am sorry mr schellenberg
// 8. first person (maybe?)
//    - adjust camera position
//    - introduce flashlight lighting???
//    - better immesion
// 9. add ranged weaponary
//    - probably that one gun thing
//    - allows impostors to kill from afar, but gives away position through sound 
// 10. venting (maybe?)
//    - either classic fast travel or hidden passageways only accessable to the impostor


// Instantiating variables
let camYaw = 0; //x
let camPitch = 0; //y
let camDistance = 300;
let lightpos = [];
let lightSize = 10;

let playerAcceleration = 1;
let playerDeceleration = 0.9;


// Create environment objects
let terrain = [
  {type: 'box', x: 0, y: 50, z: 0, width: 3600, height: 100, length: 3600},
  {type: 'box', x: 300, y: -30, z: 0, width: 100, height: 60, length: 100}, 
  {type: 'box', x: 450, y: -110, z: 0, width: 100, height: 60, length: 100}, 
  {type: 'box', x: 300, y: -30, z: 400, width: 300, height: 60, length: 300},
  {type: 'box', x: -300, y: -30, z: -600, width: 800, height: 60, length: 800},
  {type: 'cylinder', x: -300, y: -30, z: 400, radius: 100, height: 60},
  {type: 'cylinder', x: 000, y: -350, z: 1500, radius: 200, height: 700}
];


for (let i = 1; i < 10; i += 1) {
  terrain.push({type: 'box', x: 450, y: -110 - i * 80, z: i * 200, width: 100, height: 60, length: 100});
}

// Connect to the server and shared data
function preload() {
  partyConnect("wss://demoserver.p5party.org", "among");
  my = partyLoadMyShared();
  guests = partyLoadGuestShareds();
  shared = partyLoadShared("shared", {ambientLevel: 0, debugState: false});
  killSFX = loadSound('assets/killSFX.mp3');
};

// Set sketch modes, canvas, and 
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

  partySubscribe("die", die);
  } 



function draw() {

  drawInit();

  collideVisual();

  updateMyPlayer();

  updateCam();

  createLights();

  drawPlayers();

  drawEnvironment();



}

// Set background and pointer lock
function drawInit() {
  background(5);
 
  // create a weak light so WEBGL doesn't just break when there are no lights
  pointLight(
    0,0,0,
    0,-300,0
  );
  pointLight(
    0,0,shared.ambientLevel,
    0,-1900,0
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
    for (let terrainObject of terrain) {
      push();
        if (terrainObject.type === 'box') {
          let boxMiniX = (terrainObject.x - terrainObject.width/2)/10 + 90;
          let boxMiniZ = (terrainObject.z - terrainObject.length/2)/10 + 90;
          collideVisualCanvas.rect(boxMiniX, boxMiniZ, terrainObject.width/10, terrainObject.length/10);
        }
        if (terrainObject.type === 'cylinder') {
          let cylinderMiniX = terrainObject.x/10 + 90;
          let cylinderMiniZ = terrainObject.z/10 + 90;
          collideVisualCanvas.circle(cylinderMiniX,cylinderMiniZ,terrainObject.radius/5);
        }
      pop();
    }

    // draw character hitboxes
    for (let guest of guests) {
      collideVisualCanvas.circle(guest.player.x/10 + 90,guest.player.z/10 + 90, 6);
      collideVisualCanvas.circle(guest.player.x/10 + 90 + sin(guest.player.dir) * 3, guest.player.z/10 + 90 + cos(guest.player.dir) * 3, 2)

    }

    //draw visualizer above the player model
    push();
      translate(my.player.x - 50,my.player.y-65 - 100,my.player.z)
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
    my.player.x + cos(camYaw) * camDistance * cos(camPitch),
    my.player.y - 60 + sin(camPitch) * camDistance,
    my.player.z + sin(camYaw) * camDistance * cos(camPitch),
    );
  camYaw += movedX/10;
  camPitch -= movedY/10;

  cam.lookAt(my.player.x,my.player.y,my.player.z);
}

// Create and store position of each player light
function createLights() {
  lightpos = [];

  for (let guest of guests) {
    if (guest.player.hold === 1) {
      spotLight(
        0,0,255,
        guest.player.x,guest.player.y - 400,guest.player.z,
        0,1,0,
        85,40/lightSize);
      lightpos.push([guest.player.x,guest.player.z]);
    }
  }
}



// Calculate ambient lighting and draw player models
function drawPlayers() {
  for (let guest of guests) {
    push();
      // calculate ambient lighting depending on the closest distance to another light before rendering
      let minimumDistance = min(lightpos.map(v => dist(guest.player.x,guest.player.z,v[0], v[1])));
      ambientLight(map(minimumDistance,0,125 + 50*lightSize,105,5,true));
      drawCrewMateModel(guest.player.x,guest.player.y,guest.player.z,guest.player.dir,guest.player.h,guest.player.hold,guest.player.alive)
    pop();
  }

  // draw demo player model if in debug mode
  if (shared.debugState) {
    push();
      let minimumDistance = min(lightpos.map(v => dist(0,0,v[0], v[1])));
      ambientLight(map(minimumDistance,0,125 + 50*lightSize,105,5,true));
      drawCrewMateModel(0,0,0,0,180,2,false);
    pop();
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

          box(20,6,2)
          translate(22,0,0);
          rotateZ(-90);

          ambientMaterial(0,120,60);
          scale(1,1,0.3)
          cone(8,30,5,0);
        pop();
    }
  
  }
  else {
    // draw main body
    push();
      translate(0,15,0)
      ellipsoid(20,15,15);
      scale(1, 1, 0.75);
      translate(0,-9,0)
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
      translate(0,-5,0)
      cylinder(4,20);

      translate(3,-9,0)
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
  // push();
  //   rotateX(90);
  //   plane(1800,1800);
  // pop();

  for (let terrainObject of terrain) {
    push();
      translate(terrainObject.x,terrainObject.y,terrainObject.z);
      if (terrainObject.type === 'box') {
        box(terrainObject.width,terrainObject.height,terrainObject.length);
      }
      else if (terrainObject.type === 'cylinder') {
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

function checkCollisions(playerX,playerY,playerZ,terrainObject) {
  if (terrainObject.type === 'box') {
    if (collideRectCircle(
      terrainObject.x - terrainObject.width/2, 
      terrainObject.z - terrainObject.length/2,
      terrainObject.width,
      terrainObject.length,
      playerX,
      playerZ,
      60
    )) {
      if (playerY > terrainObject.y - terrainObject.height/2 && playerY - 65 < terrainObject.y + terrainObject.height/2) {
        return(true);
      }
    }
  }
  else if (terrainObject.type === 'cylinder') {
    if (collideCircleCircle(
      terrainObject.x,
      terrainObject.z,
      terrainObject.radius * 2,
      playerX,
      playerZ,
      60
    )) {
      if (playerY > terrainObject.y - terrainObject.height/2 && playerY - 65 < terrainObject.y + terrainObject.height/2) {
        return(true);
      }
    }
  }
return(false);
}


function findNormal(playerX,playerZ,playerDir,terrainObject) {
  if (terrainObject.type === 'box') {
    var normalCollide = (x, z, dir, terrainObject) => collidePointRect(
      x + sin(dir) * 40,
      z + cos(dir) * 40,
      terrainObject.x - terrainObject.width/2, 
      terrainObject.z - terrainObject.length/2,
      terrainObject.width,
      terrainObject.length,
    );
  }
  else if (terrainObject.type === 'cylinder') {
    var normalCollide = (x, z, dir, terrainObject) => collidePointCircle(
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
    while (normalCollide(playerX,playerZ,tempDir,terrainObject)) {
      tempDir += 1;
    }

    dir1 = tempDir;
    tempDir = playerDir;
    while (normalCollide(playerX,playerZ,tempDir,terrainObject)) {
      tempDir -= 1;
    }
    dir2 = tempDir;
    }

  else {
    while (!normalCollide(playerX,playerZ,tempDir,terrainObject)) {
      tempDir += 1;
    }
  
    dir1 = tempDir;
    tempDir = playerDir;
    while (!normalCollide(playerX,playerZ,tempDir,terrainObject)) {
      tempDir -= 1;
    }
    dir2 = tempDir + 360;
  }

  return(round((dir1 + dir2)/2,2));
}

function die(data) {
  console.log(my.player.id, data.id)
  if (data.id === my.player.id) {
    killSFX.play();
    
    console.log('bruh');
    my.player.alive = false;
    my.player.dx = data.dx;
    my.player.dy = data.dy;
    my.player.dz = data.dz;
    my.player.hold = 0;
  }
}

function keyPressed() {
  if (keyCode === 80) {
    shared.debugState = !shared.debugState;
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
    this.h = h
    this.hold = 1;
    this.alive = true;
    this.id = noise(random(1,10));
  }

  update() {
    if (this.alive) {
      // select item
      if (keyIsDown(49)) {
        this.hold = 0;
      }
      else if (keyIsDown(50)) {
        this.hold = 1;
      }
      else if (keyIsDown(51)) {
        this.hold = 2
      }

      if (this.hold === 2) {
        for (let guest of guests) {
          if (guest.player != my.player) {
            if (dist(guest.player.x,guest.player.y,guest.player.z,my.player.x,my.player.y,my.player.z) < 300) {
              if (mouseIsPressed && !killSFX.isPlaying()) {
                killSFX.play();
                let dir = atan2(my.player.x - guest.player.x, my.player.z - guest.player.z)
                partyEmit("die", {
                  id: guest.player.id,
                  dx: sin(dir) * -5,
                  dy: -4,
                  dz: cos(dir) * -5
                  })
                
              }
            }
          }
        }
      }

      // apply x velocity and check collisions
      this.x += this.dx;
      this.z += this.dz;

      for (let terrainObject of terrain) {
        if (checkCollisions(this.x, this.y, this.z, terrainObject)) {
          let n = findNormal(this.x, this.z, this.dir, terrainObject);
          while (checkCollisions(this.x, this.y, this.z,terrainObject)) {
            this.x -= sin(n);
            this.z -= cos(n);
          }
        }
      }

      // point in direction of motion
      this.dir = atan2(this.dx,this.dz);

      // apply y velocity and check collisions
      this.y += this.dy;

      let touchingGround = false;

      for (let terrainObject of terrain) {
        if (checkCollisions(this.x, this.y, this.z, terrainObject)) {
          if (this.dy >= 0) {
            while (checkCollisions(this.x, this.y, this.z, terrainObject)) {
              this.y -= 0.1;
            }
            this.dy = 0;
            if (keyIsDown(32)) {
              this.dy = -5;
            }
            
          }
          else if (this.dy < 0) {
            while (checkCollisions(this.x, this.y, this.z, terrainObject)) {
              this.y += 0.1;
            }
            this.dy = 0;
          }
          touchingGround = true;
        } 
      }

      if (!touchingGround) {
        this.dy += 0.15;
      }



      // detect keyboard input
        // 87 = W
        // 65 = A
        // 83 = S
        // 68 = D
      if (keyIsDown(83) + keyIsDown(87) === 1 || keyIsDown(65) + keyIsDown(68) === 1) {

        // perform math stuff
        let magnitude = !keyIsDown(83) * 2 - 1;
        let dir = 
        (keyIsDown(68) * 0 + 
        keyIsDown(87) * 90 +
        keyIsDown(65) * 180 + 
        keyIsDown(83) * 90) / 
        (keyIsDown(68) + 
        keyIsDown(87) + 
        keyIsDown(65) + 
        keyIsDown(83))  * magnitude

        // accelerate player
        this.dx -= playerAcceleration * sin(dir - camYaw);
        this.dz -= playerAcceleration * cos(dir - camYaw);

        // cap player velocity
        if (Math.sqrt(this.dx**2 + this.dz**2) > 6) {
          let ratio = 6/Math.sqrt(this.dx**2 + this.dz**2);
          this.dx = lerp(0,this.dx,ratio);
          this.dz = lerp(0,this.dz,ratio);
        }

      }
      else {
        // decelerate player
        this.dx = this.dx * playerDeceleration
        this.dz = this.dz * playerDeceleration
      }
      shared.ambientLevel += keyIsDown(UP_ARROW) - keyIsDown(DOWN_ARROW);


    }
    else {
      // apply x velocity and check collisions
      this.x += this.dx;
      this.z += this.dz;

      for (let terrainObject of terrain) {
        if (checkCollisions(this.x, this.y, this.z, terrainObject)) {
          let n = findNormal(this.x, this.z, this.dir, terrainObject);
          while (checkCollisions(this.x, this.y, this.z,terrainObject)) {
            this.x -= sin(n);
            this.z -= cos(n);
          }
          let mag = sqrt(this.dx * this.dx + this.dz * this.dz)
          this.dx = mag * -sin(n);
          this.dz = mag * -cos(n);
        }
      }


      // apply y velocity and check collisions
      this.y += this.dy;

      let touchingGround = false;

      for (let terrainObject of terrain) {
        if (checkCollisions(this.x, this.y, this.z, terrainObject)) {
          if (this.dy >= 0) {
            while (checkCollisions(this.x, this.y, this.z, terrainObject)) {
              this.y -= 0.1;
            }
          }
          else if (this.dy < 0) {
            while (checkCollisions(this.x, this.y, this.z, terrainObject)) {
              this.y += 0.1;
            }
          }
          this.dy = -this.dy;
          touchingGround = true;
        }
      }

      // this.dx = this.dx * playerDeceleration
      // this.dz = this.dz * playerDeceleration
      if (!touchingGround) {
        this.dy += 0.15;
      }
    } //else end
  }
}