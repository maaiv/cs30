// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


camYaw = 0; //x
camPitch = 0; //y
camDistance = 300;
pointerLocked = false;


window.preload = () => {
  partyConnect("wss://demoserver.p5party.org", "among");
  my = partyLoadMyShared();
  guests = partyLoadGuestShareds();
};

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  angleMode(DEGREES);
  colorMode(HSB, 255);
  my.player = new Crewmate(0,0,0,0);

  console.log("me", JSON.stringify(my));
  console.log("guests", JSON.stringify(guests));
  console.log("am i host?", partyIsHost());

}

function draw() {


  if (mouseIsPressed) {
    requestPointerLock();
  }


  background(20);
  drawInit();
  drawCrewMate(0,0,0,frameCount);
  // my.player.draw();
  my.player.update();
  
  push();
  stroke("red"); // x
  line(-900,0,0,900,0,0);
  stroke("blue"); // y
  line(0,-900,0,0,900,0);
  stroke("yellow"); // z
  line(0,0,-900,0,0,900);
  pop();

  cam.setPosition(
    my.player.x + cos(camYaw) * camDistance * cos(camPitch),
    my.player.y + sin(camPitch) * camDistance,
    my.player.z + sin(camYaw) * camDistance * cos(camPitch),
    );

  camYaw += movedX/10;
  camPitch -= movedY/10;

  cam.lookAt(my.player.x,my.player.y,my.player.z);
  for (let guest of guests) {

    push();
    drawCrewMate(guest.player.x,guest.player.y,guest.player.z,guest.player.dir)
    pop();

    // guest.player.draw();
  }



}

function drawInit() {

  pointLight(100,0,220,0,-600,0);
  ambientLight(255);

}

function drawCrewMate(x,y,z,dir) {
  push();
    noStroke();
    // specularMaterial(25);
    // shininess(1000);
    ambientMaterial(0, 255, 120);

    strokeWeight(0.3);
    translate(x,y-35,z);
    rotateY(dir);
    ellipsoid(25,30,20);

    push();
      specularMaterial(200);
      shininess(40);
      ambientMaterial(0, 0, 60);

      translate(0,-10,15);
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
  pop();

  push();
    
  pop();


}

class Crewmate {
  constructor(x, y, z, dir) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.dir = dir;
    this.dx = 0;
    this.dy = 0;
    this.dz = 0;
  }

  update() {

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
    this.z += this.dz;
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