//
// The spinning cube example, done in Three.js.
//

var path = "../images/park/";
////var path = "../images/sky/";
var imageNames = [
                  path + "px.jpg",
                  path + "nx.jpg",
                  path + "py.jpg",
                  path + "ny.jpg",
                  path + "pz.jpg",
                  path + "nz.jpg"
                  ];


var axis = 'z';
var paused = false;


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

function handleKeyPress(event)
{
  var ch = getChar(event);
  switch(ch)
  {
  case ' ':
    paused = !paused;
    break;
  case 'x':
    axis = 'x';
    break;
  case 'y':
    axis = 'y';
    break;
  case 'z':
    axis = 'z';
    break;
  case 'o':
    model.setIdentity();
    axis = 'x';
    break;
    default:
      return;
  }
}

function start()
{
  // Create a threejs renderer from the canvas
  var ourCanvas = document.getElementById('theCanvas');
  var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});

  // key handler as usual
  window.onkeypress = handleKeyPress;

  // create a scene and camera
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 30, 1.5, 0.1, 1000 );
  camera.position.x = 2;
  camera.position.y = 2;
  camera.position.z = 5;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var url = "../images/check64border.png";
  var loader = new THREE.TextureLoader();
  var texture = loader.load(url);

  //var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var geometry = new THREE.SphereGeometry(1);

  var material = new THREE.MeshPhongMaterial( { map:texture, color: 0xffffff, specular: 0x222222, shininess: 50} );
  //var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x222222, shininess: 50} );

  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  // texture parameters.  See the Texture class for properties, and
  // see "Textures" in the documentation for names of constants
   texture.magFilter = THREE.NearestFilter;
  // texture.minFilter = THREE.NearestFilter;
  //texture.wrapS = THREE.ClampToEdgeWrapping;
  //texture.wrapT = THREE.ClampToEdgeWrapping;



  // Make some axes, this will be a Line instead of a Mesh
  var material = new THREE.LineBasicMaterial({color: 0xff0000});
  var geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 2, 0, 0 )
  );
  var line = new THREE.Line( geometry, material );
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

  // Put a point light in the scene
  var light = new THREE.PointLight(0xffffff, 1.0);
  light.position.set(-2, 3, 5);
  scene.add(light);

  // Put in an ambient light too
  light = new THREE.AmbientLight(0x555555);
  scene.add(light);

  var render = function () {
    renderer.render(scene, camera);
    var increment = 0.5 * Math.PI / 180.0;  // convert to radians

    if (!paused)
    {

      // Note about rotations: it is tempting to use cube.rotation.x += increment
      // here.  But that won't give the behavior we expect, because threejs uses
      // the 'rotation' attribute as a set of Euler angles, applied in a specific
      // order. See EulerThreejs.js.
      //
      // In most applications you would use methods for "intrinsic" rotations,
      // rotateX(), rotateY(), and rotateZ(), rotateOnAxis().
     // switch(axis)
     // {
     // case 'x':
     //   cube.rotateX(increment);
     //   break;
     // case 'y':
     //   cube.rotateY(increment);
     //   break;
     // case 'z':
     //   cube.rotateZ(increment);
     //   break;
     // default:
     // }

      //
      // To get extrinsic rotations as in the example we did before, one option is
      // to use applyMatrix.
      // The applyMatrix performs a left-multiplication of the object's
      // complete translation * rotation * scale by the given matrix,
      // and then updates the translation, rotation, and scale from it.
      // However, a warning: if you alter the object by setting some
      // other attribute such as the position, you have to call updateMatrix()
      // before calling applyMatrix.  Otherwise it will just perform a multiplication
      // of the current matrix without taking the position into account.
      // switch(axis)
      // {
      // case 'x':
      //   cube.applyMatrix(new THREE.Matrix4().makeRotationX(increment));
      //   break;
      // case 'y':
      //   cube.applyMatrix(new THREE.Matrix4().makeRotationY(increment));
      //   break;
      // case 'z':
      //   cube.applyMatrix(new THREE.Matrix4().makeRotationZ(increment));
      //   break;
      // default:
      // }

      // A third option is if you want to do an extrinsic rotation about
      // the object's center.  In that case, you have to update the
      // rotation of the object, not the combined TRS matrix.
      // Again, you can't just alter the 'rotation.xyz' attributes,
      // because those are Euler angles.  Internally, the rotation
      // is stored as a quaternion, and we can left-multiply it by
      // another quaternion to get an extrinsic rotation.
     var q, q2;
     switch(axis)
     {
     case 'x':
       // create a quaternion representing a rotation about x axis
       q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0),  increment);

       // copy the object's current quaternion
       q2 = new THREE.Quaternion().copy(cube.quaternion);

       // multiply on left and set
       cube.quaternion.copy(q).multiply(q2);
       break;
     case 'y':
       q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  increment);
       q2 = new THREE.Quaternion().copy(cube.quaternion);
       cube.quaternion.copy(q).multiply(q2);
       break;
     case 'z':
       q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1),  increment);
       q2 = new THREE.Quaternion().copy(cube.quaternion);
       cube.quaternion.copy(q).multiply(q2);
       break;
     default:
     }

   }

  requestAnimationFrame( render );

  };

  render();
}