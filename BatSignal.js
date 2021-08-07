/**
 * 
 * I Started with "../threejsexamples/RotatingCubeWithModel.js", I used the camera controls from the examples.
  I added 2 variations of a skybox, a snow skybox, and a space skybox. After adding all of that I decided on making the bat signal.
  I found the batman symbol on thingiverse and converted it to and obj and unwrapped its coordinates in blender. I modeled the batman logo in blender by converting an .svg to a mesh and extruding it, also in blender. I used heirarchy to create the bat signal that way it could be adjusted easily and controlled. I added metal textures to the different objects as well. I decided to render the Batman '66 logo in the framebuffer and give the ability to change the background colors of it. The purple cubes use heirarchy, are animated, and have a blue spotlight following the top cube. I also added a green spotlight around the batsignal. I didn't add all 6 walls for a room that way it was easier to see the skybox.
 */

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

batarangFile = "batarang.obj";
logoFile = "logo66.obj"

var OFFSCREEN_SIZE = 512;

var path = "images/winter/winterskyday";
var imageNames = [
                  path + "lf.bmp",
                  path + "rt.bmp",
                  path + "up.bmp",
                  path + "dn.bmp",
                  path + "ft.bmp",
                  path + "bk.bmp"
                  ];
var axis = 'y';
var logoColor = 'g';
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

//Controls for the camera
function cameraControl(c, ch)
{
  var distance = c.position.length();
  var q, q2;

  switch (ch)
  {
  // camera controls
  case 'w':
    c.translateZ(-0.3);
    return true;
  case 'a':
    c.translateX(-0.3);
    return true;
  case 's':
    c.translateZ(0.3);
    return true;
  case 'd':
    c.translateX(0.3);
    return true;
  case 'r':
    c.translateY(0.3);
    return true;
  case 'f':
    c.translateY(-0.3);
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

//Handles all the kinds of key presses
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

  //Handles the batsignal movement
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

  //Handles the skybox change
  case '1':
    path = "images/winter/winterskyday";
    imageNames = [path + "lf.bmp", path + "rt.bmp", path + "up.bmp", path + "dn.bmp", path + "ft.bmp", path + "bk.bmp"];
    var ourCubeMap = new THREE.CubeTextureLoader().load( imageNames );
    scene.background = ourCubeMap;
    break;
  case '2':
    path = "images/stars/Stargate";
    imageNames = [path + "lf.bmp", path + "rt.bmp", path + "up.bmp", path + "dn.bmp", path + "ft.bmp", path + "bk.bmp"];
      var ourCubeMap = new THREE.CubeTextureLoader().load( imageNames );
      scene.background = ourCubeMap;
    break;

  //Handles the background color in the frame buffer
  case '3':
    logoColor = 'g';
    break;
  case '4':
    logoColor = 'y';
    break;
  case '5':
    logoColor = 'b';
    break;
  case '6':
    logoColor = 'r';
    break;
  case '7':
    logoColor = 'p';
    break;
    default:
      return;
  }
}

