// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let mappedmouseX, cube, scene, camera;



function setup(){
scene = new THREE.Scene( );
  
scene.background = new THREE.Color("hsl(0,0,255)");
  
console.log(scene.background);
  

camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  
  
var renderer = new THREE.WebGLRenderer(); //like canvas
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


const light = new THREE.PointLight( new THREE.Color("hsl(0,0,255)", 1, 100 ));
light.position.set( 5, 5, 5 );
scene.add( light );
  
  

  
  
var shinyMaterial = new THREE.MeshPhongMaterial( { color: new THREE.Color("hsl(0,0,255)") , specular: new THREE.Color("hsl(0,0,255)")});

  
console.log(shinyMaterial.color);
  
var geometry = new THREE.BoxGeometry( 1, 1, 1 );

cube = new THREE.Mesh( geometry, shinyMaterial );
scene.add( cube );
  


  
let planeGeometry = new THREE.PlaneGeometry(5, 5);

ground = new THREE.Mesh( planeGeometry, shinyMaterial);
scene.add( ground );

  ground.rotation.x = 3*PI/2;
  ground.position.y = -1;
  
camera.position.z = 5;

  
  


    
  var animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
  };
    
animate();


}

function draw(){
  // mappedmouseX= map(mouseX, 0, 600, 0, 1, true);
  // cube.rotation.y = mappedmouseX;
  // console.log(mappedmouseX);
  
}
