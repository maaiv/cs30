// Project Title
// Your Name
// Date

// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let startTime, allPrimes = [];

let multithreading = true;

let workerTotal = 4;
let busyWorkers = 0;

let total = 50000000;

let clock1 = 0;
let clock2 = 0;
let primes = [];
function setup() {
  
  createCanvas(windowWidth, windowHeight);

  clock1 = millis();
  if (multithreading) {
    let primes = [];
    for (let n = 0; n < workerTotal; n++) {
      let worker = new Worker("worker.js");

      worker.onmessage = workerDone;

      busyWorkers += 1;
      worker.postMessage({start:n * (total / workerTotal), total:total/ workerTotal, id:n});


    }
    
  }

  if (!multithreading) {
    startTime = millis();
    for (let num = 0; num < total; num++) {
      if (checkPrime(num)) {
        primes.push(num);
      }
    }
    console.log(primes);
    console.log(millis() - startTime);
  }

}

function draw() {
  background(160);

}

function workerDone(e) {

  for (let i of e.data.primes) {
    allPrimes.push(i);
  }

  busyWorkers -= 1;
  console.log("Worker " + e.data.id +" is done");
  if (busyWorkers === 0) {
    clock2 = millis()
    console.log(clock2 - clock1);
    console.log(allPrimes);
  }

}

function checkPrime(num) {
  for (let i = 2; i <= sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}