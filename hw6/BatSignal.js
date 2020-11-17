//
// The spinning cube example, done in Three.js.
// Note there are several options for performing rotations, see the
// animation loop for examples and comments.
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
    objLoader.load(logoFile, callback);
    objLoader.load(batarangFile, callback);
    }
  );
}

batarangFile = "../models/batarang.obj";
logoFile = "../models/66logo.obj"

var OFFSCREEN_SIZE = 256;

var path = "../images/winter/winterskyday";
////var path = "../images/sky/";
var imageNames = [
                  path + "lf.bmp",
                  path + "rt.bmp",
                  path + "up.bmp",
                  path + "dn.bmp",
                  path + "ft.bmp",
                  path + "bk.bmp"
                  ];
var axis = 'y';
var paused = false;
var camera;
var scene;

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
  case 't':
    baseDummy.rotateY(5 * Math.PI / 180);
    break;
  case 'T':
    baseDummy.rotateY(-5 * Math.PI / 180);
    break;
  case 'u':
    rodDummy.rotateX(-5 * Math.PI / 180);
    break;
  case 'U':
    rodDummy.rotateX(5 * Math.PI / 180);
    break;
  case '1':
    path = "../images/winter/winterskyday";
    imageNames = [path + "lf.bmp", path + "rt.bmp", path + "up.bmp", path + "dn.bmp", path + "ft.bmp", path + "bk.bmp"];
    // load the six images
    var ourCubeMap = new THREE.CubeTextureLoader().load( imageNames );
    // this is too easy, don't need a mesh or anything
    scene.background = ourCubeMap;
    geometry = new THREE.SphereGeometry(1, 48, 24);
    geometry.computeFlatVertexNormals();
    material = new THREE.MeshBasicMaterial({color : 0xffffff, envMap : ourCubeMap});
    material.wireframe = false;
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(0, 3, 0);
    sphere.name = "mirror";
    var sphereObject = scene.getObjectByName("mirror");
    scene.remove(sphereObject);
    scene.add(sphere);
    break;
  case '2':
    path = "../images/stars/Stargate";
    imageNames = [path + "lf.bmp", path + "rt.bmp", path + "up.bmp", path + "dn.bmp", path + "ft.bmp", path + "bk.bmp"];
      // load the six images
      var ourCubeMap = new THREE.CubeTextureLoader().load( imageNames );
      // this is too easy, don't need a mesh or anything
      scene.background = ourCubeMap;
      geometry = new THREE.SphereGeometry(1, 48, 24);
      geometry.computeFlatVertexNormals();
      material = new THREE.MeshBasicMaterial({color : 0xffffff, envMap : ourCubeMap});
      material.wireframe = false;
      sphere = new THREE.Mesh( geometry, material );
      sphere.position.set(0, 3, 0);
      sphere.name = "mirror";
      var sphereObject = scene.getObjectByName("mirror");
      scene.remove(sphereObject);
      scene.add(sphere);
    break;
    default:
      return;
  }
}

