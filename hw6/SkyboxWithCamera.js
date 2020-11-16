//
// Skybox using Three.js.
//

// Helper function similar to loadOBJPromise in
// cs336util.js, for synchronously loading an
// OBJ file
function loadOBJPromise(filename)
{
  var doResolve;
  var callback = function(loadedModel, materials)
  {
    // assume only one object in the .obj file
    var child = loadedModel.children[0];

    // for the new (2015) obj file loader, this is an instance
    // of THREE.BufferGeometry
    var geometry = child.geometry;
    doResolve(geometry);
  };

  return new Promise(function (resolve) {
    doResolve = resolve; // move into outer scope
    var objLoader = new THREE.OBJLoader();
    objLoader.load(modelFilename, callback);
    }
  );
}

modelFilename = "../models/batman.obj";


var path = "../images/winter/winterskyday";
//var path = "../images/stars/Stargate";
////var path = "../images/sky/";
var imageNames = [
                  path + "lf.bmp",
                  path + "rt.bmp",
                  path + "up.bmp",
                  path + "dn.bmp",
                  path + "ft.bmp",
                  path + "bk.bmp"
                  ];


var axis = 'z';
var paused = false;
var camera;

//translate keypress events to strings
//from http://javascript.info/tutorial/keyboard-events
function getChar(event) {
if (event.which == null) {
 return String.fromCharCode(event.keyCode) // IE
} else if (event.which!=0 && event.charCode!=0) {
 return String.fromCharCode(event.which)   // the rest
} else {
 return null // special key
}
}

function cameraControl(c, ch)
{
  var distance = c.position.length();
  var q, q2;

  switch (ch)
  {
  // camera controls
  case 'w':
    c.translateZ(-0.1);
    return true;
  case 'a':
    c.translateX(-0.1);
    return true;
  case 's':
    c.translateZ(0.1);
    return true;
  case 'd':
    c.translateX(0.1);
    return true;
  case 'r':
    c.translateY(0.1);
    return true;
  case 'f':
    c.translateY(-0.1);
    return true;
  case 'j':
    // need to do extrinsic rotation about world y axis, so multiply camera's quaternion
    // on left
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  5 * Math.PI / 180);
    c.applyQuaternion(q);
    return true;
  case 'l':
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  -5 * Math.PI / 180);
    c.applyQuaternion(q);
    return true;
  case 'i':
    // intrinsic rotation about camera's x-axis
    c.rotateX(5 * Math.PI / 180);
    return true;
  case 'k':
    c.rotateX(-5 * Math.PI / 180);
    return true;
  case 'O':
    c.lookAt(new THREE.Vector3(0, 0, 0));
    return true;
  case 'S':
    c.fov = Math.min(80, c.fov + 5);
    c.updateProjectionMatrix();
    return true;
  case 'W':
    c.fov = Math.max(5, c.fov  - 5);
    c.updateProjectionMatrix();
    return true;

    // alternates for arrow keys
  case 'J':
    //this.orbitLeft(5, distance)
    c.translateZ(-distance);
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  5 * Math.PI / 180);
    c.applyQuaternion(q);
    c.translateZ(distance);
    return true;
  case 'L':
    //this.orbitRight(5, distance)
    c.translateZ(-distance);    
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  -5 * Math.PI / 180);
    c.applyQuaternion(q);
    c.translateZ(distance);
    return true;
  case 'I':
    //this.orbitUp(5, distance)
    c.translateZ(-distance);
    c.rotateX(-5 * Math.PI / 180);
    c.translateZ(distance);
    return true;
  case 'K':
    //this.orbitDown(5, distance)
    c.translateZ(-distance);
    c.rotateX(5 * Math.PI / 180);
    c.translateZ(distance);
    return true;
  }
  return false;
}

function handleKeyPress(event)
{
  var ch = getChar(event);
  if (cameraControl(camera, ch)) return;
}

async function start()
{
  var ourCanvas = document.getElementById('theCanvas');
  var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});

  window.onkeypress = handleKeyPress;

  var scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 45, 1.5, 0.1, 1000 );
  camera.position.x = 2;
  camera.position.y = 2;
  camera.position.z = 5;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // var geometry = await loadOBJPromise(modelFilename);
  // var material = new THREE.MeshPhongMaterial( { color: 0x00ff00, specular: 0x222222, shininess: 50} );

  // // // Create a mesh
  // var cube = new THREE.Mesh( geometry, material );
  // // // Add batsignal to the scene
  // scene.add(cube);


  // load the six images
  var ourCubeMap = new THREE.CubeTextureLoader().load( imageNames );

  // this is too easy, don't need a mesh or anything
  scene.background = ourCubeMap;

  var render = function () {
    requestAnimationFrame( render );
     renderer.render(scene, camera);
  };

  render();
}
