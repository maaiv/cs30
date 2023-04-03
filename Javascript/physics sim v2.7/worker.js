

self.addEventListener("message", 
  function(e) {

    let vec = createVector(3,3); 
    let x = vec.x;
    self.postMessage(vec.x);
    self.close();
    
  }
);