//Actually creates and renders things
async function start()
{
  // Create a threejs renderer from the canvas
  var ourCanvas = document.getElementById('theCanvas');
  var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  /**-----------------------------Framebuffer Scene and Camera------------------------- */
  rtTexture = new THREE.WebGLRenderTarget( OFFSCREEN_SIZE, OFFSCREEN_SIZE, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );
  // Set up the scene to render to texture, for framebuffer
  cameraRTT = new THREE.PerspectiveCamera( 30, 1.5, 0.1, 1000 );
  cameraRTT.position.x = 0;
  cameraRTT.position.y = 5;
  cameraRTT.position.z = -5;
  cameraRTT.lookAt(new THREE.Vector3(0, 5, 0));
  sceneRTT = new THREE.Scene();
  

  /**-----------------------------Scene and Camera------------------------- */
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 30, 1.5, 0.1, 1000 );
  camera.position.x = 5;
  camera.position.y = 8;
  camera.position.z = -25;
  camera.lookAt(new THREE.Vector3(1, 4, 0));
  
  // key handler as usual
  window.onkeypress = handleKeyPress;

  var geometryCylinder = new THREE.CylinderBufferGeometry(1, 1, 1, 16); 
  var geometryBox = new THREE.BoxGeometry(1);
  
  /**-----------------------------Batman Logo for the Framebuffer------------------------- */

  var url = "images/metal2.jpg"; 
  var loader = new THREE.TextureLoader();
  var texture = loader.load(url);
  var geometry = await loadOBJPromise(logoFile);
  var materialLogo = new THREE.MeshPhongMaterial( { color: 0xffff00, specular: 0x222222, shininess: 10} );
  var cube = new THREE.Mesh( geometry, materialLogo );
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(0, 5, 0);
  // Add it to the framebuffer
  sceneRTT.add(cube);

  
  /**-----------------------------Regular Walls in the Scene------------------------- */

  var material = new THREE.MeshPhongMaterial( { map:texture, color: 0xffff00, specular: 0x222222, shininess: 10} );
  var url = "images/metal.jpg";
  texture = loader.load(url);

  //Wall plane on the positive x axis
  var planeGeometry = new THREE.PlaneGeometry(1);
  var plane1 = new THREE.Mesh( planeGeometry, material );
  plane1.scale.set(20, 10, 0.1);
  plane1.position.set(0, 5, 6.5);
  plane1.castShadow = true;
  plane1.receiveShadow = true;
  plane1.rotateY(180 * Math.PI / 180);
  scene.add(plane1);// Add it to the scene

  //Wall Plane on the positive Z axis
  var materialWhite = new THREE.MeshPhongMaterial( { map:texture, color: 0xFFFFFF, specular: 0x222222, shininess: 10} );
  var plane2 = new THREE.Mesh( planeGeometry, materialWhite );
  plane2.scale.set(13, 10, 0.1);
  plane2.position.set(10, 5, 0);
  plane2.castShadow = true;
  plane2.receiveShadow = true;
  plane2.rotateY(-90 * Math.PI / 180);
   scene.add(plane2);// Add it to the scene

  var url = "images/metal2.jpg"; 
  var loader = new THREE.TextureLoader();
  var texture = loader.load(url);
  var material = new THREE.MeshPhongMaterial( { map:texture, color: 0xffffff, specular: 0x222222, shininess: 10} );

  //Floor Plane
  var plane3 = new THREE.Mesh( planeGeometry, material ); 
  plane3.scale.set(20, 13, 0.1);
  plane3.position.set(0, 0, 0);
  plane3.rotateX(-90 * Math.PI / 180);
  //plane3.castShadow = true;
  plane3.receiveShadow = true;
  scene.add(plane3);// Add it to the scene
  



  /**-----------------------------Bat Signal in the Scene------------------------- */

  var url = "images/metal.jpg"; //loading the 
  var loader = new THREE.TextureLoader();
  var texture = loader.load(url);
  var material = new THREE.MeshPhongMaterial( { map:texture, color: 0xffff00, specular: 0x222222, shininess: 10} );
  
  var materialBlack = new THREE.MeshPhongMaterial( { map:texture, color: 0x989898, specular: 0x222222, shininess: 50} );
  const white = new THREE.Color(0xFFFFFF);
  var materialWhiteLight = new THREE.MeshPhongMaterial( {color: 0xFFFFFF, specular: 0x222222, shininess: 50, emissive: white} );
  var materialYellow = new THREE.MeshPhongMaterial( { map:texture, color: 0xFFFF00, specular: 0x222222, shininess: 50} );

  //Box the light is on
  var baseBox = new THREE.Mesh( geometryBox, materialBlack);
  baseBox.scale.set(2, 0.5, 2);
  baseBox.position.set(0, 0.25, 0);
  baseBox.castShadow = true;
  baseBox.receiveShadow = true;
  scene.add(baseBox);


  // basedummy is parent of base, rod1, rod2 and housing dummy
  baseDummy = new THREE.Object3D();
  //circular base
  var base = new THREE.Mesh( geometryCylinder, materialBlack );
  baseDummy.position.set(0, 0.6, 0);
  base.scale.set(1, 0.3, 1);
  base.castShadow = true;
  base.receiveShadow = true;
  baseDummy.add(base);
  //side rod base to hold cylinder
  var rod1 = new THREE.Mesh( geometryBox, materialBlack );
  rod1.position.set(-0.6, 0.6, 0);
  rod1.scale.set(0.2, 1.5, 0.6);
  rod1.castShadow = true;
  rod1.receiveShadow = true;
  baseDummy.add(rod1);
  //other side rod base to hold cylinder
  var rod2 = new THREE.Mesh( geometryBox, materialBlack );
  rod2.scale.set(0.2, 1.5, 0.6);
  rod2.position.set(0.6, 0.6, 0);
  rod2.castShadow = true;
  rod2.receiveShadow = true;
  baseDummy.add(rod2);

  //rodDummy is parent of backing, cylinder, batsymbol, and light
  rodDummy = new THREE.Object3D();
  rodDummy.position.set(0, 1, 0);
  rodDummy.rotateX(-15 * Math.PI / 180);
  baseDummy.add(rodDummy);

  //gives the backing so we can't just see through the mesh
  var backing = new THREE.Mesh( geometryCylinder, materialYellow);
  backing.scale.set(0.6, 0.2, 0.6);
  backing.position.set(0, 0, -0.6);
  backing.rotateX(90 * Math.PI / 180);
  backing.castShadow = true;
  backing.receiveShadow = true;
  rodDummy.add(backing);

  //gives the backing light to give the illusion a light is in the cylinder
  var backingLight = new THREE.Mesh( geometryCylinder, materialWhiteLight);
  backingLight.scale.set(0.4, 0.2, 0.4);
  backingLight.position.set(0, 0, -0.45);
  backingLight.rotateX(90 * Math.PI / 180);
  rodDummy.add(backingLight);

  //gives the cylinder to hold the light
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
  hollow.castShadow = true;
  hollow.receiveShadow = true;
  // Add it to the scene
  rodDummy.add(hollow);

  //gives it the shade for the bat symbol
  var geometry = await loadOBJPromise(batarangFile);
  var material = new THREE.MeshPhongMaterial( { map:texture, color: 0xffffff, specular: 0x222222, shininess: 50} );
  var symbol = new THREE.Mesh( geometry, material );
  symbol.scale.set(0.43, 0.43, 0.43);
  symbol.position.set(0, -0.1, 0.65);
  symbol.name = "symbol";
  symbol.castShadow = true;
  symbol.receiveShadow = true;
  rodDummy.add(symbol);

  //Actual spotlight that comes out of the bat signal
  var spotLight = new THREE.SpotLight( 0xffffff, 1.5);
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

  /**-----------------------------Three Purple Boxes in the Scene------------------------- */

  //Box dummy parent of boxdummy2 and box1
  var boxDummy = new THREE.Object3D();
  boxDummy.position.set(7, 1, 0); 
  var material = new THREE.MeshPhongMaterial( {  map:texture, color: 0x6a0dad, specular: 0x222222, shininess: 75} );
  var box1 = new THREE.Mesh( geometryBox, material );
  box1.position.set(0, 0.5, 0);
  box1.castShadow = true;
  box1.receiveShadow = true;
  boxDummy.add(box1);

  //Box dummy2 parent of boxdummy3 and box2
  var boxDummy2 = new THREE.Object3D();
  boxDummy2.position.set(0, 1, 0);
  boxDummy.add(boxDummy2);
  var box2 = new THREE.Mesh( geometryBox, material );
  box2.position.set(0, 1, 0);
  box2.castShadow = true;
  box2.receiveShadow = true;
  boxDummy2.add(box2);

  //Box dummy3 parent of box3
  var boxDummy3 = new THREE.Object3D();
  boxDummy3.position.set(0, 1.5, 0);
  boxDummy2.add(boxDummy3);
  var box3 = new THREE.Mesh( geometryBox, material );
  boxDummy3.name = "boxDummy3";
  box3.position.set(0, 1, 0);
  box3.castShadow = true;
  box3.receiveShadow = true;
  boxDummy3.add(box3);

  scene.add(boxDummy);

  /**-----------------------------Extra Spotlights in the Scene------------------------- */

  //Green spotlight towards the bat signal
  var spotLight2 = new THREE.SpotLight( 0x00ff00, 1);
  
  spotLight2.position.set(-7, 5, 5);
  spotLight2.angle = 0.35;
  spotLight2.distance = 160;
  
  spotLight2.castShadow = true;
  spotLight2.shadow.mapSize.width = 1024;
  spotLight2.shadow.mapSize.height = 1024;
  spotLight2.shadow.camera.near = 0.5;
  spotLight2.shadow.camera.far = 50;   
  scene.add(spotLight2);


  //Blue spotlight directed at the top purple cube
  var spotLight3 = new THREE.SpotLight( 0x0000ff, 4);
  var lightBeam = boxDummy.getObjectByName("boxDummy3");
  spotLight3.position.set(-5, 5, -4);
  spotLight3.angle = 0.30;
  spotLight3.distance = 160;
  spotLight3.target = lightBeam;
  
  spotLight3.castShadow = true;
  spotLight3.shadow.mapSize.width = 1024;
  spotLight3.shadow.mapSize.height = 1024;
  spotLight3.shadow.camera.near = 0.5;
  spotLight3.shadow.camera.far = 50;   
  scene.add(spotLight3);


  /**-----------------------------Framebuffer Wall in the Scene------------------------- */

  //Wall used for the framebuffer
  var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: rtTexture.texture} );
  var plane3 = new THREE.Mesh( planeGeometry, material );
  plane3.scale.set(13, 10, 0.1);
  plane3.position.set(-10, 5, 0);
  plane3.rotateY(90 * Math.PI / 180);
  plane3.castShadow = true;
  plane3.receiveShadow = true;
  // Add it to the scene
  scene.add(plane3);

  /**-----------------------------Other lights in the Scene------------------------- */

  // Put a point light in the scene
  var light = new THREE.PointLight(0xffffff, 1.0);
  light.position.set(-2, 3, 5);
  scene.add(light);

  // Put in an ambient light too
  light = new THREE.AmbientLight(0x555555);
  scene.add(light);

  /**-----------------------------Skybox in the Scene------------------------- */
  // load the six images
  var ourCubeMap = new THREE.CubeTextureLoader().load( imageNames );

  // this is too easy, don't need a mesh or anything
  scene.background = ourCubeMap;

  


  var degrees = 0;
  var animate = 1;

  var render = function () {
    renderer.setRenderTarget(rtTexture);
    renderer.render(sceneRTT, cameraRTT); 
    // render to canvas
    renderer.setRenderTarget(null);
    

    renderer.render(scene, camera);
    var increment = 1 * Math.PI / 180.0;  // convert to radians
    if (!paused)
    {

      //Animating the purple cubes
      if(animate){ 
        degrees++;
        boxDummy.rotateX(1 * Math.PI / 180);
        boxDummy2.rotateX(1 * Math.PI / 180);
        boxDummy3.rotateX(1 * Math.PI / 180);
        if(degrees >= 50){
          animate = 0;
        }
      }
      else{
        degrees--;
        boxDummy.rotateX(-1 * Math.PI / 180);
        boxDummy2.rotateX(-1 * Math.PI / 180);
        boxDummy3.rotateX(-1 * Math.PI / 180);
        if(degrees <= -50){
          animate = 1;
        }
      }

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
    //Switches the logo color in the frame buffer
    switch(logoColor){
      case 'g':
        renderer.setClearColor(0x00AA00);
        break;
      case 'y':
        renderer.setClearColor(0xFFF82B);
        break;
      case 'b':
        renderer.setClearColor(0x007BFF);
        break;
      case 'r':
        renderer.setClearColor(0xDD0000);
        break;
      case 'p':
        renderer.setClearColor(0xAA00AA);
        break;
      default:
    }

    requestAnimationFrame( render );
  };

  render();
}
