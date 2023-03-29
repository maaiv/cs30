// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let keys = [];
let WHITEWIDTH = 70, BLACKWIDTH = 50;
let octaves = 2;
let monoSynth;
let whiteNotes = ["C","D","E","F","G","A","B"];


function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 7 * octaves; i++) {
    keys.push(new pianoKey("white", i * WHITEWIDTH, i));
  }

  let offset = 0
  for (let i = 0; i < 5 * octaves; i++) {

    keys.push(new pianoKey("black", i * WHITEWIDTH + WHITEWIDTH - BLACKWIDTH/2 + offset, i));
    if (i % 5 === 1 || i % 5 === 4) {
      offset += WHITEWIDTH;
    }
  }

  monoSynth = new p5.MonoSynth();
}

function draw() {
  updateKeys();
  drawKeys(); 
}

function drawKeys() {
  for (let key of keys) {
    key.draw();
  }
}
function updateKeys() {  
  for (let key of keys) {
    if (key.type === "black") {
      if (key.update()) {
        break;
      }
    }
    key.update();
  }
}

function playSound(note) {
  userStartAudio();
  monoSynth.play(note, 1  , 0, 0);
}



class pianoKey {

  constructor(type, pos, pitch) {
    this.type = type;
    this.pos = pos;
    if (type === "black") {
      this.width = BLACKWIDTH;
      this.height = 220;
      this.colour = "black";
      this.pitch = whiteNotes[4];
      this.octave = floor(pitch/5) + 4;
      this.octave = 1;
    }
    else {
      this.width = WHITEWIDTH;
      this.height = 340;
      this.colour = "white";
      this.pitch = whiteNotes[pitch % 7];
      this.octave = floor(pitch/7) + 4;
      if (pitch % 7 >= 5 && pitch % 7 <= 6) {
        this.octave += 1;
      }
    }
  }

  draw() {
    push();
    fill(this.colour);
    rect(this.pos, 100, this.width, this.height);
    pop();
  }

  update() {
    if (mouseX > this.pos && mouseX < this.pos + this.width && mouseY > 100 && mouseY < 100 + this.height && mouseIsPressed) {
      console.log(this.pitch, this.type, this.octave + 4);
      playSound(this.pitch.concat(this.octave + 4));
      return true;
    }
    else {
      return false;
    }
  }
}