async function start()
{
  // Create a threejs renderer from the canvas
  var ourCanvas = document.getElementById('theCanvas');
  var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  rtTexture = new THREE.WebGLRenderTarget( OFFSCREEN_SIZE, OFFSCREEN_SIZE, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );
  // Set up the scene to render to texture, this code is just copied from RotatingSquare.js
  cameraRTT = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  cameraRTT.position.y = 5;
  sceneRTT = new THREE.Scene();
  

  // create a scene and camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 30, 1.5, 0.1, 1000 );
  camera.position.x = 8;
  camera.position.y = 5;
  camera.position.z = -10;
  camera.lookAt(new THREE.Vector3(1, 2.5, 0));
  
  // key handler as usual
  window.onkeypress = handleKeyPress;

  var geometryCylinder = new THREE.CylinderBufferGeometry(1, 1, 1, 16); //for shaft
  var geometryBox = new THREE.BoxGeometry(1);
  
  var url = "../images/metal3.jpg";
  var loader = new THREE.TextureLoader();
  var texture = loader.load(url);
  // choose a model, possibly loading one from the named file
  var geometry = await loadOBJPromise(logoFile);
  var material = new THREE.MeshPhongMaterial( { map:texture, color: 0xffff00, specular: 0x222222, shininess: 10} );
  var cube = new THREE.Mesh( geometry, material );
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(-4, 4, 4);
  // Add it to the scene
  scene.add(cube);
  var url = "../images/metal.jpg";
  texture = loader.load(url);

  var boxGeometry = new THREE.BoxGeometry(1);
  var box = new THREE.Mesh( boxGeometry, material );
  box.scale.set(20, 10, 0.1);
  box.position.set(0, 5, 6.5);
  box.castShadow = true;
  box.receiveShadow = true;
  // Add it to the scene
  scene.add(box);


  var plane = new THREE.Mesh( boxGeometry, material ); // made with boxs for proper shadow
  plane.scale.set(18, 13, 0.1);
  plane.position.set(0, 0, 0);
  plane.rotateX(-90 * Math.PI / 180);
  plane.castShadow = true;
  plane.receiveShadow = true;
  // Add it to the scene
  scene.add(plane);




  //BatSignal
  var materialBlack = new THREE.MeshPhongMaterial( { map:texture, color: 0x989898, specular: 0x222222, shininess: 50} );
  var materialYellow = new THREE.MeshPhongMaterial( { map:texture, color: 0xFFFF00, specular: 0x222222, shininess: 50} );
  
  // base is parent of base, rod1, rod2 and housing dummy
  baseDummy = new THREE.Object3D();
  var base = new THREE.Mesh( geometryCylinder, materialBlack );
  base.scale.set(1, 0.3, 1);
  baseDummy.add(base);
  var rod1 = new THREE.Mesh( geometryBox, materialBlack );
  rod1.position.set(-0.6, 0.6, 0);
  rod1.scale.set(0.2, 1.5, 0.6);
  baseDummy.add(rod1);
  var rod2 = new THREE.Mesh( geometryBox, materialBlack );
  rod2.scale.set(0.2, 1.5, 0.6);
  rod2.position.set(0.6, 0.6, 0);
  baseDummy.add(rod2);

  //housingDummy is parent of housing and rotor dummy
  rodDummy = new THREE.Object3D();
  rodDummy.position.set(0, 1, 0);
  baseDummy.add(rodDummy);

  var backing = new THREE.Mesh( geometryCylinder, materialYellow);
  backing.scale.set(0.6, 0.2, 0.6);
  backing.position.set(0, 0, -0.6);
  backing.rotateX(90 * Math.PI / 180);
  rodDummy.add(backing);

  var extrudeSettings = {amount : 2, steps : 1, bevelEnabled: false, curveSegments: 16};
  var arcShape = new THREE.Shape();
  arcShape.absarc(0, 0, 0.6, 0, Math.PI * 2, 0, false);//cylinder outside
  var holePath = new THREE.Path();
  holePath.absarc(0, 0, 0.5, 0, Math.PI * 2, true);//cylinder to hollow out
  arcShape.holes.push(holePath);
  var geometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
  var material = new THREE.MeshPhongMaterial( { map:texture, color: 0x989898, specular: 0x222222, shininess: 50} );
  var hollow = new THREE.Mesh( geometry, material );
  hollow.scale.set(1, 1, 0.6);
  hollow.position.set(0, 0, -0.5);
  // Add it to the scene
  rodDummy.add(hollow);

  var geometry = await loadOBJPromise(batarangFile);
  var material = new THREE.MeshPhongMaterial( { map:texture, color: 0xffffff, specular: 0x222222, shininess: 50} );
  var symbol = new THREE.Mesh( geometry, material );
  symbol.scale.set(0.43, 0.43, 0.43);
  symbol.position.set(0, -0.1, 0.65);
  symbol.name = "symbol";
  symbol.castShadow = true;
  symbol.receiveShadow = true;
  rodDummy.add(symbol);


  var spotLight = new THREE.SpotLight( 0xffffff, 1);
  var lightBeam = rodDummy.getObjectByName("symbol");
  
  spotLight.position.set(0, 0, -0.5);
  spotLight.angle = 0.45;
  spotLight.distance = 160;
  spotLight.target = lightBeam;
  
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 0.5;
  spotLight.shadow.camera.far = 50;   

  rodDummy.add( spotLight );



  scene.add(baseDummy);



  // Make some axes, this will be a Line instead of a Mesh
  // var material = new THREE.LineBasicMaterial({color: 0xff0000});
  // var geometry = new THREE.Geometry();
  // geometry.vertices.push(
  //   new THREE.Vector3( 0, 0, 0 ),
  //   new THREE.Vector3( 2, 0, 0 )
  // );
  // var line = new THREE.Line( geometry, material );
  // scene.add( line );

  // material = new THREE.LineBasicMaterial({color: 0x00ff00});
  // geometry = new THREE.Geometry();
  // geometry.vertices.push(
  //   new THREE.Vector3( 0, 0, 0 ),
  //   new THREE.Vector3( 0, 2, 0 )
  // );
  // line = new THREE.Line( geometry, material );
  // scene.add( line );

  // material = new THREE.LineBasicMaterial({color: 0x0000ff});
  // geometry = new THREE.Geometry();
  // geometry.vertices.push(
  //   new THREE.Vector3( 0, 0, 0 ),
  //   new THREE.Vector3( 0, 0, 2 )
  // );
  // line = new THREE.Line( geometry, material );
  // scene.add( line );


  var boxGeometry = new THREE.BoxGeometry(1);
  //var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: rtTexture.texture } );
  var box = new THREE.Mesh( boxGeometry, material );
  box.scale.set(20, 10, 0.1);
  box.position.set(-8.5, 5, 0);
  box.rotateY(90 * Math.PI / 180);
  box.castShadow = true;
  box.receiveShadow = true;
  // Add it to the scene
  scene.add(box);


  // Put a point light in the scene
  var light = new THREE.PointLight(0xffffff, 1.0);
  light.position.set(-2, 3, 5);
  scene.add(light);

  // Put in an ambient light too
  light = new THREE.AmbientLight(0x555555);
  scene.add(light);

  //cube.position.set(0.5, 0, 0);

    // load the six images
  var ourCubeMap = new THREE.CubeTextureLoader().load( imageNames );

  // this is too easy, don't need a mesh or anything
  scene.background = ourCubeMap;

  
  // put another object in the scene
  //geometry = new THREE.SphereGeometry(1);
  // geometry = new THREE.SphereGeometry(1, 48, 24);
  // // replaces vertex normals with face normals
  // geometry.computeFlatVertexNormals();
  // // to make it look reflective, set the envMap property
  // // we can also set the base color or reflectivity (default 1.0)
  // material = new THREE.MeshBasicMaterial({color : 0xffffff, envMap : ourCubeMap});
  // //material = new THREE.MeshBasicMaterial({color : 0x00ff00, envMap : ourCubeMap, reflectivity : .7});
  // // (Note: to get refraction need to set mapping property to THREE.CubeRefractionMapping, see below.)
  // //ourCubeMap.mapping = THREE.CubeRefractionMapping;
  // //material = new THREE.MeshBasicMaterial({color : 0xffffff, envMap : ourCubeMap,  refractionRatio : .8});
  // material.wireframe = false;
  // var sphere = new THREE.Mesh( geometry, material );
  // sphere.name = "mirror";
  // sphere.position.set(0, 3, 0);
  // scene.add(sphere);
  




  var render = function () {
    renderer.setRenderTarget(rtTexture);
    renderer.render(sceneRTT, cameraRTT); //, rtTexture, true);
    // render to canvas
    renderer.setRenderTarget(null);
    renderer.setClearColor(0x444444);

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


      requestAnimationFrame( render );
    }
  };

  render();
}
