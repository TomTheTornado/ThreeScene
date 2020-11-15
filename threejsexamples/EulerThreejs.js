//
// Same as our original example Euler.js, done in Three.js.
// Note that to use our preferred convention of
// intrinsic Head-Pitch-Roll, we have to explicitly set
// the rotation order in the Three.js object to "YXZ"
//

// keep track of the angles
var head = 0.0;
var pitch = 0.0;
var roll = 0.0;


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

//handler for key press events will update modelMatrix based
//on key press and radio button state
function handleKeyPress(event)
{
//var m = new Matrix4();
var ch = getChar(event);
var text = "I";
switch(ch)
{
case 'x':
  pitch += 15;
  if (pitch >= 360) pitch = 0;
  break;
case 'y':
  head += 15;
  if (head >= 360) head = 0;
  break;
case 'z':
  roll += 15;
  if (roll >= 360) roll = 0;
  break;
case 'X':
  pitch -= 15;
  if (pitch <= -360) pitch = 0;
  break;
case 'Y':
  head -= 15;
  if (head <= -360) head = 0;
  break;
case 'Z':
  roll -= 15;
  if (roll <= -360) roll = 0;
  break;
case 'o':
  pitch = head = roll = 0.0;
  break;
  default:
    return;
}

  // update output window
  var outputWindow = document.getElementById("displayMatrices");
  outputWindow.innerHTML = "RotateY(" + head + ") * RotateX(" + pitch + ") * RotateZ(" + roll + ")";
  //console.log(transformations);

  //model = model.setRotate(head, 0, 1, 0).rotate(pitch, 1, 0, 0).rotate(roll, 0, 0, 1);
}


function start()
{
  window.onkeypress = handleKeyPress;

  var scene = new THREE.Scene();

  // note y bounds are upside down
  var camera = new THREE.OrthographicCamera(-1.5, 1.5, 1, -1, 0.1, 1000);

  camera.position.x = 2;
  camera.position.y = 2;
  camera.position.z = 5;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var ourCanvas = document.getElementById('theCanvas');

  var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});
  renderer.setClearColor(0xffffff);

  var holder = new THREE.Object3D();

  // set the rotation order for Euler angles for this object
  holder.rotation.order = "YXZ";  // intrinsic head, pitch, roll

  // draw a triangle and then make the geometry from it
  var triangleShape = new THREE.Shape();
  triangleShape.moveTo(.75, -.75);
  triangleShape.lineTo( 0.0, .75);
  triangleShape.lineTo( -.75, -.75);
  triangleShape.lineTo( .75, -.75);

  var geometry = new THREE.ShapeGeometry( triangleShape );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );  // cyan
  material.side = THREE.DoubleSide;
  var triangle = new THREE.Mesh( geometry, material );
  holder.add(triangle);
  triangle.translateZ(-0.5);

  // same geometry, different material and different position
  material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); // yellow
  material.side = THREE.DoubleSide;
  var triangle2 = new THREE.Mesh( geometry, material );
  triangle2.translateZ(0.5);
  holder.add(triangle2);

  // create the three black lines
  material = new THREE.LineBasicMaterial({color: 0x000000});
  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( -0.8, 0, 0 ),
    new THREE.Vector3( 0.8, 0, 0 ),
  );
  var line = new THREE.Line( geometry, material, THREE.LinePieces );
  holder.add(line);

  material = new THREE.LineBasicMaterial({color: 0x000000});
  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( 0, -0.8, 0 ),
    new THREE.Vector3( 0.0, 0.8, 0 ),
  );
  line = new THREE.Line( geometry, material, THREE.LinePieces );
  holder.add(line);

  material = new THREE.LineBasicMaterial({color: 0x000000});
  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( 0, 0, -0.8 ),
    new THREE.Vector3( 0, 0, 0.8 )
  );
  line = new THREE.Line( geometry, material, THREE.LinePieces );
  holder.add(line);

  scene.add( holder );

  // geometry for the three axes
  material = new THREE.LineBasicMaterial({color: 0xff0000});
  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 2, 0, 0 )
  );
  line = new THREE.Line( geometry, material );
  scene.add( line );

  material = new THREE.LineBasicMaterial({color: 0x00ff00});
  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 0, 2, 0 )
  );
  line = new THREE.Line( geometry, material );
  scene.add( line );

  material = new THREE.LineBasicMaterial({color: 0x0000ff});
  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 0, 0, 2 )
  );
  line = new THREE.Line( geometry, material );
  scene.add( line );


  var render = function () {
    requestAnimationFrame( render );

    holder.rotation.z = roll * Math.PI / 180;
    holder.rotation.x = pitch * Math.PI / 180;
    holder.rotation.y = head * Math.PI / 180;


    renderer.render(scene, camera);
  };

  render();
}
