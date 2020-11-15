//
// Basic texture mapping example in Three.js.
//


// entry point when page is loaded
function main() {

  var ourCanvas = document.getElementById('theCanvas');
  var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});
  renderer.setClearColor(0x00cccc);
  var scene = new THREE.Scene();

  // ortho args are left, right, top, bottom (backwards!), near, far
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 1;

  // load texture map
  //var url = "../images/check64border.png";
  var url = "../images/clover_really_small.jpg";

  // deprecated technique
  //var texture = THREE.ImageUtils.loadTexture(url);

  var loader = new THREE.TextureLoader();
  var texture = loader.load(url);

  var geometry = new THREE.PlaneGeometry(1, 1);
  var material = new THREE.MeshBasicMaterial( { map: texture } );
  var square = new THREE.Mesh(geometry, material);
  scene.add(square);

  // texture parameters.  See the Texture class for properties, and
  // see "Textures" in the documentation for names of constants
  //texture.magFilter = THREE.NearestFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.NearestFilter;

  // texture parameters.  See the Texture class for properties, and
  // see "Textures" in the documentation for names of constants
  // texture.magFilter = THREE.NearestFilter;
  // texture.minFilter = THREE.NearestFilter;
  //texture.wrapS = THREE.ClampToEdgeWrapping;
  //texture.wrapT = THREE.ClampToEdgeWrapping;

  var animate = function() {
    requestAnimationFrame( animate );
    renderer.render(scene, camera);
  };

  // draw!
  animate();

}
