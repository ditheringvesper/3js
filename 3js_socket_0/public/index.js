/*
This example sets up a simple three.js scene which connects to a websocket server.

*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer;

let desktop;
let mouse;
let socket; // create a global socket object

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();

  // create a camera and position it in space
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 5; // place the camera in space
  camera.position.y = 5;
  camera.lookAt(0, 0, 0);

  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // add shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  let desktopGeo = new THREE.BoxGeometry(25.6, 0.1, 16);
  let desktopTex = new THREE.TextureLoader().load( "desktop.png" );
  let desktopMat = new THREE.MeshPhongMaterial({ 
    color: "white",
    map: desktopTex,
  });
  desktop = new THREE.Mesh(desktopGeo, desktopMat);
  scene.add(desktop);
  desktop.receiveShadow = true;
  desktop.rotateX(-10);


  // add orbit controls
  let controls = new OrbitControls(camera, renderer.domElement);

  setupEnvironment();
  establishWebsocketConnection();
  setupRaycastInteraction();

  loop();
}

function establishWebsocketConnection() {
  socket = io();

  socket.on("dialogue", (dialogue) => {
    console.log(
      "Got a message from friend with ID ",
      dialogue.from,
      "and data:",
      dialogue.data
    );

    // your side
    let zipGeo = new THREE.PlaneGeometry(1,1.3);
      let zipTex = new THREE.TextureLoader().load( "zip.png" );
      let zipMat = new THREE.MeshPhongMaterial({
        map: zipTex,
        // alpha: true,
        transparent: true,
        side: THREE.DoubleSide,      
      });
      let zipMesh = new THREE.Mesh(zipGeo, zipMat);
      scene.add(zipMesh);
      zipMesh.position.set(dialogue.data.x, dialogue.data.y+zipMesh.scale.y/2, dialogue.data.z);
      zipMesh.castShadow = true;
      zipMesh.rotateX(4.5);
  });

}

function setupRaycastInteraction() {
  mouse = new THREE.Vector2(0, 0);
  document.addEventListener(
    "mousemove",
    (ev) => {
      // three.js expects 'normalized device coordinates' (i.e. between -1 and 1 on both axes)
      mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    },
    false
  );

  let raycaster = new THREE.Raycaster();
  document.addEventListener("click", (ev) => {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(desktop);

    if (intersects.length) {
      let point = intersects[0].point;
      console.log(point);
      socket.emit("dialogue", point);

      // my side:
      let folderGeo = new THREE.PlaneGeometry(1.2,1);
      let folderTex = new THREE.TextureLoader().load( "folder.png" );
      let folderMat = new THREE.MeshPhongMaterial({
        map: folderTex,
        alpha: true,
        transparent: true,
        side: THREE.DoubleSide,      
      });
      let folderMesh = new THREE.Mesh(folderGeo, folderMat);
      scene.add(folderMesh);
      folderMesh.position.set(point.x, point.y+folderMesh.scale.y/2, point.z);
      folderMesh.castShadow = true;
      folderMesh.rotateX(4.5);
    }
  });
}

function setupEnvironment() {
  //add a light
  let myColor = new THREE.Color('white');
  let ambientLight = new THREE.AmbientLight(myColor, 0.5);
  scene.add(ambientLight);

  // add a directional light
  let myDirectionalLight = new THREE.DirectionalLight(myColor, 0.55);
  myDirectionalLight.position.set(2, 5, 2);
  myDirectionalLight.lookAt(0, 0, 0);
  scene.add(myDirectionalLight);
  myDirectionalLight.castShadow = true;
}

function loop() {
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

init();
