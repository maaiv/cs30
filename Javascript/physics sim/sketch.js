let multiplier = 2000;
let buffer = 1100;




// function preload() {
//   mamun = loadImage("mamun.jpg")
// }


function setup() {
  new Canvas(windowWidth, windowHeight);

  let floor = new Sprite(width/2,height , width, 5);
  floor.collider = 's';
  floor = new Sprite(width/2,0, width, 5);
  floor.collider = 's';
  let wall = new Sprite(0,height/2, 5,height);
  wall.collider = 's';
  wall = new Sprite(width,height/2, 5,height);
  wall.collider = 's';
  

  noStroke();
  positive = new Group();  
  positive.bounciness = 0;  
  positive.color = color(255,0,0);
  positive.collider = "d";
  positive.r = 8;


  negative = new Group();  
  negative.r = 8;
  negative.bounciness = 0;  
  negative.collider = "d";
  negative.color = color(0,0,255);

  ball = new positive.Sprite(500+50, height/2+200);
  ball.vel.y = -3 - 1;
  ball = new negative.Sprite(500-50, height/2 + 200); 
  ball.vel.y = 3 - 1;
}



function draw() {
  background(0,0,0,0); // try removing this line and see what happens!
  
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
      ball = new negative.Sprite(mouseX, mouseY);
    }
  }

  //sim positive
  for (let i = 0; i < positive.length; i++) {
    for (let j = 0; j < positive.length; j++) {
      if (j !== i) {
        let angle = positive[i].angleTo(positive[j]);
        let distance = dist(positive[i].x, positive[i].y, positive[j].x, positive[j].y);
        positive[i].vel.y -= sin(angle) * multiplier/(distance*distance+buffer);
        positive[i].vel.x -= cos(angle) * multiplier/(distance*distance+buffer);
      }
    }
    for (let j = 0; j < negative.length; j++) {
      let angle = positive[i].angleTo(negative[j]);
      let distance = dist(positive[i].x, positive[i].y, negative[j].x, negative[j].y);
      positive[i].vel.y += sin(angle) * multiplier/(distance*distance+buffer);
      positive[i].vel.x += cos(angle) * multiplier/(distance*distance+buffer);
    }
  }
  
  //sim negative
  for (let i = 0; i < negative.length; i++) {
    for (let j = 0; j < negative.length; j++) {
      if (j !== i) {
        let angle = negative[i].angleTo(negative[j]);
        let distance = dist(negative[i].x, negative[i].y, negative[j].x, negative[j].y);
        negative[i].vel.y -= sin(angle) * multiplier/(distance*distance+buffer);
        negative[i].vel.x -= cos(angle) * multiplier/(distance*distance+buffer);
      }
    }
    for (let j = 0; j < positive.length; j++) {
      let angle = negative[i].angleTo(positive[j]);
      let distance = dist(negative[i].x, negative[i].y, positive[j].x, positive[j].y);
      negative[i].vel.x += cos(angle) * multiplier/(distance*distance+buffer);
      negative[i].vel.y += sin(angle) * multiplier/(distance*distance+buffer);
    }
  }
  // console.log(count)
}
