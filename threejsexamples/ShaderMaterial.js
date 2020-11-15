//
// Basic example using a custom shader with Three.js
//

// entry point when page is loaded
function main() {

  var ourCanvas = document.getElementById('theCanvas');
  //var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});
  let ourContext = ourCanvas.getContext("webgl", {alpha:false});
  var renderer = new THREE.WebGLRenderer({context: ourContext});
  renderer.setViewport(0, 0, 400, 400);


  renderer.setClearColor(0x00cccc);
  var scene = new THREE.Scene();

  // ortho args are left, right, top, bottom (backwards!), near, far
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 1;

  var vshaderSource = document.getElementById('vertexShader').textContent;
  var fshaderSource = document.getElementById('fragmentShader').textContent;


  // create a square
  var geometry = new THREE.PlaneGeometry(1, 1);
  var material = new THREE.ShaderMaterial({
    uniforms:{},
    vertexShader: vshaderSource,
    fragmentShader: fshaderSource} );

  var square = new THREE.Mesh(geometry, material);

  scene.add(square);

  var animate = function() {
    requestAnimationFrame( animate );
    renderer.render(scene, camera);
  };

  // draw!
  animate();

}
