

self.addEventListener("message", 
  function(e) {
    self.postMessage("yooo " + e.data);
    self.close();
    
  }
);

