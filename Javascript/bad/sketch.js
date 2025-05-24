// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let arrowAngle = 0;

let ballY = 0;
let ballStartY = 0;
let ballSpeed = 0;
let changeTime = 2;
let lastHitTime = 0

const gravity = 0.05; // Acceleration due to gravity

let arrowDirection = ""; // Global variable to store the arrow's direction

let changeTimeSlider, changeTimeInput;

let directionToggles = {}; // Object to store toggle states for directions

let hitSound; // Sound to play when the bar hits the ground
let volumeSlider; // Volume slider

function preload() {

    soundFormats('mp3', 'wav');
    hitSound = loadSound('hit.mp3'); // Place your sound file in an 'assets' folder
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(90); // Set frame rate to 90
    resetBall();

    // Create slider for changeTime
    changeTimeSlider = createSlider(0, 10, changeTime, 0.1); // Min: 2, Max: 6, Step: 0.1
    changeTimeSlider.position(width - 320, 25); // Position slider in the top right

    // Create input field for changeTime
    changeTimeInput = createInput(changeTime.toString());
    changeTimeInput.size(50); // Make the input field smaller
    changeTimeInput.position(changeTimeSlider.x + changeTimeSlider.width + 20, 20);

    // Update slider when input changes
    changeTimeInput.input(() => {
        const value = parseFloat(changeTimeInput.value());
        if (!isNaN(value) && value >= 2 && value <= 6) {
            changeTime = value;
            changeTimeSlider.value(value);
        }
    });

    // Update input when slider changes
    changeTimeSlider.input(() => {
        changeTime = changeTimeSlider.value();
        changeTimeInput.value(changeTime.toFixed(1));
    });

    
    // Create volume slider
    volumeSlider = createSlider(0, 1, 0.5, 0.01);
    volumeSlider.addClass('volume-slider');
    volumeSlider.position(width - 320, 70);
    
    // Optionally, add a label for the slider
    let volumeLabel = createDiv('Volume');
    volumeLabel.parent(document.body);
    volumeLabel.addClass('volume-slider-container');
    volumeLabel.style('position', 'absolute');
    volumeLabel.style('left', (width - 320) + 'px');
    volumeLabel.style('top', '50px');

    // Create toggle checkboxes for directions
    const directions = ["NW", "N", "NE", "SW", "S", "SE"];
    directions.forEach((dir, index) => {
        directionToggles[dir] = createCheckbox(dir, true); // Default all toggles to true
        directionToggles[dir].position(width - 250 + (100 * (index >= 3)), 120 + ((index * 40) % 120) ); // Position checkboxes on the right
    });
}


function draw() {
    background(220);

    push();
    fill("white");
    text(str(round(frameRate())), 10, 10);
    pop();

    // Draw the tube
    drawTube();

    if (millis() - lastHitTime > changeTime * 1000) {
        // Ball falling logic
        ballSpeed += gravity;
        ballY += ballSpeed;

        if (ballY >= height - 175) { // Adjusted ground level to 100 pixels higher
            if (hitSound && hitSound.isLoaded()) {
                hitSound.play();
            }
            lastHitTime = millis(); // Record the time of the last hit
            resetBall(); // Reset ball position after changeTime seconds

            // Filter directions based on toggles
            const directions = ["NW", "N", "NE", "SW", "S", "SE"].filter(dir => directionToggles[dir].checked());
            const angles = {
                "NW": -QUARTER_PI,
                "N": 0,
                "NE": QUARTER_PI,
                "SW": PI + QUARTER_PI,
                "S": PI,
                "SE": PI - QUARTER_PI
            };

            if (directions.length > 0) {
                const selectedDirection = random(directions);
                arrowAngle = angles[selectedDirection]; // Randomly select angle
                arrowDirection = selectedDirection; // Store corresponding direction
            }
        } 
else {
            // Draw the ball
            push();
            strokeWeight(0);
            fill(0, 0, 0);
            rect(width / 2 - 450, 100, 50, ballY-25);

            // circle(width / 2 - 450 + 25, ballY, 50); // Larger ball, positioned in the tube
        
            pop();
        }
    }

    // Set sound volume based on slider
    if (hitSound && hitSound.isLoaded()) {
        hitSound.setVolume(volumeSlider.value());
    }

    // Draw the arrow
    push();
    translate(width / 2, height / 2); // Move to center of canvas
    fill(255, 255, 255); // Light blue circle background
    ellipse(0, 0, (4 / 5) * height + 70); // Circle background slightly larger than the arrow
    // // Draw notches for the 6 directions
    // const notchRadius = (2 / 3) * height / 2 + 25; // Radius for notches
    // const directions = [PI + QUARTER_PI, PI / 2, PI - QUARTER_PI, -QUARTER_PI, -PI / 2, QUARTER_PI]; // Corrected angles for NW, N, NE, SW, S, SE
    // stroke(0);
    // strokeWeight(4);
    // directions.forEach(angle => {
    //     const x = notchRadius * cos(angle);
    //     const y = notchRadius * sin(angle);
    //     line(x * 0.9, y * 0.9, x, y); // Draw notches slightly inside the circle
    // });

    rotate(arrowAngle); // Rotate to random angle
    drawArrow();
    pop();
}

function resetBall() {
    ballStartY = 25; // Random starting height
    ballY = ballStartY;
    ballSpeed = 0;
}

function drawArrow() {
    fadeTime = ((1+changeTime)*1000)
    stroke(400*(millis() - lastHitTime)/fadeTime - 100);
    fill(400*(millis() - lastHitTime)/fadeTime - 100);
    strokeWeight(24-max((20*(millis() - lastHitTime)/fadeTime-5),0)); // Thicker arrow shaft
    const arrowLength = (4 / 5) * height; // Arrow length is 2/3 of canvas height
    line(0, -arrowLength / 2, 0, arrowLength / 2); // Larger arrow shaft
    triangle(-60, -arrowLength / 2+120, 60, -arrowLength / 2+120, 0, -arrowLength / 2); // Larger arrowhead
}

function drawTube() {
    stroke(100);
    fill(200);
    rect(width / 2 - 450, 100, 50, height - 200); // Tube moved 50 pixels higher
}