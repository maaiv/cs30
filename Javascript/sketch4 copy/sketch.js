// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let r=15;
let allgear=[];
let n=45;
let s =1;
let speed=1;
angle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  angleMode(DEGREES);
}
  

function draw() {
  if (angle >= 360){
    angle = 0;

  }
  
  
  background(220);
  for (let gear of allgear) {
    gear.a += gear.speed;
    gears(gear.x,gear.y,gear.r,gear.n,gear.s,gear.speed,gear.a);

  }
  gears(mouseX, mouseY,r,n,s,speed,angle);
  angle += speed
  if (keyIsDown(LEFT_ARROW)) {
    s = -1 ; 
    
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    s = 1 ; 
    
  }
  if (keyIsDown(UP_ARROW)) {
    speed += 1;

    
  }
  else if (keyIsDown(DOWN_ARROW)) {
    speed -= 1;
    
  }
 //console.log(s);
 //console.log(frameCount);
 console.log(speed);
}


function gears(x,y,r,n,s,speed,a){
  // iner gear
  push();
  translate(x,y);
  rotate(((a)/s)+speed);

  ellipse(0,0,r);
  // outer gear
  outerGears(0,0,r,n);
  pop();
}


function outerGears(x,y,r,n){
  for (let i = -n; i <= 360; i +=n){
    
      
    
    //outer cog
    if (i<=360){
      arc(x,y,r*2,r*2,i,i+n/2); 
    
    }
    //iner cog
    if (i<=360){ 
      arc(x,y,r*1.5,r*1.5,i-n/2,i);
    }
  }
  

}
function mouseWheel(event){
  if (event.delta > 0){
    r += 50;
  }
  else if (event.delta < 0){
    r -= 50;

  }
}




function mousePressed(){
  let gear={
    x:mouseX,
    y:mouseY,
    r:r,
    n:n,
    s:s,
    speed:speed,
    a:angle,

  };
  console.log(gear);
  allgear.push(gear);
}
