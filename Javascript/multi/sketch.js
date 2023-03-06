let me;
let guests;
function preload() {
  // connect to a p5party server
  partyConnect(
    "wss://demoserver.p5party.org",
    "bello"
  );
  
  // tell p5.party to sync the pos object
  me = partyLoadMyShared({lineData: []});
  guests = partyLoadGuestShareds();
}


function setup() {
  createCanvas(700, 500);

  console.log("me", JSON.stringify(me));
  console.log("guests", JSON.stringify(guests));
  console.log("am i host?", partyIsHost());
  
}
function draw() {
  background(50);
  
  for (let guest of guests) {
    for (let l of guest.lineData)
      circle(l[0], l[1], 5);
  }
  
  if (mouseButton === LEFT && mouseIsPressed) {
    me.lineData.push([mouseX,mouseY])
  }
  if (keyIsDown(32)) {
    me.lineData = [];
  }
}
