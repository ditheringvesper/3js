
import * as THREE from "three";
import { FirstPersonControls } from "./firstPersonControls.js";
// import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

import { textInfo } from "./textInfo.js";
import { textMesh } from "./textMesh.js";

let scene, camera, renderer, mouse, raycaster;
let WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
let baseline = -100;

let controls;
let speed;
var timestamp = 0, mY = 0;
let textMeshObjects = [];
let raycastMeshObjects = [];

let textpairs = textInfo.txtPairs;
var caption = document.querySelector(".caption");

init();

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 5, Math.abs(baseline));
  scene.position.set(0, 0, 0);
  scene.scale.x = 1.2;

  // create a camera and position it in space
  let aspect = WIDTH*1.5/HEIGHT;
  camera = new THREE.PerspectiveCamera(500, aspect, 0.1, 1000000);
  camera.position.set(0,-15,10);
  camera.lookAt(0,0,0);
  camera.layers.set(0);

  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor( 0x000000, 0 ); // the default
  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.opacity = '0.5';
  renderer.domElement.style.mixBlendMode = "screen";
  renderer.domElement.style.zIndex= '5';

  let gridHelper = new THREE.GridHelper(20, 100);
  // scene.add(gridHelper);

  // raycaster
  mouse = new THREE.Vector2(0,0);
  raycaster = new THREE.Raycaster();
  raycaster.layers.set(0);

  // event listeners
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('resize', onResize);


  // add first person controls
  // controls = new FirstPersonControls(scene, camera, renderer);

  // Mesh 
  let gap = Math.random() * 30;

  for (let i = 0; i < textpairs.length; i++) {
    // add moving text with class, visible but not raycasted directly
    let x = gap * Math.random();
    let y = 9;
    let z = baseline - i * gap;
    let myText = new textMesh(x, y, z, textpairs[i].flowText, scene);
    // layer is set to 0; in textMesh.js class file.
    textMeshObjects.push(myText);

    // add raycasting mesh // testing...
    let planegeo = new THREE.PlaneGeometry(8, 1); // for interactive mesh
    let interactionMesh = new THREE.Mesh(planegeo, new THREE.MeshBasicMaterial({color: "red"}));
    interactionMesh.position.set(x, y, -10 + i * 5);
    interactionMesh.layers.set(0);
    interactionMesh.userData.textM = myText; // bound the visible mesh with the interactive mesh
    raycastMeshObjects.push(interactionMesh);
    scene.add(interactionMesh);
  }
  // var textObj = scene.getObjectById( textMeshObjects[1].textMeshId, true);
  // console.log(textMeshObjects[1].textMeshId);


  loop();

}

function loop() {

  // controls.update();

  for (let i = 0; i < textMeshObjects.length; i++) {
    textMeshObjects[i].update(speed);
    
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

function onResize(){
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize( WIDTH, HEIGHT);
}


function mouseMove(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 -1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  // update raycaster
  raycaster.setFromCamera(mouse, camera);
  // console.log(textMeshObjects.length);
  // const intersects = raycaster.intersectObjects(textMeshObjects);
  const intersects = raycaster.intersectObjects(raycastMeshObjects);

  console.log(intersects);

  // run an intersection check 
  if (intersects.length > 0 ){
    for (let i = 0; i < intersects.length; i++) {
      // // console.log(intersects[i]);
      // // intersects[i].object.position.y = 0;	
      // let id = intersects[i].object.userData.textM.id;
      // var object = scene.getObjectById( id, true );
			// var txtPointer = textpairs[textMeshObjects.indexOf(object)].flowText;
      //       console.log(object);

      let captionIndex = textpairs.find(function(textImg) {
        return textImg.flowText === textpairs[randomInt(0,8)].flowText; 
      });
      caption.innerHTML = captionIndex.cap;
    }
  } else{
    caption.innerHTML = "[...]";
  }

  // for (let i = 0; i < textMeshObjects.length; i++) {
  //   textMeshObjects[i].onRaycast(mouse, camera, textMeshObjects);
  // }


  var now = Date.now();
  var currentmY = e.screenY;
  var duration = now - timestamp;
  var distance = Math.abs(currentmY - mY);
  speed = Math.round(distance / duration * 1000);
  var preSpeed = speed; // record speed change.
  mY = currentmY;
  timestamp = now;
}

function randomInt(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}