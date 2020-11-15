//
// Drawing a square in Three.js
//
function main() {

  // create a renderer
  var ourCanvas = document.getElementById('theCanvas');
  let ourContext = ourCanvas.getContext("webgl", {alpha:false});
  var renderer = new THREE.WebGLRenderer({context: ourContext});
  renderer.setViewport(0, 0, 400, 400);

  //var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});
  renderer.setClearColor(0x00cccc);

  // create a scene
  var scene = new THREE.Scene();

  // create a camera
  // ortho args are left, right, top, bottom (backwards!!), near, far
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

  // create the geometry
  var geometry = new THREE.PlaneGeometry(1, 1);

  // create the material
  var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

  // create a mesh using the geometry and material
  var rect1 = new THREE.Mesh(geometry, material);

  // add the object to the scene
  scene.add(rect1);

  // render the scene using the camera
  var animate = function() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  // go!
  animate();

}
