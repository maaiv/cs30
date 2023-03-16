// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// lol
// Checklist:
// 1. add make collisions work in all directions in the 2d plane
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
// 4. add true 3d collisions (maybe?)
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
// 7. clean up code
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

let camYaw = 0; //x
let camPitch = 0; //y
let camDistance = 300;
let things = [{type: 'box', x: 300, z: 0, width: 100}, {type: 'box', x: 300, z: 600, width: 300},{type: 'box', x: -300, z: -1200, width: 800}];
let lightpos = [];
let lightSize = 10;


window.preload = () => {
  partyConnect("wss://demoserver.p5party.org", "among");
  my = partyLoadMyShared();
  guests = partyLoadGuestShareds();
  shared = partyLoadShared("shared");
};

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  colorMode(HSB, 255);

  cam = createCamera();
  my.player = new Crewmate(0,0,0,0,0);
  collideVisualCanvas = createGraphics(180,180);
  shared.messages = [];

  console.log("me", JSON.stringify(my));
  console.log("guests", JSON.stringify(guests));
  console.log("am i host?", partyIsHost());
  }

function draw() {
  background(5);
  //get pointerlock
  if (mouseIsPressed) {
    requestPointerLock();
  }




  drawInit();
  collideVisual();
  lightpos = [];
  for (let guest of guests) {
    if (guest.player.hold === 1) {
      spotLight(
        0,0,255,
        guest.player.x,-400,guest.player.z,
        0,1,0,
        85,40/lightSize);
      lightpos.push([guest.player.x,guest.player.z]);
    }
  }

  for (let guest of guests) {
    push();
    let minimumDistance = min(lightpos.map(v => dist(guest.player.x,guest.player.z,v[0], v[1])));
    ambientLight(map(minimumDistance,0,125 + 50*lightSize,105,5,true));
    drawCrewMate(guest.player.x,guest.player.y,guest.player.z,guest.player.dir,guest.player.h,guest.player.hold)
    pop();
  }
  push();
    let minimumDistance = min(lightpos.map(v => dist(0,0,v[0], v[1])));
    ambientLight(map(minimumDistance,0,125 + 50*lightSize,105,5,true));
    drawCrewMate(0,0,0,frameCount,180,2);
  pop();

  // my.player.draw();

  push();
  rotateX(90);
  plane(1800,1800);
  pop();

  for (let thing of things) {
    push();
    translate(thing.x,0,thing.z);
    if (thing.type === 'box') {
      box(thing.width,1000,thing.width)
    }
    pop();
  }


  
  my.player.update();
  

  cam.setPosition(
    my.player.x + cos(camYaw) * camDistance * cos(camPitch),
    my.player.y + sin(camPitch) * camDistance,
    my.player.z + sin(camYaw) * camDistance * cos(camPitch),
    );

  camYaw += movedX/10;
  camPitch -= movedY/10;

  cam.lookAt(my.player.x,my.player.y,my.player.z);

}


function drawInit() {
  pointLight(
    0,0,0,
    0,-300,0
  );


  push();
  stroke("red"); // x
  line(-900,0,0,900,0,0);
  stroke("blue"); // y
  line(0,-900,0,0,900,0);
  stroke("yellow"); // z
  line(0,0,-900,0,0,900);
  pop();
  
}

function drawCrewMate(x,y,z,dir,h,hold) {
  push();
    noStroke();
    specularMaterial(25);
    shininess(10000);
    ambientMaterial(h, 255, 255);

    strokeWeight(0.3);
    translate(x,y-36,z);
    rotateY(dir);

    ellipsoid(25,30,20);

    push();
      specularMaterial(300);
      shininess(20);
      ambientMaterial(0,0,0);

      translate(0,-10,14);
      ellipsoid(15,10,13);
    pop();

    push();
      translate(12,18,0);
      ellipsoid(8,18,8);
      translate(-24,0,0);
      ellipsoid(8,18,8);
    pop();

    push();
      translate(0,0,-18);
      box(24,35,8);
    pop();


  if (hold === 2) {
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
  pop();




}

function checkCollisions(playerX,playerZ) {
  for (let thing of things) {
    if (thing.type === 'box') {
      if (collideRectCircle(
        thing.x - thing.width/2, 
        thing.z - thing.width/2,
        thing.width,
        thing.width,
        playerX,
        playerZ,
        60
      )) {
        return(true);
      }
    }
  

  }
  return(false);
}

function collideVisual() {
  collideVisualCanvas.background(255);
  for (let guest of guests) {

    collideVisualCanvas.circle(guest.player.x/10 + 90,guest.player.z/10 + 90, 6);
  }
  for (let thing of things) {
    push();
    if (thing.type === 'box') {
      let boxMiniX = (thing.x - thing.width/2)/10 + 90
      let boxMiniZ = (thing.z - thing.width/2)/10 + 90
      collideVisualCanvas.square(boxMiniX, boxMiniZ, thing.width/10);
    }
    pop();
  }
  push();
  translate(my.player.x - 50,my.player.y-200,my.player.z)
  image(collideVisualCanvas,0,0,100,100);
  pop();

}

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
  }

  update() {

    if (keyIsDown(49)) {
      this.hold = 0;
    }
    else if (keyIsDown(50)) {
      this.hold = 1;
    }
    else if (keyIsDown(51)) {
      this.hold = 2
    }

    

    if (this.y <= 0) {
      this.dy += 0.15;
    } 
    else {
      while (this.y > 0) {
        this.y -= 0.1;
      }
      this.y = 0;
      if (keyIsDown(32)) {
        this.dy = -5;
      }
    }
  


    // 87 = W
    // 65 = A
    // 83 = S
    // 68 = D
    if (keyIsDown(83) + keyIsDown(87) === 1 || keyIsDown(65) + keyIsDown(68) === 1) {
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

     

      this.dx -= 1 * sin(dir - camYaw);

      this.dz -= 1 * cos(dir - camYaw);

      if (Math.sqrt(this.dx**2 + this.dz**2) > 6) {
        let ratio = 6/Math.sqrt(this.dx**2 + this.dz**2);
        this.dx = lerp(0,this.dx,ratio);
        this.dz = lerp(0,this.dz,ratio);
      }

    }
    else {
      this.dx = this.dx * 0.9
      this.dz = this.dz * 0.9
    }



    this.x += this.dx;
    if (checkCollisions(this.x,this.z)) {
      while (checkCollisions(this.x,this.z)) {
        this.x -= this.dx/100;
      }
      this.dx = 0;
      
    }
    this.z += this.dz;
    if (checkCollisions(this.x,this.z)) {
      while (checkCollisions(this.x,this.z)) {
        this.z -= this.dz/100;
      }
      this.dz = 0;
      
    }
    this.y += this.dy;
    this.dir = atan2(this.dx,this.dz);
    
    


  }
  draw() {
    push();
    translate(this.x, this.y, this.z);
    rotateY(this.dir)
    box(30,30,30);
    pop();
  }
}