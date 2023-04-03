let startNum, total;

let myPrimes = [], id;

this.onmessage = function(e) {
    startNum = e.data.start;
    total = e.data.total;
    id = e.data.id;
    for (let num = startNum; num < total + startNum; num++) {
      if (checkPrime(num)) {
        myPrimes.push(num);
      }
    }
    this.postMessage({primes: myPrimes, id:id, length:myPrimes.length});

}



function checkPrime(num) {
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}