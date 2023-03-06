let screenWidth = 700;
let screenHeight = 500;

let numBalls = 0;



// function preload() {
//   mamun = loadImage("mamun.jpg")
// }


function setup() {
  new Canvas(screenWidth, screenHeight);
  // world.gravity.y = 10;
  floor = new Sprite(screenWidth/2,screenHeight , screenWidth, 5);
  floor.collider = 's';
  floor = new Sprite(screenWidth/2,0, screenWidth, 5);
  floor.collider = 's';
  wall = new Sprite(0,screenHeight/2, 5,screenHeight);
  wall.collider = 's';
  wall = new Sprite(screenWidth,screenHeight/2, 5,screenHeight);
  wall.collider = 's';


  noStroke();
  positive = new Group();  
  positive.r = 8;
  positive.bounciness = 1;
  
}



function draw() {
  background(0,0,0,30); // try removing this line and see what happens!
  
  push();
  fill("white")
  text(str(round(frameRate())), 10, 10);
  text(str(round(positive.length)), 10, 20);
  pop();

  if (positive.length < 0) {
    ball = new positive.Sprite(30,30);
  }
  

  if (mouseIsPressed && frameCount % 10 === 0) {
    if (mouseButton === LEFT) {
      ball = new positive.Sprite(mouseX, mouseY);
    }
    if (mouseButton === RIGHT) {
      ball = new positive.Sprite(mouseX, mouseY);
    }
  }
  for (let i = 0; i < positive.length; i++) {
    for (let j = 0; j < positive.length; j++) {
      if (j !== i) {
        let angle = positive[i].angleTo(positive[j]);
        let distance = dist(positive[i].x, positive[i].y, positive[j].x, positive[j].y);
        positive[i].vel.x += cos(angle) * 1/distance;
        positive[i].vel.y += sin(angle) * 1/distance;

      }
    }
  }
  
  // console.log(count)
}
