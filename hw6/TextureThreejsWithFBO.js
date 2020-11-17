//
// Basic render-to-texture example in Three.js.
//



var OFFSCREEN_SIZE = 256;

// entry point when page is loaded
function main() {

  var ourCanvas = document.getElementById('theCanvas');
  var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});

  // *** this creates the FBO and sets the texture parameters ***
  rtTexture = new THREE.WebGLRenderTarget( OFFSCREEN_SIZE, OFFSCREEN_SIZE, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );

  // Set up the scene to render to texture, this code is just copied from RotatingSquare.js
  cameraRTT = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  cameraRTT.position.z = 1;
  sceneRTT = new THREE.Scene();

  // create a red square
  var geometry = new THREE.PlaneGeometry(1, 1);
  var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

  // vertical rectangle
  var rect1 = new THREE.Mesh(geometry, material);
  rect1.scale.set(.15, .4, 1.0);

  // horizontal rectangle
  var rect2 = new THREE.Mesh(geometry, material);
  rect2.scale.set(.4, .15, 1.0);

  // little square is a child of vertical rectangle
  var rect3 = new THREE.Mesh(geometry, material);
  rect1.add(rect3);
  rect3.translateY(1);
  rect3.scale.set(1, .15/.4, 1);

  sceneRTT.add(rect1);
  sceneRTT.add(rect2);

  // set up the main scene
  var scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 25, 1.0, 0.1, 1000 );
  camera.position.x = 5;
  camera.position.y = 5;
  camera.position.z = 5;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // create a texture-mapped cube
  var geometry = new THREE.BoxGeometry(1, 1, 1);

  // *** here is where we specify that we will sample from the render target's texture ***
  var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  var cube3 = new THREE.Mesh(geometry, material);
  sceneRTT.add(cube3);
  
  //var material2 = new THREE.MeshBasicMaterial( { color: 0xffffff} );
  var material2 = new THREE.MeshBasicMaterial( { color: 0xffffff, map: rtTexture.texture } );
  var cube2 = new THREE.Mesh(geometry, material2);
  cube2.scale.set(3, 3, 1);
  cube2.position.set(0, 0, -2);
  scene.add(cube2);

  // animation parameters copied from RotatingSquare.js
  var angle = 0.0;
  var increment = 1.0;

  var animate = function() {
    renderer.setClearColor(0x00cccc);
    //renderer.clear();

    // update red square positions
    var tx = .75 * Math.cos(angle * Math.PI / 180.0);
    var ty = .75 * Math.sin(angle * Math.PI / 180.0);
    rect1.position.set(tx, ty, 0.0);
    rect1.rotation.z = -2 * angle * Math.PI / 180.0;
    rect2.position.set(tx, ty, 0.0);
    rect2.rotation.z = -2 * angle * Math.PI / 180.0;
    angle += increment;
    if (angle >= 360) angle = 0;

    // update cube rotation by one degree
    cube.rotateY(Math.PI / 180.0);
    cube3.rotateY(Math.PI / 180.0);

    // *** This renders the first scene with the FBO as its target ***
    renderer.setRenderTarget(rtTexture);
    renderer.render(sceneRTT, cameraRTT); //, rtTexture, true);

    // render to canvas
    renderer.setRenderTarget(null);
    renderer.setClearColor(0x444444);
    renderer.render(scene, camera);

    requestAnimationFrame( animate );

  };

  // draw!
  animate();

}
