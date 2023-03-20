// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let renderer, ptLight, material, geometry, mappedmouseX, cube, scene, camera;



function setup(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color("hsl(0,0,255)");
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.set( 0, 0.5, 5 );
 
  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.shadowMap.enabled = true;
  document.body.appendChild( renderer.domElement );

  // Light

  scene.add( new THREE.AmbientLight( new THREE.Color(1,1,1), 0.1 ) );

  ptLight = new THREE.PointLight( new THREE.Color(1,1,1), 0.7);
  ptLight.position.set( 0, 3, 3 );
  ptLight.castShadows = true;
  ptLight.shadow.mapSize.width = 1024;
  ptLight.shadow.mapSize.height = 1024;
  ptLight.shadow.camera.near = 3;
  ptLight.shadow.camera.far = 10;
  scene.add( ptLight );
    



  // Geometry
  material = new THREE.MeshPhongMaterial( {
    color: new THREE.Color(0,0,1), 
    specular: new THREE.Color(0.4,0.4,0.4),
    shininess: 10,
    side: THREE.DoubleSide,
  } );
  



  var shinyMaterial = new THREE.MeshPhongMaterial( { color: new THREE.Color("hsl(0,0,255)") , specular: new THREE.Color("hsl(0,0,255)")});

    
  console.log(shinyMaterial.color);
    

  var geometry = new THREE.BoxGeometry( 1, 1, 1 );

  cube = new THREE.Mesh( geometry, material );
  cube.castShadow = true;
  scene.add( cube );

    


    
  let planeGeometry = new THREE.PlaneGeometry(5, 5);

  ground = new THREE.Mesh( planeGeometry, shinyMaterial);
  ground.receiveShadow = true;
  scene.add( ground );

    ground.rotation.x = 3*PI/2;
    ground.position.y = -1;
    


    


      
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
